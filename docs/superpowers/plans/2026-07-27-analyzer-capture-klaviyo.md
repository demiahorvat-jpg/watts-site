# Analyzer Capture UI + Klaviyo Posting — Implementation Plan (Plan 2 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline) to implement task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add the Dog/Cat + Food/Treat/Supplement inputs and the email-gated report module to the Ingredient Analyzer, and post captured leads to Klaviyo (profile + list subscription + "Requested Ingredient Report" event carrying the `report_payload`).

**Architecture:** A new pure module `klaviyo-capture.js` builds the two Klaviyo client-API request bodies from `{email, pets, productType, competitorSupplement, reportPayload}` (testable). A thin `submitCapture()` performs the two `fetch`es to Klaviyo's public client endpoints (company_id only — safe in-browser). The analyzer's existing `analyzeIngredients()` gets ONE added line dispatching a `watts:analysis` CustomEvent with the matched DB records; a small `<script type="module">` in `index.html` listens, reads the toggles, calls `buildReportPayload` (Plan 1), renders the free result + gated report CTA, and on submit calls `submitCapture`.

**Tech Stack:** Vanilla ES modules; Klaviyo public client APIs (`/client/subscriptions/`, `/client/events/`, `company_id=SXFMie`); `node:test` for the pure builder. No new dependencies, no server.

## Global Constraints

