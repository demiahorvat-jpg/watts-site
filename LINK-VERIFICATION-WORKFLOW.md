# Link Verification Workflow

## Purpose

Before incorporating any external link into ingredient pages, the user must verify:
1. The URL loads correctly
2. The content/data is accurate
3. The source is authoritative and appropriate

This prevents broken links, incorrect citations, and linking to low-quality sources.

---

## Process for Each Ingredient

### Step 1: Research & Link Collection (AI)

When researching an ingredient, I will:
1. Search for authoritative sources (USDA, veterinary, peer-reviewed)
2. Extract specific URLs
3. Note what data/claims came from each URL
4. Create a verification document

**Output:** `/tmp/[ingredient-slug]-links-for-verification.md`

### Step 2: User Verification (Human Required)

User reviews the verification document and checks each URL:

**Verification Checklist Per URL:**
- [ ] URL loads without errors
- [ ] Content matches what was cited
- [ ] Source is authoritative (USDA, .edu, .gov, peer-reviewed, established vet source)
- [ ] No paywall blocking important information
- [ ] URL is stable (not temporary/session-based)
- [ ] Data is current and accurate

**User Marks Each URL:**
- ✅ **APPROVED** - Use this URL in content and citations
- ⚠️ **APPROVED WITH CHANGES** - Use different URL or modify citation
- ❌ **REJECTED** - Do not use this URL

### Step 3: Integration (AI)

After user approval:
1. Add approved URLs to citations array in JSON
2. Insert inline citation links in content where claims are made
3. Generate page with clickable sources

---

## URL Status Tracking

### Example Format:

```markdown
### 1. USDA FoodData Central - Chicken Liver
**URL:** https://fdc.nal.usda.gov/fdc-app.html#/food-details/171058/nutrients
**Purpose:** Nutritional data
**Data Used:** Iron: ~11.6mg per 100g, Vitamin A: ~11,078 IU per 100g
**Status:** ✅ APPROVED by user on 2026-01-31
```

---

## Where Links Appear

### 1. Citations Array (Metadata)
Every external source goes in the citations array:

```json
"citations": [
  {
    "title": "USDA FoodData Central - Chicken Liver",
    "url": "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171058/nutrients",
    "publisher": "USDA"
  }
]
```

### 2. Scientific Evidence Section
Studies link directly in the key findings:

```json
"scientificEvidence": {
  "keyStudies": [
    {
      "finding": "Chicken liver contains ~11.6mg iron per 100g",
      "source": "USDA FoodData Central",
      "citationIndex": 0
    }
  ]
}
```

### 3. Inline Content Citations
In the generated HTML, claims have inline citations:

```html
<p>According to <a href="https://fdc.nal.usda.gov/..." target="_blank" rel="noopener">USDA FoodData Central</a>,
chicken liver contains approximately 11.6mg of iron per 100g.</p>
```

### 4. References Section (Optional)
At bottom of page, a references list:

```html
<h2>References</h2>
<ol>
  <li>USDA FoodData Central. <a href="https://fdc.nal.usda.gov/...">Chicken Liver Nutritional Data</a></li>
  <li>VCA Animal Hospitals. <a href="https://vcahospitals.com/...">Vitamin A Toxicosis</a></li>
</ol>
```

---

## Link Quality Standards

### ✅ Acceptable Sources

**Government/Regulatory:**
- USDA FoodData Central (fdc.nal.usda.gov)
- FDA/CVM (fda.gov)
- AAFCO (aafco.org)
- NIH/PubMed Central (pmc.ncbi.nlm.nih.gov, pubmed.ncbi.nlm.nih.gov)

**Educational Institutions:**
- University veterinary schools (.edu domains)
- Veterinary teaching hospitals

**Veterinary Authorities:**
- VCA Animal Hospitals (vcahospitals.com)
- Merck Veterinary Manual (merckvetmanual.com)
- AVMA (avma.org)
- Pet Poison Helpline (petpoisonhelpline.com)

**Peer-Reviewed Journals:**
- British Journal of Nutrition
- Journal of Animal Science
- Journal of Veterinary Internal Medicine
- Any journal indexed in PubMed

### ❌ Unacceptable Sources

- Generic pet blogs without credentials
- Commercial pet food company marketing sites
- Social media posts
- Forum posts or Q&A sites
- Sites with excessive ads or clickbait
- Paywalled content that can't be accessed
- Temporary or session-based URLs
- Sources that contradict veterinary consensus

---

## Verification Document Template

For each new ingredient, create this file:

