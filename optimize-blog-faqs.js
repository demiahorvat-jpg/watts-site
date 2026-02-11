#!/usr/bin/env node

/**
 * Optimize Blog Post FAQs for SEO and Featured Snippets
 *
 * - Splits long FAQ answers into paragraphs
 * - Ensures clear formatting for featured snippets
 * - Improves readability
 */

const fs = require('fs');
const path = require('path');

function splitIntoSentences(text) {
  // Split on sentence boundaries while preserving HTML tags
  // This is a simplified approach - splits on ". " followed by capital or tag
  const sentences = [];
  let current = '';

  for (let i = 0; i < text.length; i++) {
    current += text[i];

    // Check for sentence end: period followed by space and capital letter or tag
    if (text[i] === '.' &&
        text[i + 1] === ' ' &&
        (text[i + 2] === text[i + 2]?.toUpperCase() || text[i + 2] === '<')) {
      sentences.push(current.trim());
      current = '';
      i++; // Skip the space
    }
  }

  if (current.trim()) {
    sentences.push(current.trim());
  }

  return sentences;
}

function optimizeFAQAnswer(answerHTML) {
  // Extract just the paragraph content
  const pMatch = answerHTML.match(/<p>([\s\S]*?)<\/p>/);
  if (!pMatch) return answerHTML; // No paragraph found, return as-is

  const content = pMatch[1].trim();

  // Calculate length without HTML tags
  const plainText = content.replace(/<[^>]+>/g, '');

  // If short enough, leave as single paragraph
  if (plainText.length < 300) {
    return `<p>${content}</p>`;
  }

  // Split into sentences
  const sentences = splitIntoSentences(content);

  if (sentences.length <= 2) {
    return `<p>${content}</p>`; // Already concise enough
  }

  // Create paragraphs: first 1-2 sentences as direct answer, rest as details
  const firstPara = sentences.slice(0, 2).join(' ').trim();
  const restSentences = sentences.slice(2);

  let result = `<p>${firstPara}</p>`;

  if (restSentences.length > 0) {
    // Group remaining sentences into paragraphs of ~2-3 sentences
    let currentPara = '';
    let sentenceCount = 0;

    for (const sentence of restSentences) {
      currentPara += (currentPara ? ' ' : '') + sentence;
      sentenceCount++;

      if (sentenceCount >= 2 || currentPara.length > 250) {
        result += `\n        <p>${currentPara.trim()}</p>`;
        currentPara = '';
        sentenceCount = 0;
      }
    }

    if (currentPara.trim()) {
      result += `\n        <p>${currentPara.trim()}</p>`;
    }
  }

  return result;
}

function processBlogPost(filePath) {
  console.log(`Processing: ${path.basename(filePath)}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Find FAQ items - match div.faq-item with h3 and p
  const faqItemPattern = /(<div class="faq-item">\s*<h3>[^<]+<\/h3>\s*)(<p>[\s\S]*?<\/p>)(\s*<\/div>)/g;

  content = content.replace(faqItemPattern, (match, before, answerHTML, after) => {
    // Get plain text length to check if optimization needed
    const plainText = answerHTML.replace(/<[^>]+>/g, '').trim();

    if (plainText.length > 300) {
      const optimized = optimizeFAQAnswer(answerHTML);

      // Only count as changed if actually different
      if (optimized !== answerHTML.trim()) {
        changes++;
        return before + optimized + after;
      }
    }

    return match;
  });

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Optimized ${changes} FAQ answers`);
  } else {
    console.log(`  ✓ No optimization needed`);
  }

  return changes;
}

// Get all blog posts
const blogDir = 'blog';
if (!fs.existsSync(blogDir)) {
  console.error('Blog directory not found');
  process.exit(1);
}

const blogFiles = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(blogDir, f));

console.log(`Found ${blogFiles.length} blog posts\n`);

let totalChanges = 0;

blogFiles.forEach(file => {
  totalChanges += processBlogPost(file);
});

console.log(`\n✓ Complete! Optimized ${totalChanges} total FAQ answers across all blog posts.`);
