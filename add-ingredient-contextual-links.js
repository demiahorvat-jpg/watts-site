const fs = require('fs');
const path = require('path');

console.log('🔗 Adding contextual links to ingredient pages...\n');

// Mapping of keywords/topics to relevant blog posts
const linkMappings = [
  // Vitamins
  {
    keywords: ['vitamin a', 'retinol', 'beta-carotene', 'beta carotene'],
    section: 'what-it-is|why-used|nutritional-profile',
    link: '/blog/beef-liver-for-dogs.html',
    anchorText: 'beef liver',
    context: 'rich source of vitamin A'
  },
  {
    keywords: ['vitamin b', 'b vitamin', 'b-vitamin', 'thiamine', 'riboflavin', 'niacin', 'pantothenic', 'pyridoxine', 'biotin', 'folate', 'folic acid', 'cobalamin', 'b12', 'b6', 'b1', 'b2', 'b3', 'b5', 'b9'],
    section: 'what-it-is|why-used|nutritional-profile',
    link: '/blog/b-vitamins-for-dogs.html',
    anchorText: 'B vitamins',
    context: 'essential for metabolism'
  },
  {
    keywords: ['vitamin d', 'cholecalciferol', 'ergocalciferol'],
    section: 'what-it-is|why-used',
    link: '/blog/vitamin-d-for-dogs.html',
    anchorText: 'vitamin D',
    context: 'supports bone health'
  },
  {
    keywords: ['choline', 'phosphatidylcholine'],
    section: 'what-it-is|why-used|nutritional-profile',
    link: '/blog/choline-for-dogs.html',
    anchorText: 'choline',
    context: 'essential nutrient for dogs'
  },
  {
    keywords: ['zinc', 'zinc oxide', 'zinc sulfate', 'zinc proteinate'],
    section: 'what-it-is|why-used',
    link: '/blog/zinc-for-dogs.html',
    anchorText: 'zinc',
    context: 'essential mineral'
  },

  // Omega-3 and fatty acids
  {
    keywords: ['omega-3', 'omega 3', 'epa', 'dha', 'fish oil', 'salmon oil', 'krill oil'],
    section: 'what-it-is|why-used',
    link: '/blog/omega-3-fish-oil-for-dogs.html',
    anchorText: 'omega-3 fatty acids',
    context: 'support joint and skin health'
  },

  // Protein
  {
    keywords: ['protein', 'amino acid', 'essential amino'],
    section: 'what-it-is|nutritional-profile',
    link: '/blog/protein-for-dogs.html',
    anchorText: 'protein',
    context: 'essential nutrient'
  },

  // Organ meats
  {
    keywords: ['organ meat', 'liver', 'kidney', 'heart', 'spleen', 'organ'],
    section: 'what-it-is|why-used',
    link: '/blog/organ-based-nutrition-for-dogs.html',
    anchorText: 'organ-based nutrition',
    context: 'nutrient-dense whole foods'
  },

  // Joint health
  {
    keywords: ['glucosamine', 'chondroitin', 'joint', 'cartilage', 'msm'],
    section: 'what-it-is|why-used',
    link: '/blog/joint-supplements-for-dogs.html',
    anchorText: 'joint supplements',
    context: 'support joint health'
  },
  {
    keywords: ['green-lipped mussel', 'green lipped mussel', 'perna'],
    section: 'what-it-is|why-used',
    link: '/blog/green-lipped-mussel-for-dogs.html',
    anchorText: 'green-lipped mussel',
    context: 'natural source of joint-supporting compounds'
  },
  {
    keywords: ['collagen', 'gelatin', 'bone broth'],
    section: 'what-it-is|why-used',
    link: '/blog/collagen-for-dogs-benefits.html',
    anchorText: 'collagen',
    context: 'supports joint and skin health'
  },

  // Gut health
  {
    keywords: ['probiotic', 'lactobacillus', 'bifidobacterium', 'gut bacteria', 'gut health', 'digestive health'],
    section: 'what-it-is|why-used',
    link: '/blog/probiotics-for-dogs.html',
    anchorText: 'probiotics',
    context: 'support digestive health'
  },
  {
    keywords: ['prebiotic', 'fiber', 'fructooligosaccharide', 'inulin'],
    section: 'what-it-is|why-used',
    link: '/blog/gut-health-for-dogs.html',
    anchorText: 'gut health',
    context: 'supports digestive function'
  },

  // Immune support
  {
    keywords: ['immune', 'immunity', 'antioxidant', 'beta-glucan', 'beta glucan'],
    section: 'what-it-is|why-used',
    link: '/blog/immune-support-for-dogs.html',
    anchorText: 'immune support',
    context: 'supports immune system function'
  },
  {
    keywords: ['yeast fermentate', 'epicor'],
    section: 'what-it-is|why-used',
    link: '/blog/yeast-fermentate-for-dogs.html',
    anchorText: 'yeast fermentate',
    context: 'supports immune health'
  },

  // Antioxidants
  {
    keywords: ['vitamin e', 'tocopherol', 'antioxidant', 'polyphenol'],
    section: 'what-it-is|why-used',
    link: '/blog/antioxidants-for-dogs.html',
    anchorText: 'antioxidants',
    context: 'protect cells from oxidative stress'
  },

  // Skin and coat
  {
    keywords: ['skin', 'coat', 'fur', 'dermal'],
    section: 'why-used',
    link: '/blog/dog-skin-coat-supplements.html',
    anchorText: 'skin and coat health',
    context: 'supports healthy skin and coat'
  },

  // Whole food vs synthetic
  {
    keywords: ['synthetic', 'natural form', 'bioavailability', 'absorption'],
    section: 'what-it-is|why-used',
    link: '/blog/whole-food-vs-synthetic-nutrients.html',
    anchorText: 'whole-food nutrients',
    context: 'may be better absorbed than synthetic forms'
  },

  // Fillers and ingredients
  {
    keywords: ['filler', 'unnecessary', 'bulk', 'by-product'],
    section: 'what-it-is|concerns',
    link: '/blog/fillers-in-dog-supplements.html',
    anchorText: 'fillers in dog supplements',
    context: 'ingredients with limited nutritional value'
  },

  // Senior dogs
  {
    keywords: ['senior', 'aging', 'older dog', 'elderly'],
    section: 'why-used',
    link: '/blog/senior-dog-formula-kibble.html',
    anchorText: 'senior dogs',
    context: 'have specific nutritional needs'
  },

  // Puppy nutrition
  {
    keywords: ['puppy', 'growing', 'growth', 'development'],
    section: 'why-used',
    link: '/blog/puppy-vitamins.html',
    anchorText: 'puppies',
    context: 'have higher nutritional requirements'
  }
];

