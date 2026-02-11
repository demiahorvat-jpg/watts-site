#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pattern to find: logo-container div with img but no link
const oldPattern = /(<div class="logo-container">)\s*(<img src="\/watts-logo-white\.svg" alt="Watts" class="logo">)\s*(<\/div>)/g;

// Replacement: wrap img in an <a> tag
const newPattern = `$1
          <a href="/" aria-label="Watts home">
            $2
          </a>
        $3`;

let filesUpdated = 0;
let filesSkipped = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it has the logo without a link
  if (content.match(oldPattern)) {
    content = content.replace(oldPattern, newPattern);
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    if (filesUpdated <= 5) {
      console.log(`✓ Updated: ${filePath}`);
    }
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

console.log('Updating logo links in HTML files...\n');

// Update blog pages
const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

// Update ingredient analyzer pages
const ingredientFiles = getAllHtmlFiles('ingredient-analyzer');
ingredientFiles.forEach(updateFile);

if (filesUpdated > 5) {
  console.log(`✓ Updated ${filesUpdated - 5} more files...`);
}

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`   Skipped: ${filesSkipped} files (already had link or no logo)`);
