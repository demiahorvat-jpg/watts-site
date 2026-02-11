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

console.log('Total unenhanced:', unenhanced.length);
console.log('\nBatch 30:');
unenhanced.slice(96, 104).forEach((ing, idx) => console.log(`${idx + 1}. ${ing}`));
console.log('\nBatch 31:');
unenhanced.slice(104, 112).forEach((ing, idx) => console.log(`${idx + 1}. ${ing}`));
console.log('\nBatch 32:');
unenhanced.slice(112, 120).forEach((ing, idx) => console.log(`${idx + 1}. ${ing}`));
console.log('\nAll 24:', unenhanced.slice(96, 120).join(', '));
