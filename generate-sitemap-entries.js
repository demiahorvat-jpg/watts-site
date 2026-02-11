#!/usr/bin/env node

const fs = require('fs');

// Read the slug map
const slugMap = JSON.parse(
  fs.readFileSync('./ingredient-analyzer/ingredient-slugs.json', 'utf8')
);

const today = new Date().toISOString().split('T')[0];

// Generate sitemap entries
let entries = [];

// Add main ingredient analyzer page
entries.push(`  <url>
    <loc>https://wattspet.com/ingredient-analyzer/</loc>
    <lastmod>${today}T09:00:00-05:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);

// Add ingredient directory index
entries.push(`  <url>
    <loc>https://wattspet.com/ingredient-analyzer/ingredients/</loc>
    <lastmod>${today}T09:00:00-05:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);

// Redirect pages that should be excluded from sitemap
const redirectPages = [
  'alginic-acid',
  'calcium-d-pantothenate',
  'camellia-sinensis',
  'iron-sulfate',
  'niacin-supplement',
  'riboflavin-supplement',
  'sodium-chloride',
  'vitamin-k1-supplement',
  'guar-fiber',
  'lions-mane'
];

// Add all individual ingredient pages (excluding redirects)
const slugs = Object.values(slugMap).sort().filter(slug => !redirectPages.includes(slug));
slugs.forEach(slug => {
  entries.push(`  <url>
    <loc>https://wattspet.com/ingredient-analyzer/ingredients/${slug}/</loc>
    <lastmod>${today}T09:00:00-05:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
});

// Output the entries
console.log(entries.join('\n'));
console.log(`\n✅ Generated ${entries.length} sitemap entries`);
