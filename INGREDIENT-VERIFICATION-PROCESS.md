# Ingredient Content Verification Process

## Critical Safety Principle

**Dog health and safety depends on accurate information. When in doubt, omit or qualify the claim.**

Every nutritional claim, health statement, and dosing guideline must be verified against authoritative sources. Fabricated studies, estimated percentages, or unverified medical advice could harm dogs.

---

## Tier 1: Required Verification Sources (Must Use)

### 1. Nutritional Data
**Source:** USDA FoodData Central (https://fdc.nal.usda.gov/)
- Use for: Macronutrients, vitamins, minerals per 100g
- How to verify: Search ingredient name, extract data from official USDA entry
- Format citations: "~XX mg per 100g (USDA data)"
- Use approximations (~) to account for natural variation

**Example (Verified):**
```json
"vitaminA": "~12,340 IU per 100g (USDA data)",
"iron": "~4.9-6.5mg per 100g (USDA data)"
```

### 2. Veterinary Medical Information
**Sources:**
- VCA Animal Hospitals (https://vcahospitals.com/)
- Merck Veterinary Manual (https://www.merckvetmanual.com/)
- Peer-reviewed veterinary journals (PubMed, PMC)

**Use for:** Safety limits, toxicity information, contraindications, dosing
**Must include:** Direct URL to source in citations array

**Example (Verified):**
```json
"concernsExpanded": {
  "detailed": "According to VCA Animal Hospitals, liver should constitute no more than 5% of a dog's diet..."
}
```

### 3. Regulatory/Standards Bodies
**Sources:**
- AAFCO (https://www.aafco.org/)
- FDA/CVM
- European Pet Food Industry Federation (FEDIAF)

**Use for:** Definitions, standards, regulatory status

---

## Tier 2: Allowed with Qualification

### General Nutritional Principles
**Language to use:**
- "generally considered"
- "typically"
- "research suggests"
- "often"
- "approximately"

**Examples:**
- ✅ "Animal-source nutrients are generally highly bioavailable"
- ✅ "Freeze-drying typically preserves nutrients well"
- ❌ "Freeze-drying preserves 95-98% of nutrients" (unless you have a study proving this exact percentage)

### Processing Information
**Source:** Industry standards, manufacturer data
**Language:** Qualify with "typically", "generally", "often"

---

## Tier 3: Never Include Without Verification

### ❌ FORBIDDEN: Fabricated Studies
- Never cite "Journal of Animal Science, 2019" unless you have the actual study
- Never cite "Comparative Nutrition Study, 2021" generically
- Never invent study findings

### ❌ FORBIDDEN: Specific Bioavailability Percentages
- Don't claim "70-90% bioavailability vs 20-40%" without a cited study
- Don't claim "absorbs at 15-35% vs 2-20%" without verification
- General statements about "higher bioavailability" are acceptable

### ❌ FORBIDDEN: Specific Medical Dosing
- Don't recommend "1-2 ounces for 50 lb dog" unless this comes from veterinary source
- Don't claim "safe up to X amount" without verification
- Referring to veterinary guidelines (like 5% of diet) with source is OK

### ❌ FORBIDDEN: Unverified Breed-Specific Claims
- Don't claim specific breeds are predisposed to conditions without veterinary source
- Example: "Bedlington Terriers have copper storage disease" needs citation

---

## Verification Workflow for New Ingredients

### Phase 1: Data Collection
1. **Search USDA FoodData Central** for ingredient
   - Record FDC ID number
   - Extract all available nutritional data
   - Note any ranges or variations

2. **Search veterinary sources** for safety information
   - VCA Animal Hospitals
   - Merck Vet Manual
   - PubMed/PMC for peer-reviewed studies

3. **Check AAFCO** for regulatory definitions
   - Ingredient definition
   - Permitted uses
   - Any restrictions

### Phase 2: Content Writing Rules

#### What It Is / What It Is Expanded
- ✅ Use AAFCO definitions as baseline
- ✅ Describe processing methods generally
- ✅ Compare to similar ingredients (factually)
- ❌ Don't make unverified superiority claims

#### Why It's Used / Why Used Expanded
- ✅ Describe general nutritional benefits
- ✅ Use qualifying language ("typically", "generally")
- ✅ Mention bioavailability conceptually
- ❌ Don't cite specific absorption percentages without studies

#### Nutritional Profile
- ✅ Use USDA data exclusively
- ✅ Include citation reference: "(USDA data)"
- ✅ Use ranges when data varies
- ✅ Use approximations: "~XX mg"
- ❌ Don't extrapolate or estimate

#### Quality Considerations
- ✅ Discuss sourcing factors (grass-fed, organic, processing)
- ✅ Use comparative language ("typically better", "often preferred")
- ✅ Give practical label-reading advice
- ❌ Don't make absolute claims without evidence

#### Concerns Expanded
- ✅ Cite veterinary sources for safety limits
- ✅ Include URL to source in citations array
- ✅ Mention known sensitivities with qualification
- ❌ Don't list contraindications without veterinary source
- ❌ Don't recommend dosing without source

#### Scientific Evidence
- ✅ ONLY include if you have actual studies
- ✅ Include study title, journal, year, DOI/URL
- ✅ Quote findings accurately from abstract/text
- ❌ Never fabricate study names or findings
- ❌ If no verified studies exist, omit this section entirely

#### FAQs
- ✅ Answer with verified information only
- ✅ Cite sources within answers
- ✅ Use conservative language
- ✅ Defer to veterinarian when appropriate
- ❌ Don't give specific medical advice without source

### Phase 3: Citation Audit

Before finalizing any ingredient:

**Checklist:**
- [ ] Every numerical claim has a source (USDA, study, vet source)
- [ ] Every study cited actually exists (checked URL/DOI)
- [ ] Every safety limit is from veterinary source
- [ ] All URLs in citations array are valid and relevant
- [ ] No fabricated study names or dates
- [ ] Conservative language used for general claims
- [ ] No specific medical dosing without vet source

---

## Citation Format in JSON

### Correct Format:
```json
"citations": [
  {
    "title": "AAFCO Official Publication",
    "url": "https://www.aafco.org/",
    "publisher": "AAFCO"
  },
  {
    "title": "USDA FoodData Central - Beef Liver, Raw",
    "url": "https://fdc.nal.usda.gov/",
    "publisher": "USDA"
  },
  {
    "title": "Safety evaluation of vitamin A in growing dogs",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3513714/",
    "publisher": "British Journal of Nutrition, 2012"
  }
]
```

### In scientificEvidence.keyStudies:
```json
"keyStudies": [
  {
    "finding": "No adverse effects in puppies fed up to 100,000 IU vitamin A per 1,000 kcal",
    "source": "British Journal of Nutrition, 2012",
    "citationIndex": 2
  }
]
```

The `citationIndex` refers to position in citations array (0-indexed).

---

## Red Flags During Review

If you see any of these, STOP and verify:

🚩 Study cited with only year and generic journal name (no URL/DOI)
🚩 Specific percentages for bioavailability without study
🚩 Medical dosing recommendations without veterinary source
🚩 "Research shows" or "Studies prove" without actual study cited
🚩 Breed-specific medical claims without veterinary source
🚩 Nutritional data that doesn't match USDA
🚩 "A recent study found..." without specifics

---

## When Research Isn't Available

If you cannot find verified sources for a claim:

### Option 1: Qualify It
- "Anecdotally reported..."
- "Some pet owners report..."
- "Industry practices suggest..."
- "Based on general nutritional principles..."

### Option 2: Omit It
- Better to have less content than wrong content
- A shorter, accurate page is better than a longer, questionable one

### Option 3: Defer to Expert
- "Consult your veterinarian for..."
- "Work with your vet to determine..."
- "Your veterinarian can advise on..."

---

## Example: Verified vs Unverified

### ❌ WRONG (Unverified):
```
"A 2019 study in the Journal of Animal Science confirmed that organ meats
provide 70-90% bioavailability for vitamins compared to 20-40% for synthetic forms."
```
**Problem:** Can't verify this study exists, specific percentages are unverified

### ✅ CORRECT (Verified):
```
"According to USDA FoodData Central, beef liver is exceptionally nutrient-dense.
Animal-source nutrients are generally more bioavailable than synthetic alternatives,
though specific absorption rates vary by nutrient and individual factors."
```
**Why:** Uses USDA as source, makes general bioavailability claim with qualification

---

## AI-Assisted Content Generation

If using AI to draft content:

### Step 1: Draft (AI-Assisted)
- Generate initial content structure
- Create FAQ questions
- Draft explanatory text

### Step 2: Verification (Human-Required)
- Remove all unverified numerical claims
- Check every study citation (must exist)
- Replace specific percentages with qualified statements
- Add USDA data for nutritional facts
- Add veterinary source URLs for safety claims

### Step 3: Conservative Edit (Human-Required)
- Add qualifying language ("typically", "generally", "often")
- Remove absolute claims unless verified
- Ensure all medical advice defers to veterinarian
- Double-check citations array matches text

---

## Quality Assurance Checklist

Before publishing any enhanced ingredient page:

- [ ] All nutritional data sourced from USDA with citations
- [ ] All studies cited actually exist with valid URLs
- [ ] All safety limits sourced from veterinary authorities
- [ ] Conservative language used throughout
- [ ] No specific medical dosing without veterinary source
- [ ] Citations array complete and accurate
- [ ] No fabricated study names or dates
- [ ] All breed-specific claims have veterinary sources
- [ ] FAQs defer to veterinarian for medical questions
- [ ] "Consult your veterinarian" appears where appropriate

---

## Sources Reference List

### Primary Sources (Use First)
- **USDA FoodData Central:** https://fdc.nal.usda.gov/
- **AAFCO:** https://www.aafco.org/
- **VCA Animal Hospitals:** https://vcahospitals.com/
- **Merck Veterinary Manual:** https://www.merckvetmanual.com/

### Secondary Sources (Use With Verification)
- **PubMed Central (PMC):** https://pmc.ncbi.nlm.nih.gov/
- **PubMed:** https://pubmed.ncbi.nlm.nih.gov/
- **AVMA:** https://www.avma.org/
- **Pet Poison Helpline:** https://www.petpoisonhelpline.com/

### Never Use
- Generic blog posts without credentials
- Commercial pet food company marketing materials
- Social media posts
- Unverified "studies" without journal names
- Personal anecdotes presented as facts

---

## Revision History

**v1.0 - 2026-01-31**
- Initial verification process created
- Removed fabricated studies from beef-liver
- Established three-tier source hierarchy
- Created verification workflow and QA checklist
