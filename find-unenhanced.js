#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ingredientsDir = './ingredient-analyzer/ingredients';
const dirs = fs.readdirSync(ingredientsDir).filter(d => {
  const stats = fs.statSync(path.join(ingredientsDir, d));
  return stats.isDirectory();
});

const unenhanced = [];

dirs.forEach(dir => {
  const indexPath = path.join(ingredientsDir, dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    if (!content.includes('Compare to Similar Ingredients')) {
      unenhanced.push(dir);
    }
  }
});

unenhanced.sort();

console.log(`Total unenhanced: ${unenhanced.length}\n`);
console.log('First 30 unenhanced ingredients:');
unenhanced.slice(0, 30).forEach((ing, idx) => {
  console.log(`${idx + 1}. ${ing}`);
});

console.log(`\n\nNext 8 for Batch 17:`);
unenhanced.slice(0, 8).forEach((ing, idx) => {
  console.log(`${idx + 1}. ${ing}`);
});
