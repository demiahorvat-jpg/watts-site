import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  RATING_MAP, PILLARS, BD_SIGNATURE, normalizeRating,
  summarizeIngredients, detectGaps, detectAdditives,
  detectSupplementContext, buildRecommendation, buildReportPayload,
} from './report-generator.js';

// --- Task 1 ---
test('RATING_MAP collapses the 6 wattsPosition values into 3 buckets', () => {
  assert.equal(RATING_MAP.excellent, 'good');
  assert.equal(RATING_MAP.good, 'good');
  assert.equal(RATING_MAP.neutral, 'neutral');
  assert.equal(RATING_MAP.caution, 'flag');
  assert.equal(RATING_MAP.avoid, 'flag');
  assert.equal(RATING_MAP.bad, 'flag');
});

test('normalizeRating maps known values and defaults unknown to neutral', () => {
  assert.equal(normalizeRating('excellent'), 'good');
  assert.equal(normalizeRating('avoid'), 'flag');
  assert.equal(normalizeRating('mystery'), 'neutral');
  assert.equal(normalizeRating(undefined), 'neutral');
});

test('PILLARS and BD_SIGNATURE are non-empty config', () => {
  assert.ok(PILLARS.length >= 4);
  assert.ok(PILLARS.every(p => p.key && p.label && Array.isArray(p.markers)));
  assert.ok(BD_SIGNATURE.length >= 3);
});

// --- Task 2 ---
const SAMPLE = [
  { name: 'Fish Oil', wattsPosition: 'good', nutritionValue: 'high', category: 'fat' },
  { name: 'Corn', wattsPosition: 'neutral', nutritionValue: 'low', category: 'grain' },
  { name: 'Red 40', wattsPosition: 'avoid', nutritionValue: 'none', category: 'colorant' },
];

test('summarizeIngredients rolls up ratings and counts', () => {
  const s = summarizeIngredients(SAMPLE);
  assert.equal(s.ingredients.length, 3);
  assert.deepEqual(s.ingredients[0], { name: 'Fish Oil', rating: 'good', nutrition: 'high', category: 'fat' });
  assert.equal(s.good_count, 1);
  assert.equal(s.neutral_count, 1);
  assert.equal(s.flag_count, 1);
});

test('summarizeIngredients handles empty input', () => {
  const s = summarizeIngredients([]);
  assert.deepEqual(s, { ingredients: [], good_count: 0, neutral_count: 0, flag_count: 0 });
});

// --- Task 3 ---
test('detectGaps flags pillars with no marker ingredient', () => {
  const matched = [{ name: 'Fish Oil', wattsPosition: 'good', category: 'fat' }]; // omega3 present only
  const gaps = detectGaps(matched);
  const keys = gaps.map(g => g.pillar);
  assert.ok(!keys.includes('omega3'));            // covered
  assert.ok(keys.includes('joint'));              // missing
  assert.ok(keys.includes('gut'));                // missing
  assert.ok(gaps.every(g => g.label));            // labels present
});

test('detectGaps is case-insensitive on marker names', () => {
  const matched = [{ name: 'astaxanthin', wattsPosition: 'good', category: 'active' }];
  const keys = detectGaps(matched).map(g => g.pillar);
  assert.ok(!keys.includes('antioxidant'));       // astaxanthin covers antioxidant
});

test('detectAdditives returns only avoid/bad names', () => {
  const matched = [
    { name: 'Red 40', wattsPosition: 'avoid' },
    { name: 'BHA', wattsPosition: 'bad' },
    { name: 'Salt', wattsPosition: 'caution' },   // caution is NOT an additive-to-avoid
    { name: 'Chicken', wattsPosition: 'good' },
  ];
  assert.deepEqual(detectAdditives(matched), ['Red 40', 'BHA']);
});

// --- Task 4 ---
test('detectSupplementContext recognizes Better Dailies by signature actives', () => {
  const matched = [
    { name: 'Astaxanthin' }, { name: 'Autolyzed Yeast' }, { name: 'UC-II' }, { name: 'Colostrum' },
  ];
  const ctx = detectSupplementContext(matched);
  assert.equal(ctx.is_better_dailies, true);
  assert.equal(ctx.competitor_supplement, false);
});

