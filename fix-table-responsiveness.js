#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Old table CSS that needs to be replaced
const oldTableCSS = `    /* TABLE */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 32px 0;
      font-size: 16px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    @media (min-width: 768px) {
      table {
        font-size: 17px;
      }
    }`;

// New responsive table CSS
const newTableCSS = `    /* TABLE - Responsive */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 32px 0;
      font-size: 14px;
      border-radius: 12px;
      overflow: visible;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: block;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    @media (min-width: 768px) {
      table {
        font-size: 17px;
        display: table;
        overflow-x: visible;
      }
    }`;

// Alternative: look for just the table { block
const oldTablePattern = /\/\* TABLE \*\/\s*table\s*{[^}]+}\s*@media \(min-width: 768px\)\s*{\s*table\s*{[^}]+}\s*}/s;

let filesUpdated = 0;
let filesSkipped = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Try exact match first
  if (content.includes(oldTableCSS)) {
    content = content.replace(oldTableCSS, newTableCSS);
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    console.log(`✓ Updated: ${path.basename(filePath)}`);
  }
  // Try regex pattern match
  else if (oldTablePattern.test(content)) {
    content = content.replace(oldTablePattern, newTableCSS);
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    console.log(`✓ Updated: ${path.basename(filePath)}`);
  } else {
    filesSkipped++;
  }
}

function getAllHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  const htmlFiles = [];

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && file.endsWith('.html')) {
      htmlFiles.push(filePath);
    }
  });

  return htmlFiles;
}

console.log('Fixing table responsiveness in blog posts...\n');

const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`   Skipped: ${filesSkipped} files (no tables or different CSS)`);
