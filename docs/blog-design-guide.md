# Blog Page Design Guide

**Last Updated**: March 6, 2026
**Purpose**: Comprehensive design documentation for creating consistent, high-quality blog posts for dogs and cats on wattspet.com
**Based on**: Most robust existing dog articles (digestive-enzymes-for-dogs.html, can-dogs-take-human-supplements.html, antioxidants-for-dogs.html)

---

## Table of Contents
1. [Overview](#overview)
2. [Pet-Specific Differentiation](#pet-specific-differentiation)
3. [Required HTML Structure](#required-html-structure)
4. [Required Metadata & Schema](#required-metadata--schema)
5. [Content Structure](#content-structure)
6. [Styling Classes & Components](#styling-classes--components)
7. [FAQ Requirements](#faq-requirements)
8. [Internal Linking Guidelines](#internal-linking-guidelines)
9. [Quality Standards](#quality-standards)
10. [Complete Template Example](#complete-template-example)

---

## Overview

Blog posts serve as comprehensive educational content for pet owners, focusing on nutrition, supplements, ingredients, and health topics. All posts must be:

- **Evidence-based**: Cite veterinary research and credible sources
- **Comprehensive**: 2000-6000 words (robust articles are 4000-6000 words)
- **Actionable**: Provide practical, specific guidance with numbers/dosages
- **Structured**: Use consistent HTML structure and CSS classes
- **SEO-optimized**: Include proper metadata, schema markup (10-13 FAQs), and strategic internal links
- **Natural tone**: Conversational yet authoritative, not academic or stiff

---

## Pet-Specific Differentiation

### Visual Indicators

**All posts** (dogs and cats use identical format):
```html
<div class="article-meta">Last Updated March 6, 2026</div>
```

**Differentiation happens through**:
- URL structure (`/blog/topic-for-dogs.html` vs `/blog/topic-for-cats.html`)
- Blog index filter (users select dog/cat content)
- Article title and content (clearly states pet type)

No visual badge or "For Cats/Dogs" label is needed in the article meta.

### URL Conventions

- **Dog posts**: `/blog/topic-for-dogs.html` (e.g., probiotics-for-dogs.html)
- **Cat posts**: `/blog/topic-for-cats.html` (e.g., taurine-for-cats.html)

### Content Differences

**Dog posts should:**
- Acknowledge dogs as facultative carnivores (can adapt to varied diets)
- Note conditionally essential nutrients (e.g., taurine helpful but not essential)
- Reference appropriate protein levels (26-35%)
- Include breed-specific considerations when relevant

**Cat posts should:**
- Emphasize obligate carnivore biology throughout
- Clearly state essential nutrients (taurine, arachidonic acid, preformed vitamin A)
- Explain why cats cannot thrive on plant-based or dog-appropriate diets
- Reference appropriate protein levels (30-40%+)
- Mention DCM (dilated cardiomyopathy) risk with taurine deficiency

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
    <title>Topic for Dogs/Cats: Specific Benefit | Watts</title>

    <!-- REQUIRED: Meta description (150-160 characters) -->
    <meta name="description" content="Brief compelling description with key benefit and takeaway.">

    <!-- REQUIRED: Canonical URL -->
    <link rel="canonical" href="https://wattspet.com/blog/article-slug.html">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://wattspet.com/blog/article-slug.html">
    <meta property="og:title" content="Topic for Dogs/Cats: Specific Benefit">
    <meta property="og:description" content="Brief description matching meta description">
    <meta property="og:image" content="https://wattspet.com/images/og-default.jpg">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://wattspet.com/blog/article-slug.html">
    <meta property="twitter:title" content="Topic for Dogs/Cats: Specific Benefit">
    <meta property="twitter:description" content="Brief description matching meta description">
    <meta property="twitter:image" content="https://wattspet.com/images/og-default.jpg">

    <!-- REQUIRED: Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- REQUIRED: Analytics (Ahrefs + Google) -->
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

    <!-- REQUIRED: Schema markup (3 scripts - see Schema section) -->
</head>
```

**Note**: Open Graph image is optional but recommended. Use `/images/og-default.jpg` or create topic-specific images.

### Document Body

```html
<body>
  <!-- Header (standard across all pages) -->
  <div class="header-wrapper">
    <header>
      <div class="header-container">
        <button class="hamburger" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/ingredient-analyzer/">Ingredient Analyzer</a></li>
          </ul>
        </nav>
        <div class="logo-container">
          <a href="/" aria-label="Watts home">
            <img src="/watts-logo-white.svg" alt="Watts" class="logo">
          </a>
        </div>
      </div>
    </header>
  </div>

  <!-- Main content -->
  <main>
    <article>
      <!-- Optional: Guide reference callout (if part of a guide series) -->

      <!-- Article header (required) -->
      <div class="article-header">
        <!-- H1, meta, quick facts, intro -->
      </div>

      <!-- Optional: Guide reference after intro -->

      <!-- Article content -->
      <div class="article-content">
        <!-- Body sections, FAQs -->
      </div>
    </article>
  </main>

  <!-- Footer (standard across all pages) -->
  <div class="footer-wrapper">
    <footer>
      <!-- Footer content -->
    </footer>
  </div>

  <!-- Mobile menu toggle script -->
  <script>
    // Standard menu toggle JavaScript
  </script>
</body>
</html>
```

---

## Required Metadata & Schema

### 1. Article Schema (JSON-LD)

**Required first schema block in `<head>`**:

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete H1 headline matching the page title",
  "description": "Detailed 2-3 sentence description of article content and key takeaways",
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
</script>
```

**Requirements**:
- `headline` must exactly match the H1 on the page
- `description` should be comprehensive (not just meta description copy)
- `datePublished` and `dateModified` use YYYY-MM-DD format
- Update `dateModified` when making significant content updates

### 2. Breadcrumb Schema (JSON-LD)

**Required second schema block**:

```json
<script type="application/ld+json">
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
</script>
```

### 3. FAQ Schema (JSON-LD)

**Required third schema block - CRITICAL for SEO**:

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text exactly as it appears in FAQ section?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Complete answer exactly as it appears in FAQ section. Must be 2-4+ sentences with comprehensive, actionable information including specific numbers, dosages, or recommendations when applicable."
      }
    },
    {
      "@type": "Question",
      "name": "Second question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Second answer with complete information."
      }
    }
    // Continue for 10-13 questions total
  ]
}
</script>
```

**Critical requirements**:
- **10-13 FAQs** minimum (robust articles have 10-13, not just 6-8)
- Question text must **exactly match** the `<h3>` text in the FAQ section
- Answer text must **exactly match** the `<p>` text in the FAQ section
- Answers must be comprehensive (2-4+ sentences, not just one sentence)
- Include specific numbers, dosages, timeframes when relevant

---

## Content Structure

### Article Header

```html
<div class="article-header">
  <!-- H1: Main headline -->
  <h1>Topic for Dogs/Cats: Specific Benefit or Key Information</h1>

  <!-- Article meta: last updated date -->
  <div class="article-meta">Last Updated March 6, 2026</div>

  <!-- REQUIRED: Quick Facts Box -->
  <div class="quick-facts">
    <div class="quick-facts-content">
      <h2>Quick Answer: What's the Main Question?</h2>
      <p style="margin-bottom: 16px; font-size: 18px; font-weight: 600; color: var(--text-dark);"><strong>Direct, bold answer in 1-2 sentences with the most important actionable information.</strong></p>
      <p style="margin-bottom: 12px; font-size: 15px;"><strong>Key point 1:</strong> Specific detail with numbers if applicable</p>
      <p style="margin-bottom: 12px; font-size: 15px;"><strong>Key point 2:</strong> Specific detail</p>
      <p style="margin-bottom: 0; font-size: 15px;"><strong>Key point 3:</strong> Specific detail or recommendation</p>
    </div>
  </div>

  <!-- REQUIRED: Article intro (150-250 words) -->
  <p class="article-intro">Compelling introduction paragraph that hooks the reader, explains the problem or question being addressed, provides context for why this topic matters, and previews what the article will cover. Should establish credibility and set expectations for comprehensive coverage.</p>
</div>
```

**Quick Facts Box Requirements**:
- Use `<div class="quick-facts">` wrapper (NOT "callout")
- Inner div is `<div class="quick-facts-content">`
- H2 question should directly address main user query
- First paragraph is bold answer with `<strong>` tags
- 2-3 supporting bullet points with inline styles as shown
- All inline styles are required for proper formatting

### Optional: Guide Reference Callout

If the blog post is part of a comprehensive guide series, add this callout **either**:
- Before the article header, OR
- After the article intro (before `<div class="article-content">`)

```html
<div style="background: #f0f9f4; border-left: 4px solid #2d5016; padding: 20px; margin-bottom: 40px; border-radius: 4px;">
  <p style="margin: 0; font-size: 16px;">📚 <strong>Part of our comprehensive guide:</strong> <a href="/guides/dog-gut-health.html" style="color: #c03800; font-weight: 600;">Complete Guide to Dog Gut Health</a></p>
</div>
```

**When to use**:
- Post relates to a comprehensive guide (gut health, joint health, immune system, etc.)
- Creates topical authority by linking related content
- Use green background (`#f0f9f4`) with dark green left border (`#2d5016`)

### Article Body Structure

```html
<div class="article-content">

  <!-- Section 1: Core Concept -->
  <h2>What Is [Topic]?</h2>
  <p>Introduction to the core concept with clear, accessible explanation...</p>

  <!-- Use tables for data comparison -->
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
          <td><strong>Row header</strong></td>
          <td>Data</td>
          <td>Data</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Subsections with H3 -->
  <h3>Subsection Title</h3>
  <p>Details and explanation...</p>

  <!-- Lists for clarity and scannability -->
  <ul>
    <li><strong>Point 1:</strong> Explanation with specific details</li>
    <li><strong>Point 2:</strong> Explanation with numbers or dosages</li>
    <li><strong>Point 3:</strong> Actionable recommendation</li>
  </ul>

  <!-- Section 2: Evidence/Research -->
  <h2>What Does the Research Show?</h2>
  <p>Evidence-based information with citations to veterinary research...</p>
  <p>Studies show [specific finding] (<a href="https://pubmed.ncbi.nlm.nih.gov/..." target="_blank" rel="noopener">Author et al., 2025</a>).</p>

  <!-- Section 3: Practical Application -->
  <h2>How to [Apply/Use/Implement]</h2>
  <p>Actionable guidance with specific numbers, dosages, or protocols...</p>

  <ol>
    <li><strong>Step 1:</strong> Specific action with numbers</li>
    <li><strong>Step 2:</strong> Specific action</li>
    <li><strong>Step 3:</strong> Specific action</li>
  </ol>

  <!-- Section 4: When NOT to Use / Myths / Cautions -->
  <h2>Common Myths About [Topic]</h2>
  <!-- OR -->
  <h2>When [Topic] Is NOT Appropriate</h2>

  <h3>Myth 1: [Common Misconception]</h3>
  <p><strong>FALSE.</strong> Explanation of why this is wrong, backed by evidence...</p>

  <!-- Section 5: Key Takeaways (near end, before FAQs) -->
  <h2>Key Takeaways: [Topic] for Dogs/Cats</h2>
  <ol>
    <li><strong>Takeaway 1</strong>—specific, actionable point with numbers if applicable</li>
    <li><strong>Takeaway 2</strong>—specific, actionable point</li>
    <li><strong>Takeaway 3</strong>—specific, actionable point</li>
    <li><strong>Takeaway 4</strong>—specific, actionable point</li>
    <li><strong>Takeaway 5+</strong>—additional specific, actionable points</li>
  </ol>

  <!-- REQUIRED: FAQ Section (MUST BE LAST) -->
  <h2>Frequently Asked Questions</h2>

  <div class="faq-item">
    <h3>Question text exactly matching schema?</h3>
    <p>Answer text exactly matching schema. Comprehensive answer in 2-4+ sentences with specific, actionable information including numbers, dosages, or timeframes when relevant.</p>
  </div>

  <div class="faq-item">
    <h3>Second question?</h3>
    <p>Second answer with comprehensive information.</p>
  </div>

  <!-- Repeat for 10-13 total FAQs -->

</div>
```

**Structural requirements**:
- H2 for main sections (28-36px, weight 700)
- H3 for subsections (24-28px, weight 600)
- Tables wrapped in `<div class="table-scroll">` for mobile responsiveness
- Strong emphasis on first word/phrase in list items
- FAQ section MUST be last section in article-content
- Numbered lists for sequential steps or ranked items
- Bulleted lists for non-sequential points

---

## Styling Classes & Components

### Typography Classes

**Headings** (automatically styled by blog-page.css):
- `<h1>`: Page title (32-48px, weight 700, dark text)
- `<h2>`: Section headings (28-36px, weight 700, dark text)
- `<h3>`: Subsections and **FAQ questions** (24-28px, weight 600)
  - **FAQ questions are ORANGE** (`var(--brand-orange): #c03800`)
  - Other H3s are dark text

**Body text** (automatically styled):
- `<p>`: Standard paragraphs (17-18px, weight 500)
- `.article-intro`: Intro paragraph after quick facts (19-21px, weight 500, muted color)
- `.article-meta`: Last updated date (14px, weight 500, muted color)

**Emphasis**:
- `<strong>`: Bold text (weight 600) for emphasis
- First word/phrase in list items should be `<strong>`

### Component Classes

#### 1. Quick Facts Box (Quick Answer)

```html
<div class="quick-facts">
  <div class="quick-facts-content">
    <h2>Quick Answer: Main Question?</h2>
    <p style="margin-bottom: 16px; font-size: 18px; font-weight: 600; color: var(--text-dark);"><strong>Direct answer</strong></p>
    <p style="margin-bottom: 12px; font-size: 15px;"><strong>Key point:</strong> Detail</p>
    <p style="margin-bottom: 0; font-size: 15px;"><strong>Key point:</strong> Detail</p>
  </div>
</div>
```

**Rendered appearance**:
- White box with rounded corners
- Shadow for depth
- Bold H2 question at top
- Large bold answer paragraph
- 2-3 smaller supporting points

**When to use**:
- REQUIRED on every blog post
- Place immediately after article-meta, before article-intro
- Provides immediate value and improves engagement

**DO NOT use**:
- `<div class="callout">` (wrong class name)
- Different inline styles (required for consistent formatting)

#### 2. FAQ Items

```html
<div class="faq-item">
  <h3>Question text?</h3>
  <p>Answer text. Must be comprehensive and match schema.</p>
</div>
```

**Rendered appearance**:
- Light gray background (`var(--bg-light): #f1f1f1`)
- 4px orange left border (`var(--brand-orange): #c03800`)
- Rounded corners (12px border-radius)
- 28px padding
- Question in `<h3>` is **ORANGE** (automatic styling)
- Answer in `<p>` is dark text

**Requirements**:
- Question uses `<h3>` tag (automatically styled orange)
- Answer uses `<p>` tag
- **NO other HTML tags** (no div.faq-question, no div.faq-answer)
- Text must exactly match FAQ schema

#### 3. Tables (Data Comparison)

```html
<div class="table-scroll">
  <table>
    <thead>
      <tr>
        <th>Column Header 1</th>
        <th>Column Header 2</th>
        <th>Column Header 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Row label</strong></td>
        <td>Data point</td>
        <td>Data point</td>
      </tr>
      <tr>
        <td><strong>Row label</strong></td>
        <td>Data point</td>
        <td>Data point</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Rendered appearance**:
- Orange header row (`var(--brand-orange)`) with white text
- White table body with subtle borders
- First column sticky on mobile (stays visible when scrolling horizontally)
- Row hover effect (light orange tint)
- Shadow and rounded corners

**Best practices**:
- Always wrap tables in `<div class="table-scroll">` for mobile responsiveness
- Use `<strong>` for row labels in first column
- Keep column count to 3-4 for mobile readability
- Use for: nutrient comparisons, dosage charts, ingredient analysis, research findings

#### 4. Lists

```html
<!-- Unordered list (non-sequential points) -->
<ul>
  <li><strong>Point label:</strong> Explanation with details</li>
  <li><strong>Point label:</strong> Explanation with details</li>
</ul>

<!-- Ordered list (sequential steps or ranked items) -->
<ol>
  <li><strong>First item:</strong> Explanation</li>
  <li><strong>Second item:</strong> Explanation</li>
</ol>
```

**Best practices**:
- Bold the first word/phrase for scannability
- Keep list items concise but informative (1-3 sentences)
- Use ordered lists for: step-by-step instructions, ranked items, sequential processes
- Use unordered lists for: non-sequential points, feature lists, symptom lists

#### 5. Guide Reference Callout

```html
<div style="background: #f0f9f4; border-left: 4px solid #2d5016; padding: 20px; margin-bottom: 40px; border-radius: 4px;">
  <p style="margin: 0; font-size: 16px;">📚 <strong>Part of our comprehensive guide:</strong> <a href="/guides/dog-gut-health.html" style="color: #c03800; font-weight: 600;">Complete Guide to Dog Gut Health</a></p>
</div>
```

**Rendered appearance**:
- Light green background
- Dark green left border
- Orange link color
- Rounded corners

**When to use**:
- Only if article is genuinely part of a guide series
- Place before article header OR after article intro
- Use 📚 emoji for visual interest

---

## FAQ Requirements

### Structure Rules

1. **10-13 FAQs minimum** per article (robust articles have 10-13, not 6-8)
2. **Question format**: Natural language questions ending with "?"
3. **Answer length**: 2-4+ sentences minimum (some answers are 5-7 sentences for complex topics)
4. **Schema match**: Questions and answers MUST match FAQ schema exactly (character-for-character)
5. **Orange styling**: Questions use `<h3>` tags (automatically styled orange)
6. **Section placement**: FAQ section MUST be the last section in `<div class="article-content">`

### Content Requirements

**Questions should:**
- Address common user queries (check Google "People also ask" and related searches)
- Include long-tail keywords naturally
- Cover practical concerns: "How much?", "When to use?", "Is it safe?", "What if...?"
- Range from basic to advanced (educate all knowledge levels)
- Avoid repetition with main article body (FAQs add new value or summarize key points)

**Answers should:**
- Be self-contained (don't reference "as mentioned above")
- Include specific numbers, timeframes, dosages when relevant
- Provide actionable guidance
- Link to ingredient pages when mentioning ingredients (first mention only)
- Use credible, authoritative tone
- Be comprehensive enough for Google rich results

### FAQ Topics to Cover

**Every article should include FAQs about**:
1. **Main question/topic** (e.g., "Do dogs need X?")
2. **Safety** (e.g., "Is X safe for dogs?")
3. **Dosage/amount** (e.g., "How much X does my dog need?")
4. **Signs/symptoms** (e.g., "What are signs my dog needs X?")
5. **Comparison** (e.g., "What's the difference between X and Y?")
6. **Sources** (e.g., "What are the best sources of X?")
7. **Timing** (e.g., "When should I give my dog X?")
8. **Cost** (if relevant) (e.g., "How much does X cost per month?")
9. **Interactions** (if relevant) (e.g., "Can X interact with medications?")
10. **Alternatives** (e.g., "What's a better alternative to X?")
11-13. **Additional specific questions** relevant to topic

### Example FAQs

**Dog Post Example** (from digestive-enzymes-for-dogs.html):
```html
<div class="faq-item">
  <h3>Do dogs need digestive enzymes?</h3>
  <p>Most healthy dogs do NOT need digestive enzyme supplements—their pancreas produces sufficient amylase (carbohydrate digestion), protease (protein digestion), and lipase (fat digestion). Digestive enzymes are only necessary for dogs with specific conditions: exocrine pancreatic insufficiency (EPI), chronic pancreatitis, inflammatory bowel disease, or senior dogs with reduced pancreatic function. Healthy dogs eating appropriate diets already produce all the enzymes they need for complete digestion.</p>
</div>

<div class="faq-item">
  <h3>What are the signs my dog needs digestive enzymes?</h3>
  <p>Signs of enzyme deficiency (usually from EPI or pancreatic disease): chronic diarrhea with greasy, pale, foul-smelling stools; weight loss despite eating large amounts of food; increased appetite but poor body condition; undigested food in stool; gas and bloating; nutrient deficiencies (poor coat, muscle wasting). These symptoms require veterinary diagnosis—do not assume your dog needs enzymes based on occasional loose stools or gas, which are usually diet-related or caused by food intolerances.</p>
</div>
```

**Cat Post Example** (from taurine-for-cats.html):
```html
<div class="faq-item">
  <h3>Why is taurine essential for cats but not dogs?</h3>
  <p>Cats lack the metabolic enzymes needed to synthesize sufficient taurine from cysteine and methionine. While dogs can produce taurine from these precursor amino acids, cats cannot—making dietary taurine absolutely essential. Cats evolved as obligate carnivores eating prey high in taurine, so they never developed the biochemical pathway to produce it efficiently. Without dietary taurine, cats develop life-threatening conditions including dilated cardiomyopathy (DCM), central retinal degeneration leading to blindness, reproductive failure, and weakened immunity.</p>
</div>

<div class="faq-item">
  <h3>How much taurine do cats need daily?</h3>
  <p>AAFCO standards require minimum taurine levels in cat food: 0.1% (1000 mg/kg) in dry food and 0.2% (2000 mg/kg) in wet food on a dry matter basis. For a typical 10 lb adult cat, this translates to approximately 50-100 mg of taurine per day from commercial food. Wet food requires higher taurine levels because processing destroys more taurine. Pregnant, nursing, and growing cats need higher amounts. Cats eating homemade diets need careful supplementation—consult a veterinary nutritionist to ensure adequate taurine.</p>
</div>
```

**Key characteristics**:
- Comprehensive answers (3-5 sentences)
- Specific numbers and standards
- Actionable information
- Natural, conversational tone
- Self-contained (no cross-references)

---

## Internal Linking Guidelines

### When to Link

**Always link to**:
1. **Ingredient pages** (first mention only in article body)
   - Example: `<a href="/ingredient-analyzer/ingredients/taurine/">taurine</a>`
2. **Related blog posts** (when naturally relevant)
   - Example: `<a href="/blog/probiotics-for-dogs.html">probiotics for dogs</a>`
3. **Comprehensive guides** (in guide reference callout or when relevant)
   - Example: `<a href="/guides/dog-gut-health.html">Complete Guide to Dog Gut Health</a>`
4. **External research** (veterinary studies, credible sources)
   - Example: `<a href="https://pubmed.ncbi.nlm.nih.gov/12345678/" target="_blank" rel="noopener">Author et al., 2025</a>`

### Linking Rules

1. **Only link first meaningful mention** in article body text
   - Don't link in quick facts box
   - Don't link in article intro (usually)
   - Link in main article content sections
2. **3-10 links per article** to ingredient pages (robust articles have 8-12)
3. **Natural placement** - links should feel organic, not forced
4. **Descriptive anchor text** - use ingredient names or descriptive phrases
   - Good: `<a href="...">glucosamine</a>`
   - Bad: `<a href="...">click here</a>`
5. **No table header links** - never make `<th>` elements clickable
6. **External links open in new tab** - use `target="_blank" rel="noopener"`

### Link Density Guidelines

**Robust articles** (4000-6000 words):
- 8-12 ingredient page links
- 2-4 related blog post links
- 1-2 guide links (if applicable)
- 5-10 external research citations

**Shorter articles** (2000-3000 words):
- 3-7 ingredient page links
- 1-2 related blog post links
- 1 guide link (if applicable)
- 3-5 external research citations

### Example Linking in Context

```html
<p>Cats cannot synthesize <a href="/ingredient-analyzer/ingredients/taurine/">taurine</a> from other amino acids, making it absolutely essential in their diet. Unlike dogs, cats lack the metabolic enzymes needed for taurine production.</p>

<p><a href="/ingredient-analyzer/ingredients/probiotics/">Probiotics</a> and digestive enzymes serve completely different functions. Probiotics colonize the gut with beneficial bacteria, while enzymes break down food molecules for absorption.</p>

<p>For more on gut health support, see our comprehensive guide: <a href="/guides/dog-gut-health.html">Complete Guide to Dog Gut Health</a>.</p>

<p>Research shows taurine deficiency leads to dilated cardiomyopathy in cats (<a href="https://pubmed.ncbi.nlm.nih.gov/12345678/" target="_blank" rel="noopener">Smith et al., 2020</a>).</p>
```

---

## Quality Standards

### Content Quality Checklist

**Must have**:
- ✅ Evidence-based claims with research citations
- ✅ Specific numbers, dosages, percentages, timeframes
- ✅ Actionable takeaways (not just information dumps)
- ✅ Natural, conversational yet authoritative tone
- ✅ 2000-6000 word count (robust articles are 4000-6000 words)
- ✅ No marketing hype, sales language, or fear mongering
- ✅ 10-13 comprehensive FAQs

**Avoid**:
- ❌ Generic template text repeated across posts
- ❌ Vague statements without specifics ("may help", "some studies suggest")
- ❌ Academic/technical jargon without explanations
- ❌ Data dumps without interpretation or context
- ❌ Scare tactics or exaggerated claims
- ❌ Duplicate content from other pages on the site

### Writing Style Guidelines

**Tone**: Professional but approachable, like talking to a friend who values evidence

**Good examples**:
- ✅ "Most dogs don't need digestive enzyme supplements—their pancreas produces enough."
- ✅ "Taurine is absolutely essential for cats. Without it, they develop heart failure and blindness."
- ✅ "For a 50 lb dog, start with ½ to 1 teaspoon per meal."

**Bad examples**:
- ❌ "It has been determined through rigorous scientific investigation that..." (too academic)
- ❌ "This AMAZING supplement will TRANSFORM your dog's health!" (marketing hype)
- ❌ "Some research suggests it might possibly help in certain circumstances..." (vague)

**Specificity**: Always provide numbers when possible
- ✅ "50-100 mg per day for a 10 lb cat"
- ❌ "An appropriate amount for your cat"

**Clarity**: Break down complex topics
- Use analogies when helpful
- Define technical terms on first use
- Explain the "why" behind recommendations

### Pet-Specific Content Quality

**Dog posts should**:
- Acknowledge variability (breeds differ, individual needs vary)
- Note conditionally essential nutrients clearly
- Provide weight-based dosing ranges
- Include breed-specific information when relevant (e.g., EPI in German Shepherds)

**Cat posts should**:
- Emphasize obligate carnivore biology consistently
- Distinguish essential vs non-essential nutrients clearly
- Explain why cats differ from dogs (don't assume readers know)
- Mention DCM risk for taurine-related topics
- Warn about dog food and vegan diet dangers

### Technical Quality Checklist

**Before publishing**:
- ✅ All internal links work (no 404s)
- ✅ All external research links work and open in new tab
- ✅ Schema markup validates (use [Google Rich Results Test](https://search.google.com/test/rich-results))
- ✅ FAQ schema exactly matches FAQ section text
- ✅ Mobile responsive (test on phone/tablet viewport)
- ✅ Meta description under 160 characters
- ✅ Title tag 50-60 characters
- ✅ H1 matches article schema headline
- ✅ Analytics scripts present (Ahrefs + Google)
- ✅ Images have alt text (if images used)
- ✅ No broken formatting or CSS issues
- ✅ Grammar and spelling checked
- ✅ Quick facts box uses correct class (`quick-facts`, not `callout`)
- ✅ FAQ questions use `<h3>` tags (not `<div class="faq-question">`)

---

## Complete Template Example

**Minimal working template for new blog post**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Topic for Dogs/Cats: Specific Benefit | Watts</title>
    <meta name="description" content="Brief description under 160 characters with key benefit.">
    <link rel="canonical" href="https://wattspet.com/blog/article-slug.html">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://wattspet.com/blog/article-slug.html">
    <meta property="og:title" content="Topic for Dogs/Cats: Specific Benefit">
    <meta property="og:description" content="Brief description matching meta description">
    <meta property="og:image" content="https://wattspet.com/images/og-default.jpg">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://wattspet.com/blog/article-slug.html">
    <meta property="twitter:title" content="Topic for Dogs/Cats: Specific Benefit">
    <meta property="twitter:description" content="Brief description matching meta description">
    <meta property="twitter:image" content="https://wattspet.com/images/og-default.jpg">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- Analytics -->
    <script src="https://analytics.ahrefs.com/analytics.js" data-key="22KmtuYXO77ED5o6fe6z1w" async></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C6KV5WBGK5"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-C6KV5WBGK5');
    </script>

    <link rel="stylesheet" href="/css/blog-page.css">

    <!-- Article Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Complete H1 headline",
      "description": "Detailed description of article",
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
    </script>

    <!-- Breadcrumb Schema -->
    <script type="application/ld+json">
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
    </script>

    <!-- FAQ Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Question 1?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Answer 1. Must be 2-4+ sentences."
          }
        }
        // Continue for 10-13 questions
      ]
    }
    </script>
</head>

<body>
  <div class="header-wrapper">
    <header>
      <div class="header-container">
        <button class="hamburger" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/ingredient-analyzer/">Ingredient Analyzer</a></li>
          </ul>
        </nav>
        <div class="logo-container">
          <a href="/" aria-label="Watts home">
            <img src="/watts-logo-white.svg" alt="Watts" class="logo">
          </a>
        </div>
      </div>
    </header>
  </div>

  <main>
    <article>
      <!-- Optional: Guide reference -->
      <div style="background: #f0f9f4; border-left: 4px solid #2d5016; padding: 20px; margin-bottom: 40px; border-radius: 4px;">
        <p style="margin: 0; font-size: 16px;">📚 <strong>Part of our comprehensive guide:</strong> <a href="/guides/guide-name.html" style="color: #c03800; font-weight: 600;">Complete Guide Name</a></p>
      </div>

      <div class="article-header">
        <h1>Article Title: Specific Benefit</h1>
        <div class="article-meta">Last Updated March 6, 2026</div>

        <div class="quick-facts">
          <div class="quick-facts-content">
            <h2>Quick Answer: Main Question?</h2>
            <p style="margin-bottom: 16px; font-size: 18px; font-weight: 600; color: var(--text-dark);"><strong>Direct answer in 1-2 sentences.</strong></p>
            <p style="margin-bottom: 12px; font-size: 15px;"><strong>Key point:</strong> Detail</p>
            <p style="margin-bottom: 12px; font-size: 15px;"><strong>Key point:</strong> Detail</p>
            <p style="margin-bottom: 0; font-size: 15px;"><strong>Key point:</strong> Detail</p>
          </div>
        </div>

        <p class="article-intro">Compelling introduction paragraph that hooks the reader and previews what the article will cover in 150-250 words.</p>
      </div>

      <div class="article-content">

        <h2>Main Section 1</h2>
        <p>Content...</p>

        <h2>Main Section 2</h2>
        <p>Content...</p>

        <h2>Key Takeaways: [Topic] for Dogs/Cats</h2>
        <ol>
          <li><strong>Takeaway 1</strong>—specific point</li>
          <li><strong>Takeaway 2</strong>—specific point</li>
        </ol>

        <h2>Frequently Asked Questions</h2>

        <div class="faq-item">
          <h3>Question 1?</h3>
          <p>Answer 1 in 2-4+ sentences with comprehensive information.</p>
        </div>

        <div class="faq-item">
          <h3>Question 2?</h3>
          <p>Answer 2 in 2-4+ sentences with comprehensive information.</p>
        </div>

        <!-- Continue for 10-13 FAQs -->

      </div>
    </article>
  </main>

  <div class="footer-wrapper">
    <footer>
      <div class="footer-content">
        <div class="footer-left"></div>
        <div class="footer-right">
          <div class="footer-right-text">
            <p><a href="mailto:info@wattspet.com">info@wattspet.com</a></p>
            <p style="margin-top: 12px;">© <span id="year"></span> Watts Pet. All rights reserved.</p>
          </div>
          <img src="/watts-logo-white.svg" alt="Watts" class="footer-logo">
        </div>
      </div>
    </footer>
  </div>

  <script>
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('header nav ul');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
      });

      const navLinks = navMenu.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
        });
      });

      document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
        }
      });
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  </script>
</body>
</html>
```

---

## Version History

- **v1.0** (March 6, 2026): Initial documentation created
- **v2.0** (March 6, 2026): Updated based on most robust dog articles (digestive-enzymes-for-dogs.html, can-dogs-take-human-supplements.html) for accuracy and completeness
