#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read ingredients database
const db = JSON.parse(fs.readFileSync('./data/ingredients.json', 'utf8'));
const ingredients = db.ingredients;

// Create slug from name
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Capitalize
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Get badge class
function getBadgeClass(position) {
  const map = {
    'good': 'badge-good',
    'neutral': 'badge-neutral',
    'caution': 'badge-caution',
    'avoid': 'badge-avoid'
  };
  return map[position] || 'badge-neutral';
}

// Get common product types by category
function getCommonProducts(category) {
  const products = {
    'protein': 'Kibble, wet food, treats, protein supplements',
    'carbohydrate': 'Dry food, treats, grain-free formulas',
    'fat': 'Dry food, wet food, skin & coat supplements',
    'fiber': 'Weight management foods, digestive supplements',
    'vitamin': 'Complete foods, multivitamin supplements',
    'mineral': 'Complete foods, bone & joint supplements',
    'active': 'Joint supplements, calming treats, specialty formulas',
    'preservative': 'Dry food, treats, chews',
    'additive': 'Treats, wet food, flavor enhancers',
    'produce': 'Premium kibble, freeze-dried foods, treats'
  };
  return products[category] || 'Dog food, treats, and supplements';
}

// Generate category-specific content
function getCategoryContext(category, name) {
  const contexts = {
    'protein': {
      emphasis: 'protein density, amino acid profile, digestibility, and sourcing quality',
      concerns: 'allergies, protein digestibility, and quality variations between named and generic sources'
    },
    'carbohydrate': {
      emphasis: 'digestibility, glycemic index, fiber content, and grain-free alternatives',
      concerns: 'grain sensitivities, blood sugar impact, and nutritional density versus simple fillers'
    },
    'fat': {
      emphasis: 'omega fatty acid ratios, palatability, and energy density',
      concerns: 'rancidity, processing methods, and appropriate fat levels for different life stages'
    },
    'fiber': {
      emphasis: 'soluble versus insoluble fiber, digestive health benefits, and stool quality',
      concerns: 'excessive fiber reducing nutrient absorption and causing digestive upset'
    },
    'vitamin': {
      emphasis: 'bioavailability, synthetic versus natural forms, and deficiency prevention',
      concerns: 'proper dosing, interactions with other nutrients, and toxicity from over-supplementation'
    },
    'mineral': {
      emphasis: 'chelated versus inorganic forms, bioavailability, and balanced ratios with other minerals',
      concerns: 'mineral imbalances, interactions, and appropriate levels for different life stages'
    },
    'active': {
      emphasis: 'clinical evidence, appropriate dosing, and targeted health benefits',
      concerns: 'efficacy, quality of source material, and potential interactions with medications'
    },
    'preservative': {
      emphasis: 'natural versus synthetic options, safety profile, and effectiveness',
      concerns: 'potential health impacts, regulatory approval, and consumer preferences'
    },
    'additive': {
      emphasis: 'functional purpose, safety testing, and nutritional contribution',
      concerns: 'necessity, potential sensitivities, and whether it serves dogs or just appeals to humans'
    },
    'produce': {
      emphasis: 'antioxidant content, phytonutrients, and whole food nutrition',
      concerns: 'actual quantity in formulas, bioavailability for dogs, and marketing versus nutrition'
    }
  };
  return contexts[category] || contexts['protein'];
}

