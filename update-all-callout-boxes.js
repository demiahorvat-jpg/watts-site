#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Old callout CSS
const oldCalloutCSS = `    /* LIGHT CALLOUT BOX */
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

// New Watts format callout CSS
const newCalloutCSS = `    /* WATTS CALLOUT BOX - Layered design with orange border */
    .callout {
      position: relative;
      background: var(--brand-orange);
      border-radius: 4px;
      padding: 8px;
      margin: 48px 0;
    }

    .callout-content {
      background: var(--white);
      color: var(--text-dark);
      border-radius: 12px;
      padding: 24px 28px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    @media (min-width: 768px) {
      .callout-content {
        padding: 28px 36px;
      }
    }

    .callout h3 {
      color: var(--text-dark);
    }

    .callout p:last-child {
      margin-bottom: 0;
    }

    .callout a {
      color: var(--accent-navy);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .callout a:hover {
      opacity: 0.85;
    }`;

// Wrap callout content in callout-content div
function wrapCalloutContent(html) {
  const regex = /(<div class="callout">)([\s\S]*?)(<\/div>)/g;

  return html.replace(regex, (match, openDiv, content, closeDiv) => {
    // Check if already wrapped
    if (content.includes('callout-content')) {
      return match;
    }

    // Wrap the content
    return `${openDiv}\n      <div class="callout-content">${content}\n      </div>\n    ${closeDiv}`;
  });
}

let filesUpdated = 0;
let filesSkipped = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Update CSS
  if (content.includes('/* LIGHT CALLOUT BOX */')) {
    content = content.replace(oldCalloutCSS, newCalloutCSS);
    updated = true;
  }

  // Wrap HTML content in callout-content div
  const originalContent = content;
  content = wrapCalloutContent(content);
  if (content !== originalContent) {
    updated = true;
  }

  if (updated) {
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

console.log('Updating all callout boxes to Watts format...\n');

const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`   Skipped: ${filesSkipped} files (already using Watts format or no callouts)`);
