#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Old table CSS with forced horizontal scroll
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

// New smart table CSS - only scroll wide tables
const newTableCSS = `    /* TABLE - Responsive with smart scrolling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 32px 0;
      font-size: 14px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    /* On mobile: narrow tables (2-3 columns) resize naturally, wide tables scroll */
    @media (max-width: 767px) {
      table {
        font-size: 13px;
      }

      /* Tables with 4+ columns get horizontal scroll on mobile */
      table thead tr th:nth-child(4),
      table thead tr th:nth-child(5),
      table thead tr th:nth-child(6) {
        /* Marker: if 4th+ column exists, parent table needs scroll */
      }

      /* Apply scroll to tables with 4+ columns */
      table:has(thead tr th:nth-child(4)) {
        display: block;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      table:has(thead tr th:nth-child(4)) tbody,
      table:has(thead tr th:nth-child(4)) thead,
      table:has(thead tr th:nth-child(4)) tr {
        display: block;
      }

      table:has(thead tr th:nth-child(4)) thead tr {
        display: table;
        width: 100%;
        table-layout: fixed;
      }

      table:has(thead tr th:nth-child(4)) tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;
      }
    }

    @media (min-width: 768px) {
      table {
        font-size: 17px;
      }
    }`;

let filesUpdated = 0;
let filesSkipped = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('/* TABLE - Responsive */')) {
    content = content.replace(oldTableCSS, newTableCSS);
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

console.log('Updating table responsiveness with smart scrolling...\n');

const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`   Skipped: ${filesSkipped} files`);
console.log(`\nNarrow tables (2-3 columns) now resize naturally on mobile.`);
console.log(`Wide tables (4+ columns) still use horizontal scroll.`);
