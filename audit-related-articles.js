const fs = require('fs');
const path = require('path');

console.log('🔍 Auditing Related Articles sections across all blog posts...\n');

const blogDir = path.join(__dirname, 'blog');
const files = fs.readdirSync(blogDir).filter(f =>
  f.endsWith('.html') &&
  f !== 'index.html' &&
  !f.includes('REDESIGN')
);

let hasRelated = 0;
let noRelated = 0;
let formatIssues = [];

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check if has Related Articles section
  const hasRelatedSection = content.includes('Related Articles');

  if (hasRelatedSection) {
    hasRelated++;

    // Check format issues
    const issues = [];

    // Extract the Related Articles section
    const relatedMatch = content.match(/<h2[^>]*>Related Articles<\/h2>([\s\S]*?)(?=<h2|<\/main>)/);
    if (relatedMatch) {
      const section = relatedMatch[0];

      // Check for inline styles (good)
      if (!section.includes('style=')) {
        issues.push('Missing inline styles');
      }

      // Check for correct h2 styles
      if (!section.includes('margin-top: 56px')) {
        issues.push('H2 missing margin-top: 56px');
      }
      if (!section.includes('padding-top: 40px')) {
        issues.push('H2 missing padding-top: 40px');
      }
      if (!section.includes('border-top: 2px solid')) {
        issues.push('H2 missing border-top');
      }

      // Check for grid container
      if (!section.includes('display: grid')) {
        issues.push('Missing grid container');
      }

      // Check card styles
      if (!section.includes('padding: 16px 20px')) {
        issues.push('Cards missing correct padding (16px 20px)');
      }
      if (!section.includes('border: 3px solid var(--brand-orange)')) {
        issues.push('Cards missing orange border');
      }
      if (!section.includes('border-radius: 12px')) {
        issues.push('Cards missing border-radius');
      }

      // Check h3 styles in cards
      if (!section.includes('margin: 0 0 8px 0')) {
        issues.push('Card h3 missing correct margin (0 0 8px 0)');
      }

      // Count number of related articles
      const articleCount = (section.match(/<a href="\/blog\//g) || []).length;
      if (articleCount < 3) {
        issues.push(`Only ${articleCount} related articles (recommend 3-4)`);
      }
      if (articleCount > 5) {
        issues.push(`Too many related articles (${articleCount}, recommend 3-4)`);
      }
    }

    if (issues.length > 0) {
      formatIssues.push({ file, issues });
    }
  } else {
    noRelated++;
  }
});

console.log(`📊 Summary:`);
console.log(`   Total blog posts: ${files.length}`);
console.log(`   With Related Articles: ${hasRelated} (${Math.round(hasRelated/files.length*100)}%)`);
console.log(`   Without Related Articles: ${noRelated}`);
console.log(`   Format issues found: ${formatIssues.length}\n`);

if (formatIssues.length > 0) {
  console.log('⚠️  Posts with format issues:\n');
  formatIssues.forEach(({ file, issues }) => {
    console.log(`   ${file}:`);
    issues.forEach(issue => console.log(`      - ${issue}`));
    console.log('');
  });
}

console.log(`\n📝 Posts without Related Articles:\n`);
files.forEach(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
  if (!content.includes('Related Articles')) {
    console.log(`   - ${file}`);
  }
});

// Export results for use in fixing script
const results = {
  total: files.length,
  hasRelated,
  noRelated,
  formatIssues,
  missingRelated: files.filter(file => {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
    return !content.includes('Related Articles');
  })
};

fs.writeFileSync('related-articles-audit.json', JSON.stringify(results, null, 2));
console.log(`\n✅ Audit complete! Results saved to related-articles-audit.json`);
