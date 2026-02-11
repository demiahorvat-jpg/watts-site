const fs = require('fs');
const path = require('path');

console.log('🔍 Auditing inline contextual links across blog posts...\n');

const blogDir = path.join(__dirname, 'blog');
const files = fs.readdirSync(blogDir).filter(f =>
  f.endsWith('.html') &&
  f !== 'index.html' &&
  !f.includes('REDESIGN')
);

const results = [];

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract article content (between <article> tags)
  const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if (!articleMatch) {
    return;
  }

  const articleContent = articleMatch[1];

  // Count inline links (links within <p> tags, excluding Related Articles section)
  // Exclude Related Articles section
  const beforeRelated = articleContent.split('Related Articles')[0];

  // Find all links within paragraph tags (inline contextual links)
  const inlineLinks = beforeRelated.match(/<p[^>]*>[\s\S]*?<a href="\/blog\/[^"]+\.html"[^>]*>[\s\S]*?<\/a>[\s\S]*?<\/p>/g) || [];

  // Also check for links in list items
  const listLinks = beforeRelated.match(/<li[^>]*>[\s\S]*?<a href="\/blog\/[^"]+\.html"[^>]*>[\s\S]*?<\/a>[\s\S]*?<\/li>/g) || [];

  // Count unique internal blog links
  const allBlogLinks = [...beforeRelated.matchAll(/<a href="(\/blog\/[^"]+\.html)"[^>]*>/g)];
  const uniqueLinks = new Set(allBlogLinks.map(m => m[1]));

  // Count ingredient links
  const ingredientLinks = beforeRelated.match(/<a href="\/ingredient-analyzer\/ingredients\/[^"]+"/g) || [];
  const uniqueIngredientLinks = new Set(ingredientLinks.map(link => {
    const match = link.match(/href="([^"]+)"/);
    return match ? match[1] : null;
  }).filter(Boolean));

  // Extract title
  const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : file;

  const totalInlineLinks = uniqueLinks.size + uniqueIngredientLinks.size;

  results.push({
    file,
    title,
    blogLinks: uniqueLinks.size,
    ingredientLinks: uniqueIngredientLinks.size,
    totalInlineLinks,
    needsMore: totalInlineLinks < 3,
    linksList: Array.from(uniqueLinks)
  });
});

// Sort by number of links (lowest first)
results.sort((a, b) => a.totalInlineLinks - b.totalInlineLinks);

console.log(`📊 Summary:`);
console.log(`   Total blog posts analyzed: ${results.length}`);
console.log(`   Posts with 3+ inline links: ${results.filter(r => !r.needsMore).length}`);
console.log(`   Posts needing more links: ${results.filter(r => r.needsMore).length}\n`);

console.log(`⚠️  Posts with fewer than 3 inline contextual links:\n`);
results.filter(r => r.needsMore).forEach(({ file, title, totalInlineLinks, blogLinks, ingredientLinks }) => {
  console.log(`   ${file}`);
  console.log(`      Title: ${title}`);
  console.log(`      Current links: ${totalInlineLinks} (${blogLinks} blog + ${ingredientLinks} ingredient)`);
  console.log('');
});

console.log(`\n✅ Posts with 3+ inline links:\n`);
results.filter(r => !r.needsMore).forEach(({ file, totalInlineLinks, blogLinks, ingredientLinks }) => {
  console.log(`   ${file}: ${totalInlineLinks} links (${blogLinks} blog + ${ingredientLinks} ingredient)`);
});

// Export results
fs.writeFileSync('inline-links-audit.json', JSON.stringify(results, null, 2));
console.log(`\n✅ Audit complete! Results saved to inline-links-audit.json`);