function addLinksToPage(filePath, ingredientName) {
  let content = fs.readFileSync(filePath, 'utf8');
  let linksAdded = 0;
  const addedLinks = new Set(); // Track which blog posts we've already linked to

  // Extract main content sections
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (!mainMatch) return { linksAdded: 0, ingredientName };

  const mainContent = mainMatch[0];
  let modifiedContent = mainContent;

  // Try to add links based on mappings
  for (const mapping of linkMappings) {
    // Skip if we've already added this link
    if (addedLinks.has(mapping.link)) continue;

    // Check if any keywords match (case insensitive)
    const contentLower = modifiedContent.toLowerCase();
    const hasKeyword = mapping.keywords.some(keyword => contentLower.includes(keyword.toLowerCase()));

    if (!hasKeyword) continue;

    // Find a suitable paragraph in the relevant sections
    const sectionPattern = new RegExp(
      `<h2[^>]*>(${mapping.section.split('|').join('|')})[^<]*</h2>([\\s\\S]*?)(?=<h2|<h3|<div class="key-facts"|$)`,
      'i'
    );

    const sectionMatch = modifiedContent.match(sectionPattern);
    if (!sectionMatch) continue;

    const sectionContent = sectionMatch[2];

    // Find the first <p> tag that mentions one of the keywords
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
    const paragraphMatches = [...sectionContent.matchAll(pRegex)];

    for (const pMatch of paragraphMatches) {
      const pContent = pMatch[1];
      const pContentLower = pContent.toLowerCase();

      // Skip if this paragraph already has a link
      if (pContent.includes('<a href="')) continue;

      // Check if any keyword appears in this paragraph
      const matchedKeyword = mapping.keywords.find(kw => pContentLower.includes(kw.toLowerCase()));
      if (!matchedKeyword) continue;

      // Find the keyword in the paragraph (case insensitive)
      const keywordRegex = new RegExp(`\\b(${matchedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i');
      const keywordMatch = pContent.match(keywordRegex);

      if (!keywordMatch) continue;

      // Replace the first occurrence of the keyword with a link
      const linkedParagraph = pContent.replace(
        keywordRegex,
        `<a href="${mapping.link}">${mapping.anchorText}</a>`
      );

      // Update the modified content
      modifiedContent = modifiedContent.replace(pMatch[0], `<p>${linkedParagraph}</p>`);
      addedLinks.add(mapping.link);
      linksAdded++;
      break; // Only add one link per mapping
    }

    // Stop if we've added 3 links
    if (linksAdded >= 3) break;
  }

  // Write back if we made changes
  if (linksAdded > 0) {
    content = content.replace(mainMatch[0], modifiedContent);
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return { linksAdded, ingredientName };
}

// Process ingredient pages
const audit = JSON.parse(fs.readFileSync('ingredient-links-audit.json', 'utf8'));
const ingredientsDir = path.join(__dirname, 'ingredient-analyzer/ingredients');

let processedCount = 0;
let updatedCount = 0;
let totalLinksAdded = 0;

console.log('Processing ingredient pages...\n');

// Process pages that need more links
const pagesToUpdate = audit.pages.filter(p => p.needsMore);

pagesToUpdate.forEach((page, index) => {
  const filePath = path.join(ingredientsDir, page.dir, 'index.html');

  if (!fs.existsSync(filePath)) return;

  const result = addLinksToPage(filePath, page.title);
  processedCount++;

  if (result.linksAdded > 0) {
    updatedCount++;
    totalLinksAdded += result.linksAdded;
    console.log(`✓ ${page.dir}: Added ${result.linksAdded} link(s)`);
  }

  // Show progress every 50 pages
  if ((index + 1) % 50 === 0) {
    console.log(`\n[Progress: ${index + 1}/${pagesToUpdate.length} pages processed]\n`);
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Processed: ${processedCount} pages`);
console.log(`   Updated: ${updatedCount} pages`);
console.log(`   Total links added: ${totalLinksAdded}`);
console.log(`   Average links per updated page: ${(totalLinksAdded / updatedCount).toFixed(1)}`);
