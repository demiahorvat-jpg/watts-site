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

// Generate Table of Contents
function generateTableOfContents(ingredient) {
  const sections = [
    { anchor: 'quick-summary', title: 'Quick Summary' },
    { anchor: 'what-it-is', title: 'What It Is' },
    { anchor: 'why-used', title: 'Why It\'s Used' }
  ];

  if (ingredient.nutritionalProfile) {
    sections.push({ anchor: 'nutritional-profile', title: 'Nutritional Profile' });
  }

  sections.push(
    { anchor: 'key-considerations', title: 'Quality Considerations' },
    { anchor: 'concerns', title: 'Potential Concerns' }
  );

  if (ingredient.scientificEvidence) {
    sections.push({ anchor: 'scientific-evidence', title: 'Scientific Evidence' });
  }

  if (ingredient.labelGuidance) {
    sections.push({ anchor: 'label-guidance', title: 'How to Spot on Labels' });
  }

  sections.push(
    { anchor: 'watts-take', title: 'Watts\' Take' },
    { anchor: 'faqs', title: 'Frequently Asked Questions' },
    { anchor: 'related', title: 'Related Ingredients' }
  );

  return `<div class="table-of-contents">
      <h2>Table of Contents</h2>
      <ul>
${sections.map(s => `        <li><a href="#${s.anchor}">${s.title}</a></li>`).join('\n')}
      </ul>
    </div>`;
}

// Generate internal links for comparison ingredients
function generateComparisonLinks(compareToSimilar) {
  if (!compareToSimilar || compareToSimilar.length === 0) return '';

  return `
    <h3>Compare to Similar Ingredients</h3>
    <ul>
${compareToSimilar.map(comp => `      <li><strong>vs. <a href="/ingredient-analyzer/ingredients/${comp.ingredient}/">${comp.ingredient.replace(/-/g, ' ')}</a></strong>: ${comp.difference}</li>`).join('\n')}
    </ul>`;
}

// Generate nutritional profile section
function generateNutritionalProfile(profile) {
  if (!profile) return '';

  let html = `
    <h2 id="nutritional-profile">Nutritional Profile</h2>`;

  if (profile.macros) {
    html += `
    <h3>Macronutrients</h3>
    <ul>
      <li><strong>Protein:</strong> ${profile.macros.protein}</li>
      <li><strong>Fat:</strong> ${profile.macros.fat}</li>
      <li><strong>Moisture:</strong> ${profile.macros.moisture}</li>
    </ul>`;
  }

  if (profile.micronutrients) {
    // Handle both object and string formats
    if (typeof profile.micronutrients === 'string') {
      html += `
    <p><strong>Key Micronutrients:</strong> ${profile.micronutrients}</p>`;
    } else if (typeof profile.micronutrients === 'object') {
      html += `
    <h3>Key Micronutrients</h3>
    <ul>`;
      for (const [key, value] of Object.entries(profile.micronutrients)) {
        const label = key.replace(/([A-Z])/g, ' $1').trim();
        html += `
      <li><strong>${capitalize(label)}:</strong> ${value}</li>`;
      }
      html += `
    </ul>`;
    }
  }

  if (profile.aminoAcids && Array.isArray(profile.aminoAcids)) {
    html += `
    <h3>Amino Acids</h3>
    <ul>
${profile.aminoAcids.map(aa => `      <li>${aa}</li>`).join('\n')}
    </ul>`;
  } else if (profile.aminoAcids && typeof profile.aminoAcids === 'string') {
    html += `
    <p><strong>Amino Acids:</strong> ${profile.aminoAcids}</p>`;
  }

  if (profile.bioavailability) {
    html += `
    <p><strong>Bioavailability:</strong> ${profile.bioavailability}</p>`;
  }

  return html;
}

