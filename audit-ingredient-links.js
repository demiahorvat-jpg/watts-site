const fs = require('fs');
const path = require('path');

console.log('🔍 Auditing inline contextual links across ingredient pages...\n');

const ingredientsDir = path.join(__dirname, 'ingredient-analyzer/ingredients');
const dirs = fs.readdirSync(ingredientsDir).filter(f => {
  const stat = fs.statSync(path.join(ingredientsDir, f));
  return stat.isDirectory();
});

const results = [];
let totalPages = 0;
let pagesWithLinks = 0;
let pagesNeedingLinks = 0;

dirs.forEach(dir => {
  const filePath = path.join(ingredientsDir, dir, 'index.html');

  if (!fs.existsSync(filePath)) {
    return;
  }

  totalPages++;
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract main content (between <main> tags)
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (!mainMatch) {
    return;
  }

  const mainContent = mainMatch[1];

  // Count blog post links (excluding navigation breadcrumbs and "Related" section)
  const blogLinks = mainContent.match(/<a href="\/blog\/[^"]+\.html"[^>]*>/g) || [];

  // Count other ingredient links (excluding Compare section and Related section)
  // Extract just the content sections, not navigation
  const whatItIsMatch = mainContent.match(/<h2[^>]*>What It Is<\/h2>([\s\S]*?)(?=<h2|$)/);
  const whyUsedMatch = mainContent.match(/<h2[^>]*>Why It's Used[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/);
  const evidenceMatch = mainContent.match(/<h2[^>]*>Scientific Evidence<\/h2>([\s\S]*?)(?=<h2|$)/);
  const concernsMatch = mainContent.match(/<h2[^>]*>Potential Concerns<\/h2>([\s\S]*?)(?=<h2|$)/);

  // Count contextual links in main content sections (not compare/related)
  const contentSections = [whatItIsMatch, whyUsedMatch, evidenceMatch, concernsMatch]
    .filter(Boolean)
    .map(m => m[1] || m[0])
    .join('');

  const contextualBlogLinks = (contentSections.match(/<a href="\/blog\/[^"]+\.html"[^>]*>/g) || []).length;
  const contextualIngredientLinks = (contentSections.match(/<a href="\/ingredient-analyzer\/ingredients\/[^"]+\/"[^>]*>/g) || []).length;

  const totalContextualLinks = contextualBlogLinks + contextualIngredientLinks;
  const needsMore = totalContextualLinks < 3;

  if (totalContextualLinks > 0) {
    pagesWithLinks++;
  }
  if (needsMore) {
    pagesNeedingLinks++;
  }

  // Extract title
  const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : dir;

  results.push({
    dir,
    title,
    blogLinks: contextualBlogLinks,
    ingredientLinks: contextualIngredientLinks,
    totalContextualLinks,
    needsMore
  });
});

// Sort by number of links (lowest first)
results.sort((a, b) => a.totalContextualLinks - b.totalContextualLinks);

console.log(`📊 Summary:`);
console.log(`   Total ingredient pages analyzed: ${totalPages}`);
console.log(`   Pages with at least 1 inline link: ${pagesWithLinks} (${Math.round(pagesWithLinks/totalPages*100)}%)`);
console.log(`   Pages with 3+ inline links: ${totalPages - pagesNeedingLinks} (${Math.round((totalPages - pagesNeedingLinks)/totalPages*100)}%)`);
console.log(`   Pages needing more links: ${pagesNeedingLinks} (${Math.round(pagesNeedingLinks/totalPages*100)}%)\n`);

// Show sample of pages needing links
console.log(`⚠️  Sample of pages needing more inline links (showing first 20):\n`);
results.filter(r => r.needsMore).slice(0, 20).forEach(({ dir, title, totalContextualLinks, blogLinks, ingredientLinks }) => {
  console.log(`   ${dir}`);
  console.log(`      Current links: ${totalContextualLinks} (${blogLinks} blog + ${ingredientLinks} ingredient)`);
});

console.log(`\n... and ${pagesNeedingLinks - 20 > 0 ? pagesNeedingLinks - 20 : 0} more pages need links\n`);

// Export results
fs.writeFileSync('ingredient-links-audit.json', JSON.stringify({
  summary: {
    totalPages,
    pagesWithLinks,
    pagesWithEnoughLinks: totalPages - pagesNeedingLinks,
    pagesNeedingLinks
  },
  pages: results
}, null, 2));

console.log(`✅ Audit complete! Results saved to ingredient-links-audit.json`);
