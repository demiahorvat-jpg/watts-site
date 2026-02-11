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
console.log('\nBatch 27:');
unenhanced.slice(72, 80).forEach((ing, idx) => console.log(`${idx + 1}. ${ing}`));
console.log('\nBatch 28:');
unenhanced.slice(80, 88).forEach((ing, idx) => console.log(`${idx + 1}. ${ing}`));
console.log('\nBatch 29:');
unenhanced.slice(88, 96).forEach((ing, idx) => console.log(`${idx + 1}. ${ing}`));
console.log('\nAll 24:', unenhanced.slice(72, 96).join(', '));
