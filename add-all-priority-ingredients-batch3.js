#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const blogDir = '/Users/demihorvat/Projects/watts-site/blog';

// Define ingredient mappings with search patterns and link targets
// Only link first occurrence in each contextual block to avoid overlinking
const ingredientLinks = [
  // Herbs/botanicals
  {
    patterns: [/\b(ashwagandha)\b/gi],
    link: '/ingredient-analyzer/ingredients/withania-somnifera/',
    name: 'ashwagandha',
    exclude: ['href=', 'ingredient-analyzer/ingredients/withania-somnifera']
  },
  {
    patterns: [/\b(withania somnifera)\b/gi],
    link: '/ingredient-analyzer/ingredients/withania-somnifera/',
    name: 'withania somnifera',
    exclude: ['href=', 'ingredient-analyzer/ingredients/withania-somnifera']
  },
  {
    patterns: [/\b(ginger)\b/gi],
    link: '/ingredient-analyzer/ingredients/ginger/',
    name: 'ginger',
    exclude: ['href=', 'ingredient-analyzer/ingredients/ginger']
  },
  {
    patterns: [/\b(slippery elm bark?)\b/gi],
    link: '/ingredient-analyzer/ingredients/slippery-elm-bark/',
    name: 'slippery elm',
    exclude: ['href=', 'ingredient-analyzer/ingredients/slippery-elm']
  },
  {
    patterns: [/\b(quercetin)\b/gi],
    link: '/ingredient-analyzer/ingredients/quercetin/',
    name: 'quercetin',
    exclude: ['href=', 'ingredient-analyzer/ingredients/quercetin']
  },
  {
    patterns: [/\b(sea[- ]buckthorn)\b/gi],
    link: '/ingredient-analyzer/ingredients/sea-buckthorn/',
    name: 'sea buckthorn',
    exclude: ['href=', 'ingredient-analyzer/ingredients/sea-buckthorn']
  },

  // Beans/legumes
  {
    patterns: [/\b(navy beans?)\b/gi],
    link: '/ingredient-analyzer/ingredients/navy-beans/',
    name: 'navy beans',
    exclude: ['href=', 'ingredient-analyzer/ingredients/navy-beans']
  },
  {
    patterns: [/\b(yellow peas?)\b/gi],
    link: '/ingredient-analyzer/ingredients/yellow-peas/',
    name: 'yellow peas',
    exclude: ['href=', 'ingredient-analyzer/ingredients/yellow-peas', 'pea protein']
  },
  {
    patterns: [/\b(split peas?)\b/gi],
    link: '/ingredient-analyzer/ingredients/split-peas/',
    name: 'split peas',
    exclude: ['href=', 'ingredient-analyzer/ingredients/split-peas']
  },
  {
    patterns: [/\b(pinto beans?)\b/gi],
    link: '/ingredient-analyzer/ingredients/pinto-beans/',
    name: 'pinto beans',
    exclude: ['href=', 'ingredient-analyzer/ingredients/pinto-beans']
  },

  // Fats/oils
  {
    patterns: [/\b(lamb fat)\b/gi],
    link: '/ingredient-analyzer/ingredients/lamb-fat/',
    name: 'lamb fat',
    exclude: ['href=', 'ingredient-analyzer/ingredients/lamb-fat']
  },
  {
    patterns: [/\b(duck fat)\b/gi],
    link: '/ingredient-analyzer/ingredients/duck-fat/',
    name: 'duck fat',
    exclude: ['href=', 'ingredient-analyzer/ingredients/duck-fat']
  },
  {
    patterns: [/\b(palm fruit oil)\b/gi],
    link: '/ingredient-analyzer/ingredients/palm-fruit-oil/',
    name: 'palm fruit oil',
    exclude: ['href=', 'ingredient-analyzer/ingredients/palm-fruit-oil', 'palm oil']
  },
  {
    patterns: [/\b(menhaden oil)\b/gi],
    link: '/ingredient-analyzer/ingredients/menhaden-oil/',
    name: 'menhaden oil',
    exclude: ['href=', 'ingredient-analyzer/ingredients/menhaden-oil']
  },

  // Organ meats
  {
    patterns: [/\b(duck liver)\b/gi],
    link: '/ingredient-analyzer/ingredients/duck-liver/',
    name: 'duck liver',
    exclude: ['href=', 'ingredient-analyzer/ingredients/duck-liver']
  },
  {
    patterns: [/\b(lung)\b(?! [a-z])/gi],  // Only match "lung" not followed by another word
    link: '/ingredient-analyzer/ingredients/lung/',
    name: 'lung',
    exclude: ['href=', 'ingredient-analyzer/ingredients/lung', 'lungs']
  },

  // Yeasts
  {
    patterns: [/\b(hydrolyzed yeast)\b/gi],
    link: '/ingredient-analyzer/ingredients/hydrolyzed-yeast/',
    name: 'hydrolyzed yeast',
    exclude: ['href=', 'ingredient-analyzer/ingredients/hydrolyzed-yeast', 'blog/yeast']
  },
  {
    patterns: [/\b(yeast fermentate)\b(?! for dogs)/gi],
    link: '/ingredient-analyzer/ingredients/yeast-fermentate/',
    name: 'yeast fermentate',
    exclude: ['href=', 'ingredient-analyzer/ingredients/yeast-fermentate', 'blog/yeast-fermentate']
  },

  // Fibers
  {
    patterns: [/\b(sweet potato fiber)\b/gi],
    link: '/ingredient-analyzer/ingredients/sweet-potato-fiber/',
    name: 'sweet potato fiber',
    exclude: ['href=', 'ingredient-analyzer/ingredients/sweet-potato-fiber']
  },
  {
    patterns: [/\b(lignocellulose)\b/gi],
    link: '/ingredient-analyzer/ingredients/lignocellulose/',
    name: 'lignocellulose',
    exclude: ['href=', 'ingredient-analyzer/ingredients/lignocellulose']
  },

  // Supplements/functional
  {
    patterns: [/\b(paractin)\b/gi],
    link: '/ingredient-analyzer/ingredients/paractin/',
    name: 'paractin',
    exclude: ['href=', 'ingredient-analyzer/ingredients/paractin']
  },
];

