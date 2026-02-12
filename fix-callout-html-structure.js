#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let filesFixed = 0;

function fixCalloutStructure(html) {
  // Find all callout blocks and fix their structure
  // The issue: callout-content divs are closing but callout wrapper divs are not

  // Pattern: <div class="callout">\n<div class="callout-content">...content...</div>
  // Missing: closing </div> for the callout wrapper

  const regex = /(<div class="callout">\s*<div class="callout-content">[\s\S]*?<\/div>)\s*(?=\n\s*(?:<div class="callout">|<h[123]|<p|$))/g;

  return html.replace(regex, (match) => {
    // Add closing </div> for callout wrapper if not present
    if (!match.trim().endsWith('</div>\n    </div>')) {
      return match + '\n    </div>';
    }
    return match;
  });
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  content = fixCalloutStructure(content);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesFixed++;
    console.log(`✓ Fixed: ${path.basename(filePath)}`);
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

console.log('Fixing callout HTML structure...\n');

const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

console.log(`\n✅ Complete!`);
console.log(`   Fixed: ${filesFixed} files`);