// Generate FAQs based on ingredient data
function generateFAQs(ingredient) {
  const name = ingredient.name;
  const category = ingredient.category;
  const position = ingredient.wattsPosition;

  const faqs = [
    {
      question: `Is ${name.toLowerCase()} safe for dogs?`,
      answer: position === 'avoid'
        ? `${name} should be used with caution or avoided. ${ingredient.qualityNote} ${ingredient.wattsTake}`
        : position === 'caution'
        ? `${name} is generally recognized as safe but has some concerns. ${ingredient.qualityNote} Monitor your dog for any adverse reactions when first introducing products containing this ingredient.`
        : `Yes, ${name.toLowerCase()} is safe for dogs when used appropriately. ${ingredient.wattsTake} However, individual dogs may have sensitivities, so monitor for any adverse reactions.`
    },
    {
      question: `What does ${name.toLowerCase()} do in dog ${category === 'protein' ? 'food' : 'products'}?`,
      answer: `${ingredient.whatItIs} It's used because: ${ingredient.whyUsed.slice(0, 2).join(', and ')}. ${ingredient.qualityNote}`
    }
  ];

  // Category-specific questions
  if (category === 'protein') {
    faqs.push({
      question: `Can ${name.toLowerCase()} cause allergies in dogs?`,
      answer: `Any protein source can potentially trigger allergies in sensitive dogs. Signs of food allergies include itchy skin, ear infections, digestive issues, and excessive paw licking. If your dog shows these symptoms, consult your veterinarian about an elimination diet to identify the trigger ingredient.`
    });
    faqs.push({
      question: `How much ${name.toLowerCase()} should be in dog food?`,
      answer: `Quality dog foods typically list primary protein sources like ${name.toLowerCase()} within the first 3-5 ingredients. The exact percentage varies by formula, but protein-focused foods generally contain 25-35% total protein for adults, and 28-40% for puppies or performance dogs. Check the guaranteed analysis rather than relying solely on ingredient order.`
    });
  }

  if (category === 'carbohydrate') {
    faqs.push({
      question: `Is ${name.toLowerCase()} grain-free?`,
      answer: name.toLowerCase().includes('rice') || name.toLowerCase().includes('wheat') || name.toLowerCase().includes('corn') || name.toLowerCase().includes('barley') || name.toLowerCase().includes('oat')
        ? `No, ${name.toLowerCase()} is a grain. However, grains aren't inherently bad for dogs. Most dogs digest grains well unless they have specific grain allergies or sensitivities.`
        : `Yes, ${name.toLowerCase()} is a grain-free carbohydrate source. It's commonly used in grain-free formulas as an alternative to traditional grains.`
    });
  }

  if (category === 'vitamin' || category === 'mineral') {
    faqs.push({
      question: `Can dogs get too much ${name.toLowerCase()}?`,
      answer: `Yes, excessive amounts of vitamins and minerals can cause health issues. However, properly formulated dog foods and supplements are designed to provide appropriate levels. Toxicity typically only occurs from over-supplementation or improper dosing. Always follow feeding guidelines and consult your vet before adding supplements.`
    });
    faqs.push({
      question: `Is ${name.toLowerCase()} natural or synthetic?`,
      answer: `${name} in dog food and supplements can be either natural or synthetic. Both forms can be effective, though bioavailability may differ. Premium brands often specify the form used. Natural sources may be more expensive but aren't necessarily superior—what matters most is the total amount and how well your dog absorbs it.`
    });
  }

  if (category === 'preservative' || category === 'additive') {
    faqs.push({
      question: `Why is ${name.toLowerCase()} added to dog food?`,
      answer: `${ingredient.whyUsed[0]} While some additives serve important functional purposes (preservation, texture, stability), others are primarily for human appeal. ${ingredient.wattsTake}`
    });
    faqs.push({
      question: `Are there natural alternatives to ${name.toLowerCase()}?`,
      answer: `Many modern dog foods use natural alternatives like mixed tocopherols (vitamin E), rosemary extract, or citric acid instead of synthetic additives. Check ingredient labels for "preserved with..." statements to see which preservatives are used.`
    });
  }

  return faqs.slice(0, 6); // Return up to 6 FAQs
}

// Generate related ingredients
function getRelatedIngredients(ingredient, allIngredients) {
  const related = [];
  const currentCategory = ingredient.category;
  const currentName = ingredient.name.toLowerCase();

  // Find ingredients in same category
  const sameCategory = allIngredients.filter(ing =>
    ing.category === currentCategory &&
    ing.name !== ingredient.name
  );

  // Add up to 4 from same category
  related.push(...sameCategory.slice(0, 4));

  // If we need more, add some from related categories
  if (related.length < 6) {
    const relatedCategories = {
      'protein': ['fat'],
      'carbohydrate': ['fiber'],
      'fat': ['protein'],
      'fiber': ['carbohydrate'],
      'vitamin': ['mineral'],
      'mineral': ['vitamin'],
      'active': ['vitamin', 'mineral'],
      'preservative': ['additive'],
      'additive': ['preservative'],
      'produce': ['fiber', 'vitamin']
    };

    const categoriesToCheck = relatedCategories[currentCategory] || [];
    for (const cat of categoriesToCheck) {
      const fromCategory = allIngredients.filter(ing =>
        ing.category === cat &&
        !related.some(r => r.name === ing.name)
      );
      related.push(...fromCategory.slice(0, 6 - related.length));
      if (related.length >= 6) break;
    }
  }

  return related.slice(0, 6);
}

