# Cat Health Content Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create the foundational cat health content: hub page + 2 pillar guides (Immune Health, Gut Health) + 6-8 supporting blog posts.

**Architecture:** Hub page links to pillar guides. Each pillar guide has 3-4 clustered blog posts targeting specific search queries. All content follows brand voice guide and is fully SEO-optimized.

**Key References:**
- Brand voice: `docs/brand-voice-guide.md`
- Design doc: `docs/plans/2026-03-09-cat-health-content-design.md`
- Template structure: `guides/dog-immune-system.html` (for HTML structure)
- Blog template: `blog/probiotics-for-cats.html` (for blog structure)

**Content Standards:**
- Cats are the main character (NO dog comparisons)
- Health supplement positioning (not nutritional supplement)
- Biology-first, not ingredient-first
- Direct claims when evidence supports (no "may help")
- Use "quality" not "premium", "use" not "utilize"

---

## Task 1: Keyword Research for All Phase 1 Content

**Deliverable:** Keyword map for hub page, 2 guides, and 6-8 blog posts

**Step 1: Research hub page keywords**
- Primary: "cat health" related terms
- Search volume, competition, intent analysis

**Step 2: Research Feline Immune Health guide keywords**
- Primary: "cat immune system", "immune support for cats"
- Secondary: related long-tail queries
- Identify 3-4 blog post opportunities from research

**Step 3: Research Cat Gut Health guide keywords**
- Primary: "cat gut health", "cat digestive health", "cat microbiome"
- Secondary: related long-tail queries
- Identify 3-4 blog post opportunities from research

**Step 4: Document keyword map**
Create `docs/plans/cat-content-keywords.md` with:
- Target keyword for each piece
- Search volume estimate
- Competition level
- Search intent
- Related keywords to include

**Step 5: Commit keyword research**
```bash
git add docs/plans/cat-content-keywords.md
git commit -m "Add keyword research for cat health Phase 1 content"
```

---

## Task 2: Cat Health Hub Page

**Files:**
- Create: `guides/cat-health.html`

**Step 1: Create outline**
Sections:
- Hero: What makes cats unique (obligate carnivore biology)
- The 6 pillars of cat health (overview cards linking to guides)
- Why health matters more than nutrition alone
- Watts approach to cat health

**Step 2: Write hub page content**
- ~800-1000 words
- Framework/positioning piece, not comprehensive
- Links to pillar guides (even if not yet created)
- Brand voice compliant

**Step 3: Build HTML page**
- Copy structure from existing guide
- Update all meta tags, OG tags, schema
- Primary keyword in title, H1, meta description
- Proper heading hierarchy

**Step 4: SEO optimization checklist**
- [ ] Title tag < 60 chars with primary keyword
- [ ] Meta description < 155 chars with keyword + CTA
- [ ] H1 matches search intent
- [ ] Internal links to existing cat content
- [ ] Schema markup (WebPage)

**Step 5: Brand voice review**
- [ ] No dog comparisons
- [ ] No "may help" hedging
- [ ] No "premium", "utilize", "pet parent"
- [ ] Confident, direct tone

**Step 6: Commit**
```bash
git add guides/cat-health.html
git commit -m "Add cat health hub page"
```

---

## Task 3: Feline Immune Health Guide

**Files:**
- Create: `guides/cat-immune-system.html`

**Step 1: Research feline immune system**
Topics to cover:
- How the cat immune system works (innate vs adaptive)
- Key immune organs in cats (thymus, spleen, lymph nodes, gut)
- What supports feline immune function
- What compromises it
- Life stage considerations (kittens, seniors)
- Signs of immune dysfunction
- Evidence-based support approaches

**Step 2: Create detailed outline**
- Introduction (why immune health matters for cats)
- How the Feline Immune System Works
- The Gut-Immune Connection in Cats
- Nutrients That Support Cat Immunity
- What Weakens Cat Immune Function
- Supporting Immune Health by Life Stage
- Signs Your Cat's Immune System Needs Support
- FAQs (for schema markup)

**Step 3: Write guide content**
- 3000-4000 words
- Cite research where appropriate
- Include practical takeaways
- Brand voice compliant

**Step 4: Build HTML page**
- Use `guides/dog-immune-system.html` as structural template
- Update all content, meta tags, schema
- Add FAQ schema markup
- Add BreadcrumbList schema

**Step 5: SEO optimization**
- [ ] Title tag optimized for primary keyword
- [ ] Meta description with keyword + value prop
- [ ] H2s include secondary keywords naturally
- [ ] Internal links to related cat content
- [ ] External links to research (nofollow where appropriate)

**Step 6: Quality review**
- [ ] Scientifically accurate
- [ ] Brand voice compliant
- [ ] Better than current #1 ranking content
- [ ] No dog comparisons

**Step 7: Commit**
```bash
git add guides/cat-immune-system.html
git commit -m "Add feline immune health guide"
```

---

## Task 4: Cat Gut Health Guide

**Files:**
- Create: `guides/cat-gut-health.html`

