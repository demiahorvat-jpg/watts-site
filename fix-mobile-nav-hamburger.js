#!/usr/bin/env node

/**
 * Implement Proper Mobile Navigation with Hamburger Menu
 *
 * This script:
 * 1. Removes the previous "hide About link" fix
 * 2. Implements a proper hamburger menu for mobile navigation
 * 3. Adds toggle functionality with JavaScript
 */

const fs = require('fs');
const path = require('path');

// Remove the old fix
function removeOldFix(content) {
  // Remove the old mobile nav fix that just hid the About link
  const oldFixPattern = /\/\* Mobile nav fix - hide About link on small screens to prevent logo overlap \*\/\s*@media \(max-width: 499px\) \{\s*nav li:nth-child\(2\) \{ \/\* About link \*\/\s*display: none;\s*\}\s*\}/;
  return content.replace(oldFixPattern, '');
}

// New hamburger menu CSS
const hamburgerCSS = `
    /* Hamburger menu for mobile */
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      z-index: 1000;
    }

    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--white);
      transition: all 0.3s ease;
    }

    @media (max-width: 767px) {
      .hamburger {
        display: flex;
      }

      nav ul {
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        background: var(--brand-orange);
        flex-direction: column;
        gap: 0;
        padding: 20px;
        margin: 0;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        max-height: calc(100vh - 64px);
        overflow-y: auto;
      }

      nav ul.active {
        transform: translateX(0);
      }

      nav li {
        width: 100%;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      nav li:last-child {
        border-bottom: none;
      }

      nav a {
        font-size: 16px;
        display: block;
        width: 100%;
      }

      /* Keep logo centered */
      .logo-container {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }`;

// JavaScript for hamburger toggle
const hamburgerJS = `
  // Hamburger menu toggle
  document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
      });

      // Close menu when clicking a link
      const navLinks = navMenu.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
        }
      });
    }
  });`;

function fixMobileNavigation(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if hamburger menu already implemented
  if (content.includes('Hamburger menu for mobile')) {
    console.log(`  ✓ Already has hamburger menu`);
    return;
  }

  // Remove old fix if present
  content = removeOldFix(content);

  // Find where to add CSS (after nav a:hover or after Mobile nav fix removal)
  const navHoverPattern = /nav a:hover \{[^}]+\}/;

  if (!navHoverPattern.test(content)) {
    console.log(`  ✗ Could not find nav a:hover section`);
    return;
  }

  // Add hamburger CSS after nav a:hover
  content = content.replace(
    navHoverPattern,
    match => match + hamburgerCSS
  );

  // Find the nav HTML and add hamburger button
  const navPattern = /(<nav>\s*<ul>)/;

  if (navPattern.test(content)) {
    content = content.replace(
      navPattern,
      `<button class="hamburger" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          $1`
    );
  }

  // Add JavaScript before closing script tag or body tag
  const scriptPattern = /<script>\s*document\.getElementById\('year'\)/;

  if (scriptPattern.test(content)) {
    content = content.replace(
      scriptPattern,
      `<script>${hamburgerJS}\n\n  document.getElementById('year')`
    );
  } else {
    // If no year script found, add before closing body tag
    content = content.replace(
      /<\/body>/,
      `  <script>${hamburgerJS}\n  </script>\n</body>`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ Fixed with hamburger menu!`);
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

allFiles.forEach(fixMobileNavigation);

console.log('\n✓ Mobile navigation with hamburger menu complete!');
