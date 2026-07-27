// ingredient-analyzer/js/report-generator.js
// Pure, dependency-free. Turns matched ingredient records into a report_payload.
// The report_payload is the canonical data contract consumed by the on-page report,
// the Klaviyo email, and (later) a Gemini personalization step (spec §14).

export const RATING_MAP = {
  excellent: 'good',
  good: 'good',
  neutral: 'neutral',
  caution: 'flag',
  avoid: 'flag',
  bad: 'flag',
};

export function normalizeRating(wattsPosition) {
  return RATING_MAP[wattsPosition] || 'neutral';
}

// Better Dailies functional pillars. A complete FOOD is "missing" a pillar when
// none of its matched ingredients appear in that pillar's markers. Marker names
// are matched (case-insensitive) against matched ingredients' canonical `name`;
// markers that don't exist in the DB are simply never matched (harmless).
export const PILLARS = [
  { key: 'omega3', label: 'Omega-3 fatty acids (skin, coat, joints)',
    markers: ['Fish Oil', 'Salmon Oil', 'Eicosapentaenoic Acid', 'Docosahexaenoic Acid', 'Flaxseed', 'Fish Meal', 'Krill'] },
  { key: 'joint', label: 'Joint support',
    markers: ['Glucosamine', 'Chondroitin', 'Green-Lipped Mussel', 'UC-II', 'Collagen', 'Boswellia', 'Hyaluronic Acid', 'Eggshell Membrane'] },
  { key: 'gut', label: 'Gut & digestive support',
    markers: ['Bacillus Coagulans', 'Bifidobacterium Animalis', 'Bifidobacterium Lactis', 'Enterococcus Faecium', 'Fructooligosaccharides', 'Autolyzed Yeast', 'Brewers Dried Yeast', 'Chicory Root', 'Inulin'] },
  { key: 'immune', label: 'Immune support',
    markers: ['Colostrum', 'Chaga', 'Cordyceps', 'Astragalus', 'Champignon Mushroom Extract', 'Beta-Glucan'] },
  { key: 'antioxidant', label: 'Antioxidants (cellular protection)',
    markers: ['Astaxanthin', 'Green Tea Extract', 'Glutathione', 'Coenzyme Q10', 'Anthocyanins', 'Turmeric', 'Blueberries'] },
];

// Signature actives that indicate a comprehensive daily like Better Dailies.
export const BD_SIGNATURE = ['Astaxanthin', 'Autolyzed Yeast', 'Colostrum', 'UC-II', 'Beta-Glucan', 'Postbiotic'];

export function summarizeIngredients(matched) {
  const ingredients = matched.map(m => ({
    name: m.name,
    rating: normalizeRating(m.wattsPosition),
    nutrition: m.nutritionValue || 'none',
    category: m.category || 'unknown',
  }));
  return {
    ingredients,
    good_count: ingredients.filter(i => i.rating === 'good').length,
    neutral_count: ingredients.filter(i => i.rating === 'neutral').length,
    flag_count: ingredients.filter(i => i.rating === 'flag').length,
  };
}

export function detectGaps(matched) {
  const names = new Set(matched.map(m => String(m.name).toLowerCase()));
  return PILLARS
    .filter(p => !p.markers.some(marker => names.has(marker.toLowerCase())))
    .map(p => ({ pillar: p.key, label: p.label }));
}

export function detectAdditives(matched) {
  return matched
    .filter(m => m.wattsPosition === 'avoid' || m.wattsPosition === 'bad')
    .map(m => m.name);
}

export function detectSupplementContext(matched) {
  const names = new Set(matched.map(m => String(m.name).toLowerCase()));
  const hits = BD_SIGNATURE.filter(sig => names.has(sig.toLowerCase())).length;
  const is_better_dailies = hits >= 3;
  return { is_better_dailies, competitor_supplement: !is_better_dailies };
}

export function buildRecommendation({ productType, pets, gaps, additives, supplementCtx }) {
  const species = pets === 'cat' ? 'cat' : 'dog';
  if (productType === 'treat') {
    return { headline: `A treat doesn't need to be complete — here's what to watch for in your ${species}'s treats`, body_key: 'treat' };
  }
  if (productType === 'supplement') {
    if (supplementCtx && supplementCtx.is_better_dailies) {
      return { headline: `Your ${species} is already on a complete daily — nice`, body_key: 'supplement_bd' };
    }
    return { headline: `Here's how this supplement stacks up for your ${species}`, body_key: 'supplement_competitor' };
  }
  // food
  if (gaps && gaps.length > 0) {
    return { headline: `Here's what your ${species}'s food is missing`, body_key: 'food_gaps' };
  }
  return { headline: `Your ${species}'s food covers the basics — here's how to go further`, body_key: 'food_clean' };
}

export function buildReportPayload(matched, { productType, pets } = {}) {
  const type = ['food', 'treat', 'supplement'].includes(productType) ? productType : 'food';
  const species = pets === 'cat' ? 'cat' : 'dog';

  const summary = summarizeIngredients(matched);
  const flagged_additives = detectAdditives(matched);

  // Honesty rule: gaps ONLY for complete food.
  const flagged_gaps = type === 'food' ? detectGaps(matched) : [];
  const supplementCtx = type === 'supplement'
    ? detectSupplementContext(matched)
    : { is_better_dailies: false, competitor_supplement: false };

  const recommendation = buildRecommendation({
    productType: type, pets: species, gaps: flagged_gaps, additives: flagged_additives, supplementCtx,
  });

  return {
    version: '1',
    pets: species,
    product_type: type,
    ingredient_count: summary.ingredients.length,
    ingredients: summary.ingredients,
    good_count: summary.good_count,
    neutral_count: summary.neutral_count,
    flag_count: summary.flag_count,
    flagged_gaps,
    flagged_additives,
    competitor_supplement: supplementCtx.competitor_supplement,
    is_better_dailies: supplementCtx.is_better_dailies,
    recommendation,
  };
}
