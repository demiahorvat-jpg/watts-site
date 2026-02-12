#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Old generic quick-facts CSS
const oldQuickFactsCSS = `    /* Quick Facts Box */
    .quick-facts {
      background: var(--bg-light);
      border-left: 4px solid var(--brand-orange);
      border-radius: 8px;
      padding: 24px 28px;
      margin: 32px 0;
    }
    @media (min-width: 768px) {
      .quick-facts {
        padding: 28px 32px;
      }
    }

    .quick-facts h3 {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: var(--text-dark);
    }

    .quick-facts ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .quick-facts li {
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
      font-size: 16px;
      line-height: 1.6;
    }
    @media (min-width: 768px) {
      .quick-facts li {
        font-size: 17px;
      }
    }

    .quick-facts li:before {
      content: "→";
      position: absolute;
      left: 0;
      font-weight: 700;
    }`;

// New Watts format quick-facts CSS
const newQuickFactsCSS = `    /* LAYERED CALLOUT BOX - Watts format with orange border */
    .quick-facts {
      position: relative;
      background: var(--brand-orange);
      border-radius: 4px;
      padding: 8px;
      margin: 48px 0;
    }

    .quick-facts-content {
      background: var(--white);
      color: var(--text-dark);
      border-radius: 12px;
      padding: 24px 28px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    @media (min-width: 768px) {
      .quick-facts-content {
        padding: 28px 36px;
      }
    }

    .quick-facts h3 {
      font-size: 24px;
      font-weight: 600;
      margin-top: 4px;
      margin-bottom: 20px;
      color: var(--text-dark);
    }
    @media (min-width: 768px) {
      .quick-facts h3 {
        font-size: 28px;
      }
    }

    .quick-facts ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .quick-facts li {
      padding: 8px 0;
      padding-left: 28px;
      position: relative;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.6;
    }
    @media (min-width: 768px) {
      .quick-facts li {
        font-size: 17px;
      }
    }

    .quick-facts li:before {
      content: "→";
      position: absolute;
      left: 0;
      top: 8px;
      font-weight: 700;
      color: var(--brand-orange);
    }

    .quick-facts a {
      color: var(--accent-navy);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .quick-facts a:hover {
      opacity: 0.85;
    }`;

// Also need to wrap the HTML content in quick-facts-content div
function wrapQuickFactsContent(html) {
  // Find all quick-facts divs and wrap their content
  const regex = /(<div class="quick-facts">)([\s\S]*?)(<\/div>)/g;

  return html.replace(regex, (match, openDiv, content, closeDiv) => {
    // Check if already wrapped
    if (content.includes('quick-facts-content')) {
      return match;
    }

    // Wrap the content
    return `${openDiv}\n      <div class="quick-facts-content">${content}\n      </div>\n    ${closeDiv}`;
  });
}

let filesUpdated = 0;
let filesSkipped = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Update CSS
  if (content.includes('/* Quick Facts Box */')) {
    content = content.replace(oldQuickFactsCSS, newQuickFactsCSS);
    updated = true;
  }

  // Wrap HTML content in quick-facts-content div
  const originalContent = content;
  content = wrapQuickFactsContent(content);
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

console.log('Updating callout box styling to Watts format...\n');

const blogFiles = getAllHtmlFiles('blog');
blogFiles.forEach(updateFile);

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`   Skipped: ${filesSkipped} files (already using Watts format or no quick-facts)`);