// Generate scientific evidence section
function generateScientificEvidence(evidence, citations) {
  if (!evidence) return '';

  let html = `
    <h2 id="scientific-evidence">Scientific Evidence</h2>
    <p>${evidence.summary}</p>`;

  if (evidence.keyStudies && evidence.keyStudies.length > 0) {
    html += `
    <h3>Key Research Findings</h3>
    <ul>`;
    evidence.keyStudies.forEach(study => {
      html += `
      <li><strong>${study.finding}</strong> (${study.source})`;
      if (citations && citations[study.citationIndex]) {
        html += ` <a href="${citations[study.citationIndex].url}" target="_blank" rel="noopener">[Source]</a>`;
      }
      html += `</li>`;
    });
    html += `
    </ul>`;
  }

  if (evidence.evidenceLevel) {
    html += `
    <p><strong>Evidence Level:</strong> ${evidence.evidenceLevel}</p>`;
  }

  return html;
}

// Generate label guidance section
function generateLabelGuidance(guidance) {
  if (!guidance) return '';

  let html = `
    <h2 id="label-guidance">How to Spot on Labels</h2>
    <p>Reading ingredient labels can be confusing. Here's how to identify and evaluate this ingredient:</p>`;

  if (guidance.howToSpot && guidance.howToSpot.length > 0) {
    html += `
    <h3>What to Look For</h3>
    <ul>
${guidance.howToSpot.map(tip => `      <li>${tip}</li>`).join('\n')}
    </ul>`;
  }

  if (guidance.synonymsToKnow && guidance.synonymsToKnow.length > 0) {
    html += `
    <h3>Alternative Names</h3>
    <p>This ingredient may also appear as:</p>
    <ul>
${guidance.synonymsToKnow.map(syn => `      <li>${syn}</li>`).join('\n')}
    </ul>`;
  }

  if (guidance.typicalPosition) {
    html += `
    <p><strong>Typical Position:</strong> ${guidance.typicalPosition}</p>`;
  }

  return html;
}

// Generate enhanced FAQs
function generateEnhancedFAQs(faqs) {
  if (!faqs || faqs.length === 0) return '';

  // Sort by priority
  const sortedFaqs = [...faqs].sort((a, b) => (a.priority || 99) - (b.priority || 99));

  return sortedFaqs.map(faq => `
    <div class="faq-item">
      <h3>${faq.question}</h3>
      <p>${faq.answer}</p>
    </div>
`).join('');
}

