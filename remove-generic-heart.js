#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Removing generic "heart" ingredient...\n');

// 1. Remove from ingredients.json
console.log('1. Removing from ingredients.json...');
const ingredientsData = JSON.parse(fs.readFileSync('data/ingredients.json', 'utf8'));
const heartIndex = ingredientsData.ingredients.findIndex(i => i.name === 'Heart');
if (heartIndex > -1) {
  ingredientsData.ingredients.splice(heartIndex, 1);
  fs.writeFileSync('data/ingredients.json', JSON.stringify(ingredientsData, null, 2), 'utf8');
  console.log('   ✅ Removed from ingredients.json');
} else {
  console.log('   ⚠️  Heart not found in ingredients.json');
}

// 2. Remove from sitemap.xml
console.log('\n2. Removing from sitemap.xml...');
let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapLines = sitemap.split('\n');
const heartUrlIndex = sitemapLines.findIndex(line => line.includes('ingredients/heart/'));
if (heartUrlIndex > -1) {
  // Remove the <url> block (should be 4 lines: <url>, <loc>, <lastmod>, </url>)
  const startIndex = heartUrlIndex - 1; // <url> tag
  sitemapLines.splice(startIndex, 4);
  fs.writeFileSync('sitemap.xml', sitemapLines.join('\n'), 'utf8');
  console.log('   ✅ Removed from sitemap.xml');
} else {
  console.log('   ⚠️  Heart URL not found in sitemap.xml');
}

// 3. Update ingredient index - remove the card
console.log('\n3. Removing from ingredient index...');
let indexHtml = fs.readFileSync('ingredient-analyzer/ingredients/index.html', 'utf8');
// Remove the entire <a> tag for heart
indexHtml = indexHtml.replace(
  /\s*<a href="\/ingredient-analyzer\/ingredients\/heart\/" class="ingredient-card"[^>]*>[\s\S]*?<\/a>/,
  ''
);
fs.writeFileSync('ingredient-analyzer/ingredients/index.html', indexHtml, 'utf8');
console.log('   ✅ Removed from ingredient index');

// 4. Update lung page - change link to beef-heart
console.log('\n4. Updating lung page comparison...');
let lungHtml = fs.readFileSync('ingredient-analyzer/ingredients/lung/index.html', 'utf8');
lungHtml = lungHtml.replace(
  /href="\/ingredient-analyzer\/ingredients\/heart\/"/g,
  'href="/ingredient-analyzer/ingredients/beef-heart/"'
);
lungHtml = lungHtml.replace(
  />heart</g,
  '>beef heart<'
);
fs.writeFileSync('ingredient-analyzer/ingredients/lung/index.html', lungHtml, 'utf8');
console.log('   ✅ Updated lung page to link to beef-heart');

// 5. Update taurine page - change links to beef-heart
console.log('\n5. Updating taurine page comparisons...');
let taurineHtml = fs.readFileSync('ingredient-analyzer/ingredients/taurine/index.html', 'utf8');
taurineHtml = taurineHtml.replace(
  /href="\/ingredient-analyzer\/ingredients\/heart\/"/g,
  'href="/ingredient-analyzer/ingredients/beef-heart/"'
);
// Update the comparison text to be more specific
taurineHtml = taurineHtml.replace(
  /vs\. <a href="\/ingredient-analyzer\/ingredients\/beef-heart\/">heart<\/a>/,
  'vs. <a href="/ingredient-analyzer/ingredients/beef-heart/">beef heart</a>'
);
fs.writeFileSync('ingredient-analyzer/ingredients/taurine/index.html', taurineHtml, 'utf8');
console.log('   ✅ Updated taurine page to link to beef-heart');

console.log('\n✅ All references updated. Ready to delete directory.');
console.log('   Run: rm -rf ingredient-analyzer/ingredients/heart/');
