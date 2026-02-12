#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// H1 updates to match title tags
const updates = [
  {
    file: 'blog/red-dye-40-dog-food.html',
    oldH1: 'Red Dye 40 in Dog Food and Treats: Safety, Side Effects & Alternatives',
    newH1: 'Is Red 40 Bad for Dogs? Safety Guide 2026'
  },
  {
    file: 'ingredient-analyzer/ingredients/barley/index.html',
    oldH1: 'Barley',
    newH1: 'Barley in Dog Food: Is It Safe?'
  },
  {
    file: 'ingredient-analyzer/ingredients/cellulose/index.html',
    oldH1: 'Cellulose',
    newH1: 'Cellulose in Dog Food: Is It Safe?'
  },
  {
    file: 'blog/chicken-by-products-dog-food.html',
    oldH1: 'Chicken By-Products in Dog Food: What They Actually Are',
    newH1: 'Chicken By-Products in Dog Food: What Are They Really?'
  },
  {
    file: 'blog/digestive-enzymes-for-dogs.html',
    oldH1: 'Digestive Enzymes for Dogs: When They Help vs Marketing Hype',
    newH1: 'Digestive Enzymes for Dogs: Guide & Dosing'
  },
  {
    file: 'ingredient-analyzer/ingredients/xanthan-gum/index.html',
    oldH1: 'Xanthan Gum',
    newH1: 'Xanthan Gum in Dog Food: Is It Safe?'
  },
  {
    file: 'ingredient-analyzer/ingredients/chickpeas/index.html',
    oldH1: 'Chickpeas',
    newH1: 'Chickpeas in Dog Food: Are They Safe?'
  },
  {
    file: 'ingredient-analyzer/ingredients/colostrum/index.html',
    oldH1: 'Colostrum',
    newH1: 'Colostrum in Dog Food: Is It Safe?'
  }
];

let filesUpdated = 0;

updates.forEach(update => {
  const filePath = path.join(process.cwd(), update.file);

  if (!fs.existsSync(filePath)) {
    console.log(`✗ File not found: ${update.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Find and replace H1 - need to be careful to match the exact pattern
  const h1Regex = new RegExp(`<h1[^>]*>${update.oldH1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h1>`);

  if (content.match(h1Regex)) {
    content = content.replace(h1Regex, (match) => {
      // Preserve the opening tag attributes
      const openTag = match.substring(0, match.indexOf('>') + 1);
      return `${openTag}${update.newH1}</h1>`;
    });
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    console.log(`✓ Updated: ${update.file}`);
    console.log(`  Old H1: ${update.oldH1}`);
    console.log(`  New H1: ${update.newH1}`);
    console.log('');
  } else {
    console.log(`✗ H1 not found in: ${update.file}`);
    console.log(`  Looking for: ${update.oldH1}`);
    console.log('');
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`\nH1 headings now align with title tags for better SEO consistency.`);
