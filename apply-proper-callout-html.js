#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Proper Watts callout CSS with nested structure
const cssToReplace = `    /* WATTS CALLOUT BOX - Orange border with white content */
    .callout {
      background: var(--white);
      border-radius: 12px;
      padding: 24px 28px;
      margin: 48px 0;
      box-shadow: 0 0 0 8px var(--brand-orange), 0 2px 8px rgba(0,0,0,0.06);
    }
    @media (min-width: 768px) {
      .callout {
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

const properWattsCSS = `    /* WATTS CALLOUT BOX - Layered design with orange border */
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

// Properly wrap callout content - find complete callout blocks
function wrapCalloutContent(html) {
  // Strategy: Find each <div class="callout"> and its matching </div>
  // Then wrap everything between them in <div class="callout-content">

  let result = html;
  let startPos = 0;

  while (true) {
    // Find next callout div
    const calloutStart = result.indexOf('<div class="callout">', startPos);
    if (calloutStart === -1) break;

    // Find the matching closing div by counting nested divs
    let depth = 1;
    let searchPos = calloutStart + '<div class="callout">'.length;
    let calloutEnd = -1;

    while (searchPos < result.length && depth > 0) {
      const nextOpen = result.indexOf('<div', searchPos);
      const nextClose = result.indexOf('</div>', searchPos);

      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        searchPos = nextOpen + 4;
      } else {
        depth--;
        if (depth === 0) {
          calloutEnd = nextClose;
          break;
        }
        searchPos = nextClose + 6;
      }
    }

    if (calloutEnd === -1) {
      startPos = calloutStart + 1;
      continue;
    }

    // Extract the content between the divs
    const contentStart = calloutStart + '<div class="callout">'.length;
    const content = result.substring(contentStart, calloutEnd);

    // Check if already wrapped
    if (content.trim().startsWith('<div class="callout-content">')) {
      startPos = calloutEnd + 6;
      continue;
    }

    // Wrap the content
    const newContent = `\n      <div class="callout-content">${content}\n      </div>\n    `;
    result = result.substring(0, contentStart) + newContent + result.substring(calloutEnd);

    startPos = calloutStart + '<div class="callout">'.length + newContent.length;
  }

  return result;
}

let filesUpdated = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Update CSS
  if (content.includes('/* WATTS CALLOUT BOX - Orange border with white content */')) {
    content = content.replace(cssToReplace, properWattsCSS);
    updated = true;
  }

  // Wrap HTML content properly
  const originalHTML = content;
  content = wrapCalloutContent(content);
  if (content !== originalHTML) {
    updated = true;
  }

  if (updated) {
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

console.log('Applying proper HTML structure for Watts callouts...\n');

const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`\nCallouts now use proper nested div structure.`);