- **No private Klaviyo key in the browser** — client endpoints use `company_id=SXFMie` only.
- **Master list id = `WLb5bq`** (the "Email List"). Subscribing to it triggers the existing Welcome Series (Plan 3 adds the `pets` split).
- **Event metric name = exactly `Requested Ingredient Report`** (Plan 3's flow triggers on it). Auto-created on first event.
- **Profile properties set at capture:** `pets` (`dog`/`cat`), `analyzing_product_type` (`food`/`treat`/`supplement`), `lead_source` = `ingredient-analyzer`, `competitor_supplement` (bool).
- **Event properties = the full `report_payload`** (spec §14 — the structured payload a future Gemini step consumes).
- **Do not rewrite the existing analyzer JS** — hook via one dispatched CustomEvent. Free per-ingredient results stay ungated (SEO).
- Node ≥18 for tests.

## Interfaces (from Plan 1, already built and committed)
- `buildReportPayload(matched, {productType, pets}) => report_payload` — `ingredient-analyzer/js/report-generator.js`

---

### Task 1: `klaviyo-capture.js` — pure payload builder + submit

**Files:**
- Create: `ingredient-analyzer/js/klaviyo-capture.js`
- Test: `ingredient-analyzer/js/klaviyo-capture.test.mjs`

**Interfaces:**
- Produces:
  - `buildKlaviyoPayloads({email, pets, productType, competitorSupplement, reportPayload, listId}) => { subscription, event }` — the two JSON:API request bodies.
  - `submitCapture(args, fetchImpl=fetch) => Promise<{ok:boolean}>` — POSTs both; `fetchImpl` injectable for tests.
  - Const `EMAIL_LIST_ID = 'WLb5bq'`, `COMPANY_ID = 'SXFMie'`, `METRIC_NAME = 'Requested Ingredient Report'`.

- [ ] **Step 1: Write the failing test**

```javascript
// ingredient-analyzer/js/klaviyo-capture.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildKlaviyoPayloads, submitCapture, EMAIL_LIST_ID, METRIC_NAME } from './klaviyo-capture.js';

const REPORT = { version: '1', pets: 'dog', product_type: 'food', flagged_gaps: [{ pillar: 'joint', label: 'Joint support' }] };
const ARGS = { email: 'a@b.com', pets: 'dog', productType: 'food', competitorSupplement: false, reportPayload: REPORT, listId: EMAIL_LIST_ID };

test('buildKlaviyoPayloads: subscription body sets email, list, and profile properties', () => {
  const { subscription } = buildKlaviyoPayloads(ARGS);
  assert.equal(subscription.data.type, 'subscription');
  const attrs = subscription.data.attributes.profile.data.attributes;
  assert.equal(attrs.email, 'a@b.com');
  assert.equal(attrs.properties.pets, 'dog');
  assert.equal(attrs.properties.analyzing_product_type, 'food');
  assert.equal(attrs.properties.lead_source, 'ingredient-analyzer');
  assert.equal(attrs.properties.competitor_supplement, false);
  assert.equal(subscription.data.relationships.list.data.id, EMAIL_LIST_ID);
});

test('buildKlaviyoPayloads: event body uses the metric name and carries the full report_payload', () => {
  const { event } = buildKlaviyoPayloads(ARGS);
  assert.equal(event.data.type, 'event');
  assert.equal(event.data.attributes.metric.data.attributes.name, METRIC_NAME);
  assert.equal(event.data.attributes.profile.data.attributes.email, 'a@b.com');
  assert.deepEqual(event.data.attributes.properties, REPORT);
});

test('submitCapture posts subscription then event and resolves ok on 2xx', async () => {
  const calls = [];
  const fakeFetch = async (url, opts) => { calls.push({ url, opts }); return { ok: true, status: 202 }; };
  const res = await submitCapture(ARGS, fakeFetch);
  assert.equal(res.ok, true);
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/client\/subscriptions\//);
  assert.match(calls[1].url, /\/client\/events\//);
  assert.match(calls[0].url, /company_id=SXFMie/);
});

test('submitCapture resolves ok:false when a request fails', async () => {
  const fakeFetch = async () => ({ ok: false, status: 400 });
  const res = await submitCapture(ARGS, fakeFetch);
  assert.equal(res.ok, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test ingredient-analyzer/js/klaviyo-capture.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```javascript
// ingredient-analyzer/js/klaviyo-capture.js
// Client-side Klaviyo posting. Public endpoints (company_id only) — safe in-browser.
export const COMPANY_ID = 'SXFMie';
export const EMAIL_LIST_ID = 'WLb5bq';
export const METRIC_NAME = 'Requested Ingredient Report';
const REVISION = '2024-10-15';

export function buildKlaviyoPayloads({ email, pets, productType, competitorSupplement, reportPayload, listId = EMAIL_LIST_ID }) {
  const subscription = {
    data: {
      type: 'subscription',
      attributes: {
        custom_source: 'Ingredient Analyzer',
        profile: {
          data: {
            type: 'profile',
            attributes: {
              email,
              properties: {
                pets,
                analyzing_product_type: productType,
                lead_source: 'ingredient-analyzer',
                competitor_supplement: !!competitorSupplement,
              },
            },
          },
        },
      },
      relationships: { list: { data: { type: 'list', id: listId } } },
    },
  };
  const event = {
    data: {
      type: 'event',
      attributes: {
        properties: reportPayload,
        metric: { data: { type: 'metric', attributes: { name: METRIC_NAME } } },
        profile: { data: { type: 'profile', attributes: { email } } },
      },
    },
  };
  return { subscription, event };
}

export async function submitCapture(args, fetchImpl = fetch) {
  const { subscription, event } = buildKlaviyoPayloads(args);
  const headers = { 'Content-Type': 'application/json', revision: REVISION };
  const base = 'https://a.klaviyo.com/client';
  const subRes = await fetchImpl(`${base}/subscriptions/?company_id=${COMPANY_ID}`, { method: 'POST', headers, body: JSON.stringify(subscription) });
  if (!subRes.ok) return { ok: false };
  const evtRes = await fetchImpl(`${base}/events/?company_id=${COMPANY_ID}`, { method: 'POST', headers, body: JSON.stringify(event) });
  return { ok: !!evtRes.ok };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test ingredient-analyzer/js/klaviyo-capture.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add ingredient-analyzer/js/klaviyo-capture.js ingredient-analyzer/js/klaviyo-capture.test.mjs
git commit -m "feat(analyzer): klaviyo-capture payload builder + submit"
```

---

### Task 2: Analyzer UI inputs + report container (HTML)

**Files:**
- Modify: `ingredient-analyzer/index.html` (near the textarea/analyze button, ~line 961-966; add a results-area container after `#results`)

**Note:** DOM/visual task — verify in a browser after (no unit test). Keep markup minimal and reuse existing classes.

- [ ] **Step 1: Add the two toggles above the Analyze button**

Insert immediately before `<button id="analyzeBtn">Analyze Ingredients</button>` (line 966):

```html
<div class="analyzer-inputs" style="display:flex;gap:20px;flex-wrap:wrap;margin:12px 0;">
  <label style="font-weight:600;">Pet:
    <select id="petType"><option value="dog">Dog</option><option value="cat">Cat</option></select>
  </label>
  <label style="font-weight:600;">Analyzing a:
    <select id="productType"><option value="food">Food</option><option value="treat">Treat</option><option value="supplement">Supplement</option></select>
  </label>
</div>
```

- [ ] **Step 2: Add the report container** immediately after the `#results` element's closing (search for `id="results"` opening tag and add this sibling right after `#ingredientResults`):

```html
<div id="reportCapture" class="hidden" style="margin-top:24px;"></div>
```

- [ ] **Step 3: Commit**

```bash
git add ingredient-analyzer/index.html
git commit -m "feat(analyzer): add pet/product-type inputs + report container"
```

---

### Task 3: Dispatch matched results + wire the gated report module

**Files:**
- Modify: `ingredient-analyzer/index.html` — (a) one line at the end of `analyzeIngredients()` (after `scrollIntoView`, ~line 1479); (b) new `<script type="module">` before `</body>`.

- [ ] **Step 1: Dispatch the matched records.** At the end of `analyzeIngredients()`, immediately after the `scrollIntoView(...)` line, add:

```javascript
      document.dispatchEvent(new CustomEvent('watts:analysis', {
        detail: { matched: results.filter(r => r.data).map(r => r.data) }
      }));
```

- [ ] **Step 2: Add the module** just before `</body>`:

```html
<script type="module">
  import { buildReportPayload } from './js/report-generator.js';
  import { submitCapture } from './js/klaviyo-capture.js';

  const box = document.getElementById('reportCapture');

  document.addEventListener('watts:analysis', (e) => {
    const matched = e.detail.matched || [];
    if (matched.length === 0) { box.classList.add('hidden'); return; }
    const pets = document.getElementById('petType').value;
    const productType = document.getElementById('productType').value;
    const payload = buildReportPayload(matched, { productType, pets });
    renderCapture(payload);
  });

  function renderCapture(payload) {
    box.dataset.payload = JSON.stringify(payload);
    box.innerHTML = `
      <div style="border:1px solid var(--border,#ddd);border-radius:12px;padding:20px;background:#fafafa;">
        <h3 style="margin:0 0 6px;">${payload.recommendation.headline}</h3>
        <p style="margin:0 0 14px;color:var(--muted,#666);">Get your ${payload.pets}'s full report — what these ingredients mean together${payload.product_type === 'food' ? ', what\\'s missing,' : ''} and what to do next. We\\'ll email it to you.</p>
        <form id="reportForm" style="display:flex;gap:8px;flex-wrap:wrap;">
          <input type="email" id="reportEmail" required placeholder="Email address" style="flex:1;min-width:220px;padding:10px;border:1px solid #ccc;border-radius:8px;">
          <button type="submit" style="padding:10px 18px;border:0;border-radius:8px;background:var(--brand-orange,#c03800);color:#fff;font-weight:600;cursor:pointer;">Email my report</button>
        </form>
        <p id="reportMsg" style="margin:10px 0 0;font-size:14px;"></p>
      </div>`;
    box.classList.remove('hidden');
    document.getElementById('reportForm').addEventListener('submit', onSubmit);
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    const payload = JSON.parse(box.dataset.payload);
    const email = document.getElementById('reportEmail').value.trim();
    const msg = document.getElementById('reportMsg');
    msg.textContent = 'Sending…';
    const res = await submitCapture({
      email, pets: payload.pets, productType: payload.product_type,
      competitorSupplement: payload.competitor_supplement, reportPayload: payload,
    });
    msg.textContent = res.ok
      ? 'Done — check your inbox for your report.'
      : 'Something went wrong. Please try again.';
    if (res.ok) document.getElementById('reportForm').style.display = 'none';
  }
</script>
```

- [ ] **Step 3: Browser smoke-test** (manual — no headless browser available):
  - Serve locally: `python3 -m http.server 8000` from repo root; open `http://localhost:8000/ingredient-analyzer/`.
  - Paste an ingredient list, pick Dog + Food, Analyze → the gated report block appears with the branch headline.
  - Submit a test email → "check your inbox" message; verify in Klaviyo the profile got `pets`/`analyzing_product_type`/`lead_source` and a "Requested Ingredient Report" event fired.

- [ ] **Step 4: Commit**

```bash
git add ingredient-analyzer/index.html
git commit -m "feat(analyzer): dispatch matched results + gated report capture module"
```

---

## Self-Review

**Spec coverage (Plan 2 scope):**
- §4 capture UX (Dog/Cat + Food/Treat/Supplement inputs, gated synthesis, email-only) → Tasks 2–3 ✓
- §6 Klaviyo client posting (profile + list + event with report_payload) → Task 1 ✓
- §14 event carries full `report_payload` (Gemini seam) → Task 1 test "carries the full report_payload" ✓
- No private key in browser; company_id only → Task 1 constants ✓

**Placeholder scan:** none — full code in every step. DOM tasks have a manual smoke-test (no headless browser) rather than a fake unit test.

**Type consistency:** `buildReportPayload` (Plan 1) → `payload`; `submitCapture` args (`email,pets,productType,competitorSupplement,reportPayload`) match the module signature (Task 1) and the module call site (Task 3). `payload.product_type`/`payload.competitor_supplement` match Plan 1's contract. ✓
