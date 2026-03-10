const fs = require('fs');
const path = require('path');

// Files that need fixing
const filesToFix = [
  '/Users/demihorvat/Projects/watts-site/blog/all-natural-dog-supplements.html',
  '/Users/demihorvat/Projects/watts-site/blog/beta-glucans-for-cats.html',
  '/Users/demihorvat/Projects/watts-site/blog/cat-digestive-issues.html',
  '/Users/demihorvat/Projects/watts-site/blog/digestive-enzymes-for-dogs.html',
  '/Users/demihorvat/Projects/watts-site/blog/gut-health-for-dogs.html',
  '/Users/demihorvat/Projects/watts-site/blog/immune-support-for-cats.html',
  '/Users/demihorvat/Projects/watts-site/blog/melatonin-for-dogs.html',
  '/Users/demihorvat/Projects/watts-site/blog/omega-3-for-cats.html',
  '/Users/demihorvat/Projects/watts-site/blog/prebiotics-for-cats.html',
  '/Users/demihorvat/Projects/watts-site/blog/probiotic-supplement-for-dogs.html',
  '/Users/demihorvat/Projects/watts-site/blog/probiotics-for-cats.html',
  '/Users/demihorvat/Projects/watts-site/blog/probiotics-for-dogs-with-diarrhea.html',
  '/Users/demihorvat/Projects/watts-site/blog/protein-for-dogs.html',
  '/Users/demihorvat/Projects/watts-site/blog/senior-cat-nutrition.html',
  '/Users/demihorvat/Projects/watts-site/blog/taurine-for-cats.html',
  '/Users/demihorvat/Projects/watts-site/blog/vitamin-a-for-cats.html',
  '/Users/demihorvat/Projects/watts-site/blog/vitamin-a-supplement.html',
  '/Users/demihorvat/Projects/watts-site/blog/vitamins-for-cat-immune-system.html',
  '/Users/demihorvat/Projects/watts-site/guides/cat-gut-health.html',
  '/Users/demihorvat/Projects/watts-site/guides/cat-immune-system.html',
  '/Users/demihorvat/Projects/watts-site/guides/dog-gut-health.html',
  '/Users/demihorvat/Projects/watts-site/guides/dog-immune-system.html',
  '/Users/demihorvat/Projects/watts-site/guides/dog-joint-health.html',
  '/Users/demihorvat/Projects/watts-site/guides/dog-life-stage-health.html',
  '/Users/demihorvat/Projects/watts-site/guides/dog-skin-coat-health.html',
  '/Users/demihorvat/Projects/watts-site/guides/dog-vitamins-minerals.html',
];

function findFaqSection(content) {
  // Pattern 1: <div class="faq-section"> ... </div>
  let match = content.match(/<div class="faq-section"[\s\S]*?<\/div>\s*<\/div>/);
  if (match) {
    // Need to properly match nested divs
    const startIdx = content.indexOf('<div class="faq-section">');
    if (startIdx === -1) return null;

    // Find the matching closing tag by counting div levels
    let depth = 0;
    let endIdx = startIdx;
    for (let i = startIdx; i < content.length; i++) {
      if (content.substring(i, i + 4) === '<div') {
        depth++;
      } else if (content.substring(i, i + 6) === '</div>') {
        depth--;
        if (depth === 0) {
          endIdx = i + 6;
          break;
        }
      }
    }
    return { start: startIdx, end: endIdx, text: content.substring(startIdx, endIdx) };
  }

  // Pattern 2: <h2>Frequently Asked Questions</h2> followed by faq-items until next h2 or section end
  const faqH2Match = content.match(/<h2[^>]*>Frequently Asked Questions<\/h2>/i);
  if (faqH2Match) {
    const startIdx = content.indexOf(faqH2Match[0]);
    // Find the end - next <h2 or </article> or <div class="related or <div class="article-footer
    const afterFaqH2 = content.substring(startIdx + faqH2Match[0].length);

    // Find where FAQ items end
    const endMarkers = [
      afterFaqH2.search(/<h2[^>]*>(?!Frequently Asked Questions)/i),
      afterFaqH2.indexOf('<div class="related'),
      afterFaqH2.indexOf('<div class="article-footer'),
      afterFaqH2.indexOf('<div class="supporting-grid'),
    ].filter(idx => idx !== -1);

    let endOffset;
    if (endMarkers.length > 0) {
      endOffset = Math.min(...endMarkers);
    } else {
      // Find the last </div> of faq-item sections
      const lastFaqItem = afterFaqH2.lastIndexOf('</div>');
      endOffset = lastFaqItem + 6;
    }

    const endIdx = startIdx + faqH2Match[0].length + endOffset;
    return { start: startIdx, end: endIdx, text: content.substring(startIdx, endIdx) };
  }

  return null;
}

