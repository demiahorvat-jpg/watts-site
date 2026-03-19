# Blog Execution Plan

Generated: March 18, 2026

Based on audit files:
- blog-page-audits-batch1-recreated.md
- blog-page-audits-batch2-recreated.md
- blog-page-audits-batch3.md
- blog-page-audits-batch4.md
- blog-page-audits-batch5.md

---

## EXECUTION_PLAN (Original Audit-Based)

### INTRO_REWRITE_QUEUE:
(none - all files marked intro_quality: GOOD in original audits)

### STRUCTURE_ADD_QUEUE:
- /blog/leaky-gut-in-dogs.html
- /blog/best-prebiotic-foods-for-dogs.html

### TONE_FIX_QUEUE:
- /blog/red-dye-40-dog-food.html
- /blog/how-pet-supplements-are-made.html

### PRODUCT_LEAKAGE_QUEUE:
- /blog/do-joint-supplements-work-for-dogs.html
- /blog/b-vitamins-for-dogs.html
- /blog/antioxidants-for-dogs.html
- /blog/zinc-for-dogs.html
- /blog/why-dogs-need-supplements.html
- /blog/vitamin-d-for-dogs.html
- /blog/dog-vitamins-deficiency.html
- /blog/what-extends-dog-lifespan.html
- /blog/choline-for-dogs.html
- /blog/human-grade-dog-treats.html
- /blog/leaky-gut-in-dogs.html
- /blog/best-prebiotic-foods-for-dogs.html
- /blog/what-is-meat-meal-dog-food.html
- /blog/how-much-liver-to-feed-dog.html
- /blog/chicken-by-products-dog-food.html
- /blog/dog-supplement-formats-compared.html
- /blog/fillers-in-dog-supplements.html
- /blog/how-to-read-dog-supplement-labels.html
- /blog/how-pet-supplements-are-made.html
- /blog/organ-based-nutrition-for-dogs.html
- /blog/puppy-vitamins.html
- /blog/senior-dog-formula-kibble.html
- /blog/spirulina-for-dogs.html

### META_DESCRIPTION_FIX_QUEUE:
- /blog/do-joint-supplements-work-for-dogs.html → too_short (117 chars)
- /blog/human-grade-dog-treats.html → too_short (108 chars)
- /blog/probiotics-for-dogs-with-diarrhea.html → too_short (105 chars)
- /blog/senior-cat-nutrition.html → too_short (114 chars)
- /blog/all-natural-dog-supplements.html → too_short (113 chars)
- /blog/large-breed-puppy-nutrition.html → too_short (104 chars)
- /blog/vitamin-a-for-cats.html → too_short (117 chars)
- /blog/antioxidants-for-cats.html → too_long (162 chars)
- /blog/astaxanthin-for-cats.html → too_long (162 chars)
- /blog/beta-glucans-for-cats.html → too_long (159 chars)
- /blog/epicor-for-cats.html → too_long (173 chars)
- /blog/how-to-read-cat-food-labels.html → too_long (159 chars)
- /blog/uc-ii-for-dogs.html → too_long (163 chars)
- /blog/protein-for-dogs.html → too_long (158 chars)

### FOOTER_MIGRATION_QUEUE:
- /blog/leaky-gut-in-dogs.html
- /blog/best-prebiotic-foods-for-dogs.html
- /blog/prebiotics-for-cats.html
- /blog/beta-glucans-for-cats.html
- /blog/cat-digestive-issues.html
- /blog/immune-support-for-cats.html
- /blog/vitamins-for-cat-immune-system.html