```markdown
# [Ingredient Name] - External Links for Verification

## URLs Found During Research

### 1. [Source Name]
**URL:** [full URL]
**Purpose:** [nutritional data/safety info/study findings]
**Data Used:**
- [specific claim 1]
- [specific claim 2]

**Status:** ⬜ Needs verification
**Your verification:**
- [ ] URL loads correctly
- [ ] Data matches what we cited
- [ ] Appropriate to link to

**User Decision:** [✅ APPROVED / ⚠️ APPROVED WITH CHANGES / ❌ REJECTED]
**Notes:** [any changes needed]

---

[Repeat for each URL]
```

---

## Batch Verification

For efficiency when processing multiple ingredients:

### Option 1: Per-Ingredient Verification
- Complete research on one ingredient
- User verifies URLs
- Generate that ingredient page
- Move to next

**Pros:** Immediate feedback, catch issues early
**Cons:** More back-and-forth

### Option 2: Batch of 10
- Research 10 ingredients
- User verifies all URLs in one session
- Generate all 10 pages
- Review batch

**Pros:** More efficient, less context switching
**Cons:** Potential for systematic errors

### Option 3: Category Batch
- Research all proteins (or all vitamins, etc.)
- User verifies all URLs for that category
- Generate all pages in category

**Pros:** Similar sources per category, efficient
**Cons:** Large upfront verification task

**Recommended:** Start with Option 1 for first 5-10 ingredients to establish patterns, then move to Option 2 or 3.

---

## URL Update Process

Links can break or change over time:

### Quarterly Link Check
- Run automated link checker on all ingredient pages
- Flag any 404s or redirects
- User verifies replacement URLs
- Update JSON data and regenerate affected pages

### User-Reported Issues
If a user reports a broken link:
1. Verify link is broken
2. Search for replacement URL
3. Create verification document with new URL
4. User approves
5. Update and regenerate

---

## Special Cases

### USDA FoodData Central URLs
USDA uses FDC IDs in URLs. Example:
- Raw chicken liver: FDC ID 171058
- Raw beef liver: FDC ID 169451

**Best Practice:**
- Link to specific food detail page with FDC ID
- Verify FDC ID matches ingredient exactly
- Note raw vs cooked distinction

### PubMed/PMC Studies
- Use PMC (PubMed Central) full-text URLs when available
- Fallback to PubMed abstract if full-text paywalled
- Include PMID in citation title for findability

### Veterinary Hospital Pages
- VCA and similar sites sometimes reorganize
- Archive.org as backup if page disappears
- Screenshot key information for reference

---

## Documentation

Keep a master log of all verified URLs:

**File:** `data/verified-urls.json`

```json
{
  "beef-liver": {
    "usda": {
      "url": "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169451/nutrients",
      "verified": "2026-01-31",
      "status": "active"
    },
    "vitamin_a_safety": {
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3513714/",
      "verified": "2026-01-31",
      "status": "active"
    }
  }
}
```

This enables:
- Quick reference during content creation
- Automated link checking
- Tracking when URLs were last verified

---

## Implementation Checklist

To add external links to ingredient pages:

- [ ] Research ingredient and collect URLs
- [ ] Create verification document for user
- [ ] User verifies each URL
- [ ] Update ingredient JSON with approved URLs in citations array
- [ ] Update generation script to insert inline citation links
- [ ] Generate page with clickable sources
- [ ] User reviews final page to confirm links work
- [ ] Add to verified-urls.json log

---

## Generation Script Updates Needed

To insert inline links, the script needs to:

1. **In nutritional profile section:** Link USDA data
```javascript
`According to <a href="${citations[usdaIndex].url}" target="_blank" rel="noopener">USDA FoodData Central</a>,
${ingredient.name} contains approximately ${nutrientValue}.`
```

2. **In scientific evidence:** Link to studies
```javascript
keyStudies.forEach(study => {
  const citationUrl = ingredient.citations[study.citationIndex].url;
  return `<li>${study.finding}
    <a href="${citationUrl}" target="_blank" rel="noopener">[Source]</a></li>`;
});
```

3. **In concerns section:** Link to vet resources
```javascript
`According to <a href="${vetSourceUrl}" target="_blank" rel="noopener">VCA Animal Hospitals</a>,
liver should comprise no more than 5% of diet.`
```

4. **Add references section at end:**
```javascript
function generateReferencesSection(citations) {
  return `
    <h2>References</h2>
    <ol class="references">
      ${citations.map(cite => `
        <li><strong>${cite.title}.</strong> ${cite.publisher}.
        <a href="${cite.url}" target="_blank" rel="noopener">${cite.url}</a></li>
      `).join('')}
    </ol>
  `;
}
```
