#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pattern to find the Ingredients nav link
const patterns = [
  // Standard nav link
  {
    old: '<li><a href="/ingredient-analyzer/">Ingredients</a></li>',
    new: '<li><a href="/ingredient-analyzer/">Ingredient Analyzer</a></li>'
  },
  // With active class
  {
    old: '<li><a href="/ingredient-analyzer/" class="active">Ingredients</a></li>',
    new: '<li><a href="/ingredient-analyzer/" class="active">Ingredient Analyzer</a></li>'
  }
];

let filesUpdated = 0;
let filesSkipped = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  patterns.forEach(pattern => {
    if (content.includes(pattern.old)) {
      content = content.replaceAll(pattern.old, pattern.new);
      updated = true;
    }
  });

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    console.log(`✓ Updated: ${path.relative(process.cwd(), filePath)}`);
  } else {
    filesSkipped++;
  }
}

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

console.log('Updating navigation text from "Ingredients" to "Ingredient Analyzer"...\n');

// Update root pages
['index.html', 'about.html'].forEach(file => {
  if (fs.existsSync(file)) {
    updateFile(file);
  }
});

// Update blog pages
const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

// Update ingredient analyzer pages
const ingredientFiles = getAllHtmlFiles('ingredient-analyzer');
ingredientFiles.forEach(updateFile);

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`   Skipped: ${filesSkipped} files (already updated or no nav)`);
