const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync(
  'grep -rl "SHARED_HEADER_START" . --include="*.html"',
  { cwd: __dirname, encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

const ANNOUNCEMENT = `  <section class="g-announcement mx-contain js-announcement">
    <style>
      .g-announcement {
        --color: #191919;
        --background: #f1f1f1;
        --emphasize: #ff4a00;
      }
    </style>
    <div class="g-announcement__wrapper bg-black">
      <div class="g-announcement__blocks br-sm js-announcement-blocks">
        <div class="g-announcement__blocks__item is-active js-announcement-block">
          <div class="g-announcement__blocks__item__text">
            <p>Real ingredients. Real benefits. Nothing to hide.</p>
          </div>
        </div>
      </div>
    </div>
  </section>\n`;

let updated = 0;
let skipped = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('g-announcement')) {
    skipped++;
    continue;
  }

  content = content.replace('<body>\n', '<body>\n' + ANNOUNCEMENT);
  fs.writeFileSync(file, content, 'utf8');
  updated++;
}

console.log(`Updated: ${updated}`);
console.log(`Already had announcement: ${skipped}`);