### SKIP_QUEUE:
- /blog/digestive-enzymes-for-dogs.html → no issues flagged
- /blog/joint-supplements-for-dogs.html → no issues flagged
- /blog/whole-food-vs-synthetic-nutrients.html → no issues flagged
- /blog/omega-3-fish-oil-for-dogs.html → no issues flagged
- /blog/dog-skin-coat-supplements.html → no issues flagged
- /blog/gut-health-for-dogs.html → no issues flagged
- /blog/collagen-for-dogs-benefits.html → no issues flagged
- /blog/calming-supplements-for-dogs.html → no issues flagged
- /blog/boswellia-for-dogs.html → no issues flagged
- /blog/green-lipped-mussel-for-dogs.html → no issues flagged
- /blog/active-working-dog-nutrition.html → no issues flagged
- /blog/melatonin-for-dogs.html → no issues flagged
- /blog/bone-broth-for-dogs.html → no issues flagged
- /blog/yeast-fermentate-for-dogs.html → no issues flagged
- /blog/dog-anal-gland-diet.html → no issues flagged
- /blog/astaxanthin-for-dogs.html → no issues flagged
- /blog/epicor-for-dogs.html → no issues flagged
- /blog/yeast-beta-glucan-for-dogs.html → no issues flagged
- /blog/can-dogs-take-human-supplements.html → no issues flagged
- /blog/food-thickeners-gums-in-dog-food.html → no issues flagged
- /blog/dog-vs-human-nutrition.html → no issues flagged
- /blog/probiotic-supplement-for-dogs.html → no issues flagged
- /blog/pregnant-nursing-dog-nutrition.html → no issues flagged
- /blog/beef-liver-for-dogs.html → no issues flagged
- /blog/omega-3-for-cats.html → no issues flagged
- /blog/probiotics-for-cats.html → no issues flagged
- /blog/probiotics-for-dogs.html → no issues flagged
- /blog/protein-requirements-cats.html → no issues flagged
- /blog/spirulina-for-cats.html → no issues flagged
- /blog/taurine-for-cats.html → no issues flagged
- /blog/uc-ii-for-cats.html → no issues flagged
- /blog/arachidonic-acid-for-cats.html → no issues flagged
- /blog/immune-support-for-dogs.html → no issues flagged
- /blog/natural-glucosamine-sources-for-dogs.html → no issues flagged
- /blog/uc-ii-vs-glucosamine-for-dogs.html → no issues flagged
- /blog/vitamin-a-supplement.html → no issues flagged

### COVERAGE_CHECK:
- total_files_in_audits: 76
- unique_files_queued_or_skipped: 76
- missing_files: 0
- duplicate_files: 0

---

## INTRO_REWRITE_QUEUE_STRICT

Strict criteria applied:
- First sentence must directly answer a specific user question
- Must include a concrete detail (number, definition, or mechanism)
- Must contain no rhetorical or argumentative framing
- Fails if first paragraph contains: "most", "many", "the truth", "industry", "misconception", or strong opinion before explanation

**54 files FAIL strict criteria:**

