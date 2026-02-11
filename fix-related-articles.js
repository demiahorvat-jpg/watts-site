const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Related Articles sections...\n');

const blogDir = path.join(__dirname, 'blog');

// Standard Related Articles template
const getRelatedArticlesTemplate = (articles) => {
  const articlesHtml = articles.map(({ url, title, description }) => `
        <a href="${url}" style="display: block; padding: 16px 20px; border: 3px solid var(--brand-orange); background: var(--white); border-radius: 12px; text-decoration: none; color: var(--text-dark); transition: background 0.15s;">
          <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">${title}</h3>
          <p style="font-size: 15px; color: var(--text-muted); margin: 0;">${description}</p>
        </a>`).join('\n');

  return `      <h2 style="margin-top: 56px; padding-top: 40px; border-top: 2px solid var(--border-light);">Related Articles</h2>

      <div style="display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 56px;">
${articlesHtml}
      </div>`;
};

// Suggested related articles for posts missing them
const suggestedRelated = {
  'active-working-dog-nutrition.html': [
    { url: '/blog/protein-for-dogs.html', title: 'Protein for Dogs', description: 'Why active dogs need optimal protein levels' },
    { url: '/blog/beef-liver-for-dogs.html', title: 'Beef Liver for Dogs', description: 'Nutrient-dense organ meat for working dogs' },
    { url: '/blog/joint-supplements-for-dogs.html', title: 'Joint Supplements for Dogs', description: 'Supporting active dogs\' joint health' },
  ],
  'beef-liver-for-dogs.html': [
    { url: '/blog/organ-based-nutrition-for-dogs.html', title: 'Organ-Based Nutrition for Dogs', description: 'Why organ meats are nutritional powerhouses' },
    { url: '/blog/whole-food-vs-synthetic-nutrients.html', title: 'Whole Food vs Synthetic Vitamins', description: 'Why whole-food nutrients are better absorbed' },
    { url: '/blog/vitamin-a-supplement.html', title: 'Vitamin A for Dogs', description: 'Liver as a natural source of vitamin A' },
  ],
  'bone-broth-for-dogs.html': [
    { url: '/blog/collagen-for-dogs-benefits.html', title: 'Collagen for Dogs', description: 'Why bone broth is rich in collagen' },
    { url: '/blog/joint-supplements-for-dogs.html', title: 'Joint Supplements for Dogs', description: 'How bone broth supports joint health' },
    { url: '/blog/gut-health-for-dogs.html', title: 'Gut Health for Dogs', description: 'Bone broth for digestive support' },
  ],
  'how-much-liver-to-feed-dog.html': [
    { url: '/blog/beef-liver-for-dogs.html', title: 'Beef Liver for Dogs', description: 'Understanding liver\'s nutritional benefits' },
    { url: '/blog/organ-based-nutrition-for-dogs.html', title: 'Organ-Based Nutrition', description: 'How to balance organ meats in diet' },
    { url: '/blog/dog-vitamins-deficiency.html', title: 'Dog Vitamin Deficiency', description: 'Signs your dog needs more nutrients' },
  ],
  'organ-based-nutrition-for-dogs.html': [
    { url: '/blog/beef-liver-for-dogs.html', title: 'Beef Liver for Dogs', description: 'The most nutrient-dense organ meat' },
    { url: '/blog/whole-food-vs-synthetic-nutrients.html', title: 'Whole Food vs Synthetic', description: 'Why whole-food organs are superior' },
    { url: '/blog/protein-for-dogs.html', title: 'Protein for Dogs', description: 'Complete protein from organ meats' },
  ],
  'whole-food-vs-synthetic-nutrients.html': [
    { url: '/blog/beef-liver-for-dogs.html', title: 'Beef Liver for Dogs', description: 'Whole-food nutrition from organ meats' },
    { url: '/blog/why-dogs-need-supplements.html', title: 'Why Dogs Need Supplements', description: 'Choosing the right supplement form' },
    { url: '/blog/can-dogs-take-human-supplements.html', title: 'Can Dogs Take Human Supplements?', description: 'Why dog-specific formulations matter' },
  ],
  'zinc-for-dogs.html': [
    { url: '/blog/antioxidants-for-dogs.html', title: 'Antioxidants for Dogs', description: 'Zinc as an essential antioxidant mineral' },
    { url: '/blog/immune-support-for-dogs.html', title: 'Immune Support for Dogs', description: 'How zinc supports immune function' },
    { url: '/blog/dog-skin-coat-supplements.html', title: 'Dog Skin & Coat Supplements', description: 'Zinc for healthy skin and coat' },
  ],
};

function fixRelatedArticles(file) {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Check if file needs Related Articles added
  if (!content.includes('Related Articles')) {
    if (suggestedRelated[file]) {
      const template = getRelatedArticlesTemplate(suggestedRelated[file]);

      // Insert before FAQ section or before </main>
      if (content.includes('<h2>Frequently Asked Questions</h2>')) {
        content = content.replace(
          '<h2>Frequently Asked Questions</h2>',
          template + '\n\n      <h2>Frequently Asked Questions</h2>'
        );
        updated = true;
      } else if (content.includes('</main>')) {
        content = content.replace(
          '</main>',
          template + '\n\n    </main>'
        );
        updated = true;
      }
    }
  } else {
    // Fix format issues for existing Related Articles
    const relatedMatch = content.match(/<h2[^>]*>Related Articles<\/h2>([\s\S]*?)(?=<h2|<\/main>)/);

    if (relatedMatch) {
      const oldSection = relatedMatch[0];

      // Extract existing article links
      const linkMatches = [...oldSection.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];

      if (linkMatches.length > 0) {
        const articles = linkMatches.map(match => {
          const url = match[1];
          const innerHtml = match[2];

          // Extract title and description
          const titleMatch = innerHtml.match(/<h3[^>]*>(.*?)<\/h3>/);
          const descMatch = innerHtml.match(/<p[^>]*>(.*?)<\/p>/);

          return {
            url,
            title: titleMatch ? titleMatch[1] : 'Article Title',
            description: descMatch ? descMatch[1] : 'Article description'
          };
        }).slice(0, 4); // Max 4 articles

        // Generate new standardized section
        const newSection = getRelatedArticlesTemplate(articles);
        content = content.replace(oldSection, newSection);
        updated = true;
      }
    }
  }

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    return { status: 'fixed', file };
  }

  return { status: 'no changes', file };
}

// Process all files with issues
const audit = JSON.parse(fs.readFileSync('related-articles-audit.json', 'utf8'));

let fixed = 0;
let skipped = 0;

// Fix posts with format issues
console.log('Fixing posts with format issues...');
audit.formatIssues.forEach(({ file }) => {
  const result = fixRelatedArticles(file);
  if (result.status === 'fixed') {
    console.log(`   ✓ Fixed ${file}`);
    fixed++;
  } else {
    console.log(`   ⚠️  ${file} - no changes made`);
    skipped++;
  }
});

// Add Related Articles to posts missing them
console.log('\nAdding Related Articles to posts without them...');
audit.missingRelated.forEach(file => {
  const result = fixRelatedArticles(file);
  if (result.status === 'fixed') {
    console.log(`   ✓ Added to ${file}`);
    fixed++;
  } else {
    console.log(`   ⚠️  ${file} - no suggestions available`);
    skipped++;
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Fixed: ${fixed} files`);
console.log(`   Skipped: ${skipped} files`);