// Track changes
const changes = [];
let totalLinksAdded = 0;

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

      // Create a fresh regex for each file
      const regex = new RegExp(pattern.source, pattern.flags);

      while ((match = regex.exec(content)) !== null) {
        matches.push({
          index: match.index,
          text: match[0],
          fullMatch: match[0]
        });
      }

      // Process matches in reverse order to preserve indices
      // Only link FIRST occurrence in meaningful context sections
      const linkedInContext = new Set();

      matches.reverse().forEach(m => {
        const before = content.substring(Math.max(0, m.index - 150), m.index);
        const after = content.substring(m.index + m.text.length, Math.min(content.length, m.index + m.text.length + 150));

        // Check if already linked or in excluded context
        const shouldExclude = exclude.some(ex => {
          return before.toLowerCase().includes(ex.toLowerCase()) ||
                 after.toLowerCase().includes(ex.toLowerCase()) ||
                 m.text.toLowerCase().includes(ex.toLowerCase());
        });

        // Check if it's in a meaningful content context
        const inContent = (/<(?:p|li|td|th)[^>]*>/.test(before) ||
                          before.includes('<p>') || before.includes('<li>') ||
                          before.includes('<td>') || before.includes('<strong>')) &&
                         !/<a [^>]*href/.test(before.substring(before.length - 50));

        // Skip if it's in navigation, meta tags, schema, or script tags
        const inNavOrMeta = before.includes('<nav') || before.includes('<head>') ||
                           before.includes('<title') || before.includes('<meta') ||
                           before.includes('"@type"') || before.includes('<script') ||
                           before.includes('application/ld+json');

        // Skip if we already linked this in a nearby context (within same paragraph/list)
        const contextKey = before.substring(Math.max(0, before.lastIndexOf('<p>'), before.lastIndexOf('<li>'), before.lastIndexOf('<td>')));

        if (!shouldExclude && inContent && !inNavOrMeta && !linkedInContext.has(contextKey)) {
          // Create the link
          const linkedText = `<a href="${link}">${m.text}</a>`;
          content = content.substring(0, m.index) + linkedText + content.substring(m.index + m.text.length);
          modified = true;
          fileChanges.push(`  - Linked "${m.text}" to ${link}`);
          linkedInContext.add(contextKey);
          totalLinksAdded++;
        }
      });
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
console.log(`Total links added: ${totalLinksAdded}`);

if (changes.length > 0) {
  console.log('\nDetailed changes:');
  changes.forEach(({ file, changes: fileChanges }) => {
    console.log(`\n${file}:`);
    fileChanges.forEach(change => console.log(change));
  });

  // Write to log file
  const logContent = `Priority Ingredient Links - Batch 3
Total files updated: ${changes.length}
Total links added: ${totalLinksAdded}

${changes.map(({ file, changes: fc }) =>
    `${file}:\n${fc.join('\n')}`
  ).join('\n\n')}`;

  fs.writeFileSync(
    path.join('/Users/demihorvat/Projects/watts-site', 'ingredient-links-batch3-full-log.txt'),
    logContent,
    'utf-8'
  );
  console.log('\nLog written to: ingredient-links-batch3-full-log.txt');
} else {
  console.log('\nNo changes needed - all ingredients already linked where appropriate.');
}