// Generate comprehensive HTML page
function generateIngredientPage(ingredient, allIngredients) {
  const slug = slugify(ingredient.name);
  const faqs = generateFAQs(ingredient);
  const relatedIngredients = getRelatedIngredients(ingredient, allIngredients);
  const context = getCategoryContext(ingredient.category, ingredient.name);
  const commonProducts = getCommonProducts(ingredient.category);

  // Generate FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ingredient.name} in Dog Food, Treats & Supplements: Complete Guide | Watts Pet</title>
    <meta name="description" content="Complete guide to ${ingredient.name.toLowerCase()} in dog food, treats, and supplements. Learn what it is, nutritional benefits, quality considerations, and expert analysis.">
    <link rel="canonical" href="https://wattspet.com/ingredient-analyzer/ingredients/${slug}/">

    <!-- Open Graph -->
    <meta property="og:title" content="${ingredient.name} in Dog Food: Complete Guide | Watts Pet">
    <meta property="og:description" content="${ingredient.whatItIs.substring(0, 150)}">
    <meta property="og:url" content="https://wattspet.com/ingredient-analyzer/ingredients/${slug}/">
    <meta property="og:type" content="article">

    <style>
      :root {
        --bg: #F1ECE9;
        --fg: #191919;
        --muted: #3a3a3a;
        --border: #191919;
        --good: #2d5016;
        --caution: #b45309;
        --avoid: #991b1b;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      html, body { min-height: 100%; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: "Geologica", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        font-weight: 400;
        line-height: 1.6;
        overflow-x: hidden;
      }

      nav.nav {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 20px 20px;
        border-bottom: 2.5px solid var(--border);
      }
      @media (min-width: 768px) {
        nav.nav { padding: 24px 20px; }
      }
      nav.nav ul {
        list-style: none;
        display: flex;
        gap: 24px;
        align-items: center;
      }
      @media (min-width: 768px) {
        nav.nav ul { gap: 32px; }
      }
      nav.nav a {
        color: var(--fg);
        text-decoration: none;
        font-size: 15px;
        font-weight: 500;
        transition: opacity 0.15s;
      }
      @media (min-width: 768px) {
        nav.nav a { font-size: 16px; }
      }
      nav.nav a:hover { opacity: 0.7; }

      main {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 20px 60px;
      }
      @media (min-width: 768px) {
        main { padding: 60px 40px 80px; }
      }

      .breadcrumbs {
        font-size: 14px;
        color: var(--muted);
        margin-bottom: 32px;
      }
      .breadcrumbs a {
        color: var(--muted);
        text-decoration: none;
      }
      .breadcrumbs a:hover { text-decoration: underline; }
      .breadcrumbs span { margin: 0 8px; }

      .ingredient-hero { margin-bottom: 40px; }

      h1 {
        font-family: "Geologica", sans-serif;
        font-size: 36px;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 16px;
        letter-spacing: -0.02em;
      }
      @media (min-width: 768px) {
        h1 { font-size: 48px; }
      }

      .ingredient-meta {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        align-items: center;
        margin: 16px 0;
      }

      .category-badge {
        padding: 6px 14px;
        border: 2px solid var(--border);
        font-size: 14px;
        font-weight: 600;
        text-transform: capitalize;
      }

      .position-badge {
        padding: 6px 14px;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: white;
      }

      .badge-good { background: var(--good); }
      .badge-neutral { background: var(--muted); }
      .badge-caution { background: var(--caution); }
      .badge-avoid { background: var(--avoid); }

      .nutrition-value {
        font-size: 15px;
        color: var(--muted);
      }

      .quick-summary {
        background: white;
        border: 2.5px solid var(--border);
        padding: 24px;
        margin: 32px 0;
      }

      .quick-summary h2 {
        font-size: 20px;
        margin: 0 0 12px 0;
      }

      .quick-summary p {
        margin: 0;
        font-size: 17px;
        line-height: 1.6;
      }

      .key-facts {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        margin: 32px 0;
      }
      @media (min-width: 640px) {
        .key-facts { grid-template-columns: repeat(2, 1fr); }
      }

      .fact-item {
        border: 2px solid var(--border);
        padding: 16px;
      }

      .fact-label {
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--muted);
        margin-bottom: 6px;
      }

      .fact-value {
        font-size: 16px;
        font-weight: 600;
      }

      h2 {
        font-size: 28px;
        font-weight: 700;
        line-height: 1.3;
        margin: 48px 0 20px;
        letter-spacing: -0.01em;
      }
      @media (min-width: 768px) {
        h2 { font-size: 32px; }
      }

      h3 {
        font-size: 22px;
        font-weight: 600;
        line-height: 1.4;
        margin: 32px 0 16px;
      }

      p {
        margin-bottom: 20px;
        font-size: 18px;
        line-height: 1.7;
      }

      ul {
        margin: 20px 0 20px 24px;
      }
      @media (min-width: 768px) {
        ul { margin: 24px 0 24px 32px; }
      }

      li {
        margin-bottom: 12px;
        font-size: 18px;
        line-height: 1.6;
      }

      .quality-note-box,
      .watts-take-box {
        border: 2.5px solid var(--border);
        padding: 24px;
        margin: 32px 0;
      }

      .quality-note-box { background: #fff9e6; }
      .watts-take-box { background: #e8f5e9; }

      .quality-note-label,
      .watts-take-label {
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 12px;
      }

      .faq-item { margin-bottom: 32px; }
      .faq-item h3 { margin-top: 0; }

      .related-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        margin: 32px 0;
      }
      @media (min-width: 640px) {
        .related-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (min-width: 900px) {
        .related-grid { grid-template-columns: repeat(3, 1fr); }
      }

      .related-card {
        border: 2.5px solid var(--border);
        padding: 20px;
        text-decoration: none;
        color: var(--fg);
        transition: all 0.15s;
        display: block;
      }

      .related-card:hover {
        background: rgba(25, 25, 25, 0.02);
        transform: translateY(-2px);
      }

      .related-card h3 {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 8px 0;
      }

      .related-card p {
        font-size: 15px;
        color: var(--muted);
        margin: 0;
      }

      .cta-section {
        background: var(--fg);
        color: var(--bg);
        padding: 40px;
        text-align: center;
        margin: 60px 0 40px;
      }

      .cta-section h3 {
        color: var(--bg);
        margin-top: 0;
        font-size: 28px;
      }

      .cta-section p {
        font-size: 18px;
        margin-bottom: 24px;
        color: var(--bg);
        opacity: 0.9;
      }

      .cta-button {
        display: inline-block;
        background: var(--bg);
        color: var(--fg);
        padding: 14px 32px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        border: 2.5px solid var(--bg);
        transition: all 0.15s;
      }

      .cta-button:hover {
        background: transparent;
        color: var(--bg);
        border-color: var(--bg);
      }

      footer {
        text-align: center;
        padding: 20px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 400;
        border-top: 2.5px solid var(--border);
        margin-top: 60px;
      }
      @media (min-width: 768px) {
        footer {
          padding: 24px;
          font-size: 13px;
        }
      }
    </style>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${ingredient.name} in Dog Food, Treats & Supplements: Complete Guide",
      "description": "${ingredient.whatItIs.replace(/"/g, '\\"')}",
      "author": {
        "@type": "Organization",
        "name": "Watts Pet"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Watts Pet",
        "logo": {
          "@type": "ImageObject",
          "url": "https://wattspet.com/favicon.svg"
        }
      },
      "datePublished": "2026-01-25",
      "dateModified": "2026-01-25"
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://wattspet.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Ingredient Analyzer",
          "item": "https://wattspet.com/ingredient-analyzer/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Ingredients",
          "item": "https://wattspet.com/ingredient-analyzer/ingredients/"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "${ingredient.name}",
          "item": "https://wattspet.com/ingredient-analyzer/ingredients/${slug}/"
        }
      ]
    }
    </script>

    <script type="application/ld+json">
    ${JSON.stringify(faqSchema, null, 2)}
    </script>
