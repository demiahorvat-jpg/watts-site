const fs = require('fs');
const path = require('path');

console.log('🔧 Carefully updating ingredient pages...\n');

// Degular font declarations
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

// Correct header styles
const headerStyles = `
      /* HEADER WRAPPER - Black background */
      .header-wrapper {
        background: #191919;
        padding: 12px 12px 0;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      /* ORANGE HEADER - Rounded like Shopify site */
      header {
        background: var(--brand-orange);
        padding: 7px 20px;
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }

      .header-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        min-height: 40px;
      }

      /* Nav on the LEFT */
      header nav {
        order: -1;
        display: flex;
        align-items: center;
      }

      header nav ul {
        list-style: none;
        display: flex;
        gap: 16px;
        align-items: center;
        margin: 0;
        padding: 0;
      }
      @media (min-width: 768px) {
        header nav ul { gap: 24px; }
      }

      header nav li {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
      }

      header nav a {
        color: var(--white);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: opacity 0.15s;
      }
      @media (min-width: 768px) {
        header nav a { font-size: 15px; }
      }
      header nav a:hover {
        opacity: 0.8;
      }

      /* Logo in CENTER */
      .logo-link {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
      }

      .logo {
        height: 24px;
        width: auto;
      }
      @media (min-width: 768px) {
        .logo { height: 28px; }
      }
`;

// Correct footer styles
const footerStyles = `
      /* FOOTER WRAPPER */
      .footer-wrapper {
        background: #191919;
        padding: 0 12px 12px;
        margin-top: 80px;
      }

      /* FOOTER - Orange with asymmetric rounded shape like Shopify */
      footer {
        background: var(--brand-orange);
        color: var(--white);
        padding: 45px 40px 20px;
        border-radius: 200px 16px 16px 200px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        min-height: 144px;
      }
      @media (min-width: 768px) {
        footer {
          padding: 63px 60px 24px;
          min-height: 207px;
          border-radius: 300px 16px 16px 300px;
        }
      }

      .footer-content {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }

      .footer-left {
        flex: 1;
      }

      .footer-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 24px;
        flex: 1;
      }
      @media (min-width: 768px) {
        .footer-right {
          gap: 32px;
        }
      }

      .footer-right-text {
        text-align: right;
      }

      .footer-logo {
        height: 100px;
        width: auto;
      }
      @media (min-width: 768px) {
        .footer-logo { height: 140px; }
      }

      footer p {
        margin: 0;
        font-size: 15px;
        line-height: 1.5;
      }
      @media (min-width: 768px) {
        footer p { font-size: 16px; }
      }
`;

// Header HTML
const headerHTML = `  <div class="header-wrapper">
    <header>
      <div class="header-container">
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/ingredient-analyzer/">Ingredients</a></li>
          </ul>
        </nav>
        <a href="/" class="logo-link">
          <img src="/watts-logo-white.svg" alt="Watts" class="logo">
        </a>
      </div>
    </header>
  </div>`;

// Footer HTML
const footerHTML = `  <div class="footer-wrapper">
    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <img src="/watts-logo-white.svg" alt="Watts" class="footer-logo">
        </div>
        <div class="footer-right">
          <div class="footer-right-text">
            <p>hello@wattspet.com</p>
          </div>
        </div>
      </div>
    </footer>
  </div>`;

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Skip if already fully updated (has new header)
    if (content.includes('.header-wrapper') && content.includes('.footer-wrapper')) {
      return { path: filePath, status: 'skipped' };
    }

    // 1. Add Degular fonts right after <style>
    if (!content.includes('Degular')) {
      content = content.replace('<style>', '<style>' + degularFonts);
      updated = true;
    }

    // 2. Add CSS variables to :root
    if (!content.includes('--brand-orange')) {
      content = content.replace(
        '--avoid: #991b1b;',
        '--avoid: #991b1b;\n        --brand-orange: #c03800;\n        --accent-navy: #1e3a5f;\n        --bg-light: #f1f1f1;\n        --white: #ffffff;'
      );
      updated = true;
    }

    // 3. Replace Geologica with Degular
    content = content.replace(/"Geologica"/g, '"Degular"');

    // 4. Add header styles before old nav.nav styles (keep old nav styles for fallback)
    if (!content.includes('.header-wrapper')) {
      // Try with comment first
      if (content.includes('/* Navigation */')) {
        content = content.replace(
          '/* Navigation */',
          '/* Navigation */' + headerStyles
        );
      } else {
        // Otherwise insert before nav.nav
        content = content.replace(
          'nav.nav {',
          headerStyles + '\n      nav.nav {'
        );
      }
      updated = true;
    }

    // 5. Add footer styles before the old footer or before </style>
    if (!content.includes('.footer-wrapper')) {
      if (content.includes('footer {')) {
        // Insert before old footer styles
        content = content.replace(
          'footer {',
          footerStyles + '\n      /* Old footer (unused) */\n      footer.old {'
        );
      } else {
        // Or before closing </style> if no footer found
        content = content.replace(
          '</style>',
          footerStyles + '\n    </style>'
        );
      }
      updated = true;
    }

    // 6. Replace old nav HTML with new header HTML
    const oldNavRegex = /<nav class="nav">\s*<ul>[\s\S]*?<\/ul>\s*<\/nav>/;
    if (oldNavRegex.test(content)) {
      content = content.replace(oldNavRegex, headerHTML);
      updated = true;
    }

    // 7. Replace old footer HTML with new footer HTML
    const oldFooterRegex = /<footer>\s*<p>&copy; \d+ Watts Pet\. All rights reserved\.<\/p>\s*<\/footer>/;
    if (oldFooterRegex.test(content)) {
      content = content.replace(oldFooterRegex, footerHTML);
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { path: filePath, status: 'updated' };
    }

    return { path: filePath, status: 'no changes' };
  } catch (error) {
    return { path: filePath, status: 'error', error: error.message };
  }
}

// Update main page
console.log('📄 Updating main ingredient analyzer page...');
const mainPage = path.join(__dirname, 'ingredient-analyzer', 'index.html');
const mainResult = updateFile(mainPage);
console.log(`   ${mainResult.status === 'updated' ? '✓' : '⚠️'} ${mainResult.status}\n`);

// Update ingredient pages
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

    if ((index + 1) % 50 === 0) {
      console.log(`   Progress: ${index + 1}/${ingredients.length} files...`);
    }
  }
});

console.log('\n✅ Update complete!');
console.log(`   Updated: ${updated} files`);
console.log(`   Skipped: ${skipped} files`);
console.log(`   Errors: ${errors} files\n`);
