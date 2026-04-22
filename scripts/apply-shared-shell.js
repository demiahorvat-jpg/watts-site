#!/usr/bin/env node
/**
 * apply-shared-shell.js
 *
 * Applies the shared shell (head, header, footer) across all blog HTML pages.
 *
 * Usage:
 *   node scripts/apply-shared-shell.js          # dry-run (default, safe)
 *   node scripts/apply-shared-shell.js --apply  # write changes to disk
 *
 * Shell files (source of truth):
 *   shell/head-shared.html   → content between SHARED_HEAD_START / SHARED_HEAD_END
 *   shell/header.html        → content between SHARED_HEADER_START / SHARED_HEADER_END
 *   shell/footer.html        → content between SHARED_FOOTER_START / SHARED_FOOTER_END
 *
 * Two modes:
 *   A — markers present: replace content between existing marker pairs (idempotent)
 *   B — old format (no markers): pattern-based first-time migration
 *       Head    → remove old favicon + old CSS link, insert shared head before </head>
 *       Header  → replace <div class="header-wrapper">...</div> block
 *       Footer  → replace <div class="footer-wrapper">...</div> block
 *
 * Skipped automatically:
 *   - index.html
 *   - preview-*.html
 *   - any page with no <article> element
 *   - pages with partial markers (reported as warnings, needs manual review)
 *   - pages where pattern detection fails
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const APPLY    = process.argv.includes('--apply');
const DRY_RUN  = !APPLY;

const FILE_ARG = (() => {
  const i = process.argv.indexOf('--file');
  return i !== -1 ? process.argv[i + 1] : null;
})();

const DIR_ARG = (() => {
  const i = process.argv.indexOf('--dir');
  return i !== -1 ? process.argv[i + 1] : null;
})();

const RECURSIVE = process.argv.includes('--recursive');

const ROOT       = path.join(__dirname, '..');
const BLOG_DIR   = path.join(ROOT, DIR_ARG || 'blog');
const SHELL_DIR  = path.join(ROOT, 'shell');

// ---------------------------------------------------------------------------
// Load shell content
// ---------------------------------------------------------------------------

const HEAD_FILE = (() => {
  if (DIR_ARG === 'guides') return 'head-shared-guides.html';
  if (RECURSIVE)            return 'head-shared-ingredients.html';
  return 'head-shared.html';
})();

const SHELL = {
  head:   fs.readFileSync(path.join(SHELL_DIR, HEAD_FILE),     'utf8'),
  header: fs.readFileSync(path.join(SHELL_DIR, 'header.html'), 'utf8'),
  footer: fs.readFileSync(path.join(SHELL_DIR, 'footer.html'), 'utf8'),
};

// Trim trailing newline from shell files so insertion is clean
Object.keys(SHELL).forEach(k => { SHELL[k] = SHELL[k].trimEnd(); });

// ---------------------------------------------------------------------------
// Marker pairs
// ---------------------------------------------------------------------------

const MARKERS = {
  head:   { start: '<!-- SHARED_HEAD_START -->',   end: '<!-- SHARED_HEAD_END -->'   },
  header: { start: '<!-- SHARED_HEADER_START -->', end: '<!-- SHARED_HEADER_END -->' },
  footer: { start: '<!-- SHARED_FOOTER_START -->', end: '<!-- SHARED_FOOTER_END -->' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hasMarker(html, key) {
  return html.includes(MARKERS[key].start) && html.includes(MARKERS[key].end);
}

function replaceMarkerBlock(html, key, content) {
  const { start, end } = MARKERS[key];
  const si = html.indexOf(start);
  const ei = html.indexOf(end, si + start.length);
  if (si === -1 || ei === -1) return null;
  return html.slice(0, si) + start + '\n' + content + '\n' + end + html.slice(ei + end.length);
}

// Find a block by fixed start string and fixed end string (first occurrence of
// end that appears after start). Returns { start: idx, end: idx } of the
// outermost span, or null if not found.
function findBlock(html, startStr, endStr, searchFrom = 0) {
  const si = html.indexOf(startStr, searchFrom);
  if (si === -1) return null;
  const ei = html.indexOf(endStr, si + startStr.length);
  if (ei === -1) return null;
  return { start: si, end: ei + endStr.length };
}

function removeFirst(html, pattern) {
  // pattern is a string; removes the first occurrence plus any immediately
  // following newline.
  const i = html.indexOf(pattern);
  if (i === -1) return { html, found: false };
  let end = i + pattern.length;
  if (html[end] === '\n') end++;
  return { html: html.slice(0, i) + html.slice(end), found: true };
}

// ---------------------------------------------------------------------------
// Migration: old-format pages (no markers)
// ---------------------------------------------------------------------------

function migrateHead(html) {
  const notes = [];

  // Remove old favicon (svg variant)
  const OLD_FAVICON_SVG = '<link rel="icon" type="image/svg+xml" href="/favicon.svg">';
  let r = removeFirst(html, OLD_FAVICON_SVG);
  if (r.found) { html = r.html; notes.push('removed old favicon (/favicon.svg)'); }

  // Remove old CSS link (blog-page.css for blog/guides; ingredient-page.css
  // for ingredient pages — it gets re-added after Shopify CSS in the shared head)
  const OLD_CSS = RECURSIVE
    ? '<link rel="stylesheet" href="/css/ingredient-page.css">'
    : '<link rel="stylesheet" href="/css/blog-page.css">';
  r = removeFirst(html, OLD_CSS);
  if (r.found) {
    html = r.html;
    notes.push(`removed old CSS link (${RECURSIVE ? 'ingredient-page.css' : 'blog-page.css'})`);
  } else {
    // Already migrated or different path — not fatal, warn
    notes.push('WARN: old CSS link not found — may already be migrated or use different path');
  }

  // Insert shared head block immediately before </head>
  const HEAD_CLOSE = '</head>';
  const hci = html.indexOf(HEAD_CLOSE);
  if (hci === -1) return { html: null, notes, error: '</head> not found' };

  const block = '\n  <!-- SHARED_HEAD_START -->\n' + SHELL.head + '\n  <!-- SHARED_HEAD_END -->\n';
  html = html.slice(0, hci) + block + html.slice(hci);
  notes.push('inserted shared head block before </head>');

  return { html, notes };
}

function migrateHeader(html) {
  const notes = [];

  // Pattern: <div class="header-wrapper"> ... </header> ... </div>
  const WRAPPER_START = '<div class="header-wrapper">';
  const si = html.indexOf(WRAPPER_START);
  if (si === -1) {
    return { html, notes, warn: 'header-wrapper div not found — header not replaced' };
  }

  // Find </header> after the wrapper start
  const HEADER_END = '</header>';
  const hei = html.indexOf(HEADER_END, si);
  if (hei === -1) {
    return { html, notes, warn: '</header> not found after header-wrapper — header not replaced' };
  }

  // Find the closing </div> of the wrapper (first </div> after </header>)
  const WRAPPER_END = '</div>';
  const wei = html.indexOf(WRAPPER_END, hei + HEADER_END.length);
  if (wei === -1) {
    return { html, notes, warn: 'closing </div> not found after </header> — header not replaced' };
  }

  const blockEnd = wei + WRAPPER_END.length;
  // Consume a trailing newline if present
  const trailingNL = html[blockEnd] === '\n' ? 1 : 0;

  const replacement = '  <!-- SHARED_HEADER_START -->\n' + SHELL.header + '\n  <!-- SHARED_HEADER_END -->';
  html = html.slice(0, si) + replacement + html.slice(blockEnd + trailingNL);
  notes.push('replaced header-wrapper block with shared header');

  return { html, notes };
}

function migrateFooter(html) {
  const notes = [];

  // Pattern: <div class="footer-wrapper"> ... </footer> ... </div>
  const WRAPPER_START = '<div class="footer-wrapper">';
  const si = html.indexOf(WRAPPER_START);
  if (si === -1) {
    return { html, notes, warn: 'footer-wrapper div not found — footer not replaced' };
  }

  const FOOTER_END = '</footer>';
  const fei = html.indexOf(FOOTER_END, si);
  if (fei === -1) {
    return { html, notes, warn: '</footer> not found after footer-wrapper — footer not replaced' };
  }

  const WRAPPER_END = '</div>';
  const wei = html.indexOf(WRAPPER_END, fei + FOOTER_END.length);
  if (wei === -1) {
    return { html, notes, warn: 'closing </div> not found after </footer> — footer not replaced' };
  }

  const blockEnd = wei + WRAPPER_END.length;
  const trailingNL = html[blockEnd] === '\n' ? 1 : 0;

  const replacement = '  <!-- SHARED_FOOTER_START -->\n' + SHELL.footer + '\n  <!-- SHARED_FOOTER_END -->';
  html = html.slice(0, si) + replacement + html.slice(blockEnd + trailingNL);
  notes.push('replaced footer-wrapper block with shared footer');

  return { html, notes };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// In recursive mode, collect index.html from each immediate subdirectory.
// Files are stored as relative paths like "astaxanthin/index.html".
function collectRecursive(dir) {
  return fs.readdirSync(dir)
    .filter(entry => fs.statSync(path.join(dir, entry)).isDirectory())
    .sort()
    .filter(entry => fs.existsSync(path.join(dir, entry, 'index.html')))
    .map(entry => path.join(entry, 'index.html'));
}

const files = FILE_ARG
  ? [FILE_ARG]
  : RECURSIVE
    ? collectRecursive(BLOG_DIR)
    : fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html')).sort();

const SKIP_FILES   = RECURSIVE ? new Set() : new Set(['index.html']);
const SKIP_PREFIX  = 'preview-';

const report = {
  markerUpdate:  [],   // { file, changed }
  migration:     [],   // { file, notes }
  warnings:      [],   // { file, reason }
  skipped:       [],   // { file, reason }
};

for (const file of files) {
  if (SKIP_FILES.has(file) || file.startsWith(SKIP_PREFIX)) {
    report.skipped.push({ file, reason: 'non-article page (index or preview)' });
    continue;
  }

  const filePath = path.join(BLOG_DIR, file);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!RECURSIVE && !html.includes('<article')) {
    report.skipped.push({ file, reason: 'no <article> element found' });
    continue;
  }

  const mHead   = hasMarker(html, 'head');
  const mHeader = hasMarker(html, 'header');
  const mFooter = hasMarker(html, 'footer');
  const allMarkers  = mHead && mHeader && mFooter;
  const someMarkers = mHead || mHeader || mFooter;

  if (allMarkers) {
    // Mode A — replace between existing markers
    let result = html;
    result = replaceMarkerBlock(result, 'head',   SHELL.head);
    result = replaceMarkerBlock(result, 'header', SHELL.header);
    result = replaceMarkerBlock(result, 'footer', SHELL.footer);

    if (result === null) {
      report.warnings.push({ file, reason: 'marker replacement failed unexpectedly' });
      continue;
    }

    if (!DRY_RUN && result !== html) {
      fs.writeFileSync(filePath, result, 'utf8');
    }
    report.markerUpdate.push({ file, changed: result !== html });

  } else if (someMarkers) {
    // Partial markers — skip, needs manual review
    const present = ['head','header','footer'].filter(k => hasMarker(html, k));
    const missing  = ['head','header','footer'].filter(k => !hasMarker(html, k));
    report.warnings.push({
      file,
      reason: `partial markers — present: [${present.join(', ')}]  missing: [${missing.join(', ')}]`,
    });

  } else {
    // Mode B — old-format migration
    const allNotes   = [];
    const allWarns   = [];
    let result = html;

    const headResult = migrateHead(result);
    if (headResult.error) {
      report.warnings.push({ file, reason: `head migration failed: ${headResult.error}` });
      continue;
    }
    result = headResult.html;
    allNotes.push(...headResult.notes);

    const headerResult = migrateHeader(result);
    result = headerResult.html;
    allNotes.push(...headerResult.notes);
    if (headerResult.warn) allWarns.push(headerResult.warn);

    const footerResult = migrateFooter(result);
    result = footerResult.html;
    allNotes.push(...footerResult.notes);
    if (footerResult.warn) allWarns.push(footerResult.warn);

    if (allWarns.length) {
      report.warnings.push({ file, reason: allWarns.join('; '), notes: allNotes });
    } else {
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, result, 'utf8');
      }
      report.migration.push({ file, notes: allNotes });
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log(DRY_RUN
  ? '\nDRY RUN — no files modified\n'
  : '\nAPPLY MODE — files written to disk\n'
);

if (report.markerUpdate.length) {
  console.log('MARKER-BASED UPDATE (idempotent):');
  for (const { file, changed } of report.markerUpdate) {
    const tag = changed ? '' : '  [no change — already up to date]';
    console.log(`  ✓  ${file}${tag}`);
  }
  console.log();
}

if (report.migration.length) {
  console.log('MIGRATION (old format → shared shell):');
  for (const { file, notes } of report.migration) {
    console.log(`  ✓  ${file}`);
    for (const n of notes) console.log(`       ${n}`);
  }
  console.log();
}

if (report.warnings.length) {
  console.log('WARNINGS (skipped — needs manual review):');
  for (const { file, reason, notes } of report.warnings) {
    console.log(`  !  ${file}`);
    console.log(`       ${reason}`);
    if (notes) for (const n of notes) console.log(`       ${n}`);
  }
  console.log();
}

if (report.skipped.length) {
  console.log('SKIPPED:');
  for (const { file, reason } of report.skipped) {
    console.log(`  -  ${file}  —  ${reason}`);
  }
  console.log();
}

const total   = files.length;
const updated = report.markerUpdate.length + report.migration.length;
const warned  = report.warnings.length;
const skipped = report.skipped.length;

console.log('SUMMARY');
console.log(`  Total blog pages scanned : ${total}`);
console.log(`  Would update             : ${updated}`);
console.log(`  Warnings (manual review) : ${warned}`);
console.log(`  Skipped                  : ${skipped}`);
console.log();
