#!/usr/bin/env node
// Submit changed pages to IndexNow (Bing, DuckDuckGo, Yahoo, Ecosia, Yandex all share it).
// Bing's index sends ~97% of learn.wattspet.com's organic traffic, so telling it about changes
// the moment they ship matters more here than any Google-side work.
//
//   node scripts/indexnow-submit.mjs <base-sha> <head-sha>   pages changed between two commits
//   node scripts/indexnow-submit.mjs --urls <url> [<url>...]  explicit URLs
//   add --dry-run to print the list without submitting
//
// Run automatically on every push to main by .github/workflows/indexnow.yml.
// Only URLs listed in sitemap.xml are submitted, so noindexed pages never go out.
// Deleted pages are submitted too: IndexNow uses that to drop them from the index.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const HOST = 'learn.wattspet.com';
const KEY = 'c3d5e8f1a4b7c9d2e5f8a1b4c7d9e2f5';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const BATCH = 10000; // IndexNow's per-request limit

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const rest = args.filter(a => a !== '--dry-run');

function fileToUrl(file) {
  const path = file.replace(/(^|\/)index\.html$/, '$1');
  return `https://${HOST}/${path}`;
}

function sitemapUrls(xml) {
  return new Set([...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]));
}

function changedUrls(base, head) {
  const git = (...a) => execFileSync('git', a, { encoding: 'utf8' });
  const allowed = sitemapUrls(readFileSync('sitemap.xml', 'utf8'));
  // A deleted page is no longer in the current sitemap, so check it against the old one.
  let previous = new Set();
  try { previous = sitemapUrls(git('show', `${base}:sitemap.xml`)); } catch {}

  const urls = new Set();
  const diff = git('diff', '--name-status', '--no-renames', base, head).trim();
  for (const line of diff ? diff.split('\n') : []) {
    const [status, file] = line.split('\t');
    if (!file.endsWith('.html')) continue;
    const url = fileToUrl(file);
    if (status === 'D' ? previous.has(url) : allowed.has(url)) urls.add(url);
  }
  return [...urls];
}

async function submit(urlList) {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  // 200 = accepted, 202 = accepted while the key is still being validated.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow returned ${res.status}: ${await res.text()}`);
  }
  return res.status;
}

let urls;
if (rest[0] === '--urls') {
  urls = rest.slice(1);
} else if (rest.length === 2) {
  urls = changedUrls(rest[0], rest[1]);
} else {
  console.error('usage: indexnow-submit.mjs <base> <head> | --urls <url>... [--dry-run]');
  process.exit(2);
}

if (urls.length === 0) {
  console.log('No indexable pages changed; nothing to submit.');
  process.exit(0);
}

console.log(`${urls.length} URL(s):\n  ${urls.join('\n  ')}`);
if (dryRun) process.exit(0);

for (let i = 0; i < urls.length; i += BATCH) {
  const status = await submit(urls.slice(i, i + BATCH));
  console.log(`IndexNow ${status} for ${Math.min(BATCH, urls.length - i)} URL(s)`);
}
