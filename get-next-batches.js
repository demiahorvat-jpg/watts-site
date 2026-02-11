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

// Get batches 18, 19, 20 (8 ingredients each)
console.log('Batch 18:');
unenhanced.slice(0, 8).forEach((ing, idx) => {
  console.log(`${idx + 1}. ${ing}`);
});

console.log('\nBatch 19:');
unenhanced.slice(8, 16).forEach((ing, idx) => {
  console.log(`${idx + 1}. ${ing}`);
});

console.log('\nBatch 20:');
unenhanced.slice(16, 24).forEach((ing, idx) => {
  console.log(`${idx + 1}. ${ing}`);
});

console.log('\n\nAll 24 ingredients for Batches 18-20:');
console.log(unenhanced.slice(0, 24).join(', '));
