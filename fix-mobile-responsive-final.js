#!/usr/bin/env node

/**
 * Fix Mobile Responsive Issues - Final Comprehensive Fix
 *
 * Issues:
 * 1. Inconsistent breakpoints (nav uses 767px, footer uses 599px)
 * 2. Footer CSS specificity issues preventing overrides
 * 3. Need to ensure both header and footer work properly on all mobile sizes
 */

const fs = require('fs');
const path = require('path');

function fixResponsiveIssues(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace old mobile footer fixes with better ones
  const oldFooterFixPattern = /\/\* Mobile footer fixes \*\/\s*@media \(max-width: 599px\) \{[\s\S]*?\n    \}/;

  if (!oldFooterFixPattern.test(content)) {
    console.log(`  ✗ Could not find mobile footer fixes`);
    return;
  }

  const newFooterFixes = `/* Mobile footer fixes */
    @media (max-width: 767px) {
      footer {
        padding: 32px 20px 16px !important;
        border-radius: 100px 16px 16px 100px !important;
        min-height: auto !important;
      }

      .footer-content {
        flex-direction: column !important;
        align-items: center !important;
        gap: 24px !important;
      }

      .footer-left {
        flex: none !important;
        width: 100% !important;
      }

      .footer-right {
        flex: none !important;
        width: 100% !important;
        align-items: center !important;
        gap: 16px !important;
      }

      .footer-right-text {
        text-align: center !important;
      }

      .footer-logo {
        height: 60px !important;
        margin-top: 0 !important;
      }

      footer p {
        font-size: 14px !important;
        margin-bottom: 8px !important;
      }
    }`;

  content = content.replace(oldFooterFixPattern, newFooterFixes);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ Fixed responsive issues!`);
}

function getAllHtmlFiles(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...getAllHtmlFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }

  return results;
}

// Get all files
const blogFiles = fs.existsSync('blog') ? getAllHtmlFiles('blog') : [];
console.log(`Found ${blogFiles.length} blog posts\n`);

const ingredientFiles = fs.existsSync('ingredient-analyzer/ingredients')
  ? getAllHtmlFiles('ingredient-analyzer/ingredients')
  : [];
console.log(`Found ${ingredientFiles.length} ingredient pages\n`);

const otherFiles = ['index.html', 'about.html'].filter(f => fs.existsSync(f));
console.log(`Found ${otherFiles.length} other pages\n`);

const allFiles = [...blogFiles, ...ingredientFiles, ...otherFiles];

console.log(`Processing ${allFiles.length} total files...\n`);

allFiles.forEach(fixResponsiveIssues);

console.log('\n✓ Mobile responsive fixes complete!');
