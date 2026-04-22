'use strict';
const { execSync } = require('child_process');
const fs = require('fs');

const INFRA = [
  /apply shared shell/i, /shared shell/i, /shell batch/i,
  /ingredient pages batch/i, /fix ingredient/i, /restore list-style/i,
  /scope list-style/i, /add padding/i, /add ingredient shell/i,
  /fix header/i, /fix list-style/i, /cancel page inline/i,
  /indexnow/i, /favicon/i, /blog-page\.css/i, /load blog-page/i,
  /preload\.min\.css/i, /opacity/i, /restore article typography/i,
  /zero out nav/i, /logo container/i, /shrink logo/i, /reduce logo/i,
  /temporary fallback/i, /set logo/i, /apply shell/i, /shell to /i,
  /ingredient-analyzer index/i, /pill height/i, /header color/i,
  /header link/i, /bullet/i, /footer padding/i, /restore list/i,
];

function isInfra(msg) {
  return INFRA.some(p => p.test(msg));
}

function getLastContentDate(file) {
  try {
    const out = execSync(`git log --format=%ad__SEP__%s --date=format:%Y-%m-%d -- "${file}"`, { encoding: 'utf8' }).trim();
    for (const line of out.split('\n')) {
      const idx = line.indexOf('__SEP__');
      const date = line.slice(0, idx);
      const msg  = line.slice(idx + 7);
      if (!isInfra(msg)) return date;
    }
  } catch(e) {}
  return null;
}

function getDateModified(html) {
  let m = html.match(/"dateModified":\s*"([^"]+)"/);
  if (m) return m[1];
  m = html.match(/Last updated:\s*([A-Z][a-z]+ \d+, \d{4})/);
  if (m) return m[1];
  return null;
}

function toISO(str) {
  if (!str) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const d = new Date(str);
  return isNaN(d) ? null : d.toISOString().slice(0, 10);
}

const pages = [];
fs.readdirSync('blog').filter(f => f.endsWith('.html')).forEach(f => pages.push('blog/' + f));
fs.readdirSync('guides').filter(f => f.endsWith('.html')).forEach(f => pages.push('guides/' + f));
pages.push('ingredient-analyzer/index.html');
fs.readdirSync('ingredient-analyzer/ingredients').forEach(slug => {
  const p = `ingredient-analyzer/ingredients/${slug}/index.html`;
  if (fs.existsSync(p)) pages.push(p);
});

const mismatches = [];

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('http-equiv="refresh"')) continue;
  const raw = getDateModified(html);
  const inFile = toISO(raw);
  const inGit  = getLastContentDate(file);
  if (!raw || !inGit) continue;
  if (inFile !== inGit) mismatches.push({ file, inFile, inGit, raw });
}

console.log(`MISMATCHES: ${mismatches.length}`);
mismatches.forEach(({ file, inFile, inGit }) =>
  console.log(`  ${inFile} → ${inGit}  ${file}`)
);