test('detectSupplementContext marks a non-matching supplement as competitor', () => {
  const matched = [{ name: 'Glucosamine' }, { name: 'Chondroitin' }];
  const ctx = detectSupplementContext(matched);
  assert.equal(ctx.is_better_dailies, false);
  assert.equal(ctx.competitor_supplement, true);
});

// --- Task 5 ---
test('food with gaps -> food_gaps, species in headline', () => {
  const r = buildRecommendation({ productType: 'food', pets: 'dog', gaps: [{ pillar: 'joint', label: 'Joint support' }], additives: [], supplementCtx: null });
  assert.equal(r.body_key, 'food_gaps');
  assert.match(r.headline, /dog/i);
});

test('food with no gaps -> food_clean', () => {
  const r = buildRecommendation({ productType: 'food', pets: 'cat', gaps: [], additives: [], supplementCtx: null });
  assert.equal(r.body_key, 'food_clean');
  assert.match(r.headline, /cat/i);
});

test('treat -> treat body_key regardless of gaps', () => {
  const r = buildRecommendation({ productType: 'treat', pets: 'dog', gaps: [], additives: ['Red 40'], supplementCtx: null });
  assert.equal(r.body_key, 'treat');
});

test('supplement branches on Better Dailies detection', () => {
  assert.equal(buildRecommendation({ productType: 'supplement', pets: 'dog', gaps: [], additives: [], supplementCtx: { is_better_dailies: true, competitor_supplement: false } }).body_key, 'supplement_bd');
  assert.equal(buildRecommendation({ productType: 'supplement', pets: 'dog', gaps: [], additives: [], supplementCtx: { is_better_dailies: false, competitor_supplement: true } }).body_key, 'supplement_competitor');
});

// --- Task 6 ---
const FOOD = [
  { name: 'Chicken', wattsPosition: 'good', nutritionValue: 'high', category: 'protein' },
  { name: 'Corn', wattsPosition: 'neutral', nutritionValue: 'low', category: 'grain' },
  { name: 'Red 40', wattsPosition: 'avoid', nutritionValue: 'none', category: 'colorant' },
];

test('food payload: gaps + additives populated, contract shape correct', () => {
  const p = buildReportPayload(FOOD, { productType: 'food', pets: 'dog' });
  assert.equal(p.version, '1');
  assert.equal(p.product_type, 'food');
  assert.equal(p.pets, 'dog');
  assert.equal(p.ingredient_count, 3);
  assert.ok(p.flagged_gaps.length > 0);
  assert.deepEqual(p.flagged_additives, ['Red 40']);
  assert.equal(p.competitor_supplement, false);
  assert.equal(p.recommendation.body_key, 'food_gaps');
});

test('treat payload NEVER has gaps (honesty rule)', () => {
  const p = buildReportPayload(FOOD, { productType: 'treat', pets: 'dog' });
  assert.deepEqual(p.flagged_gaps, []);
  assert.equal(p.recommendation.body_key, 'treat');
  assert.deepEqual(p.flagged_additives, ['Red 40']); // additives still surfaced
});

test('supplement payload sets competitor flag and no gaps', () => {
  const supp = [{ name: 'Glucosamine', wattsPosition: 'good', nutritionValue: 'moderate', category: 'active' }];
  const p = buildReportPayload(supp, { productType: 'supplement', pets: 'cat' });
  assert.deepEqual(p.flagged_gaps, []);
  assert.equal(p.competitor_supplement, true);
  assert.equal(p.is_better_dailies, false);
  assert.equal(p.recommendation.body_key, 'supplement_competitor');
});

test('pets defaults to dog when unspecified/invalid', () => {
  const p = buildReportPayload(FOOD, { productType: 'food', pets: 'lizard' });
  assert.equal(p.pets, 'dog');
});
