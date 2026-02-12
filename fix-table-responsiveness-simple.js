#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Old table CSS with forced horizontal scroll for all tables
const oldTableCSS = `    /* TABLE - Responsive */
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

// New table CSS - let narrow tables resize naturally, wrap for wide tables
const newTableCSS = `    /* TABLE - Responsive */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 32px 0;
      font-size: 14px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    /* Wrapper for horizontal scroll on wide tables only */
    .table-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 32px 0;
    }

    .table-scroll table {
      margin: 0;
      min-width: 600px; /* Force scroll for wide tables */
    }

    @media (min-width: 768px) {
      table {
        font-size: 17px;
      }

      .table-scroll table {
        min-width: auto;
      }
    }`;

// Wrap tables with 4+ columns in a scroll div
function wrapWideTables(html) {
  // Find all table elements and check column count
  const tableRegex = /<table>([\s\S]*?)<\/table>/g;

  return html.replace(tableRegex, (match) => {
    // Count th elements in thead
    const thMatches = match.match(/<th[^>]*>/g);
    const columnCount = thMatches ? thMatches.length : 0;

    // If table has 4+ columns, wrap it
    if (columnCount >= 4) {
      // Check if already wrapped
      if (!match.includes('table-scroll')) {
        return `<div class="table-scroll">\n    ${match}\n    </div>`;
      }
    }

    return match;
  });
}

let filesUpdated = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Update CSS
  if (content.includes('/* TABLE - Responsive */')) {
    content = content.replace(oldTableCSS, newTableCSS);
    updated = true;
  }

  // Wrap wide tables
  const originalHTML = content;
  content = wrapWideTables(content);
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

console.log('Updating table responsiveness - smart scrolling...\n');

const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`\n2-3 column tables: Resize naturally on mobile (text wraps)`);
console.log(`4+ column tables: Horizontal scroll on mobile`);
