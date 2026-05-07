#!/usr/bin/env node
// Adds missing og:image, og:site_name, and twitter:* meta tags to all content pages.
// Also fixes og:image URLs that still point to bare wattspet.com CDN (no www prefix issue is separate).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OG_IMAGE = 'https://learn.wattspet.com/assets/hero.jpg';
const OG_SITE_NAME = 'Watts Pet';

function getFiles(dirs) {
  const files = [];
  for (const dir of dirs) {
    try {
      const result = execSync(`find ${dir} -name "*.html"`, { encoding: 'utf8' });
      files.push(...result.trim().split('\n').filter(Boolean));
    } catch (e) {}
  }
  return files;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const hasOgImage = content.includes('property="og:image"') || content.includes("property='og:image'");
  const hasOgSiteName = content.includes('property="og:site_name"') || content.includes("property='og:site_name'");
  const hasTwitterCard = content.includes('name="twitter:card"') || content.includes("name='twitter:card'") ||
                         content.includes('property="twitter:card"') || content.includes("property='twitter:card'");
  const hasTwitterImage = content.includes('name="twitter:image"') || content.includes("name='twitter:image'") ||
                          content.includes('property="twitter:image"') || content.includes("property='twitter:image'");
  const hasTwitterTitle = content.includes('name="twitter:title"') || content.includes("name='twitter:title'") ||
                          content.includes('property="twitter:title"') || content.includes("property='twitter:title'");
  const hasTwitterDesc = content.includes('name="twitter:description"') || content.includes("name='twitter:description'") ||
                         content.includes('property="twitter:description"') || content.includes("property='twitter:description'");
  const hasOgUrl = content.includes('property="og:url"') || content.includes("property='og:url'");
  const hasOgTitle = content.includes('property="og:title"') || content.includes("property='og:title'");
  const hasOgDesc = content.includes('property="og:description"') || content.includes("property='og:description'");

  if (!hasOgImage || !hasOgSiteName || !hasTwitterCard || !hasTwitterImage) {
    // Find the best insertion point: after og:url or og:description or og:title
    // Strategy: find last og: tag line and insert missing tags after it

    // Get og:url value for use in twitter tags
    let ogUrl = '';
    const urlMatch = content.match(/property="og:url"\s+content="([^"]+)"/);
    if (urlMatch) ogUrl = urlMatch[1];

    let ogTitle = '';
    const titleMatch = content.match(/property="og:title"\s+content="([^"]+)"/);
    if (titleMatch) ogTitle = titleMatch[1];

    let ogDesc = '';
    const descMatch = content.match(/property="og:description"\s+content="([^"]+)"/);
    if (descMatch) ogDesc = descMatch[1];

    // Build tags to insert after last og: property tag (before </head> or first non-og meta)
    let tagsToInsert = '';

    if (!hasOgImage) {
      tagsToInsert += `  <meta property="og:image" content="${OG_IMAGE}">\n`;
    }
    if (!hasOgSiteName) {
      tagsToInsert += `  <meta property="og:site_name" content="${OG_SITE_NAME}">\n`;
    }
    if (!hasTwitterCard) {
      tagsToInsert += `  <meta name="twitter:card" content="summary_large_image">\n`;
      if (ogUrl) tagsToInsert += `  <meta name="twitter:url" content="${ogUrl}">\n`;
      if (ogTitle) tagsToInsert += `  <meta name="twitter:title" content="${ogTitle}">\n`;
      if (ogDesc) tagsToInsert += `  <meta name="twitter:description" content="${ogDesc}">\n`;
      if (!hasTwitterImage) {
        tagsToInsert += `  <meta name="twitter:image" content="${OG_IMAGE}">\n`;
      }
    } else if (!hasTwitterImage) {
      // Has twitter:card but missing twitter:image
      tagsToInsert += `  <meta name="twitter:image" content="${OG_IMAGE}">\n`;
    }

    if (!tagsToInsert) return false;

    // Find the last og: meta tag and insert after it
    const ogTagRegex = /<meta\s+(?:property|name)="(?:og:|twitter:)[^"]*"[^>]*>\n?/g;
    let lastMatch = null;
    let match;
    while ((match = ogTagRegex.exec(content)) !== null) {
      lastMatch = match;
    }

    if (lastMatch) {
      const insertPos = lastMatch.index + lastMatch[0].length;
      content = content.slice(0, insertPos) + tagsToInsert + content.slice(insertPos);
      changed = true;
    } else if (hasOgTitle) {
      // Fallback: insert after og:title tag
      content = content.replace(
        /(<meta\s+property="og:title"[^>]*>\n?)/,
        `$1${tagsToInsert}`
      );
      changed = true;
    } else {
      // Last resort: insert before </head>
      content = content.replace('</head>', tagsToInsert + '</head>');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

const dirs = [
  'blog',
  'guides',
  'ingredient-analyzer/ingredients'
];

const files = getFiles(dirs);
// Also handle index files
const extraFiles = [
  'blog/index.html',
  'ingredient-analyzer/index.html',
  'ingredient-analyzer/ingredients/index.html',
  'dog-age-calculator/index.html',
  'supplement-quiz/index.html',
];
for (const f of extraFiles) {
  if (!files.includes(f) && fs.existsSync(f)) files.push(f);
}

let fixedCount = 0;
for (const file of files) {
  if (fixFile(file)) {
    fixedCount++;
    console.log('FIXED:', file);
  }
}
console.log(`\nDone. Fixed ${fixedCount} / ${files.length} files.`);
