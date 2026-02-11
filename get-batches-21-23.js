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

console.log('Batch 21:');
unenhanced.slice(24, 32).forEach((ing, idx) => console.log(`${idx + 1}. ${ing}`));
console.log('\nBatch 22:');
unenhanced.slice(32, 40).forEach((ing, idx) => console.log(`${idx + 1}. ${ing}`));
console.log('\nBatch 23:');
unenhanced.slice(40, 48).forEach((ing, idx) => console.log(`${idx + 1}. ${ing}`));
console.log('\nAll 24:', unenhanced.slice(24, 48).join(', '));
