const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync(
  'grep -rl "g-header__linklist__item btn-underline" . --include="*.html"',
  { cwd: __dirname, encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

const DESKTOP_OLD = `          <li class="g-header__linklist__item btn-underline t-l-2">
            <a href="https://www.wattspet.com/products/better-dailies">Shop</a>
          </li>
          <li class="g-header__linklist__item btn-underline t-l-2">
            <a href="/blog">Blog</a>`;

const DESKTOP_NEW = `          <li class="g-header__linklist__item btn-underline t-l-2">
            <a href="https://www.wattspet.com/products/better-dailies">Shop</a>
          </li>
          <li class="g-header__linklist__item btn-underline t-l-2">
            <a href="https://www.wattspet.com/pages/about">About</a>
          </li>
          <li class="g-header__linklist__item btn-underline t-l-2">
            <a href="/blog">Blog</a>`;

const MOBILE_OLD = `          <li class="g-header__mobile-menu__list__item">
            <a class="g-header__mobile-menu__item t-l-1" href="https://www.wattspet.com/products/better-dailies">
              <span class="g-header__mobile-menu__item__active-deco"></span>
              <span>Shop</span>
            </a>
          </li>
          <li class="g-header__mobile-menu__list__item">
            <a class="g-header__mobile-menu__item t-l-1" href="/blog">`;

const MOBILE_NEW = `          <li class="g-header__mobile-menu__list__item">
            <a class="g-header__mobile-menu__item t-l-1" href="https://www.wattspet.com/products/better-dailies">
              <span class="g-header__mobile-menu__item__active-deco"></span>
              <span>Shop</span>
            </a>
          </li>
          <li class="g-header__mobile-menu__list__item">
            <a class="g-header__mobile-menu__item t-l-1" href="https://www.wattspet.com/pages/about">
              <span class="g-header__mobile-menu__item__active-deco"></span>
              <span>About</span>
            </a>
          </li>
          <li class="g-header__mobile-menu__list__item">
            <a class="g-header__mobile-menu__item t-l-1" href="/blog">`;

let updated = 0;
let skipped = 0;
let alreadyHas = 0;

for (const file of files) {
  const fullPath = path.resolve(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  if (content.includes('href="https://www.wattspet.com/pages/about">About</a>')) {
    alreadyHas++;
    continue;
  }

  const hadDesktop = content.includes(DESKTOP_OLD);
  const hadMobile = content.includes(MOBILE_OLD);

  if (!hadDesktop && !hadMobile) {
    skipped++;
    continue;
  }

  content = content.replace(DESKTOP_OLD, DESKTOP_NEW);
  content = content.replace(MOBILE_OLD, MOBILE_NEW);
  fs.writeFileSync(fullPath, content, 'utf8');
  updated++;
}

console.log(`Updated: ${updated}`);
console.log(`Already had About: ${alreadyHas}`);
console.log(`Skipped (pattern not found): ${skipped}`);
