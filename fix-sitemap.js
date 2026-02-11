#!/usr/bin/env node

const fs = require('fs');

// Read sitemap
let sitemap = fs.readFileSync('./sitemap.xml', 'utf8');

// Redirect pages to remove
const redirectSlugs = [
  'alginic-acid',
  'calcium-d-pantothenate',
  'camellia-sinensis',
  'iron-sulfate',
  'niacin-supplement',
  'riboflavin-supplement',
  'sodium-chloride',
  'vitamin-k1-supplement'
];

let removedCount = 0;

// Remove each redirect page's <url> block
redirectSlugs.forEach(slug => {
  const pattern = new RegExp(
    `  <url>\\s*<loc>https://wattspet\\.com/ingredient-analyzer/ingredients/${slug}/</loc>\\s*<lastmod>[^<]+</lastmod>\\s*<changefreq>[^<]+</changefreq>\\s*<priority>[^<]+</priority>\\s*</url>\\s*`,
    'g'
  );

  if (pattern.test(sitemap)) {
    sitemap = sitemap.replace(pattern, '');
    removedCount++;
    console.log(`✓ Removed ${slug}`);
  }
});

// Write updated sitemap
fs.writeFileSync('./sitemap.xml', sitemap, 'utf8');

console.log(`\n✅ Removed ${removedCount} redirect pages from sitemap`);