- /blog/digestive-enzymes-for-dogs.html → contains "Most"
- /blog/do-joint-supplements-work-for-dogs.html → contains "industry"
- /blog/b-vitamins-for-dogs.html → contains "most"
- /blog/antioxidants-for-dogs.html → contains "most"
- /blog/whole-food-vs-synthetic-nutrients.html → contains "Most"
- /blog/zinc-for-dogs.html → contains "most" and "many"
- /blog/why-dogs-need-supplements.html → contains "Most"
- /blog/vitamin-d-for-dogs.html → contains "most" and "misconceptions"
- /blog/dog-vitamins-deficiency.html → argumentative framing
- /blog/gut-health-for-dogs.html → no direct answer
- /blog/collagen-for-dogs-benefits.html → contains "most"
- /blog/calming-supplements-for-dogs.html → rhetorical framing
- /blog/dog-skin-coat-supplements.html → no direct answer
- /blog/what-extends-dog-lifespan.html → contains "most"
- /blog/boswellia-for-dogs.html → contains "most" (twice)
- /blog/green-lipped-mussel-for-dogs.html → contains "most"
- /blog/active-working-dog-nutrition.html → rhetorical/narrative framing
- /blog/choline-for-dogs.html → contains "most"
- /blog/bone-broth-for-dogs.html → "for good reason" (argumentative)
- /blog/dog-anal-gland-diet.html → contains "Most"
- /blog/human-grade-dog-treats.html → contains "most", "industry", "The truth is"
- /blog/astaxanthin-for-dogs.html → contains "most"
- /blog/epicor-for-dogs.html → subjective framing ("more interesting")
- /blog/what-is-meat-meal-dog-food.html → rhetorical framing
- /blog/how-much-liver-to-feed-dog.html → contains "most"
- /blog/yeast-beta-glucan-for-dogs.html → contains "most"
- /blog/chicken-by-products-dog-food.html → rhetorical/opinion framing
- /blog/can-dogs-take-human-supplements.html → rhetorical framing
- /blog/dog-supplement-formats-compared.html → contains "The truth is"
- /blog/fillers-in-dog-supplements.html → rhetorical framing
- /blog/how-to-read-dog-supplement-labels.html → contains "Most"
- /blog/food-thickeners-gums-in-dog-food.html → contains "Most"
- /blog/probiotic-supplement-for-dogs.html → rhetorical framing
- /blog/how-pet-supplements-are-made.html → contains "Most"
- /blog/beef-liver-for-dogs.html → strong opinion/argumentative framing
- /blog/omega-3-for-cats.html → rhetorical framing
- /blog/organ-based-nutrition-for-dogs.html → rhetorical/narrative framing
- /blog/prebiotics-for-cats.html → contains "most"
- /blog/probiotics-for-cats.html → contains "most"
- /blog/probiotics-for-dogs.html → contains "most"
- /blog/senior-cat-nutrition.html → contains "industry", "myths"
- /blog/senior-dog-formula-kibble.html → contains "Most"
- /blog/spirulina-for-cats.html → "for good reason" (argumentative)
- /blog/spirulina-for-dogs.html → contains "most"
- /blog/antioxidants-for-cats.html → rhetorical framing
- /blog/arachidonic-acid-for-cats.html → contains "Most"
- /blog/beta-glucans-for-cats.html → contains "most"
- /blog/cat-digestive-issues.html → contains "most"
- /blog/how-to-read-cat-food-labels.html → opinion/argumentative framing
- /blog/immune-support-for-cats.html → rhetorical framing
- /blog/immune-support-for-dogs.html → contains "industry"
- /blog/natural-glucosamine-sources-for-dogs.html → contains "most"
- /blog/vitamin-a-for-cats.html → rhetorical framing
- /blog/vitamin-a-supplement.html → contains "most"

**22 files PASS strict criteria:**

- /blog/joint-supplements-for-dogs.html → Quick Answer with concrete glucosamine/chondroitin detail
- /blog/melatonin-for-dogs.html → directly answers dosage question with weight table
- /blog/omega-3-fish-oil-for-dogs.html → direct answer: "whole fatty fish 2-3 times per week"
- /blog/yeast-fermentate-for-dogs.html → direct definition with 50-200mg/10lbs dosing
- /blog/leaky-gut-in-dogs.html → direct definition with mechanism
- /blog/best-prebiotic-foods-for-dogs.html → direct definition
- /blog/red-dye-40-dog-food.html → direct statement with definition
- /blog/dog-vs-human-nutrition.html → direct factual statement
- /blog/pregnant-nursing-dog-nutrition.html → direct statement
- /blog/probiotics-for-dogs-with-diarrhea.html → direct answer with strain-specific detail
- /blog/protein-for-dogs.html → direct statement
- /blog/protein-requirements-cats.html → direct factual statement
- /blog/puppy-vitamins.html → direct statement
- /blog/taurine-for-cats.html → direct statement with essential amino acid definition
- /blog/all-natural-dog-supplements.html → direct answer: "not a regulated term"
- /blog/astaxanthin-for-cats.html → direct definition with pigment mechanism
- /blog/epicor-for-cats.html → direct definition as postbiotic
- /blog/large-breed-puppy-nutrition.html → direct statement with 50-60 lbs concrete detail
- /blog/uc-ii-for-dogs.html → direct definition with 40mg dose, 60-90 day timeline
- /blog/uc-ii-for-cats.html → direct definition with mechanism and dosing
- /blog/uc-ii-vs-glucosamine-for-dogs.html → direct comparison statement
- /blog/vitamins-for-cat-immune-system.html → direct statement about unique requirements

