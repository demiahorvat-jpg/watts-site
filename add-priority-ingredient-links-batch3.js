#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const blogDir = '/Users/demihorvat/Projects/watts-site/blog';

// Define ingredient mappings with search patterns and link targets
const ingredientLinks = [
  // Fish ingredients - omega-3 sources
  {
    patterns: [
      /\b(anchovies|anchovy)\b/gi,
    ],
    link: '/ingredient-analyzer/ingredients/anchovies/',
    name: 'anchovies',
    exclude: ['href=', 'ingredient-analyzer/ingredients/anchovies']
  },
  {
    patterns: [/\b(tuna)\b/gi],
    link: '/ingredient-analyzer/ingredients/tuna/',
    name: 'tuna',
    exclude: ['href=', 'ingredient-analyzer/ingredients/tuna']
  },
  {
    patterns: [/\b(whitefish|white fish)\b(?!.*meal)/gi],
    link: '/ingredient-analyzer/ingredients/whitefish/',
    name: 'whitefish',
    exclude: ['href=', 'ingredient-analyzer/ingredients/whitefish', 'whitefish meal']
  },
  {
    patterns: [/\b(menhaden)\b/gi],
    link: '/ingredient-analyzer/ingredients/menhaden/',
    name: 'menhaden',
    exclude: ['href=', 'ingredient-analyzer/ingredients/menhaden']
  },

  // Fats and oils
  {
    patterns: [/\b(olive oil)\b/gi],
    link: '/ingredient-analyzer/ingredients/olive-oil/',
    name: 'olive oil',
    exclude: ['href=', 'ingredient-analyzer/ingredients/olive-oil']
  },

  // Fiber sources
  {
    patterns: [/\b(pectin)\b/gi],
    link: '/ingredient-analyzer/ingredients/pectin/',
    name: 'pectin',
    exclude: ['href=', 'ingredient-analyzer/ingredients/pectin']
  },

  // Yeasts - be careful with beta-glucan (only link the ingredient page context)
  {
    patterns: [/\b(yeast beta-glucans?|beta-glucans? from yeast)\b/gi],
    link: '/ingredient-analyzer/ingredients/yeast-beta-glucans/',
    name: 'yeast beta-glucans',
    exclude: ['href=', 'ingredient-analyzer/ingredients/yeast-beta-glucans', 'blog/yeast-beta-glucan']
  },
];

// Track changes
const changes = [];

// Process each HTML file
const htmlFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(filename => {
  const filepath = path.join(blogDir, filename);
  let content = fs.readFileSync(filepath, 'utf-8');
  let modified = false;
  let fileChanges = [];

  ingredientLinks.forEach(({ patterns, link, name, exclude }) => {
    patterns.forEach(pattern => {
      // Find matches
      const matches = [];
      let match;
      while ((match = pattern.exec(content)) !== null) {
        matches.push({
          index: match.index,
          text: match[0],
          fullMatch: match[0]
        });
      }

      // Process matches in reverse order to preserve indices
      matches.reverse().forEach(m => {
        const before = content.substring(Math.max(0, m.index - 100), m.index);
        const after = content.substring(m.index + m.text.length, Math.min(content.length, m.index + m.text.length + 100));

        // Check if already linked or in excluded context
        const shouldExclude = exclude.some(ex => {
          return before.includes(ex) || after.includes(ex) || m.text.toLowerCase().includes(ex);
        });

        // Check if it's in a meaningful context (paragraph, list item, table cell)
        const inContent = /<(?:p|li|td|th|h[1-6])[^>]*>/.test(before) ||
                         before.includes('<p>') || before.includes('<li>') ||
                         before.includes('<td>') || before.includes('<strong>');

        // Skip if it's already linked, in navigation, or in meta tags
        const inNavOrMeta = /<nav[^>]*>/.test(before) || /<head>/.test(before) ||
                           /<title>/.test(before) || /<meta/.test(before);

        if (!shouldExclude && inContent && !inNavOrMeta) {
          // Create the link
          const linkedText = `<a href="${link}">${m.text}</a>`;
          content = content.substring(0, m.index) + linkedText + content.substring(m.index + m.text.length);
          modified = true;
          fileChanges.push(`  - Linked "${m.text}" to ${link}`);
        }
      });

      // Reset regex
      pattern.lastIndex = 0;
    });
  });

  if (modified) {
    fs.writeFileSync(filepath, content, 'utf-8');
    changes.push({
      file: filename,
      changes: fileChanges
    });
    console.log(`✓ Updated ${filename} (${fileChanges.length} links added)`);
  }
});

// Write summary
console.log('\n=== SUMMARY ===');
console.log(`Total files updated: ${changes.length}`);
console.log(`Total links added: ${changes.reduce((sum, c) => sum + c.changes.length, 0)}`);

if (changes.length > 0) {
  console.log('\nDetailed changes:');
  changes.forEach(({ file, changes: fileChanges }) => {
    console.log(`\n${file}:`);
    fileChanges.forEach(change => console.log(change));
  });

  // Write to log file
  const logContent = changes.map(({ file, changes: fc }) =>
    `${file}:\n${fc.join('\n')}`
  ).join('\n\n');

  fs.writeFileSync(
    path.join(__dirname, 'ingredient-links-batch3-log.txt'),
    logContent,
    'utf-8'
  );
  console.log('\nLog written to: ingredient-links-batch3-log.txt');
}
