#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// New Watts-style callout CSS using box-shadow trick for border effect
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

const wattsCalloutCSS = `    /* WATTS CALLOUT BOX - Orange border with white content */
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

let filesUpdated = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('/* LIGHT CALLOUT BOX */')) {
    content = content.replace(oldCalloutCSS, wattsCalloutCSS);
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

console.log('Applying Watts callout styling (CSS-only approach)...\n');

const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`\nUsing box-shadow to create orange border effect without HTML changes.`);
