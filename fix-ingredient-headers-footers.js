const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing ingredient page headers and footers...\n');

// Correct header styles matching blog pages
const correctHeaderStyles = `
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
      nav {
        order: -1;
        display: flex;
        align-items: center;
      }

      nav ul {
        list-style: none;
        display: flex;
        gap: 16px;
        align-items: center;
        margin: 0;
        padding: 0;
      }
      @media (min-width: 768px) {
        nav ul { gap: 24px; }
      }

      nav li {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
      }

      nav a {
        color: var(--white);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: opacity 0.15s;
      }
      @media (min-width: 768px) {
        nav a { font-size: 15px; }
      }
      nav a:hover {
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

// Correct footer styles matching blog pages
const correctFooterStyles = `
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

// Correct header HTML matching blog pages
const correctHeaderHTML = `  <div class="header-wrapper">
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

// Correct footer HTML matching blog pages
const correctFooterHTML = `  <div class="footer-wrapper">
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

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // 1. Replace incorrect header styles with correct ones
    if (content.includes('.header-wrapper')) {
      // Remove old header styles (everything from .header-wrapper to before .footer-wrapper or main/body styles)
      content = content.replace(
        /\/\* Header wrapper \*\/[\s\S]*?(?=\/\* Footer wrapper \*\/|\/\* Old footer)/m,
        correctHeaderStyles
      );
      updated = true;
    }

    // 2. Replace incorrect footer styles with correct ones
    if (content.includes('.footer-wrapper')) {
      // Remove old footer styles
      content = content.replace(
        /\/\* Footer wrapper \*\/[\s\S]*?(?=<\/style>)/m,
        correctFooterStyles + '\n    '
      );
      updated = true;
    }

    // 3. Replace incorrect header HTML with correct structure
    const oldHeaderRegex = /<div class="header-wrapper">[\s\S]*?<\/div>\s*<\/div>/m;
    if (oldHeaderRegex.test(content)) {
      content = content.replace(oldHeaderRegex, correctHeaderHTML);
      updated = true;
    }

    // 4. Replace incorrect footer HTML with correct structure
    const oldFooterRegex = /<div class="footer-wrapper">[\s\S]*?<\/footer>\s*<\/div>/m;
    if (oldFooterRegex.test(content)) {
      content = content.replace(oldFooterRegex, correctFooterHTML);
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { path: filePath, status: 'fixed' };
    } else {
      return { path: filePath, status: 'no changes needed' };
    }
  } catch (error) {
    return { path: filePath, status: 'error', error: error.message };
  }
}

// Fix main ingredient analyzer page
console.log('📄 Fixing main ingredient analyzer page...');
const mainPage = path.join(__dirname, 'ingredient-analyzer', 'index.html');
const mainResult = fixFile(mainPage);
console.log(`   ${mainResult.status === 'fixed' ? '✓' : '⚠️'} ${mainResult.status}\n`);

// Fix all ingredient pages
console.log('📄 Fixing ingredient pages...');
const ingredientsDir = path.join(__dirname, 'ingredient-analyzer', 'ingredients');
const ingredients = fs.readdirSync(ingredientsDir);

let fixed = 0;
let errors = 0;

ingredients.forEach((ingredient, index) => {
  const ingredientPath = path.join(ingredientsDir, ingredient, 'index.html');

  if (fs.existsSync(ingredientPath)) {
    const result = fixFile(ingredientPath);

    if (result.status === 'fixed') {
      fixed++;
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

console.log('\n✅ Fix complete!');
console.log(`   Fixed: ${fixed} files`);
console.log(`   Errors: ${errors} files`);
console.log(`   Total: ${ingredients.length} ingredient pages\n`);
