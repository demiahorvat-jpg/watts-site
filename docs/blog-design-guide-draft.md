# Blog Page Design Guide

**Last Updated**: March 6, 2026
**Purpose**: Comprehensive guide for creating consistent, high-quality blog posts for both dog and cat content on wattspet.com

---

## Table of Contents
1. [Overview](#overview)
2. [Pet-Specific Differentiation](#pet-specific-differentiation)
3. [Required HTML Structure](#required-html-structure)
4. [Required Metadata](#required-metadata)
5. [Content Structure](#content-structure)
6. [Styling Classes & Components](#styling-classes--components)
7. [FAQ Requirements](#faq-requirements)
8. [Internal Linking Guidelines](#internal-linking-guidelines)
9. [Quality Standards](#quality-standards)
10. [Examples](#examples)

---

## Overview

Blog posts serve as educational content for pet owners, focusing on nutrition, supplements, ingredients, and health topics. All posts must be:
- **Evidence-based**: Cite research and veterinary sources
- **Comprehensive**: Cover topics in depth (2000-4000 words)
- **Actionable**: Provide practical guidance
- **Structured**: Use consistent HTML structure and styling
- **SEO-optimized**: Include proper metadata, schema, and internal links

---

## Pet-Specific Differentiation

### Visual Indicators
Blog posts are differentiated by pet type using the article meta line:

**Dog posts:**
```html
<div class="article-meta">January 22, 2026</div>
```

**Cat posts:**
```html
<div class="article-meta">March 6, 2026 • For Cats</div>
```

### URL Conventions
- **Dog posts**: No special suffix (e.g., `/blog/probiotics-for-dogs.html`)
- **Cat posts**: Topic name reflects cat focus (e.g., `/blog/taurine-for-cats.html`, `/blog/protein-requirements-cats.html`)

### Content Differences
- **Dog posts**: Focus on dog-specific nutrition, conditionally essential nutrients (e.g., taurine is helpful but not essential)
- **Cat posts**: Emphasize obligate carnivore biology, essential nutrients (e.g., taurine is absolutely essential)

---

## Required HTML Structure

### Document Head

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- REQUIRED: Title (50-60 characters) -->
    <title>Topic for Dogs/Cats: Key Benefit | Watts</title>

    <!-- REQUIRED: Meta description (150-160 characters) -->
    <meta name="description" content="Brief description of what the post covers and key takeaways.">

    <!-- REQUIRED: Canonical URL -->
    <link rel="canonical" href="https://wattspet.com/blog/post-slug.html">

    <!-- REQUIRED: Open Graph tags -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="Topic for Dogs/Cats: Key Benefit">
    <meta property="og:description" content="Brief description matching meta description">
    <meta property="og:url" content="https://wattspet.com/blog/post-slug.html">
    <meta property="og:site_name" content="Watts">

    <!-- REQUIRED: Twitter Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Topic for Dogs/Cats: Key Benefit">
    <meta name="twitter:description" content="Brief description matching meta description">

    <!-- REQUIRED: Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- REQUIRED: Analytics -->
    <script src="https://analytics.ahrefs.com/analytics.js" data-key="22KmtuYXO77ED5o6fe6z1w" async></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C6KV5WBGK5"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-C6KV5WBGK5');
    </script>

    <!-- REQUIRED: CSS -->
    <link rel="stylesheet" href="/css/blog-page.css">

    <!-- REQUIRED: Schema markup (see Schema section below) -->
</head>
```

---

## Required Metadata

### 1. Article Schema (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article headline matching H1",
  "description": "Detailed description of article content",
  "author": {
    "@type": "Organization",
    "name": "Watts Pet"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Watts Pet",
    "logo": {
      "@type": "ImageObject",
      "url": "https://wattspet.com/logo.png"
    }
  },
  "datePublished": "2026-03-06",
  "dateModified": "2026-03-06"
}
```

### 2. Breadcrumb Schema (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://wattspet.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://wattspet.com/blog/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title",
      "item": "https://wattspet.com/blog/article-slug.html"
    }
  ]
}
```

### 3. FAQ Schema (JSON-LD)

**REQUIRED**: Every blog post must include FAQPage schema with 6-10 questions.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text exactly as it appears in FAQ section?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Complete answer text matching FAQ section, 2-4 sentences, actionable information"
      }
    }
  ]
}
```

**Requirements:**
- Minimum 6 FAQs, ideal 8-10
- Questions must match FAQ section exactly
- Answers must be comprehensive (2-4 sentences minimum)
- Questions should address common user queries and long-tail keywords

---

## Content Structure

### Article Header

```html
<div class="article-header">
  <!-- Date and pet type indicator -->
  <div class="article-meta">March 6, 2026 • For Cats</div>

  <!-- H1: Main headline (must match schema) -->
  <h1>Article Title: Specific Benefit or Key Information</h1>

  <!-- Quick Answer Callout (REQUIRED) -->
  <div class="callout" style="margin-top: 32px; margin-bottom: 40px;">
    <div class="callout-content">
      <h2 style="margin-top: 0; font-size: 20px; margin-bottom: 16px;">🔬 Quick Answer: What's the Main Question?</h2>
      <p style="margin-bottom: 16px; font-size: 18px; font-weight: 600; color: var(--text-dark);"><strong>Direct answer in 1-2 sentences with key actionable information.</strong></p>
      <p style="margin-bottom: 12px; font-size: 15px;"><strong>Key point 1:</strong> Important detail</p>
      <p style="margin-bottom: 12px; font-size: 15px;"><strong>Key point 2:</strong> Important detail</p>
      <p style="margin-bottom: 0; font-size: 15px;"><strong>Key point 3:</strong> Important detail</p>
    </div>
  </div>

  <!-- Article introduction (150-200 words) -->
  <p class="article-intro">Compelling introduction that hooks the reader, explains the problem or question, and previews what the article will cover.</p>
</div>
```

### Article Body Structure

```html
<div class="article-content">

  <!-- Section 1: Core Concept -->
  <h2>What Is [Topic] and Why Does It Matter?</h2>
  <p>Introduction to the core concept...</p>

  <h3>Subsection if needed</h3>
  <p>Details...</p>

  <!-- Use lists for clarity -->
  <ul>
    <li><strong>Point 1:</strong> Explanation</li>
    <li><strong>Point 2:</strong> Explanation</li>
  </ul>

  <!-- Section 2: Evidence/Research -->
  <h2>What Does the Research Show?</h2>
  <p>Evidence-based information with citations...</p>

  <!-- Optional: Tables for data comparison -->
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Column 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data</td>
          <td>Data</td>
          <td>Data</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Section 3: Practical Application -->
  <h2>How to Apply This Information</h2>
  <p>Actionable guidance...</p>

  <!-- Section 4: Key Takeaways -->
  <h2>Key Takeaways: [Topic] for Dogs/Cats</h2>
  <ol>
    <li><strong>Takeaway 1</strong>—specific actionable point</li>
    <li><strong>Takeaway 2</strong>—specific actionable point</li>
    <li><strong>Takeaway 3</strong>—specific actionable point</li>
  </ol>

  <!-- REQUIRED: FAQ Section -->
  <h2>Frequently Asked Questions</h2>

  <div class="faq-item">
    <h3>Question text exactly matching schema?</h3>
    <p>Answer text exactly matching schema. Complete, comprehensive answer in 2-4 sentences with actionable information.</p>
  </div>

  <!-- Repeat for 6-10 FAQs -->

</div>
```

---

## Styling Classes & Components

### Typography

**Headings:**
- `<h1>`: Page title (32-48px, weight 700, orange never used)
- `<h2>`: Section headings (28-36px, weight 700, dark text)
- `<h3>`: Subsections and FAQ questions (24-28px, weight 600, **orange color for FAQs**)

**Body text:**
- `<p>`: Standard paragraphs (17-18px, weight 500, dark text)
- `.article-intro`: Intro paragraph (19-21px, weight 500, muted color)
- `.article-meta`: Date/pet type indicator (14px, weight 500, muted color)

**Strong text:**
- `<strong>`: Bold emphasis (weight 600)

### Components

#### 1. Callout Box (Quick Answer)
```html
<div class="callout" style="margin-top: 32px; margin-bottom: 40px;">
  <div class="callout-content">
    <!-- Orange border outer, white inner box with shadow -->
    <h2 style="margin-top: 0; font-size: 20px; margin-bottom: 16px;">Icon Quick Answer: Question?</h2>
    <p style="margin-bottom: 16px; font-size: 18px; font-weight: 600; color: var(--text-dark);"><strong>Direct answer</strong></p>
    <!-- Additional key points with inline styles as shown -->
  </div>
</div>
```

**When to use:**
- Every article must have ONE callout box after the H1
- Provides immediate answer to main question
- Uses emoji icon relevant to topic (🔬 🥩 💊 🐕 🐱 etc.)

#### 2. FAQ Items
```html
<div class="faq-item">
  <h3>Question text?</h3>
  <p>Answer text. Must match schema exactly.</p>
</div>
```

**Styling:**
- Light gray background (`var(--bg-light)`)
- Orange left border (4px)
- Rounded corners (12px)
- Question in `<h3>` is **orange** (`var(--brand-orange)`)
- Answer in `<p>` is dark text

#### 3. Tables (Data Comparison)
```html
<div class="table-scroll">
  <table>
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data</td>
        <td>Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Styling:**
- Orange header background (`var(--brand-orange)`)
- White text in header
- First column sticky on mobile
- Hover effect on rows
- Shadow and rounded corners

#### 4. Lists
```html
<!-- Unordered list -->
<ul>
  <li><strong>Point:</strong> Explanation</li>
</ul>

<!-- Ordered list (for sequential steps or ranked items) -->
<ol>
  <li><strong>Step 1:</strong> Action</li>
</ol>
```

---

## FAQ Requirements

### Structure Rules

1. **Minimum 6 FAQs, ideal 8-10** per article
2. **Question format**: Natural language questions ending with "?"
3. **Answer length**: 2-4 sentences minimum, comprehensive and actionable
4. **Schema match**: Questions and answers MUST match FAQ schema exactly
5. **Orange styling**: Questions use `<h3>` tags (styled orange automatically)

### Content Requirements

**Questions should:**
- Address common user queries (check Google "People also ask")
- Include long-tail keywords naturally
- Cover practical concerns ("How much?", "When to use?", "Is it safe?")
- Avoid repetition with article body (FAQs add new value)

**Answers should:**
- Be self-contained (don't reference "as mentioned above")
- Include specific numbers, timeframes, or dosages when relevant
- Provide actionable guidance
- Link to ingredient pages when mentioning specific ingredients

### Example FAQs

**Dog Post Example:**
```html
<div class="faq-item">
  <h3>How much taurine do dogs need daily?</h3>
  <p>Most dogs can synthesize adequate taurine from methionine and cysteine, so there's no established minimum requirement. However, certain breeds (golden retrievers, cocker spaniels) and dogs eating grain-free diets may benefit from 50-100 mg supplemental taurine per day. Consult your veterinarian before supplementing.</p>
</div>
```

**Cat Post Example:**
```html
<div class="faq-item">
  <h3>How much taurine do cats need daily?</h3>
  <p>AAFCO standards require minimum taurine levels in cat food: 0.1% (1000 mg/kg) in dry food and 0.2% (2000 mg/kg) in wet food on a dry matter basis. For a typical 10 lb adult cat, this translates to approximately 50-100 mg of taurine per day from commercial food. Pregnant, nursing, and growing cats need higher amounts.</p>
</div>
```

---

## Internal Linking Guidelines

### When to Link

1. **Ingredient mentions**: Link first mention of ingredients in body text
   - Example: `<a href="/ingredient-analyzer/ingredients/taurine/">taurine</a>`
2. **Related blog posts**: Link to related topics when relevant
   - Example: `<a href="/blog/gut-health-for-dogs.html">gut health</a>`
3. **Guide references**: Link to comprehensive guides when applicable
   - Example: `<a href="/guides/dog-gut-health.html">Complete Guide to Dog Gut Health</a>`

### Linking Rules

- **Only link first meaningful mention** in body text (not in callout box)
- **3-7 links per article** maximum (avoid over-linking)
- **Natural placement**: Links should feel organic, not forced
- **Descriptive anchor text**: Use ingredient names or descriptive phrases, never "click here"
- **No table header links**: Never make table headers clickable
- **Open external links in new tab**: Use `target="_blank" rel="noopener"` for research citations

### Example Linking

```html
<p>Cats cannot synthesize <a href="/ingredient-analyzer/ingredients/taurine/">taurine</a> from other amino acids, making it absolutely essential in their diet. Unlike dogs, cats lack the metabolic enzymes needed for taurine production.</p>

<p>For more on digestive health, see our guide on <a href="/blog/probiotics-for-cats.html">probiotics for cats</a>.</p>

<p>Research shows taurine deficiency leads to dilated cardiomyopathy in cats (<a href="https://pubmed.ncbi.nlm.nih.gov/12345678/" target="_blank" rel="noopener">Smith et al., 2020</a>).</p>
```

---

## Quality Standards

### Content Quality

**Must have:**
- ✅ Evidence-based claims with research citations
- ✅ Specific numbers, dosages, percentages when applicable
- ✅ Actionable takeaways (not just information)
- ✅ Natural, conversational tone (not academic/stiff)
- ✅ 2000-4000 word count for comprehensive coverage
- ✅ No marketing hype or sales language

**Avoid:**
- ❌ Generic template text repeated across posts
- ❌ Vague statements ("may help", "some studies suggest" without specifics)
- ❌ Data dumps without explanation
- ❌ Over-technical jargon without definitions
- ❌ Scare tactics or fear mongering
- ❌ Duplicate content from other pages

### Pet-Specific Content Quality

**Dog posts should:**
- Acknowledge dogs as facultative carnivores (can adapt to varied diets)
- Note conditionally essential nutrients (e.g., taurine)
- Include breed-specific considerations when relevant
- Reference appropriate protein levels (26-35%)

**Cat posts should:**
- Emphasize obligate carnivore biology
- Clearly state essential nutrients (taurine, arachidonic acid, preformed vitamin A)
- Explain why cats cannot thrive on plant-based diets
- Reference appropriate protein levels (30-40%+)
- Mention DCM (dilated cardiomyopathy) risk with taurine deficiency

### Technical Quality

**Before publishing:**
- ✅ All internal links work (no 404s)
- ✅ Schema markup validates (Google Rich Results Test)
- ✅ Mobile responsive (test on phone/tablet)
- ✅ FAQ questions match schema exactly
- ✅ Meta description under 160 characters
- ✅ Title tag 50-60 characters
- ✅ H1 matches article schema headline
- ✅ No broken external links
- ✅ Images have alt text (if images used)

---

## Examples

### Example Dog Blog Post Structure

**File**: `/blog/probiotics-for-dogs.html`

**Key features:**
- Meta: `January 22, 2026` (no pet indicator = dog by default)
- Title: `Probiotics for Dogs: Complete Evidence-Based Guide | Watts`
- H1: `Probiotics for Dogs: Which Strains Work & When They Actually Help`
- Quick Answer callout with 🦠 emoji
- 10 FAQs with orange `<h3>` questions
- Internal links to ingredient pages (enterococcus-faecium, lactobacillus-acidophilus, etc.)
- Tables comparing probiotic strains
- Evidence-based with research citations
- Comprehensive (4500+ words)

### Example Cat Blog Post Structure

**File**: `/blog/taurine-for-cats.html`

**Key features:**
- Meta: `March 6, 2026 • For Cats`
- Title: `Taurine for Cats: Why It's Essential & Deficiency Signs | Watts`
- H1: `Taurine for Cats: Why It's Essential & How to Prevent Deficiency`
- Quick Answer callout with 💊 emoji
- 8 FAQs with orange `<h3>` questions
- Emphasis on essential nature (not conditional like dogs)
- Warning about dog food and vegan diets
- DCM (dilated cardiomyopathy) prominently featured
- Table of taurine content in foods
- Comprehensive (3200+ words)

---

## Template Checklist

Use this checklist when creating new blog posts:

### Pre-Writing
- [ ] Research topic thoroughly
- [ ] Identify 8-10 FAQ questions (check Google "People also ask")
- [ ] Gather research citations and sources
- [ ] Determine dog vs cat focus (or create separate posts)

### HTML Structure
- [ ] All required meta tags (title, description, canonical)
- [ ] Open Graph and Twitter Card tags
- [ ] Article schema with correct dates
- [ ] Breadcrumb schema
- [ ] FAQPage schema (6-10 questions)

### Content
- [ ] Article meta shows date + "For Cats" if cat post
- [ ] H1 matches article schema headline
- [ ] Quick Answer callout with emoji after H1
- [ ] Article intro (150-200 words)
- [ ] 2000-4000 word comprehensive content
- [ ] Evidence-based claims with citations
- [ ] Natural, conversational tone
- [ ] Key takeaways section
- [ ] 6-10 FAQs with orange `<h3>` questions
- [ ] FAQ text matches schema exactly

### Linking
- [ ] 3-7 internal links to ingredient pages (first mention only)
- [ ] Links to related blog posts or guides where relevant
- [ ] External research citations open in new tab
- [ ] No table header links

### Quality Check
- [ ] All internal links work
- [ ] Schema validates (Google Rich Results Test)
- [ ] Mobile responsive
- [ ] No generic template text
- [ ] Specific numbers and dosages included
- [ ] Actionable takeaways
- [ ] Grammar and spelling checked

---

## Version History

- **v1.0** (March 6, 2026): Initial documentation created after first cat blog posts
