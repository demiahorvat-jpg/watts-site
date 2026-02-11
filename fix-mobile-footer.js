#!/usr/bin/env node

/**
 * Fix Mobile Footer Layout Issues
 *
 * Problems on mobile:
 * 1. Footer doesn't stack vertically - stays horizontal with two flex columns
 * 2. Large border-radius (200px) doesn't scale well on narrow screens
 * 3. Footer logo has excessive margin-top (128px on mobile)
 * 4. Right-aligned text doesn't look good on small screens
 * 5. Excessive padding on mobile
 *
 * Solution: Add mobile-specific styles to stack content, reduce sizes, center text
 */

const fs = require('fs');
const path = require('path');

// CSS fixes to add for mobile footer
const mobileFooterFixes = `
    /* Mobile footer fixes */
    @media (max-width: 599px) {
      footer {
        padding: 32px 20px 16px;
        border-radius: 100px 16px 16px 100px;
        min-height: auto;
      }

      .footer-content {
        flex-direction: column;
        align-items: center;
        gap: 24px;
      }

      .footer-left {
        flex: none;
        width: 100%;
      }

      .footer-right {
        flex: none;
        width: 100%;
        align-items: center;
        gap: 16px;
      }

      .footer-right-text {
        text-align: center;
      }

      .footer-logo {
        height: 60px;
        margin-top: 0;
      }

      footer p {
        font-size: 14px;
        margin-bottom: 8px;
      }
    }`;

function fixMobileFooter(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if fix already applied
  if (content.includes('Mobile footer fixes')) {
    console.log(`  ✓ Already fixed`);
    return;
  }

  // Find the location to insert the fix (right after footer a:hover)
  const footerHoverPattern = /footer a:hover \{[^}]+\}/;

  if (!footerHoverPattern.test(content)) {
    console.log(`  ✗ Could not find footer a:hover section`);
    return;
  }

  // Insert the mobile footer fixes right after footer a:hover
  content = content.replace(
    footerHoverPattern,
    match => match + mobileFooterFixes
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ Fixed!`);
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

// Get all blog posts
const blogFiles = fs.existsSync('blog') ? getAllHtmlFiles('blog') : [];
console.log(`Found ${blogFiles.length} blog posts\n`);

// Get all ingredient pages
const ingredientFiles = fs.existsSync('ingredient-analyzer/ingredients')
  ? getAllHtmlFiles('ingredient-analyzer/ingredients')
  : [];
console.log(`Found ${ingredientFiles.length} ingredient pages\n`);

// Get index and about pages
const otherFiles = ['index.html', 'about.html'].filter(f => fs.existsSync(f));
console.log(`Found ${otherFiles.length} other pages\n`);

const allFiles = [...blogFiles, ...ingredientFiles, ...otherFiles];

console.log(`Processing ${allFiles.length} total files...\n`);

allFiles.forEach(fixMobileFooter);

console.log('\n✓ Mobile footer fixes complete!');
