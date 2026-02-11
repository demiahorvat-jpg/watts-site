const fs = require('fs');
const path = require('path');

console.log('🚀 Starting ingredient pages update...\n');

// Degular font-face declarations to add
const degularFonts = `
      @font-face {
        font-family: 'Degular';
        src: url('/fonts/Degular-Regular.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Degular';
        src: url('/fonts/Degular-Medium.woff2') format('woff2');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Degular';
        src: url('/fonts/Degular-Semibold.woff2') format('woff2');
        font-weight: 600;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Degular';
        src: url('/fonts/Degular-Bold.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
`;

// New header HTML
const newHeader = `  <div class="header-wrapper">
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/about.html">About</a>
        <a href="/blog/">Blog</a>
        <a href="/ingredient-analyzer/">Ingredients</a>
      </nav>
      <a href="/" class="logo-link">
        <img src="/watts-logo-white.svg" alt="Watts" class="logo">
      </a>
    </header>
  </div>`;

// New footer HTML
const newFooter = `  <div class="footer-wrapper">
    <footer>
      <div class="footer-content">
        <img src="/watts-logo-white.svg" alt="Watts" class="footer-logo">
        <p>hello@wattspet.com</p>
      </div>
    </footer>
  </div>`;

// Function to update a single file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Skip if already updated
    if (content.includes('Degular')) {
      return { path: filePath, status: 'skipped', reason: 'already updated' };
    }

    // 1. Add Degular fonts before :root
    if (content.includes(':root {')) {
      content = content.replace('<style>', '<style>' + degularFonts);
      updated = true;
    }

    // 2. Update CSS variables - add accent-navy
    if (content.includes(':root {') && !content.includes('--accent-navy')) {
      content = content.replace(
        '--avoid: #991b1b;',
        '--avoid: #991b1b;\n        --brand-orange: #c03800;\n        --accent-navy: #1e3a5f;\n        --bg-light: #f1f1f1;\n        --white: #ffffff;'
      );
      updated = true;
    }

    // 3. Replace Geologica with Degular
    content = content.replace(/"Geologica"/g, '"Degular"');
    content = content.replace(/font-family: "Geologica"/g, 'font-family: "Degular"');

    // 4. Add header-wrapper styles if not present
    if (!content.includes('.header-wrapper')) {
      const headerWrapperStyles = `
      /* Header wrapper */
      .header-wrapper {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: #191919;
        padding: 16px 20px;
      }

      header {
        max-width: 1400px;
        margin: 0 auto;
        background: var(--brand-orange, #c03800);
        border-radius: 200px;
        padding: 16px 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }

      header nav {
        display: flex;
        gap: 32px;
        align-items: center;
      }

      header nav a {
        color: var(--white, #ffffff);
        text-decoration: none;
        font-size: 15px;
        font-weight: 500;
        transition: opacity 0.15s;
      }

      header nav a:hover {
        opacity: 0.8;
      }

      header .logo-link {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      header .logo {
        height: 28px;
        width: auto;
        display: block;
      }

      @media (max-width: 767px) {
        .header-wrapper {
          padding: 12px 16px;
        }
        header {
          padding: 12px 20px;
          border-radius: 100px;
        }
        header nav {
          gap: 20px;
        }
        header nav a {
          font-size: 14px;
        }
        header .logo {
          height: 24px;
        }
      }
`;

      // Insert before nav.nav styles
      content = content.replace('nav.nav {', headerWrapperStyles + '\n      /* Old nav styles (unused) */\n      nav.nav {');
      updated = true;
    }

    // 5. Add footer-wrapper styles if not present
    if (!content.includes('.footer-wrapper')) {
      const footerWrapperStyles = `
      /* Footer wrapper */
      .footer-wrapper {
        background: #191919;
        padding: 16px 20px;
        margin-top: 80px;
      }

      footer {
        max-width: 1400px;
        margin: 0 auto;
        background: var(--brand-orange, #c03800);
        border-radius: 200px 0 200px 300px;
        padding: 32px 48px;
        text-align: center;
      }

      .footer-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      .footer-logo {
        height: 32px;
        width: auto;
      }

      footer p {
        color: var(--white, #ffffff);
        font-size: 15px;
        margin: 0;
      }

      @media (max-width: 767px) {
        .footer-wrapper {
          padding: 12px 16px;
          margin-top: 60px;
        }
        footer {
          padding: 24px 32px;
          border-radius: 100px 0 100px 150px;
        }
        .footer-logo {
          height: 28px;
        }
        footer p {
          font-size: 14px;
        }
      }
`;

      // Insert before existing footer styles
      content = content.replace('footer {', footerWrapperStyles + '\n      /* Old footer styles (may be unused) */\n      footer.old {');
      updated = true;
    }

    // 6. Replace old nav HTML with new header HTML
    const oldNavRegex = /<nav class="nav">\s*<ul>[\s\S]*?<\/ul>\s*<\/nav>/;
    if (oldNavRegex.test(content)) {
      content = content.replace(oldNavRegex, newHeader);
      updated = true;
    }

    // 7. Replace old footer HTML with new footer HTML
    const oldFooterRegex = /<footer>\s*<p>&copy; \d+ Watts Pet\. All rights reserved\.<\/p>\s*<\/footer>/;
    if (oldFooterRegex.test(content)) {
      content = content.replace(oldFooterRegex, newFooter);
      updated = true;
    }

    // 8. Update link colors to navy in content links (not nav links)
    // This is conservative - only updates specific link styles, not all
    content = content.replace(
      /color: var\(--fg\);(\s*text-decoration: underline;)/g,
      'color: var(--accent-navy, #1e3a5f);$1'
    );

    // Write back to file
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { path: filePath, status: 'updated' };
    } else {
      return { path: filePath, status: 'no changes' };
    }
  } catch (error) {
    return { path: filePath, status: 'error', error: error.message };
  }
}

// Process main ingredient analyzer page
console.log('📄 Updating main ingredient analyzer page...');
const mainPage = path.join(__dirname, 'ingredient-analyzer', 'index.html');
const mainResult = updateFile(mainPage);
console.log(`   ${mainResult.status === 'updated' ? '✓' : '⚠️'} ${mainResult.status}\n`);

// Process all ingredient pages
console.log('📄 Updating ingredient pages...');
const ingredientsDir = path.join(__dirname, 'ingredient-analyzer', 'ingredients');
const ingredients = fs.readdirSync(ingredientsDir);

let updated = 0;
let skipped = 0;
let errors = 0;

ingredients.forEach((ingredient, index) => {
  const ingredientPath = path.join(ingredientsDir, ingredient, 'index.html');

  if (fs.existsSync(ingredientPath)) {
    const result = updateFile(ingredientPath);

    if (result.status === 'updated') {
      updated++;
    } else if (result.status === 'skipped') {
      skipped++;
    } else if (result.status === 'error') {
      errors++;
      console.log(`   ✗ Error in ${ingredient}: ${result.error}`);
    }

    // Progress indicator every 50 files
    if ((index + 1) % 50 === 0) {
      console.log(`   Progress: ${index + 1}/${ingredients.length} files processed...`);
    }
  }
});

console.log('\n✅ Update complete!');
console.log(`   Updated: ${updated} files`);
console.log(`   Skipped: ${skipped} files (already updated)`);
console.log(`   Errors: ${errors} files`);
console.log(`   Total: ${ingredients.length} ingredient pages\n`);