// Generate legacy FAQs (for ingredients without enhanced FAQ data)
function generateLegacyFAQs(ingredient) {
  const name = ingredient.name;
  const category = ingredient.category;
  const position = ingredient.wattsPosition;

  // Helper function to create smooth FAQ answers from nutritionalProfile
  const createSafetyAnswer = () => {
    const profile = ingredient.nutritionalProfile || {};

    if (position === 'avoid') {
      return `${name} should be used with caution or avoided. ${ingredient.qualityNote || ingredient.wattsTake}`;
    }

    if (position === 'caution') {
      return `${name} is generally recognized as safe but has some concerns. ${ingredient.qualityNote || ''} Monitor your dog for any adverse reactions when first introducing products containing this ingredient.`;
    }

    // For "good" or "neutral" positions - create flowing answer
    let answer = `Yes, ${name.toLowerCase()} is safe for dogs when used appropriately in properly formulated dog food.`;

    // Add safety info from profile if available
    if (profile.safety) {
      answer += ` ${profile.safety}`;
    }

    // Add context-appropriate closing
    answer += ` As with any ingredient, individual dogs may have sensitivities, so monitor for any adverse reactions when first introducing products containing this ingredient.`;

    return answer;
  };

  const createFunctionAnswer = () => {
    const profile = ingredient.nutritionalProfile || {};
    const primaryFunction = profile.function || ingredient.whatItIs;
    const whyUsedReasons = ingredient.whyUsed?.slice(0, 2) || [];

    // Ensure primary function ends with a period
    let answer = primaryFunction;
    if (answer && !answer.endsWith('.')) {
      answer += '.';
    }

    // Add why it's used with proper grammar
    if (whyUsedReasons.length > 0) {
      // Convert reasons to infinitive form
      const reasons = whyUsedReasons.map(r => {
        const lower = r.toLowerCase();
        // If it starts with a verb like "provides", "improves", etc., convert to "provide", "improve"
        if (lower.startsWith('provides ')) return lower.replace('provides ', 'provide ');
        if (lower.startsWith('improves ')) return lower.replace('improves ', 'improve ');
        if (lower.startsWith('adds ')) return lower.replace('adds ', 'add ');
        if (lower.startsWith('supports ')) return lower.replace('supports ', 'support ');
        if (lower.startsWith('enhances ')) return lower.replace('enhances ', 'enhance ');
        // If it's a noun phrase like "high-energy fat source", add "provide" before it
        if (!lower.match(/^(provide|improve|add|support|enhance|serve)/)) {
          return `provide ${lower}`;
        }
        return lower;
      });
      answer += ` Dog food manufacturers include this ingredient to ${reasons.join(' and ')}.`;
    }

    return answer;
  };

  const faqs = [
    {
      question: `Is ${name.toLowerCase()} safe for dogs?`,
      answer: createSafetyAnswer()
    },
    {
      question: `What does ${name.toLowerCase()} do in dog ${category === 'protein' ? 'food' : 'products'}?`,
      answer: createFunctionAnswer()
    }
  ];

  // Category-specific questions
  if (category === 'fat') {
    const profile = ingredient.nutritionalProfile || {};
    const isNamedFat = !name.toLowerCase().includes('animal fat') && !name.toLowerCase().includes('poultry fat');

    faqs.push({
      question: `Is ${name.toLowerCase()} better than other fats in dog food?`,
      answer: isNamedFat
        ? `Named fat sources like ${name.toLowerCase()} are generally superior to generic "animal fat" because they provide transparency about the source and consistent quality. The quality of any fat depends on its fatty acid profile, omega-6 to omega-3 ratio, preservation method, and source animal health. ${name} offers traceability that generic fats cannot match.`
        : `The quality of any fat depends on its fatty acid profile, omega-6 to omega-3 ratio, and preservation method. Named fat sources (like chicken fat or beef tallow) are generally preferred because they provide transparency about the source and consistent quality.`
    });

    faqs.push({
      question: `How should ${name.toLowerCase()} be preserved in dog food?`,
      answer: `Fats and oils in dog food must be preserved to prevent rancidity and oxidation. Natural preservatives like mixed tocopherols (vitamin E) and rosemary extract are preferred over synthetic preservatives like BHA and BHT. Check the ingredient label for "preserved with" statements to identify which preservatives are used.`
    });

    if (profile.omega6toOmega3 || profile.fattyAcidProfile) {
      const hasHighOmega6 = profile.omega6toOmega3 && (profile.omega6toOmega3.includes('high') || profile.omega6toOmega3.includes('20:1') || profile.omega6toOmega3.includes('10:1'));

      faqs.push({
        question: `Does ${name.toLowerCase()} provide omega-3 fatty acids?`,
        answer: hasHighOmega6
          ? `${name} has a high omega-6 to omega-3 ratio, which means it provides minimal omega-3 fatty acids. For optimal nutrition and to support anti-inflammatory benefits, dog foods containing ${name.toLowerCase()} should be supplemented with omega-3 sources like fish oil, algal oil, or flaxseed oil to balance the fatty acid profile.`
          : `Like most fats, ${name.toLowerCase()} provides fatty acids that support energy, palatability, and nutrient absorption. Check the guaranteed analysis to see the omega-3 content, as land animal fats are typically lower in omega-3s compared to fish-based fats like salmon oil or menhaden oil.`
      });
    }

    faqs.push({
      question: `How much fat should be in dog food?`,
      answer: `Adult dog foods typically contain 12-18% fat, while puppy and performance formulas may have 18-25% fat or more. The AAFCO minimum is 5.5% for adult maintenance and 8.5% for growth and reproduction. The optimal amount depends on your dog's age, activity level, and individual metabolism.`
    });
  }

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
  // If relationships are specified in data, use those
  if (ingredient.relationships && ingredient.relationships.oftenPairedWith) {
    const pairedIngredients = ingredient.relationships.oftenPairedWith
      .map(slug => allIngredients.find(ing => slugify(ing.name) === slug))
      .filter(ing => ing); // Remove any not found

    if (pairedIngredients.length >= 6) {
      return pairedIngredients.slice(0, 6);
    }

    // If we have some but need more, fill with category matches
    const related = [...pairedIngredients];
    const currentCategory = ingredient.category;
    const sameCategory = allIngredients.filter(ing =>
      ing.category === currentCategory &&
      ing.name !== ingredient.name &&
      !related.some(r => r.name === ing.name)
    );
    related.push(...sameCategory.slice(0, 6 - related.length));
    return related.slice(0, 6);
  }

  // Legacy logic for ingredients without relationships data
  const related = [];
  const currentCategory = ingredient.category;

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

// Generate related blog posts section
function generateRelatedBlogPosts(relationships) {
  if (!relationships || !relationships.relatedBlogPosts || relationships.relatedBlogPosts.length === 0) {
    return '';
  }

  const blogTitles = {
    'beef-liver-for-dogs': 'Beef Liver for Dogs: Complete Guide',
    'organ-based-nutrition-for-dogs': 'Organ-Based Nutrition for Dogs',
    'whole-food-vs-synthetic-nutrients': 'Whole Food vs Synthetic Nutrients',
    'protein-for-dogs': 'Protein for Dogs: Complete Guide',
    'zinc-for-dogs': 'Zinc for Dogs: Benefits and Sources',
    'immune-support-for-dogs': 'Immune Support for Dogs',
    'gut-health-for-dogs': 'Gut Health for Dogs',
    'antioxidants-for-dogs': 'Antioxidants for Dogs',
    'bone-broth-for-dogs': 'Bone Broth for Dogs',
    'spirulina-for-dogs': 'Spirulina for Dogs'
  };

  return `
    <h2>Related Articles</h2>
    <div class="related-grid">
${relationships.relatedBlogPosts.map(slug => `      <a href="/blog/${slug}.html" class="related-card">
        <h3>${blogTitles[slug] || capitalize(slug.replace(/-/g, ' '))}</h3>
        <p>Learn more about this topic</p>
      </a>`).join('\n')}
    </div>`;
}

// Generate comprehensive HTML page
function generateIngredientPage(ingredient, allIngredients) {
  const slug = slugify(ingredient.name);

  // Use enhanced FAQs if available, otherwise generate legacy ones
  const faqData = ingredient.faqs && ingredient.faqs.length > 0
    ? ingredient.faqs
    : generateLegacyFAQs(ingredient);

  const relatedIngredients = getRelatedIngredients(ingredient, allIngredients);
  const context = getCategoryContext(ingredient.category, ingredient.name);
  const commonProducts = getCommonProducts(ingredient.category);

  // Generate FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (ingredient.faqs || faqData).map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Generate meta description (155-160 chars optimal for SEO)
  const metaDescription = ingredient.seoMetadata?.metaDescription
    || `Is ${ingredient.name.toLowerCase()} safe for dogs? Learn about nutritional benefits, safety considerations, quality indicators & expert analysis. Complete guide.`;

  // Helper function to detect if ingredient name is plural
  const isPlural = (name) => {
    const lower = name.toLowerCase();

    // Singular exceptions (ends in 's' but is singular)
    const singularExceptions = [
      'asparagus', 'citrus', 'grass', 'yeast', 'rice', 'moss',
      'acidophilus', 'faecium', 'coagulans', 'animalis', 'lactis',
      'lupus', 'status', 'virus', 'focus', 'mucus', 'phosphorus'
    ];

    // Plural exceptions (doesn't end in 's' but is plural)
    const pluralExceptions = ['poultry'];

    // Check plural exceptions first
    if (pluralExceptions.some(word => lower.includes(word))) return true;

    // Check singular exceptions
    if (singularExceptions.some(word => lower.endsWith(word))) return false;

    // Not plural if ends in these patterns
    if (lower.endsWith('ness') || lower.endsWith('ous') || lower.endsWith('us')) return false;
    if (lower.endsWith('oil') || lower.endsWith('meal') || lower.endsWith('flour')) return false;
    if (lower.endsWith('extract') || lower.endsWith('digest') || lower.endsWith('concentrate')) return false;

    // Common plural patterns
    if (lower.endsWith('berries') || lower.endsWith('cherries')) return true;
    if (lower.endsWith('ies') && !lower.endsWith('calories')) return true;
    if (lower.endsWith('oes') || lower.endsWith('ses') || lower.endsWith('ves')) return true;

    // Ends in 's' and is likely plural
    if (lower.endsWith('s')) return true;

    return false;
  };

  // Generate SEO-optimized title (50-60 chars ideal)
  let pageTitle;
  const nameLength = ingredient.name.length;
  const plural = isPlural(ingredient.name);

  if (nameLength <= 20) {
    // Short names: use full descriptive title with correct grammar
    const safetyQuestion = plural ? 'Are They Safe?' : 'Is It Safe?';
    pageTitle = `${ingredient.name} in Dog Food: ${safetyQuestion} | Watts`;
  } else if (nameLength <= 28) {
    // Medium names: slightly shorter version
    pageTitle = `${ingredient.name} in Dog Food: Safe? | Watts`;
  } else {
    // Long names: minimal version to stay under 60 chars
    pageTitle = `${ingredient.name} in Dog Food | Watts`;
  }

  // Helper: Get "what it is" text with proper fallback
  const whatItIsText = ingredient.whatItIsExpanded?.overview
    || ingredient.whatItIs
    || (ingredient.nutritionalProfile && ingredient.nutritionalProfile.function)
    || 'No description available.';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDescription}">
    <link rel="canonical" href="https://wattspet.com/ingredient-analyzer/ingredients/${slug}/">

    <!-- Open Graph -->
    <meta property="og:title" content="${ingredient.name} in Dog Food: Complete Guide | Watts Pet">
    <meta property="og:description" content="${whatItIsText.substring(0, 150)}">
    <meta property="og:url" content="https://wattspet.com/ingredient-analyzer/ingredients/${slug}/">
    <meta property="og:type" content="article">

    <!-- Degular Font -->
    <style>
      @font-face {
        font-family: 'Degular';
        src: url('/fonts/Degular-Regular.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Degular';
        src: url('/fonts/Degular-Medium.woff2') format('woff2');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Degular';
        src: url('/fonts/Degular-Semibold.woff2') format('woff2');
        font-weight: 600;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Degular';
        src: url('/fonts/Degular-Bold.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }

      :root {
        --bg: #F1ECE9;
        --fg: #191919;
        --muted: #3a3a3a;
        --border: #191919;
        --good: #2d5016;
        --caution: #b45309;
        --avoid: #991b1b;
        --brand-orange: #c03800;
        --white: #ffffff;
        --accent-navy: #1e3a5f;
        --bg-light: #f1f1f1;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      html, body { min-height: 100%; }
      body {
        background: #191919;
        color: var(--fg);
        font-family: "Degular", -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 400;
        line-height: 1.6;
        overflow-x: hidden;
      }

      /* HEADER */
      .header-wrapper {
        background: #191919;
        padding: 12px 12px 20px;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      header {
        background: var(--brand-orange);
        padding: 7px 20px;
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }

      .header-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        min-height: 40px;
      }

      nav {
        order: -1;
        display: flex;
        align-items: center;
      }

      nav ul {
        list-style: none;
        display: flex;
        gap: 16px;
        align-items: center;
        margin: 0;
        padding: 0;
      }
      @media (min-width: 768px) {
        nav ul { gap: 24px; }
      }

      nav li {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
      }

      nav a {
        color: var(--white);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: opacity 0.2s ease;
        line-height: 1;
        padding: 0;
        margin: 0;
      }
      @media (min-width: 768px) {
        nav a { font-size: 15px; }
      }
      nav a:hover {
        opacity: 0.8;
      }

      /* Hamburger menu for mobile */
      .hamburger {
        display: none;
        flex-direction: column;
        gap: 4px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        z-index: 1000;
      }

      .hamburger span {
        display: block;
        width: 22px;
        height: 2px;
        background: var(--white);
        transition: all 0.3s ease;
      }

      @media (max-width: 767px) {
        .hamburger {
          display: flex;
        }

        nav ul {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          background: var(--brand-orange);
          flex-direction: column;
          gap: 0;
          padding: 20px;
          margin: 0;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          max-height: calc(100vh - 64px);
          overflow-y: auto;
        }

        nav ul.active {
          transform: translateX(0);
        }

        nav li {
          width: 100%;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        nav li:last-child {
          border-bottom: none;
        }

        nav a {
          font-size: 16px;
          display: block;
          width: 100%;
        }

        /* Keep logo centered */
        .logo-container {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      }

      .logo-container {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .logo {
        height: 32px;
      }
      @media (min-width: 768px) {
        .logo { height: 40px; }
      }

      main {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 20px 60px;
        background: var(--bg);
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
        font-family: "Degular", sans-serif;
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

      .table-of-contents {
        background: white;
        border: 2.5px solid var(--border);
        padding: 24px;
        margin: 32px 0;
      }

      .table-of-contents h2 {
        font-size: 20px;
        margin: 0 0 16px 0;
      }

      .table-of-contents ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .table-of-contents li {
        margin-bottom: 8px;
      }

      .table-of-contents a {
        color: var(--fg);
        text-decoration: none;
        font-size: 16px;
      }

      .table-of-contents a:hover {
        text-decoration: underline;
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

      a {
        color: var(--fg);
        text-decoration: underline;
      }

      a:hover {
        opacity: 0.7;
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

      /* FOOTER */
      .footer-wrapper {
        background: #191919;
        padding: 0 12px 12px;
        margin-top: 60px;
      }

      footer {
        background: var(--brand-orange);
        color: var(--white);
        padding: 45px 40px 20px;
        border-radius: 200px 16px 16px 200px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        min-height: 144px;
      }
      @media (min-width: 768px) {
        footer {
          padding: 63px 60px 24px;
          min-height: 207px;
          border-radius: 300px 16px 16px 300px;
        }
      }

      .footer-content {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }

      .footer-left {
        flex: 1;
      }

      .footer-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 24px;
        flex: 1;
      }
      @media (min-width: 768px) {
        .footer-right {
          gap: 32px;
        }
      }

      .footer-right-text {
        text-align: right;
      }

      .footer-logo {
        height: 100px;
        margin-top: 128px;
        margin-bottom: 0;
      }
      @media (min-width: 768px) {
        .footer-logo {
          height: 160px;
          margin-top: 160px;
          margin-bottom: 0;
        }
      }

      footer p {
        color: var(--white);
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 12px;
      }

      footer a {
        color: var(--white);
        text-decoration: none;
        font-weight: 500;
      }
      footer a:hover {
        text-decoration: underline;
      }

      /* Mobile footer fixes */
      @media (max-width: 767px) {
        footer {
          padding: 32px 20px 16px !important;
          border-radius: 100px 16px 16px 100px !important;
          min-height: auto !important;
        }

        .footer-content {
          flex-direction: column !important;
          align-items: center !important;
          gap: 24px !important;
        }

        .footer-left {
          flex: none !important;
          width: 100% !important;
        }

        .footer-right {
          flex: none !important;
          width: 100% !important;
          align-items: center !important;
          gap: 16px !important;
        }

        .footer-right-text {
          text-align: center !important;
        }

        .footer-logo {
          height: 60px !important;
          margin-top: 0 !important;
        }

        footer p {
          font-size: 14px !important;
          margin-bottom: 8px !important;
        }
      }
    </style>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${ingredient.name} in Dog Food: Is It Safe for Dogs?",
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
      "datePublished": "${ingredient.lastUpdated || '2026-01-25'}",
      "dateModified": "${ingredient.lastUpdated || '2026-01-25'}"
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
  <div class="header-wrapper">
    <header>
      <div class="header-container">
        <button class="hamburger" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/ingredient-analyzer/">Ingredients</a></li>
          </ul>
        </nav>
        <div class="logo-container">
          <a href="/" aria-label="Watts home">
            <img src="/watts-logo-white.svg" alt="Watts" class="logo">
          </a>
        </div>
      </div>
    </header>
  </div>

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
      <p style="color: var(--muted); font-size: 16px; margin-top: 12px;">Last updated: ${ingredient.lastUpdated || 'January 25, 2026'}</p>
    </div>

    ${generateTableOfContents(ingredient)}

    <div class="quick-summary" id="quick-summary">
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
        <div class="fact-value">${ingredient.aliases && ingredient.aliases.length > 0 ? ingredient.aliases.join(', ') : 'N/A'}</div>
      </div>
      <div class="fact-item">
        <div class="fact-label">Watts Rating</div>
        <div class="fact-value" style="color: var(--${ingredient.wattsPosition === 'good' ? 'good' : ingredient.wattsPosition === 'caution' ? 'caution' : ingredient.wattsPosition === 'avoid' ? 'avoid' : 'muted'});">${capitalize(ingredient.wattsPosition)}${ingredient.wattsPosition === 'good' ? ' ✓' : ingredient.wattsPosition === 'avoid' ? ' ✗' : ''}</div>
      </div>
    </div>

    <h2 id="what-it-is">What It Is</h2>
    <p>${whatItIsText}</p>
    ${ingredient.whatItIsExpanded ? generateComparisonLinks(ingredient.whatItIsExpanded.compareToSimilar) : ''}

    <h2 id="why-used">Why It's Used in Dog Products</h2>
    ${ingredient.whyUsedExpanded ? `<p>${ingredient.whyUsedExpanded}</p>` : `<p>Manufacturers include ${ingredient.name.toLowerCase()} in dog food, treats, and supplements for several reasons:</p>
    <ul>
${ingredient.whyUsed.map(reason => `      <li>${reason}</li>`).join('\n')}
    </ul>`}

    ${generateNutritionalProfile(ingredient.nutritionalProfile)}

    <h2 id="key-considerations">Quality Considerations</h2>
    ${ingredient.qualityConsiderations?.expanded
      ? `<p>${ingredient.qualityConsiderations.expanded}</p>`
      : `<p>When evaluating ${ingredient.name.toLowerCase()} in dog products, it's important to understand ${context.emphasis}. This ingredient's quality and appropriateness can vary significantly based on sourcing, processing, and the specific formula it's used in.</p>`}

    ${ingredient.qualityConsiderations?.redFlags ? `
    <h3>Red Flags</h3>
    <ul>
${ingredient.qualityConsiderations.redFlags.map(flag => `      <li>${flag}</li>`).join('\n')}
    </ul>` : ''}

    ${ingredient.qualityConsiderations?.greenFlags ? `
    <h3>Green Flags</h3>
    <ul>
${ingredient.qualityConsiderations.greenFlags.map(flag => `      <li>${flag}</li>`).join('\n')}
    </ul>` : ''}

    <div class="quality-note-box">
      <div class="quality-note-label">Quality Note</div>
      <p style="margin: 0;">${ingredient.qualityNote}</p>
    </div>

    <h2 id="concerns">Potential Concerns</h2>
    ${ingredient.concernsExpanded?.detailed
      ? `<p>${ingredient.concernsExpanded.detailed}</p>`
      : `<p>While ${ingredient.name.toLowerCase()} can be appropriate in dog nutrition, pet owners should be aware of ${context.concerns}. Individual dogs may respond differently to the same ingredient based on their health status, age, and sensitivities.</p>`}

    ${ingredient.concernsExpanded?.contraindications ? `
    <h3>Contraindications</h3>
    <ul>
${ingredient.concernsExpanded.contraindications.map(ci => `      <li>${ci}</li>`).join('\n')}
    </ul>` : ''}

    ${ingredient.concernsExpanded?.lifeStageConsiderations ? `
    <p><strong>Life Stage Considerations:</strong> ${ingredient.concernsExpanded.lifeStageConsiderations}</p>` : ''}

    ${generateScientificEvidence(ingredient.scientificEvidence, ingredient.citations)}

    ${generateLabelGuidance(ingredient.labelGuidance)}

    <div class="watts-take-box" id="watts-take">
      <div class="watts-take-label">Watts' Take</div>
      <p style="margin: 0; font-size: 18px;">${ingredient.wattsTake}</p>
    </div>

    <h2 id="faqs">Frequently Asked Questions</h2>
${ingredient.faqs && ingredient.faqs.length > 0 ? generateEnhancedFAQs(ingredient.faqs) : generateLegacyFAQs(ingredient).map(faq => `
    <div class="faq-item">
      <h3>${faq.question}</h3>
      <p>${faq.answer}</p>
    </div>
`).join('')}

    ${generateRelatedBlogPosts(ingredient.relationships)}

    <h2 id="related">Related Ingredients</h2>
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

  <div class="footer-wrapper">
    <footer>
      <div class="footer-content">
        <div class="footer-left"></div>
        <div class="footer-right">
          <div class="footer-right-text">
            <p><a href="mailto:info@wattspet.com">info@wattspet.com</a></p>
          </div>
          <img src="/watts-logo-white.svg" alt="Watts" class="footer-logo">
        </div>
      </div>
    </footer>
  </div>

  <script>
    // Hamburger menu toggle
    document.addEventListener('DOMContentLoaded', function() {
      const hamburger = document.querySelector('.hamburger');
      const navMenu = document.querySelector('nav ul');

      if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
          navMenu.classList.toggle('active');
          this.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
          link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
          });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
          const isClickInsideNav = navMenu.contains(event.target);
          const isClickOnHamburger = hamburger.contains(event.target);

          if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
          }
        });
      }
    });
  </script>
</body>
</html>`;

  return html;
}

// Generate all pages
console.log('🚀 Generating enhanced deep-content ingredient pages (v2)...\n');

let generated = 0;
const slugMap = {};

// Allow filtering by specific ingredient for testing
const filterIngredient = process.argv[2];

const ingredientsToGenerate = filterIngredient
  ? ingredients.filter(ing => slugify(ing.name) === filterIngredient.toLowerCase())
  : ingredients;

if (filterIngredient && ingredientsToGenerate.length === 0) {
  console.error(`❌ Ingredient "${filterIngredient}" not found in database.`);
  process.exit(1);
}

ingredientsToGenerate.forEach(ingredient => {
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

// Save slug map (only if generating all)
if (!filterIngredient) {
  fs.writeFileSync(
    './ingredient-analyzer/ingredient-slugs.json',
    JSON.stringify(slugMap, null, 2),
    'utf8'
  );
  console.log(`✅ Updated slug map with ${Object.keys(slugMap).length} entries`);
}

console.log(`\n✅ Successfully generated ${generated} enhanced deep-content ingredient pages!`);
if (filterIngredient) {
  console.log(`   (Filtered to: ${filterIngredient})`);
}