---

## TABLE PRESENCE (for STRUCTURE_ADD_QUEUE_STRICT)

Files WITH tables (55 files have at least one <table> element):
- pregnant-nursing-dog-nutrition.html: 3 tables
- omega-3-fish-oil-for-dogs.html: 7 tables
- chicken-by-products-dog-food.html: 2 tables
- green-lipped-mussel-for-dogs.html: 3 tables
- vitamin-a-supplement.html: 3 tables
- how-pet-supplements-are-made.html: 2 tables
- gut-health-for-dogs.html: 3 tables
- active-working-dog-nutrition.html: 2 tables
- puppy-vitamins.html: 3 tables
- spirulina-for-dogs.html: 3 tables
- epicor-for-dogs.html: 2 tables
- yeast-fermentate-for-dogs.html: 3 tables
- astaxanthin-for-dogs.html: 2 tables
- probiotics-for-dogs-with-diarrhea.html: 3 tables
- food-thickeners-gums-in-dog-food.html: 1 table
- probiotics-for-cats.html: 2 tables
- senior-dog-formula-kibble.html: 1 table
- uc-ii-for-dogs.html: 3 tables
- dog-skin-coat-supplements.html: 3 tables
- probiotics-for-dogs.html: 2 tables
- whole-food-vs-synthetic-nutrients.html: 1 table
- vitamin-a-for-cats.html: 3 tables
- uc-ii-for-cats.html: 3 tables
- probiotic-supplement-for-dogs.html: 1 table
- how-to-read-cat-food-labels.html: 3 tables
- boswellia-for-dogs.html: 3 tables
- digestive-enzymes-for-dogs.html: 6 tables
- calming-supplements-for-dogs.html: 2 tables
- spirulina-for-cats.html: 1 table
- b-vitamins-for-dogs.html: 1 table
- immune-support-for-dogs.html: 1 table
- arachidonic-acid-for-cats.html: 2 tables
- epicor-for-cats.html: 1 table
- antioxidants-for-cats.html: 2 tables
- taurine-for-cats.html: 1 table
- astaxanthin-for-cats.html: 2 tables
- all-natural-dog-supplements.html: 2 tables
- omega-3-for-cats.html: 1 table
- melatonin-for-dogs.html: 4 tables
- protein-requirements-cats.html: 1 table
- dog-anal-gland-diet.html: 2 tables
- can-dogs-take-human-supplements.html: 2 tables
- what-is-meat-meal-dog-food.html: 1 table
- bone-broth-for-dogs.html: 2 tables
- yeast-beta-glucan-for-dogs.html: 2 tables
- dog-vitamins-deficiency.html: 1 table
- choline-for-dogs.html: 2 tables
- uc-ii-vs-glucosamine-for-dogs.html: 4 tables
- red-dye-40-dog-food.html: 3 tables
- protein-for-dogs.html: 6 tables
- antioxidants-for-dogs.html: 2 tables
- joint-supplements-for-dogs.html: 2 tables
- how-much-liver-to-feed-dog.html: 1 table
- fillers-in-dog-supplements.html: 1 table
- do-joint-supplements-work-for-dogs.html: 1 table

Files WITHOUT tables (21 files - need manual verification for decision checklists):
- zinc-for-dogs.html
- why-dogs-need-supplements.html
- vitamin-d-for-dogs.html
- collagen-for-dogs-benefits.html
- what-extends-dog-lifespan.html
- human-grade-dog-treats.html
- leaky-gut-in-dogs.html
- best-prebiotic-foods-for-dogs.html
- dog-supplement-formats-compared.html
- how-to-read-dog-supplement-labels.html
- dog-vs-human-nutrition.html
- beef-liver-for-dogs.html
- organ-based-nutrition-for-dogs.html
- prebiotics-for-cats.html
- senior-cat-nutrition.html
- beta-glucans-for-cats.html
- cat-digestive-issues.html
- immune-support-for-cats.html
- large-breed-puppy-nutrition.html
- natural-glucosamine-sources-for-dogs.html
- vitamins-for-cat-immune-system.html

