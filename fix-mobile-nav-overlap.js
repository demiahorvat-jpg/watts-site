#!/usr/bin/env node

/**
 * Fix Mobile Navigation Overlap
 *
 * Problem: On small screens, the navigation (4 items) overlaps with the centered logo
 * Solution: Hide the "About" link on screens < 500px, reducing to 3 nav items
 */

const fs = require('fs');
const path = require('path');

// CSS fix to add
const mobileNavFix = `
    /* Mobile nav fix - hide About link on small screens to prevent logo overlap */
    @media (max-width: 499px) {
      nav li:nth-child(2) { /* About link */
        display: none;
      }
    }`;

function fixMobileNav(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if fix already applied
  if (content.includes('Mobile nav fix - hide About link')) {
    console.log(`  ✓ Already fixed`);
    return;
  }

  // Find the location to insert the fix (right after nav a:hover)
  const navHoverPattern = /nav a:hover \{[^}]+\}/;

  if (!navHoverPattern.test(content)) {
    console.log(`  ✗ Could not find nav a:hover section`);
    return;
  }

  // Insert the mobile nav fix right after nav a:hover
  content = content.replace(
    navHoverPattern,
    match => match + mobileNavFix
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

allFiles.forEach(fixMobileNav);

console.log('\n✓ Mobile navigation overlap fix complete!');
