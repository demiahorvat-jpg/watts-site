'use strict';
const { execSync } = require('child_process');
const fs = require('fs');

const INFRA = [
  /apply shared shell/i, /add shared shell/i, /shared shell/i, /shell batch/i,
  /ingredient pages batch/i, /fix ingredient/i, /restore list-style/i,
  /scope list-style/i, /add padding/i, /add ingredient shell/i,
  /fix header/i, /fix list-style/i, /cancel page inline/i,
  /indexnow/i, /favicon/i, /blog-page\.css/i, /load blog-page/i,
  /preload\.min\.css/i, /opacity/i, /restore article typography/i,
  /zero out nav/i, /logo container/i, /shrink logo/i, /reduce logo/i,
  /temporary fallback/i, /set logo/i, /apply shell/i, /shell to /i,
  /ingredient-analyzer index/i, /pill height/i, /header color/i,
  /header link/i, /bullet/i, /footer padding/i, /restore list/i,
  /analytics/i,
];

// Any commit on or after this date is infra (shell rollout period)
const INFRA_CUTOFF = '2026-04-21';

function isInfra(msg, date) {
  if (date >= INFRA_CUTOFF) return true;
  return INFRA.some(p => p.test(msg));
}

function getLastContentDate(file) {
  try {
    const out = execSync(`git log --format=%ad__S__%s --date=format:%Y-%m-%d -- "${file}"`, { encoding: 'utf8' }).trim();
    for (const line of out.split('\n')) {
      const idx = line.indexOf('__S__');
      const date = line.slice(0, idx);
      const msg  = line.slice(idx + 5);
      if (!isInfra(msg, date)) return date;
    }
  } catch(e) {}
  return null;
}

function getDateModified(html) {
  let m = html.match(/"dateModified":\s*"([^"]+)"/);
  if (m) return m[1];
  return null;
}

function toISO(str) {
  if (!str) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const d = new Date(str);
  return isNaN(d) ? null : d.toISOString().slice(0, 10);
}

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function toEnglish(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function isEnglishFormat(str) {
  return /^[A-Z][a-z]+ \d+, \d{4}$/.test(str);
}

// Collect all pages
const pages = [];
fs.readdirSync('blog').filter(f => f.endsWith('.html')).forEach(f => pages.push('blog/' + f));
fs.readdirSync('guides').filter(f => f.endsWith('.html')).forEach(f => pages.push('guides/' + f));
pages.push('ingredient-analyzer/index.html');
fs.readdirSync('ingredient-analyzer/ingredients').forEach(slug => {
  const p = `ingredient-analyzer/ingredients/${slug}/index.html`;
  if (fs.existsSync(p)) pages.push(p);
});

let updated = 0;
const APPLY = process.argv.includes('--apply');

for (const file of pages) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('http-equiv="refresh"')) continue;

  const raw = getDateModified(html);
  if (!raw) continue;
  const inFile = toISO(raw);
  const inGit  = getLastContentDate(file);
  if (!inGit || inFile === inGit) continue;

  const useEnglish = isEnglishFormat(raw);
  const newDate    = useEnglish ? toEnglish(inGit) : inGit;

  // Replace "dateModified": "old" with new date
  let newHtml = html.replace(
    `"dateModified": "${raw}"`,
    `"dateModified": "${newDate}"`
  );

  // For ingredient pages with English format, also update visible "Last updated: ..." text
  if (useEnglish) {
    newHtml = newHtml.replace(
      `Last updated: ${raw}`,
      `Last updated: ${newDate}`
    );
  }

  if (newHtml === html) continue;

  console.log(`${inFile} → ${inGit}  ${file}`);
  updated++;

  if (APPLY) {
    fs.writeFileSync(file, newHtml, 'utf8');
  }
}

console.log(`\n${APPLY ? 'Updated' : 'Would update'}: ${updated} pages`);
