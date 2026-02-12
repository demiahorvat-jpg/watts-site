#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function wrapInlineStyledCallouts(html) {
  // Find all callout divs with inline styles that don't have callout-content inside
  const regex = /(<div class="callout" style="[^"]+">)((?!\s*<div class="callout-content">)[\s\S]*?)(<\/div>)/g;

  return html.replace(regex, (match, openDiv, content, closeDiv) => {
    // Check if content already starts with callout-content
    if (content.trim().startsWith('<div class="callout-content">')) {
      return match;
    }

    // Check if this is a nested callout or if content is empty/whitespace only
    if (content.trim() === '' || content.includes('<div class="callout"')) {
      return match;
    }

    // Wrap the content
    return `${openDiv}\n        <div class="callout-content">${content}\n        </div>\n    ${closeDiv}`;
  });
}

let filesUpdated = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  content = wrapInlineStyledCallouts(content);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    console.log(`✓ Updated: ${path.basename(filePath)}`);
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

console.log('Wrapping inline-styled callouts with callout-content...\n');

const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
