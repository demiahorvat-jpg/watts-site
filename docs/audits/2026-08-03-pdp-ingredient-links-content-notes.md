# Content notes from the PDP ingredient-card linking pass

**Date:** 2026-08-03
**Context:** Added "Read more" links to the ingredient slider cards on the Better Dailies
PDP. Assessing link targets surfaced a set of content problems worth fixing separately.

Ordered by value, not by effort.

---

## 1. No article exists for the claim the Beef card actually makes

The Grass-Fed Beef card says *"Air-dried grass-fed beef forms the foundation of Watts…
a protein-first base."* Nothing on the site covers air-dried grass-fed beef. The three
candidates were all near-misses:

| candidate | why it doesn't fit |
|---|---|
| `blog/beef-liver-for-dogs.html` | about liver, not muscle meat (still the best of the three) |
| `blog/organ-based-nutrition-for-dogs.html` | about heart/kidney/spleen |
| `ingredient-analyzer/ingredients/beef/` | about generic beef in pet food — and see §2 |

**Action:** write the missing page. Air-drying vs freeze-drying vs kibble extrusion,
why grass-fed matters, what "protein-first" means on a label. This is also the natural
landing page for food-topper framing, which is where the search volume actually is
(see §6).

---

## 2. The beef ingredient-analyzer page argues against the product

`ingredient-analyzer/ingredients/beef/` states, more than once:

> "beef is the most common food allergen in dogs"
> "If your pet has skin or digestive issues, beef is worth ruling out"
> "a less suitable choice for pets with known food sensitivities"

That's the correct editorial stance for an impartial analyzer and the reason this page
should **not** be linked from the PDP — it hands a buyer a reason not to buy.

**Action:** don't soften the analyzer; its credibility is the point. Instead add a
short distinction between *generic beef in commercial pet food* and *whole air-dried
grass-fed beef*, which is a real nutritional difference and currently isn't drawn
anywhere. Then the honest allergen caveat sits next to relevant context.

---

## 3. EpiCor and Yeast Fermentate are two articles about one topic

| page | words | impressions (90d) | position |
|---|---|---|---|
| `blog/yeast-fermentate-for-dogs.html` | 3,932 | 3 | 17.3 |
| `blog/epicor-for-dogs.html` | 1,903 | 0 | — |

The site's own internal linking already treats yeast fermentate as the hub: the EpiCor
article links out to it *and* to the yeast-fermentate ingredient page, while the yeast
fermentate article mentions EpiCor exactly once and never links to it.

**Action:** consolidate. Fold the EpiCor material into the yeast fermentate article and
301 `epicor-for-dogs.html` to it. Two thin, overlapping pages split what little
authority exists; one strong page concentrates it.

---

## 4. The Yeast Fermentate card promises EpiCor, the article barely mentions it

Card label: *"Gut + immune support, powered by EpiCor®"*. The article a reader lands on
names EpiCor once, in passing.

**Action:** add a paragraph near the top of the yeast fermentate article establishing
EpiCor as the branded, clinically-studied form of yeast fermentate, and that it's what
Watts uses. Closes the card→article gap and does the §3 consolidation work at the same
time.

---

## 5. Store → blog linking is the underserved direction

Measured 2026-08-03:

- **Blog → store: saturated.** Every sampled page links to Better Dailies 4 times.
- **Store → blog: 3 links total**, all to the `/blog/` index.

This matters because the store holds essentially all the site's authority —
`wattspet.com/` ranks position 4 and takes 238 of 249 total clicks — while the content
sits at average position 78.3. Links from store to blog pass real authority; links back
pass almost none, because the source pages have none to give.

**Action:** the PDP card links are the right first move. Extend to the store nav, the
About page, and any product-adjacent copy. Note this redistributes authority rather than
creating it — the binding constraint is external backlinks, and the subdomain boundary
weakens the effect further.

---

## 6. The content targets ingredient names, which nobody searches

The deeper problem behind §1–§5.

| query | impressions (90d) |
|---|---|
| "best dog food for pancreatitis" + variants (VetLens data) | ~74,768 |
| "astaxanthin for dogs" | 64 |
| "postbiotics for dogs" | 51 |
| "enterococcus faecium for cats" | 54 (position 70) |

Watts non-branded search: **557 impressions, 1 click, average position 78.3.** Across
the VetLens property, genuine supplement-intent queries account for 0.026% of all
impressions — and VetLens already ranks #1–3 for most of them.

The ingredient-led positioning (EpiCor, Wellmune, Zanthin) is the most
evidence-defensible story and has almost no demand attached to it. Being right about
postbiotics doesn't help when 51 people a quarter type the word.

**Action:** Better Dailies is an air-dried meat and organ topper, which sits much closer
to *food* queries than *supplement* queries. Reframe toward "food topper for dogs with
sensitive stomachs", "what to add to dog food for a picky eater", "best food topper for
senior dogs". Re-pointing existing pages is far cheaper than writing new ones — there
are 462 well-written pages aimed at the wrong terms.

---

## 7. Smaller items

- **Link to `wattspet.com/blog/...`, not `learn.wattspet.com/...`** in PDP cards. It
  301s to the same page but keeps the link on the primary domain.
- **`/blog/` index ranks position 30 with 403 impressions and 0 clicks** — the single
  highest-impression content URL on the property. Worth a title/meta pass.
- **Astaxanthin card has no article link yet.** Check any claims against the note that
  astaxanthin is not a shedding remedy before writing one.
- **Remaining cards without links:** Apple Cider Vinegar, Sea Salt, Antioxidant Blend.
  ACV in particular is off the conversion path and may not warrant one.
