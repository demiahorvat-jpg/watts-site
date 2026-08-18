# Blog Email Capture + Klaviyo Audience Data Model — Design

**Date:** 2026-07-27
**Status:** Draft for review
**Owner:** Watts (Demi)

## 1. Goal

Turn Watts's high-traffic-but-non-converting educational content into an **owned email audience** that Klaviyo can nurture into buyers — and do it on a **person-centric data model** that stays clean as Watts adds a cat product (early 2027) and more segments.

Two coupled deliverables:
1. **A real lead magnet on the Ingredient Analyzer** (the site's actual high-traffic tool) that maximizes email capture.
2. **A long-term Klaviyo data model** (properties + segments, not proliferating lists) so dog vs cat vs future audiences are targetable without duplicate sends or consent mess.

### Success metrics
- Analyzer email-capture rate: from **~0.1% today → 2–5%**.
- Net email-list growth rate (new subscribers/week).
- Report-email open/click; nurture-attributed revenue in Klaviyo.
- Eventually: analyzer → email → purchase conversions (visible via Klaviyo flow revenue).

## 2. Background (why this, why now)

- The blog (`learn.wattspet.com`) gets ~3,500 sessions/28d but converts ~0 directly (research-mode readers). Cross-domain tracking **is** working; blog→store visitors just don't buy on the spot.
- **The Ingredient Analyzer is the real asset: 4,356 users / 90d** — people pasting their pet's food/treat/supplement ingredient list to judge it. (The supplement quiz is dead: 13 users/90d — do **not** build on it.)
- Current email capture is a generic "Subscribe" → **0.1% capture**. No incentive, no data.
- Almost all sales to date are friends/family (launch). The strategic need is a **repeatable owned-audience engine**; email nurture off the analyzer is the cheapest, highest-leverage path.

## 3. Data model (person-centric)

**Principle:** one consented marketing list + rich **profile properties** + dynamic **segments**. A person who owns both a dog and a cat is ONE profile that qualifies for both streams — no duplicate lists.

### Lists (Klaviyo)
- **Master marketing list** = existing **"Email List"** (294 profiles). Single source of consent for email marketing. (Rename to "Marketing Subscribers" optional.)
- **Deprecate list-based species split.** The new **"Cat People"** list (5 profiles, created 2026-07-27) is migrated: set `pets = cat` on those profiles, ensure they're on the master list, then retire the list from active logic (targeting moves to a segment). SMS List, Affiliates, Preview List keep their separate purposes — untouched.

### Profile properties (set at capture)
| Property | Values | Source |
|---|---|---|
| `pets` | `dog` / `cat` / `both` | Dog/Cat toggle (multi-select-able over time) |
| `analyzing_product_type` | `food` / `treat` / `supplement` | Food/Treat/Supplement selector |
| `lead_source` | `ingredient-analyzer` (later: `blog-post`, etc.) | capture context |
| `pasted_ingredients` | array / count | analyzer input |
| `flagged_gaps` | array of categories (food only) | report generator |
| `competitor_supplement` | bool | detected when `analyzing_product_type = supplement` and ingredients ≠ Better Dailies |

Capture also fires a Klaviyo event: **"Requested Ingredient Report"** (the flow trigger).

### Segments (dynamic, derived from properties)
- **Dog owners** (`pets` contains dog) · **Cat owners** (`pets` contains cat) · **Both**
- **Supplement comparison-shoppers** (`analyzing_product_type = supplement`) — hottest leads
- **Cat-only, pre-launch** (`pets = cat` AND `pets` not contains dog) — excluded from dog-product pitches until the cat product ships
- Food analyzers / Treat analyzers (for content relevance)

## 4. Capture UX (on the Ingredient Analyzer)

**Two core tool inputs** (legitimate analysis inputs that double as data — no friction-for-data tax):
- **Dog / Cat** toggle (default Dog) → sets `pets`, and makes the analysis species-aware (some ingredients differ for cats).
- **Food / Treat / Supplement** selector → sets `analyzing_product_type`, and is essential for an accurate, on-brand report (see §5).

**Gating strategy (protects SEO, maximizes submits):**
- **Free & ungated:** the per-ingredient ratings (what it is / why used / nutritious vs filler / Watts rating). This is the SEO traffic; keep it open.
- **Gated behind email:** the **synthesis** — "your pet's full report: what these ingredients mean together, what's missing, and how to fill the gaps." Curiosity + loss-aversion ("what's my dog missing?") drives submission far harder than a discount.

**Form:** email-only + the two toggles. Everything else inferred. Placed at the **moment of value** (right after the analysis renders), not a passive sticky bar.

## 5. Report generator (rule-based — no LLM)

Assembled deterministically from the existing static DB (`data/ingredients.json`, 350+ ingredients). **No AI/Gemini** — free, instant, and no hallucination risk (critical for ingredient/health assessments and the analyzer's "no marketing spin" promise).

**Branches on `analyzing_product_type` so the pitch is honest:**
- **Food** (complete diet): "what's missing" is valid → flag absent categories against Better Dailies' pillars (e.g., omega-3, joint/UC-II, antioxidants, gut/postbiotic, immune) → *"your food covers X; a daily like Better Dailies adds Y."* **Strongest pitch.**
- **Treat:** treats are *supposed* to be incomplete — **never** say "your treat is deficient." Instead: flag fillers/additives to avoid, describe what a good treat looks like, and position Better Dailies as the separate **daily foundation**.
- **Supplement:** "missing" doesn't apply. Contrast coverage → *"this covers A/B; Better Dailies also includes C/D in sourced forms."* If Better Dailies' own branded actives are detected (Zanthin®, EpiCor, Wellmune, UC-II) → recognize it → *"you're already on a complete daily — nice."* Otherwise flag `competitor_supplement = true` (hot lead).

Also branches on `pets` (dog vs cat) for species-appropriate notes.

**Output contract (built for future LLM personalization):** the generator's canonical output is a single structured **`report_payload`** (JSON: `pets`, `product_type`, `ingredients[]` each with rating, `flagged_gaps[]`, `recommendation`) sent to Klaviyo. v1 renders the email deterministically from this payload; because data is decoupled from rendering, a future Gemini step consumes the *same* payload with zero capture rework. See §14.

## 6. Klaviyo integration

Client-side only — **same pattern the site already uses** (`klaviyo.js`, `company_id=SXFMie`, the client subscriptions API). No server, no new infra.

On submit, the analyzer JS:
1. Computes the report data from `ingredients.json`.
2. Creates/updates the Klaviyo profile with `email` + the properties in §3.
3. Fires the **"Requested Ingredient Report"** event → triggers the flow.

## 7. Klaviyo flows — architecture

**Core principle: separate the *deliverable* from the *nurture*. Branch shared flows only on durable identity (`pets`, customer vs. prospect) — NEVER on acquisition `source`.** Source is unbounded and grows with every new entry point; forking a shared flow on it produces spaghetti. Source-specific deliverables live in their own isolated flows.

**Existing flows (keep and integrate — do NOT duplicate):** Welcome Series (Added to List), Browse Abandonment, Abandoned Checkout Reminder, First Order Flow, Re-engagement, Affiliate Welcome, SMS Welcome. Archive the 3 unconfigured "Essential Flow Recommendation" drafts.

**New — "Ingredient Report" flow (the only genuinely new flow):**
- Trigger: `Requested Ingredient Report` event.
- Single purpose: immediately send the personalized report email, branched on `pets` + `analyzing_product_type` (§5). No nurture here — just the deliverable.
- Isolated: future lead magnets each get their own deliverable flow; none touch each other or the Welcome Series.

**Existing Welcome Series (keep clean, source-agnostic):**
- Trigger unchanged (Added to List) — analyzer signups already enter it, so nurture is **reused, not rebuilt**.
- Add exactly ONE conditional split, on `pets`: dog → existing dog nurture; cat → waitlist track ("cat product coming early 2027 — you're first in line," no dog-product pitch). This **retires the Cat-People-list exclusion hack**.
- Do NOT add source-based branches.
- Add a short delay on step 1 (a few hours–1 day) so the report lands first — "here's your report" then "welcome to Watts" is a clean sequence with no simultaneous double-send.

**Scalability (why this is the point):** the report lives in its own flow; the Welcome Series stays clean. A new entry point later just joins the Welcome Series (no edits). A new lead magnet later gets its own deliverable flow (no shared edits). Nothing shared ever accumulates per-source forks.

## 8. Email content

Claude writes all copy + HTML templates (property-templated; Klaviyo template loops/conditionals render "you pasted X / you're missing Y" — no AI needed). Demi reviews for brand tone. Templates created via Klaviyo API where supported; flow wiring done in the Klaviyo UI with a provided step-by-step.

## 9. Tech, cost, infra

- **Gemini/LLM: $0** — static DB, rule-based.
- **Server/infra: $0** — client-side JS + Klaviyo + GitHub Pages (as today).
- **Klaviyo:** already paid; sends included. Only future cost is a Klaviyo tier bump as the list grows past plan limits — the intended "good problem."

## 10. Compliance & tone

Honest, no disease/medical claims; consistent with the analyzer's "honest analysis, no marketing spin." The treat branch especially must not manufacture deficiencies. Product tie-ins are soft and truthful.

## 11. Scope — v1 vs later (YAGNI)

**v1 (this build):**
- Capture module on the analyzer (Dog/Cat + Food/Treat/Supplement + email).
- Rule-based report shown on-page (synthesis gated) + emailed (property-templated).
- Person-centric properties + segments; migrate Cat People (5).
- New "Ingredient Report" deliverable flow (report email only, branched on `pets` + `analyzing_product_type`); reuse the existing Welcome Series for nurture, adding just a `pets` split + a step-1 delay. Archive the 3 stray draft flows.

**Later (not now):**
- Fully dynamic email rebuild of the exact pasted-ingredient analysis.
- Contextual capture on individual blog posts (species auto-set from post).
- Competitor-supplement-specific comparison content.
- LLM (Gemini) email personalization — slots into the seams designed in §14.

## 12. Division of labor

- **Claude:** analyzer capture UI + JS (repo), report generator from JSON (repo), Klaviyo profile/event calls, email copy + HTML, create templates/segments via Klaviyo API where supported, Cat People migration.
- **Demi:** in the Klaviyo UI (Claude provides exact steps), wire the new Ingredient Report flow and add the `pets` split + step-1 delay to the existing Welcome Series; review/approve email copy + brand tone.

## 13. Assumptions & open decisions

- Keep client-side Klaviyo (no server) — assumed acceptable.
- Gate the synthesis, not per-ingredient info — assumed acceptable (preserves SEO).
- v1 email personalization = property-templated (not full dynamic) — chosen for speed.
- Blog-post capture is a later phase, not v1.
- Spec lives in the repo but is **not** committed/pushed (the repo is a public GitHub Pages site); keep internal docs out of live pushes.

## 14. Future extensibility — Gemini (LLM) email personalization

Designed-in now (cheap), built later. Three seams keep the upgrade purely additive:

1. **Structured payload as the source of truth (§5).** Capture emits the full analysis as one `report_payload` JSON to Klaviyo. Any renderer consumes it — so adding AI needs no capture changes.
2. **Render seam + graceful fallback.** The report email renders its body from a single content block. v1 = deterministic template from the payload. v2 = an optional `report_ai_body` profile property; the email uses it when present, else falls back to the template. LLM copy becomes an enhancement that can be A/B tested and fails safe.
3. **Where the Gemini call runs (future).** v1 needs no server (client JS + Klaviyo). To add AI: a lightweight serverless function (Cloudflare Worker / Vercel / Netlify) subscribes to the `Requested Ingredient Report` event via a Klaviyo webhook → calls Gemini with `report_payload` → writes `report_ai_body` back to the profile → the existing flow/email picks it up. Nothing in v1 blocks this.

Net: v1 ships deterministic and free; the Gemini upgrade drops in behind the same data + render seam without touching capture or flow structure.
