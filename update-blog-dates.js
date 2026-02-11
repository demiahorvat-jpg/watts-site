#!/usr/bin/env node

/**
 * Update Blog Post Dates Naturally
 *
 * Updates old blog post dates to recent dates (Dec 2025 - Feb 2026)
 * in a natural, staggered way. Updates both visible dates and schema markup.
 */

const fs = require('fs');
const path = require('path');

// Generate natural dates spread across Dec 2025 - Feb 2026
const recentDates = [
  { visible: 'December 15, 2025', schema: '2025-12-15T09:00:00-05:00' },
  { visible: 'December 18, 2025', schema: '2025-12-18T09:00:00-05:00' },
  { visible: 'December 22, 2025', schema: '2025-12-22T10:00:00-05:00' },
  { visible: 'January 5, 2026', schema: '2026-01-05T09:00:00-05:00' },
  { visible: 'January 8, 2026', schema: '2026-01-08T10:00:00-05:00' },
  { visible: 'January 12, 2026', schema: '2026-01-12T09:00:00-05:00' },
  { visible: 'January 15, 2026', schema: '2026-01-15T09:00:00-05:00' },
  { visible: 'January 18, 2026', schema: '2026-01-18T10:00:00-05:00' },
  { visible: 'January 22, 2026', schema: '2026-01-22T09:00:00-05:00' },
  { visible: 'January 25, 2026', schema: '2026-01-25T10:00:00-05:00' },
  { visible: 'January 28, 2026', schema: '2026-01-28T09:00:00-05:00' },
  { visible: 'February 1, 2026', schema: '2026-02-01T09:00:00-05:00' },
  { visible: 'February 4, 2026', schema: '2026-02-04T10:00:00-05:00' },
  { visible: 'February 7, 2026', schema: '2026-02-07T09:00:00-05:00' },
  { visible: 'February 9, 2026', schema: '2026-02-09T10:00:00-05:00' },
];

let dateIndex = 0;

function getNextDate() {
  const date = recentDates[dateIndex % recentDates.length];
  dateIndex++;
  return date;
}

function needsUpdate(content) {
  // Check if post has old dates (before December 2025)
  const oldDatePatterns = [
    /202[0-4]-/,  // Years 2020-2024 in schema
    /2025-(0[1-9]|1[01])-/,  // Jan-Nov 2025 in schema
    /(January|February|March|April|May|June|July|August|September|October|November) \d+, 202[0-4]/,  // 2020-2024 visible
    /(January|February|March|April|May|June|July|August|September|October|November) \d+, 2025/,  // Jan-Nov 2025 visible
  ];

  return oldDatePatterns.some(pattern => pattern.test(content));
}

function updateDates(filePath) {
  const filename = path.basename(filePath);
  console.log(`Processing: ${filename}`);

  let content = fs.readFileSync(filePath, 'utf8');

  if (!needsUpdate(content)) {
    console.log(`  ✓ Already has recent date`);
    return 0;
  }

  const newDate = getNextDate();

  // Update schema datePublished and dateModified
  content = content.replace(
    /"datePublished":\s*"[^"]+"/g,
    `"datePublished": "${newDate.schema}"`
  );

  content = content.replace(
    /"dateModified":\s*"[^"]+"/g,
    `"dateModified": "${newDate.schema}"`
  );

  // Update visible date in article-meta
  // Handle different formats:
  // 1. "Published [Date]"
  // 2. "[Date]"
  // 3. "Published [Date] • Updated [Date]" -> keep as just "[Date]"
  // 4. "[Date] • Updated [Date]" -> keep as just "[Date]"

  content = content.replace(
    /<div class="article-meta">Published [^<•]+(?:•[^<]+)?<\/div>/g,
    `<div class="article-meta">${newDate.visible}</div>`
  );

  content = content.replace(
    /<div class="article-meta">(January|February|March|April|May|June|July|August|September|October|November|December) \d+, 202[0-5](?:\s*•[^<]+)?<\/div>/g,
    `<div class="article-meta">${newDate.visible}</div>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ Updated to ${newDate.visible}`);
  return 1;
}

// Get all blog posts (exclude index.html)
const blogDir = 'blog';
const blogFiles = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => path.join(blogDir, f));

console.log(`Found ${blogFiles.length} blog posts\n`);

let totalUpdated = 0;

blogFiles.forEach(file => {
  totalUpdated += updateDates(file);
});

console.log(`\n✓ Complete! Updated ${totalUpdated} blog post dates to be more recent.`);
