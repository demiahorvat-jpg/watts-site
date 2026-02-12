#!/usr/bin/env node

const fs = require('fs');

console.log('Adding squash ingredients to sitemap and index...\n');

// 1. Add to sitemap
console.log('1. Adding to sitemap.xml...');
let sitemap = fs.readFileSync('sitemap.xml', 'utf8');

const today = new Date().toISOString().split('T')[0];

const sitemapEntries = `  <url>
    <loc>https://wattspet.com/ingredient-analyzer/ingredients/squash/</loc>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>https://wattspet.com/ingredient-analyzer/ingredients/butternut-squash/</loc>
    <lastmod>${today}</lastmod>
  </url>
`;

// Insert before closing </urlset>
sitemap = sitemap.replace('</urlset>', sitemapEntries + '</urlset>');
fs.writeFileSync('sitemap.xml', sitemap, 'utf8');
console.log('   ✅ Added to sitemap.xml');

// 2. Add to ingredient index
console.log('\n2. Adding to ingredient index...');
let indexHtml = fs.readFileSync('ingredient-analyzer/ingredients/index.html', 'utf8');

// Find where pumpkin is (should be nearby alphabetically)
const pumpkinCardMatch = indexHtml.match(/<a href="\/ingredient-analyzer\/ingredients\/pumpkin\/"[\s\S]*?<\/a>/);

if (pumpkinCardMatch) {
  const pumpkinCard = pumpkinCardMatch[0];

  // Create squash card (insert after pumpkin)
  const squashCard = `
          <a href="/ingredient-analyzer/ingredients/squash/" class="ingredient-card" data-category="vegetable" data-position="good">
            <div class="ingredient-name">Squash</div>
            <div class="ingredient-category">Vegetable</div>
          </a>`;

  // Insert after pumpkin
  indexHtml = indexHtml.replace(pumpkinCard, pumpkinCard + squashCard);

  // Create butternut squash card (insert before pumpkin, alphabetically)
  const butternutSquashCard = `
          <a href="/ingredient-analyzer/ingredients/butternut-squash/" class="ingredient-card" data-category="vegetable" data-position="good">
            <div class="ingredient-name">Butternut Squash</div>
            <div class="ingredient-category">Vegetable</div>
          </a>`;

  // Insert before pumpkin
  indexHtml = indexHtml.replace(pumpkinCard, butternutSquashCard + pumpkinCard);

  fs.writeFileSync('ingredient-analyzer/ingredients/index.html', indexHtml, 'utf8');
  console.log('   ✅ Added to ingredient index');
} else {
  console.log('   ⚠️  Could not find pumpkin card in index');
}

console.log('\n✅ Done!');