</head>
<body>
  <nav class="nav">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about.html">About</a></li>
      <li><a href="/blog/">Blog</a></li>
      <li><a href="/ingredient-analyzer/">Ingredient Analyzer</a></li>
    </ul>
  </nav>

  <main>
    <div class="breadcrumbs">
      <a href="/">Home</a>
      <span>/</span>
      <a href="/ingredient-analyzer/">Ingredient Analyzer</a>
      <span>/</span>
      <a href="/ingredient-analyzer/ingredients/">Ingredients</a>
      <span>/</span>
      <span>${ingredient.name}</span>
    </div>

    <div class="ingredient-hero">
      <h1>${ingredient.name}</h1>
      <div class="ingredient-meta">
        <div class="category-badge">${capitalize(ingredient.category)}</div>
        <div class="position-badge ${getBadgeClass(ingredient.wattsPosition)}">${capitalize(ingredient.wattsPosition)}</div>
        <div class="nutrition-value">${capitalize(ingredient.nutritionValue)} nutritional value</div>
      </div>
      <p style="color: var(--muted); font-size: 16px; margin-top: 12px;">Last updated: January 25, 2026</p>
    </div>

    <div class="quick-summary">
      <h2>Quick Summary</h2>
      <p><strong>${ingredient.name}</strong> ${ingredient.whatItIs}</p>
    </div>

    <div class="key-facts">
      <div class="fact-item">
        <div class="fact-label">Category</div>
        <div class="fact-value">${capitalize(ingredient.category)}</div>
      </div>
      <div class="fact-item">
        <div class="fact-label">Common In</div>
        <div class="fact-value">${commonProducts}</div>
      </div>
      <div class="fact-item">
        <div class="fact-label">Also Known As</div>
        <div class="fact-value">${ingredient.aliases.slice(0, 2).join(', ') || 'N/A'}</div>
      </div>
      <div class="fact-item">
        <div class="fact-label">Watts Rating</div>
        <div class="fact-value" style="color: var(--${ingredient.wattsPosition === 'good' ? 'good' : ingredient.wattsPosition === 'caution' ? 'caution' : ingredient.wattsPosition === 'avoid' ? 'avoid' : 'muted'});">${capitalize(ingredient.wattsPosition)}${ingredient.wattsPosition === 'good' ? ' ✓' : ingredient.wattsPosition === 'avoid' ? ' ✗' : ''}</div>
      </div>
    </div>

    <h2>What It Is</h2>
    <p>${ingredient.whatItIs}</p>

    <h2>Why It's Used in Dog Products</h2>
    <p>Manufacturers include ${ingredient.name.toLowerCase()} in dog food, treats, and supplements for several reasons:</p>
    <ul>
