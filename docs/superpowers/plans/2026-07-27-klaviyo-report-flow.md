# Klaviyo Report Email + Flow — Implementation Plan (Plan 3 of 3)

> Inline execution. API-buildable artifacts done by Claude; flow/segment/Welcome-Series wiring is Klaviyo-UI clicks (Claude provides exact steps — flows aren't fully creatable via API).

**Goal:** Deliver the promised report email and route it correctly: a report email template that renders from the `report_payload` event (with a `report_ai_body` Gemini fallback), the dog/cat/supplement segments, an isolated **Ingredient Report** flow triggered by the `Requested Ingredient Report` event, and the Welcome Series `pets` split + step-1 delay.

**Architecture:** The capture (Plan 2) already fires `Requested Ingredient Report` with the full `report_payload` as event properties, and subscribes to Email List `WLb5bq`. Plan 3 adds: (1) an email template referencing `{{ event.* }}` with a `{% if person.report_ai_body %}` fallback; (2) a metric-triggered flow that sends it, branching on `pets`; (3) a `pets` split + delay on the existing Welcome Series so the report lands first and cat leads get a waitlist track (retiring the Cat-People-list exclusion).

## Global Constraints
- Report email personalizes from **event** properties (metric-triggered flow): `{{ event.recommendation.headline }}`, `{{ event.flagged_gaps }}`, `{{ event.good_count }}`, `{{ event.pets }}`, `{{ event.recommendation.body_key }}`, `{{ event.flagged_additives }}`.
- **Gemini seam (spec §14):** template wraps content in `{% if person.report_ai_body %}{{ person.report_ai_body }}{% else %}…deterministic…{% endif %}`.
- **Honesty:** the `treat` branch never implies deficiency.
- Metric name exactly `Requested Ingredient Report`; master list `WLb5bq`.

---

### Task 1 (Claude, API): Create the report email template
Create via `POST /api/templates/` (private key, revision 2024-10-15). HTML branches on `event.recommendation.body_key` and includes the `person.report_ai_body` fallback. Verify a 201 and record the template id.

### Task 2 (UI): Create segments
In Audiences → Segments → Create:
- **Dog owners** — `pets` equals `dog`
- **Cat owners** — `pets` equals `cat`
- **Supplement comparison-shoppers** — `analyzing_product_type` equals `supplement`
(2-click property conditions; more reliable in-UI than via the segment-definition API.)

### Task 3 (UI): Build the "Ingredient Report" flow
- Flows → Create flow → blank. Name: **Ingredient Report**.
- Trigger: **Metric** → `Requested Ingredient Report`.
- Add a **Conditional split**: `event.pets` equals `dog` (or profile `pets` equals `dog`).
  - **Dog branch:** Email action → use template "Ingredient Report — v1" (Task 1). Send with no delay (it's the deliverable).
  - **Cat branch:** Email action → same template (the template self-branches to the cat waitlist copy), OR a short cat-specific email.
- Turn the flow **Live** only after the browser smoke-test (Plan 2 Task 3).

### Task 4 (UI): Welcome Series `pets` split + delay + tidy
- Open **Welcome Series** (trigger: Added to List).
- Add a **Time delay** of ~4–24h on the first step (so the report email lands first).
- Add a **Conditional split** on `pets`:
  - `dog` (or unset) → existing nurture.
  - `cat` → short waitlist track ("cat product coming — you're first in line"); no dog-product pitch. This **retires the Cat-People-list exclusion**.
- **Archive** the 3 unconfigured "Essential Flow Recommendation" draft flows.

---

## Self-Review
- §7 isolated report flow + clean pets-only Welcome Series → Tasks 3–4 ✓
- §8 report email (branching, honest) → Task 1 ✓
- §14 `report_ai_body` fallback seam → Task 1 template ✓
- Segments for targeting → Task 2 ✓
- Flows not API-creatable → Tasks 2–4 are precise UI checklists (not fake tests) ✓
