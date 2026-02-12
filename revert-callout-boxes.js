#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Revert to simple callout CSS without nested divs
const oldWattsCSS = /\/\* WATTS CALLOUT BOX[\s\S]*?\.callout a:hover \{\s*opacity: 0\.85;\s*\}/;

const simpleCalloutCSS = `    /* LIGHT CALLOUT BOX */
    .callout {
      background: var(--bg-light);
      border-left: 4px solid var(--brand-orange);
      border-radius: 8px;
      padding: 24px 28px;
      margin: 32px 0;
    }
    @media (min-width: 768px) {
      .callout {
        padding: 28px 32px;
      }
    }

    .callout p:last-child {
      margin-bottom: 0;
    }`;

// Remove callout-content divs from HTML
function removeCalloutContentDivs(html) {
  // Remove opening <div class="callout-content">
  html = html.replace(/<div class="callout-content">\s*/g, '');

  // Remove orphaned closing </div> tags that were for callout-content
  // This is tricky - we need to remove the right ones
  // Pattern: content followed by whitespace and </div> that's inside a callout
  html = html.replace(/(\s*)<\/div>\s*<\/div>/g, '\n    </div>');

  return html;
}

let filesReverted = 0;

function revertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Revert CSS
  if (oldWattsCSS.test(content)) {
    content = content.replace(oldWattsCSS, simpleCalloutCSS);
    updated = true;
  }

  // Remove callout-content divs
  const originalHTML = content;
  content = removeCalloutContentDivs(content);
  if (content !== originalHTML) {
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesReverted++;
    console.log(`✓ Reverted: ${path.basename(filePath)}`);
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

console.log('Reverting callout boxes to simple format...\n');

const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(revertFile);

console.log(`\n✅ Complete!`);
console.log(`   Reverted: ${filesReverted} files`);