${ingredient.whyUsed.map(reason => `      <li>${reason}</li>`).join('\n')}
    </ul>

    <h2>Key Considerations</h2>
    <p>When evaluating ${ingredient.name.toLowerCase()} in dog products, it's important to understand ${context.emphasis}. This ingredient's quality and appropriateness can vary significantly based on sourcing, processing, and the specific formula it's used in.</p>

    <div class="quality-note-box">
      <div class="quality-note-label">Quality Note</div>
      <p style="margin: 0;">${ingredient.qualityNote}</p>
    </div>

    <h2>Potential Concerns</h2>
    <p>While ${ingredient.name.toLowerCase()} can be appropriate in dog nutrition, pet owners should be aware of ${context.concerns}. Individual dogs may respond differently to the same ingredient based on their health status, age, and sensitivities.</p>

    <div class="watts-take-box">
      <div class="watts-take-label">Watts' Take</div>
      <p style="margin: 0; font-size: 18px;">${ingredient.wattsTake}</p>
    </div>

    <h2>Frequently Asked Questions</h2>
${faqs.map(faq => `
    <div class="faq-item">
      <h3>${faq.question}</h3>
      <p>${faq.answer}</p>
    </div>
`).join('')}

    <h2>Related Ingredients</h2>
    <div class="related-grid">
${relatedIngredients.map(related => `      <a href="/ingredient-analyzer/ingredients/${slugify(related.name)}/" class="related-card">
        <h3>${related.name}</h3>
        <p>${related.whatItIs.substring(0, 100)}...</p>
      </a>
`).join('\n')}
    </div>

    <div class="cta-section">
      <h3>Analyze Your Dog's Food</h3>
      <p>Want to know what's really in your dog's food, treats, or supplements? Paste the ingredient list to get instant analysis.</p>
      <a href="/ingredient-analyzer/" class="cta-button">Try the Analyzer Tool</a>
    </div>
  </main>

  <footer>
    <p>&copy; 2026 Watts Pet. All rights reserved.</p>
  </footer>
</body>
</html>`;

  return html;
}

// Generate all pages
console.log('🚀 Generating deep-content ingredient pages...\n');

let generated = 0;
const slugMap = {};

ingredients.forEach(ingredient => {
  const slug = slugify(ingredient.name);
  const html = generateIngredientPage(ingredient, ingredients);

  const dir = path.join('./ingredient-analyzer/ingredients', slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  slugMap[ingredient.name] = slug;

  generated++;
  if (generated % 20 === 0) {
    console.log(`Generated ${generated} pages...`);
  }
});

// Save slug map
fs.writeFileSync(
  './ingredient-analyzer/ingredient-slugs.json',
  JSON.stringify(slugMap, null, 2),
  'utf8'
);

console.log(`\n✅ Successfully generated ${generated} deep-content ingredient pages!`);
console.log(`✅ Updated slug map with ${Object.keys(slugMap).length} entries`);
