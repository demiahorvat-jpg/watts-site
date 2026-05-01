#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractMeta(content, filePath) {
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const metaMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  
  // Convert file path to URL
  let url = filePath.replace('/Users/demihorvat/Projects/watts-site', 'https://learn.wattspet.com');
  if (url.endsWith('/index.html')) {
    url = url.replace('/index.html', '/');
  }
  
  return {
    url: canonicalMatch ? canonicalMatch[1] : url,
    title: titleMatch ? titleMatch[1].trim() : '(no title)',
    meta: metaMatch ? metaMatch[1].trim() : '(no meta description)',
    metaLength: metaMatch ? metaMatch[1].trim().length : 0
  };
}

const files = findHtmlFiles('/Users/demihorvat/Projects/watts-site');
const pages = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Skip redirect pages
  if (content.includes('http-equiv="refresh"') || content.length < 500) continue;
  pages.push(extractMeta(content, file));
}

// Sort by URL
pages.sort((a, b) => a.url.localeCompare(b.url));

// Output as TSV for easy viewing/copying
console.log('URL\tTITLE\tMETA DESCRIPTION\tMETA LENGTH');
for (const p of pages) {
  console.log(`${p.url}\t${p.title}\t${p.meta}\t${p.metaLength}`);
}

console.error(`\nTotal pages: ${pages.length}`);