**Step 1: Research feline gut health**
Topics to cover:
- Feline digestive system anatomy
- Cat microbiome (what we know)
- Gut-immune connection
- Gut-brain axis in cats
- Common digestive issues (IBD, food sensitivities, constipation)
- What supports gut health in cats
- Probiotics, prebiotics, postbiotics for cats

**Step 2: Create detailed outline**
- Introduction
- How the Feline Digestive System Works
- The Cat Microbiome
- Gut-Immune Connection
- Common Digestive Issues in Cats
- What Supports Cat Gut Health
- Probiotics, Prebiotics & Postbiotics for Cats
- Signs of Gut Dysfunction
- FAQs

**Step 3: Write guide content**
- 3000-4000 words
- Research-backed
- Practical guidance
- Brand voice compliant

**Step 4: Build HTML page**
- Match structure of other guides
- Full SEO optimization
- Schema markup (Article, FAQ, BreadcrumbList)

**Step 5: SEO optimization**
- [ ] All meta tags optimized
- [ ] Heading hierarchy correct
- [ ] Internal linking complete
- [ ] Schema markup valid

**Step 6: Quality review**
- [ ] Accurate and well-researched
- [ ] Brand voice compliant
- [ ] Comprehensive but not bloated

**Step 7: Commit**
```bash
git add guides/cat-gut-health.html
git commit -m "Add cat gut health guide"
```

---

## Task 5: Immune Health Blog Post Cluster (3-4 posts)

**Files:**
- Create: `blog/immune-support-for-cats.html`
- Create: `blog/beta-glucans-for-cats.html`
- Create: `blog/vitamins-for-cat-immune-system.html`
- Create: (optional) `blog/kitten-immune-system.html`

**For each blog post:**

**Step 1: Keyword targeting**
- Confirm primary keyword from research
- Identify secondary keywords
- Analyze top 3 ranking pages

**Step 2: Create outline**
- Match search intent
- Include FAQ section for schema
- Plan internal links to immune guide

**Step 3: Write content**
- 1500-2500 words (match what's ranking)
- Research-backed
- Brand voice compliant

**Step 4: Build HTML**
- Use existing blog post as template
- Full meta tag optimization
- Schema markup

**Step 5: Link to pillar guide**
- Add callout box linking to immune system guide
- Add guide to link back to this post in "Related Articles"

**Step 6: Commit each post**
```bash
git add blog/[post-name].html
git commit -m "Add [post title] blog post"
```

---

## Task 6: Gut Health Blog Post Cluster (3-4 posts)

**Files:**
- Create: `blog/best-probiotics-for-cats.html` (or enhance existing)
- Create: `blog/cat-digestive-issues.html`
- Create: `blog/prebiotics-for-cats.html`
- Create: (optional) `blog/cat-ibd-diet.html`

**Follow same process as Task 5:**
1. Keyword targeting
2. Outline
3. Write content
4. Build HTML with full SEO
5. Link to gut health guide
6. Commit each post

---

## Task 7: Internal Linking & Cross-References

**Step 1: Update hub page**
- Ensure all new guides are linked
- Add blog post references where relevant

**Step 2: Update pillar guides**
- Add "Related Articles" section with blog posts
- Cross-link between immune and gut guides where relevant

**Step 3: Update existing cat content**
- Add links from existing cat blog posts to new guides
- Files to update:
  - `blog/taurine-for-cats.html`
  - `blog/vitamin-a-for-cats.html`
  - `blog/protein-requirements-cats.html`
  - `blog/senior-cat-nutrition.html`
  - `blog/probiotics-for-cats.html`
  - `blog/arachidonic-acid-for-cats.html`
  - `blog/omega-3-for-cats.html`
  - `blog/how-to-read-cat-food-labels.html`

**Step 4: Commit linking updates**
```bash
git add guides/ blog/
git commit -m "Add internal linking between cat health content"
```

---

## Task 8: Final Review & Push

**Step 1: Full content audit**
- [ ] All pages load correctly
- [ ] All internal links work
- [ ] Schema markup validates (test with Google's tool)
- [ ] Brand voice consistent across all new content
- [ ] No dog comparisons anywhere

**Step 2: Push to production**
```bash
git push
```

**Step 3: Submit to Google Search Console**
- Submit new URLs for indexing
- Submit updated sitemap

---

## Content Checklist (Apply to Every Piece)

### SEO
- [ ] Primary keyword in title tag (< 60 chars)
- [ ] Primary keyword in H1
- [ ] Primary keyword in meta description (< 155 chars)
- [ ] Secondary keywords in H2s naturally
- [ ] Internal links (3-5 minimum)
- [ ] External links to research (where appropriate)
- [ ] Schema markup (Article/FAQ/BreadcrumbList)
- [ ] Canonical URL set
- [ ] OG and Twitter tags complete

### Brand Voice
- [ ] No dog comparisons
- [ ] Cats as main character
- [ ] Health supplement positioning (not nutritional)
- [ ] Confident, direct claims
- [ ] No "may help", "premium", "utilize", "pet parent"
- [ ] Alive, not clinical
- [ ] Expert but approachable

### Quality
- [ ] Scientifically accurate
- [ ] Better than what currently ranks #1
- [ ] Genuinely useful
- [ ] Appropriate length for topic