function findRelatedSection(content) {
  // Pattern 1: <div class="related-section"> ... </div>
  const relSectionStart = content.indexOf('<div class="related-section">');
  if (relSectionStart !== -1) {
    let depth = 0;
    let endIdx = relSectionStart;
    for (let i = relSectionStart; i < content.length; i++) {
      if (content.substring(i, i + 4) === '<div') {
        depth++;
      } else if (content.substring(i, i + 6) === '</div>') {
        depth--;
        if (depth === 0) {
          endIdx = i + 6;
          break;
        }
      }
    }
    return { start: relSectionStart, end: endIdx, text: content.substring(relSectionStart, endIdx) };
  }

  // Pattern 2: <div class="article-footer"> with Related reading
  const articleFooterStart = content.indexOf('<div class="article-footer">');
  if (articleFooterStart !== -1 && content.substring(articleFooterStart, articleFooterStart + 200).toLowerCase().includes('related')) {
    let depth = 0;
    let endIdx = articleFooterStart;
    for (let i = articleFooterStart; i < content.length; i++) {
      if (content.substring(i, i + 4) === '<div') {
        depth++;
      } else if (content.substring(i, i + 6) === '</div>') {
        depth--;
        if (depth === 0) {
          endIdx = i + 6;
          break;
        }
      }
    }
    return { start: articleFooterStart, end: endIdx, text: content.substring(articleFooterStart, endIdx) };
  }

  // Pattern 3: <h2>Related Guides & Articles</h2> or <h2...>Related Articles</h2> followed by supporting-grid
  const relatedH2Match = content.match(/<h2[^>]*>Related\s*(Guides\s*&\s*)?Articles<\/h2>/i);
  if (relatedH2Match) {
    const startIdx = content.indexOf(relatedH2Match[0]);
    const afterH2 = content.substring(startIdx);

    // Find the supporting-grid div and its end
    const gridStart = afterH2.indexOf('<div class="supporting-grid">');
    if (gridStart !== -1) {
      const gridAbsStart = startIdx + gridStart;
      let depth = 0;
      let endIdx = gridAbsStart;
      for (let i = gridAbsStart; i < content.length; i++) {
        if (content.substring(i, i + 4) === '<div') {
          depth++;
        } else if (content.substring(i, i + 6) === '</div>') {
          depth--;
          if (depth === 0) {
            endIdx = i + 6;
            break;
          }
        }
      }
      return { start: startIdx, end: endIdx, text: content.substring(startIdx, endIdx) };
    }

    // Just the h2 with a simple list after
    const nextH2Idx = afterH2.substring(relatedH2Match[0].length).search(/<h2/i);
    const articleEndIdx = afterH2.indexOf('</article>');
    let endOffset = relatedH2Match[0].length;
    if (nextH2Idx !== -1 && (articleEndIdx === -1 || nextH2Idx < articleEndIdx)) {
      endOffset += nextH2Idx;
    } else if (articleEndIdx !== -1) {
      endOffset = articleEndIdx;
    }
    return { start: startIdx, end: startIdx + endOffset, text: content.substring(startIdx, startIdx + endOffset) };
  }

  return null;
}

function fixFile(filePath) {
  console.log(`\nProcessing: ${path.basename(filePath)}`);

  let content = fs.readFileSync(filePath, 'utf8');

  const faqSection = findFaqSection(content);
  const relatedSection = findRelatedSection(content);

  if (!faqSection || !relatedSection) {
    console.log(`  Could not find both sections - FAQ: ${!!faqSection}, Related: ${!!relatedSection}`);
    return false;
  }

  // Check if already in correct order (related before faq)
  if (relatedSection.start < faqSection.start) {
    console.log('  Already in correct order (Related before FAQ)');
    return false;
  }

  console.log(`  FAQ section: lines around ${content.substring(0, faqSection.start).split('\n').length}`);
  console.log(`  Related section: lines around ${content.substring(0, relatedSection.start).split('\n').length}`);

  // Extract the sections
  const faqText = faqSection.text;
  const relatedText = relatedSection.text;

  // Remove both sections (remove related first since it comes after FAQ)
  let newContent = content.substring(0, relatedSection.start) + content.substring(relatedSection.end);

  // Recalculate FAQ position after removing related
  const newFaqSection = findFaqSection(newContent);
  if (!newFaqSection) {
    console.log('  Error: Could not find FAQ section after removing related');
    return false;
  }

  // Insert related before FAQ
  newContent = newContent.substring(0, newFaqSection.start) +
               relatedText + '\n\n    ' +
               newContent.substring(newFaqSection.start);

  fs.writeFileSync(filePath, newContent);
  console.log('  FIXED: Moved Related section before FAQ section');
  return true;
}

// Run on all files
let fixedCount = 0;
for (const file of filesToFix) {
  try {
    if (fixFile(file)) {
      fixedCount++;
    }
  } catch (err) {
    console.log(`  Error processing ${file}: ${err.message}`);
  }
}

console.log(`\n\nDone! Fixed ${fixedCount} files.`);
