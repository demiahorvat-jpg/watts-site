# Analyzer Report Generator — Implementation Plan (Plan 1 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pure, tested JS module that turns a set of matched pet-food ingredients into a structured `report_payload` — the canonical data object that the on-page report, the Klaviyo email, and (later) a Gemini personalization step all consume.

**Architecture:** A single dependency-free ES module (`report-generator.js`) with pure functions. It takes *already-matched* ingredient records (the analyzer's existing `parseIngredients()` + `matchIngredient()` do the matching) plus `{productType, pets}`, and returns one `report_payload` object. Branching by product type lives here so the "what's missing" logic is honest (food gets gap analysis; treats never do; supplements get coverage/competitor detection). No DOM, no network, no product data fetched inside — fully unit-testable with `node --test`.

**Tech Stack:** Vanilla ES modules (browser `<script type="module">` + Node ≥18). Tests via built-in `node:test` + `node:assert`. No build step, no new dependencies (this is a static GitHub Pages site).

## Decomposition (this plan is 1 of 3)
- **Plan 1 (this doc): Report Generator** — pure `report_payload` builder. Foundation; produces the data contract everything else depends on.
- **Plan 2: Analyzer capture UI + Klaviyo posting** — the Dog/Cat + Food/Treat/Supplement inputs, the gated report module, and the client-side Klaviyo profile+event call. Consumes Plan 1's `buildReportPayload`.
- **Plan 3: Klaviyo assets** — report email template (with the `report_ai_body` fallback seam), segments, the isolated "Ingredient Report" flow, Welcome Series `pets` split + delay. Mostly API + UI checklist. Consumes the event Plan 2 fires.

## Global Constraints

- **No new runtime dependencies.** Static site; module must run in-browser as an ES module and in Node for tests.
- **No LLM/network in this module.** It is pure and synchronous. (The Gemini seam is a *later* consumer of its output, per spec §14 — not built here.)
- **Ingredient rating field is `wattsPosition`**, with values exactly: `excellent`, `good`, `neutral`, `caution`, `avoid`, `bad`. Nutrition field is `nutritionValue` (`high`/`moderate`/`low`/`none`).
- **Honesty rule (spec §5, §10):** `food` → gap analysis allowed; `treat` → NEVER emit `flagged_gaps` (a treat is meant to be incomplete); `supplement` → no gaps, detect coverage/competitor.
- **Output contract is stable (spec §14):** `buildReportPayload` returns a `report_payload` with a `version` field. Additive changes only.
- **Node version:** developed against Node ≥18 (repo machine has v24).

---

### Task 1: Scaffold module + config constants

**Files:**
- Create: `ingredient-analyzer/js/report-generator.js`
- Test: `ingredient-analyzer/js/report-generator.test.mjs`

**Interfaces:**
- Produces (used by all later tasks in this plan):
  - `RATING_MAP: Record<string,'good'|'neutral'|'flag'>`
  - `PILLARS: Array<{key:string,label:string,markers:string[]}>`
  - `BD_SIGNATURE: string[]`
  - `normalizeRating(wattsPosition: string) => 'good'|'neutral'|'flag'`

- [ ] **Step 1: Write the failing test**

```javascript
// ingredient-analyzer/js/report-generator.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RATING_MAP, PILLARS, BD_SIGNATURE, normalizeRating } from './report-generator.js';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: FAIL — `Cannot find module './report-generator.js'`

- [ ] **Step 3: Write minimal implementation**

```javascript
// ingredient-analyzer/js/report-generator.js
// Pure, dependency-free. Turns matched ingredient records into a report_payload.

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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add ingredient-analyzer/js/report-generator.js ingredient-analyzer/js/report-generator.test.mjs
git commit -m "feat(analyzer): report-generator config constants + normalizeRating"
```

---

### Task 2: `summarizeIngredients` — per-ingredient rating rollup

**Files:**
- Modify: `ingredient-analyzer/js/report-generator.js`
- Test: `ingredient-analyzer/js/report-generator.test.mjs`

**Interfaces:**
- Consumes: `normalizeRating` (Task 1)
- Produces: `summarizeIngredients(matched: Array<{name,wattsPosition,nutritionValue,category}>) => { ingredients: Array<{name,rating,nutrition,category}>, good_count, neutral_count, flag_count }`

- [ ] **Step 1: Write the failing test**

```javascript
// append to report-generator.test.mjs
import { summarizeIngredients } from './report-generator.js';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: FAIL — `summarizeIngredients is not exported` / not a function

- [ ] **Step 3: Write minimal implementation**

```javascript
// append to report-generator.js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: PASS (5 tests total)

- [ ] **Step 5: Commit**

```bash
git add ingredient-analyzer/js/report-generator.js ingredient-analyzer/js/report-generator.test.mjs
git commit -m "feat(analyzer): summarizeIngredients rating rollup"
```

---

### Task 3: `detectGaps` + `detectAdditives`

**Files:**
- Modify: `ingredient-analyzer/js/report-generator.js`
- Test: `ingredient-analyzer/js/report-generator.test.mjs`

**Interfaces:**
- Consumes: `PILLARS` (Task 1)
- Produces:
  - `detectGaps(matched) => Array<{pillar:string,label:string}>` — pillars with no marker present
  - `detectAdditives(matched) => string[]` — names where `wattsPosition` is `avoid` or `bad`

- [ ] **Step 1: Write the failing test**

```javascript
// append to report-generator.test.mjs
import { detectGaps, detectAdditives } from './report-generator.js';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: FAIL — functions not exported

- [ ] **Step 3: Write minimal implementation**

```javascript
// append to report-generator.js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: PASS (8 tests total)

- [ ] **Step 5: Commit**

```bash
git add ingredient-analyzer/js/report-generator.js ingredient-analyzer/js/report-generator.test.mjs
git commit -m "feat(analyzer): detectGaps + detectAdditives"
```

---

### Task 4: `detectSupplementContext`

**Files:**
- Modify: `ingredient-analyzer/js/report-generator.js`
- Test: `ingredient-analyzer/js/report-generator.test.mjs`

**Interfaces:**
- Consumes: `BD_SIGNATURE` (Task 1)
- Produces: `detectSupplementContext(matched) => { is_better_dailies: boolean, competitor_supplement: boolean }` — `is_better_dailies` when ≥3 signature actives present; `competitor_supplement` is its inverse (true when it looks like a supplement that is NOT ours)

- [ ] **Step 1: Write the failing test**

```javascript
// append to report-generator.test.mjs
import { detectSupplementContext } from './report-generator.js';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: FAIL — not exported

- [ ] **Step 3: Write minimal implementation**

```javascript
// append to report-generator.js
export function detectSupplementContext(matched) {
  const names = new Set(matched.map(m => String(m.name).toLowerCase()));
  const hits = BD_SIGNATURE.filter(sig => names.has(sig.toLowerCase())).length;
  const is_better_dailies = hits >= 3;
  return { is_better_dailies, competitor_supplement: !is_better_dailies };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: PASS (10 tests total)

- [ ] **Step 5: Commit**

```bash
git add ingredient-analyzer/js/report-generator.js ingredient-analyzer/js/report-generator.test.mjs
git commit -m "feat(analyzer): detectSupplementContext (Better Dailies vs competitor)"
```

---

### Task 5: `buildRecommendation` — branch-appropriate headline + body key

**Files:**
- Modify: `ingredient-analyzer/js/report-generator.js`
- Test: `ingredient-analyzer/js/report-generator.test.mjs`

**Interfaces:**
- Produces: `buildRecommendation({ productType, pets, gaps, additives, supplementCtx }) => { headline: string, body_key: string }`
  - `body_key` is one of: `food_gaps`, `food_clean`, `treat`, `supplement_bd`, `supplement_competitor`. (The email template in Plan 3 maps `body_key` → copy block; keeping it a key, not prose, is the render seam.)
  - `headline` includes the species word from `pets` (`dog`/`cat`).

- [ ] **Step 1: Write the failing test**

```javascript
// append to report-generator.test.mjs
import { buildRecommendation } from './report-generator.js';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: FAIL — not exported

- [ ] **Step 3: Write minimal implementation**

```javascript
// append to report-generator.js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: PASS (14 tests total)

- [ ] **Step 5: Commit**

```bash
git add ingredient-analyzer/js/report-generator.js ingredient-analyzer/js/report-generator.test.mjs
git commit -m "feat(analyzer): buildRecommendation branch logic"
```

---

### Task 6: `buildReportPayload` — the orchestrator (the output contract)

**Files:**
- Modify: `ingredient-analyzer/js/report-generator.js`
- Test: `ingredient-analyzer/js/report-generator.test.mjs`

**Interfaces:**
- Consumes: `summarizeIngredients`, `detectGaps`, `detectAdditives`, `detectSupplementContext`, `buildRecommendation` (Tasks 2–5)
- Produces: `buildReportPayload(matched, { productType, pets }) => report_payload` where `report_payload` is:
  ```
  {
    version: '1',
    pets: 'dog'|'cat',
    product_type: 'food'|'treat'|'supplement',
    ingredient_count: number,
    ingredients: Array<{name,rating,nutrition,category}>,
    good_count, neutral_count, flag_count: number,
    flagged_gaps: Array<{pillar,label}>,        // ALWAYS [] unless product_type === 'food'
    flagged_additives: string[],
    competitor_supplement: boolean,             // false unless product_type === 'supplement'
    is_better_dailies: boolean,
    recommendation: { headline, body_key }
  }
  ```
  This object is the stable contract consumed by Plan 2 (Klaviyo event props) and Plan 3 (email render), and is the exact input a future Gemini step receives (spec §14).

- [ ] **Step 1: Write the failing test**

```javascript
// append to report-generator.test.mjs
import { buildReportPayload } from './report-generator.js';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: FAIL — not exported

- [ ] **Step 3: Write minimal implementation**

```javascript
// append to report-generator.js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test ingredient-analyzer/js/report-generator.test.mjs`
Expected: PASS (18 tests total)

- [ ] **Step 5: Commit**

```bash
git add ingredient-analyzer/js/report-generator.js ingredient-analyzer/js/report-generator.test.mjs
git commit -m "feat(analyzer): buildReportPayload orchestrator (report_payload contract)"
```

---

## Self-Review

**Spec coverage (Plan 1 scope only):**
- §5 report generator (rule-based, no LLM) → Tasks 1–6 ✓
- §5 branch by product type; honesty rule (treat never gets gaps) → Task 6 test "treat payload NEVER has gaps" ✓
- §5 competitor-supplement detection → Task 4 + Task 6 ✓
- §5/§14 canonical structured `report_payload` output contract → Task 6 ✓
- (§4 capture UI, §6 Klaviyo posting, §7 flows, §8 emails → deferred to Plans 2 & 3, per decomposition) ✓

**Placeholder scan:** none — every step has complete code and exact commands.

**Type consistency:** `normalizeRating` returns `'good'|'neutral'|'flag'` (Tasks 1,2). `report_payload.ingredients[].rating` uses the same. `flagged_gaps` shape `{pillar,label}` consistent across Tasks 3 & 6. `body_key` enum consistent across Tasks 5 & 6. `detectSupplementContext` return keys match Task 6 usage. ✓
