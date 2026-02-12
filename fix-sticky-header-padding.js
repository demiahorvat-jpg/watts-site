#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pattern to update header-wrapper padding to include bottom space
const oldPattern = `    /* HEADER WRAPPER - Black background */
    .header-wrapper {
      background: #191919;
      padding: 12px 12px 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }`;

const newPattern = `    /* HEADER WRAPPER - Black background */
    .header-wrapper {
      background: #191919;
      padding: 12px;
      position: sticky;
      top: 0;
      z-index: 100;
    }`;

let filesUpdated = 0;
let filesSkipped = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(oldPattern)) {
    content = content.replace(oldPattern, newPattern);
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

console.log('Updating header wrapper padding for sticky header...\n');

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
console.log(`   Skipped: ${filesSkipped} files (already updated)`);