---

## STRUCTURE_ADD_QUEUE_STRICT

Strict criteria applied:
- Must have comparison table, dosage table, OR decision checklist
- Bulleted lists do NOT count
- Verified all 21 no-table files for decision checklists - none found

**21 files FAIL strict criteria (no tables AND no decision checklists):**

- /blog/zinc-for-dogs.html
- /blog/why-dogs-need-supplements.html
- /blog/vitamin-d-for-dogs.html
- /blog/collagen-for-dogs-benefits.html
- /blog/what-extends-dog-lifespan.html
- /blog/human-grade-dog-treats.html
- /blog/leaky-gut-in-dogs.html
- /blog/best-prebiotic-foods-for-dogs.html
- /blog/dog-supplement-formats-compared.html
- /blog/how-to-read-dog-supplement-labels.html
- /blog/dog-vs-human-nutrition.html
- /blog/beef-liver-for-dogs.html
- /blog/organ-based-nutrition-for-dogs.html
- /blog/prebiotics-for-cats.html
- /blog/senior-cat-nutrition.html
- /blog/beta-glucans-for-cats.html
- /blog/cat-digestive-issues.html
- /blog/immune-support-for-cats.html
- /blog/large-breed-puppy-nutrition.html
- /blog/natural-glucosamine-sources-for-dogs.html
- /blog/vitamins-for-cat-immune-system.html

**55 files PASS strict criteria (have at least one table):**
(see TABLE PRESENCE section above for full list with table counts)

---

## STRUCTURE_ADD_QUEUE_FINAL

Filtered from STRUCTURE_ADD_QUEUE_STRICT (21 files) to only include pages where adding structure would meaningfully improve usability.

**Inclusion criteria:**
- Page involves comparison (A vs B, options, formats)
- Page involves dosage or quantity
- Page involves decision-making (what to choose, how to evaluate)

**Exclusion criteria:**
- Page is purely explanatory (definition or concept)
- Structure would repeat existing content
- No clear user action is implied

**10 files INCLUDED:**

- /blog/dog-supplement-formats-compared.html → comparison (powder vs chews vs liquid)
- /blog/how-to-read-dog-supplement-labels.html → decision framework (how to evaluate)
- /blog/best-prebiotic-foods-for-dogs.html → comparison (which prebiotic foods to choose)
- /blog/natural-glucosamine-sources-for-dogs.html → comparison (shellfish vs bone broth vs cartilage)
- /blog/organ-based-nutrition-for-dogs.html → comparison + dosage (liver vs heart vs kidney, amounts)
- /blog/beef-liver-for-dogs.html → dosage (how much to feed by weight)
- /blog/collagen-for-dogs-benefits.html → comparison (bone broth vs supplements)
- /blog/prebiotics-for-cats.html → comparison (which prebiotic sources work best)
- /blog/immune-support-for-cats.html → decision framework (what works vs what doesn't)
- /blog/large-breed-puppy-nutrition.html → requirements (calcium 0.8-1.2%, growth rate decisions)

**11 files EXCLUDED:**

- /blog/zinc-for-dogs.html → purely explanatory (what zinc does, deficiency signs)
- /blog/why-dogs-need-supplements.html → purely explanatory (why supplements matter)
- /blog/vitamin-d-for-dogs.html → purely explanatory (myth-busting, no decision)
- /blog/what-extends-dog-lifespan.html → purely explanatory (longevity science)
- /blog/human-grade-dog-treats.html → definitional (what the term means)
- /blog/leaky-gut-in-dogs.html → condition explanation
- /blog/dog-vs-human-nutrition.html → explanatory comparison (no user action)
- /blog/senior-cat-nutrition.html → purely explanatory (what changes with age)
- /blog/beta-glucans-for-cats.html → single ingredient explanation
- /blog/cat-digestive-issues.html → condition explanation
- /blog/vitamins-for-cat-immune-system.html → purely explanatory (requirements overview)
