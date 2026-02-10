# Watts Pet Design System
**Version 1.0 - February 10, 2026**

This document defines the complete visual design system for the Watts Pet website, based on the new Shopify brand identity.

---

## 1. Color Palette

### Primary Colors
```css
--brand-orange: #c03800;    /* Primary brand color - headers, footers, accents */
--accent-navy: #1e3a5f;     /* Interactive elements - links, buttons */
```

### Neutral Colors
```css
--text-dark: #191919;       /* Primary text color, headlines */
--text-muted: #666666;      /* Secondary text, metadata */
--bg-light: #f1f1f1;        /* Page background, subtle sections */
--white: #ffffff;           /* Card backgrounds, clean sections */
--border-light: rgba(25, 25, 25, 0.1);  /* Subtle borders and dividers */
```

### Color Usage Guidelines
- **Orange (#c03800)**: Use for structural brand elements (header, footer), primary callout boxes, arrows/icons
- **Navy (#1e3a5f)**: Use for all text links and interactive elements
- **Dark (#191919)**: Use for all body text and headlines
- **Light Gray (#f1f1f1)**: Use for page backgrounds and subtle section backgrounds
- **White (#ffffff)**: Use for content cards, article backgrounds, and clean sections
- **DO NOT**: Overuse orange in body content - reserve it for structural/brand elements

---

## 2. Typography

### Font Family
**Degular** - Custom brand typeface with multiple weights

### Font Files
Located in `/fonts/`:
- `Degular-Regular.woff2` (400 weight)
- `Degular-Medium.woff2` (500 weight)
- `Degular-Semibold.woff2` (600 weight)
- `Degular-Bold.woff2` (700 weight)

### @font-face Declaration
```css
@font-face {
  font-family: 'Degular';
  src: url('/fonts/Degular-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Degular';
  src: url('/fonts/Degular-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Degular';
  src: url('/fonts/Degular-Semibold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Degular';
  src: url('/fonts/Degular-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Typography Scale

#### Body Text
```css
body {
  font-family: 'Degular', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 500;  /* Medium is the base weight */
  line-height: 1.6;
}

p {
  font-size: 17px;
  font-weight: 500;
  line-height: 1.7;
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  p {
    font-size: 18px;
    margin-bottom: 24px;
  }
}
```

#### Headlines
```css
h1 {
  font-size: 32px;
  font-weight: 700;  /* Bold */
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text-dark);
  margin-bottom: 16px;
}
@media (min-width: 768px) {
  h1 {
    font-size: 48px;
    margin-bottom: 20px;
  }
}

h2 {
  font-size: 28px;
  font-weight: 700;  /* Bold */
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--text-dark);
  margin: 56px 0 24px;
}
@media (min-width: 768px) {
  h2 {
    font-size: 36px;
    margin: 64px 0 28px;
  }
}

h3 {
  font-size: 24px;
  font-weight: 600;  /* Semibold */
  line-height: 1.3;
  color: var(--text-dark);
  margin: 40px 0 16px;
}
@media (min-width: 768px) {
  h3 {
    font-size: 28px;
    margin: 48px 0 20px;
  }
}
```

#### Intro/Lead Text
```css
.article-intro {
  font-size: 19px;
  font-weight: 500;  /* Medium */
  line-height: 1.6;
  color: var(--text-muted);
  margin-bottom: 0;
}
@media (min-width: 768px) {
  .article-intro {
    font-size: 21px;
  }
}
```

#### Metadata/Small Text
```css
.article-meta {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
}
```

#### Links
```css
a {
  color: var(--accent-navy);
  transition: opacity 0.2s ease;
}
a:hover {
  opacity: 0.7;
}

.article-intro a {
  color: var(--accent-navy);
  text-decoration: none;
  font-weight: 600;  /* Semibold for emphasis */
  border-bottom: 1px solid var(--accent-navy);
}
```

#### Strong/Bold Text
```css
strong {
  font-weight: 600;  /* Semibold, not full Bold */
}
```

#### Lists
```css
li {
  font-size: 17px;
  font-weight: 500;
  line-height: 1.7;
  margin-bottom: 12px;
}
@media (min-width: 768px) {
  li {
    font-size: 18px;
  }
}
```

### Font Weight Usage Guide
- **400 (Regular)**: Not used as base - only for very specific light text needs
- **500 (Medium)**: Base body text weight, paragraphs, list items, metadata
- **600 (Semibold)**: Strong emphasis, H3 headings, button text, callouts
- **700 (Bold)**: H1 and H2 headings, major emphasis

---

## 3. Header Design

### Structure
The header uses a **layered design** with black padding around a rounded orange bar.

### HTML Structure
```html
<div class="header-wrapper">
  <header>
    <div class="header-container">
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about.html">About</a></li>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/ingredient-analyzer/">Ingredients</a></li>
        </ul>
      </nav>
      <div class="logo-container">
        <img src="/watts-logo-white.svg" alt="Watts" class="logo">
      </div>
    </div>
  </header>
</div>
```

### CSS Implementation
```css
/* Black background wrapper */
.header-wrapper {
  background: #191919;
  padding: 12px 12px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Orange rounded header bar */
header {
  background: var(--brand-orange);
  padding: 7px 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  min-height: 40px;
}

/* Navigation on the LEFT */
nav {
  order: -1;
  display: flex;
  align-items: center;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 16px;
  align-items: center;
  margin: 0;
  padding: 0;
}
@media (min-width: 768px) {
  nav ul { gap: 24px; }
}

nav li {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}

nav a {
  color: var(--white);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s ease;
  line-height: 1;
  padding: 0;
  margin: 0;
}
@media (min-width: 768px) {
  nav a { font-size: 15px; }
}
nav a:hover {
  opacity: 0.8;
}

/* Logo CENTERED */
.logo-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo {
  height: 32px;
}
@media (min-width: 768px) {
  .logo { height: 40px; }
}
```

### Key Design Principles
- **Centered logo**: Uses absolute positioning to remain perfectly centered
- **Left-aligned navigation**: Navigation items are on the left side
- **Compact height**: Minimal padding to keep header sleek (40px min-height)
- **Black frame**: 12px black padding creates visual frame around orange bar
- **Fully rounded corners**: 16px border-radius on all corners
- **Sticky positioning**: Header stays at top when scrolling

---

## 4. Footer Design

### Structure
The footer uses an **asymmetric rounded design** with a curved left side and standard rounded right side.

### HTML Structure
```html
<div class="footer-wrapper">
  <footer>
    <div class="footer-content">
      <div class="footer-left">
        <!-- Optional left content -->
      </div>
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
```

### CSS Implementation
```css
/* Black background wrapper */
.footer-wrapper {
  background: #191919;
  padding: 0 12px 12px;
  margin-top: 80px;
}

/* Orange footer with asymmetric rounded shape */
footer {
  background: var(--brand-orange);
  color: var(--white);
  padding: 45px 40px 20px;
  border-radius: 200px 16px 16px 200px;  /* Large curve left, standard right */
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  min-height: 144px;
}
@media (min-width: 768px) {
  footer {
    padding: 63px 60px 24px;
    min-height: 207px;
    border-radius: 300px 16px 16px 300px;
  }
}

.footer-content {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-left {
  flex: 1;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
  flex: 1;
}
@media (min-width: 768px) {
  .footer-right {
    gap: 32px;
  }
}

.footer-right-text {
  text-align: right;
}

.footer-logo {
  height: 100px;
  margin-top: 128px;
  margin-bottom: 0;
}
@media (min-width: 768px) {
  .footer-logo {
    height: 160px;
    margin-top: 160px;
    margin-bottom: 0;
  }
}

footer p {
  color: var(--white);
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
}

footer a {
  color: var(--white);
  text-decoration: none;
  font-weight: 500;
}
footer a:hover {
  text-decoration: underline;
}
```

### Key Design Principles
- **Asymmetric curves**: Left side has large circular curve (200px/300px radius), right side has standard rounded corners (16px)
- **Bottom-aligned logo**: Large logo positioned at very bottom with significant top margin
- **Right-aligned content**: Text and logo stack vertically on right side
- **Black frame**: 12px black padding on sides and bottom
- **Minimal bottom padding**: Logo sits at absolute bottom of footer (20-24px padding)
- **Compact height**: Footer is relatively short to avoid overwhelming the page

---

## 5. Main Content Layout

### Page Background
```css
body {
  background: #191919;  /* Dark background behind everything */
}

main {
  max-width: 900px;
  margin: 16px auto 40px;
  padding: 0 20px;
  background: var(--bg-light);  /* Light gray background for content area */
}
@media (min-width: 768px) {
  main {
    margin: 20px auto 60px;
    padding: 0 40px;
  }
}
```

### Article Container
```css
article {
  background: var(--white);
  padding: 40px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
@media (min-width: 768px) {
  article {
    padding: 60px 50px;
  }
}
```

### Article Header
```css
.article-header {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 2px solid var(--border-light);
}
```

### Key Principles
- **Narrow gap after header**: Only 16-20px between header and content start
- **White content cards**: Article content sits in white rounded cards
- **Light gray background**: Provides subtle separation between content and page edges
- **Generous padding**: Content has breathing room (40-60px vertical padding)
- **Max-width 900px**: Optimal reading width for blog content

---

## 6. Callout Box Pattern (Layered Design)

### Structure
A **layered card design** with an orange pointed base and white rounded content card on top.

### HTML Structure
```html
<div class="quick-facts">
  <div class="quick-facts-content">
    <h3>Box Title</h3>
    <ul>
      <li><strong>Point</strong> — Description text</li>
      <li><strong>Point</strong> — Description text</li>
    </ul>
  </div>
</div>
```

### CSS Implementation
```css
/* Orange base layer with sharp corners */
.quick-facts {
  position: relative;
  background: var(--brand-orange);
  border-radius: 4px;  /* Sharp corners */
  padding: 8px;
  margin: 48px 0;
}

/* White content card with rounded corners */
.quick-facts-content {
  background: var(--white);
  color: var(--text-dark);
  border-radius: 12px;
  padding: 24px 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
@media (min-width: 768px) {
  .quick-facts-content {
    padding: 28px 36px;
  }
}

.quick-facts h3 {
  font-size: 24px;
  font-weight: 600;
  margin-top: 4px;
  margin-bottom: 20px;
  color: var(--text-dark);
}
@media (min-width: 768px) {
  .quick-facts h3 {
    font-size: 28px;
  }
}

.quick-facts ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.quick-facts li {
  padding: 8px 0;
  padding-left: 28px;
  position: relative;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
}
@media (min-width: 768px) {
  .quick-facts li {
    font-size: 17px;
  }
}

.quick-facts li:before {
  content: "→";
  position: absolute;
  left: 0;
  top: 8px;
  font-weight: 700;
  color: var(--brand-orange);
}

.quick-facts a {
  color: var(--accent-navy);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.quick-facts a:hover {
  opacity: 0.85;
}
```

### Key Principles
- **Two-layer design**: Orange base (4px border-radius) with white card (12px border-radius) on top
- **8px padding**: Creates the orange "frame" around white content
- **Orange arrows**: Use arrow (→) instead of bullets, colored orange
- **Navy links**: Links remain navy even in callout boxes (not white, not orange)
- **Compact spacing**: Reduced padding to avoid callout box dominating the page

---

## 7. Simple Callout Box Pattern

### Structure
A lighter callout box with orange left border for less prominent notes.

### CSS Implementation
```css
.callout {
  background: var(--bg-light);
  border-left: 4px solid var(--brand-orange);
  border-radius: 8px;
  padding: 24px 28px;
  margin: 32px 0;
}
@media (min-width: 768px) {
  .callout {
    padding: 28px 32px;
  }
}

.callout p:last-child {
  margin-bottom: 0;
}
```

---

## 8. Table Styles

### CSS Implementation
```css
table {
  width: 100%;
  border-collapse: collapse;
  margin: 32px 0;
  font-size: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
@media (min-width: 768px) {
  table {
    font-size: 17px;
  }
}

thead {
  background: var(--brand-orange);
  color: var(--white);
  font-weight: 700;
}

th, td {
  text-align: left;
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
}
@media (min-width: 768px) {
  th, td {
    padding: 18px 20px;
  }
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr {
  background: var(--white);
  transition: background 0.2s ease;
}

tbody tr:hover {
  background: rgba(192, 56, 0, 0.02);
}
```

### Key Principles
- **Orange header**: Table headers use orange background with white text
- **Rounded corners**: 12px border-radius with overflow hidden
- **Hover effect**: Subtle orange tint on row hover
- **Clean borders**: Light borders between rows, no border on last row

---

## 9. FAQ Section

### CSS Implementation
```css
.faq-section {
  margin-top: 64px;
  padding-top: 56px;
  border-top: 3px solid var(--border-light);
}

.faq-item {
  margin-bottom: 32px;
  padding: 28px;
  background: var(--bg-light);
  border-radius: 12px;
  border-left: 4px solid var(--brand-orange);
}

.faq-item h3 {
  font-size: 20px;
  margin: 0 0 16px 0;
  color: var(--brand-orange);
}
@media (min-width: 768px) {
  .faq-item h3 {
    font-size: 23px;
  }
}

.faq-item p {
  margin-bottom: 0;
}
```

### Key Principles
- **Orange question text**: FAQ questions use orange color for emphasis
- **Light background**: Light gray background distinguishes from main content
- **Orange left border**: Consistent with simple callout pattern
- **Clear separation**: 3px top border separates FAQ section from main content

---

## 10. Related Articles Section (Blog Posts)

### Purpose
The Related Articles section appears at the end of blog posts to guide readers to relevant content. It should be visually consistent, easy to scan, and encourage further reading.

### Standard Format
```html
<h2 style="margin-top: 56px; padding-top: 40px; border-top: 2px solid var(--border-light);">Related Articles</h2>

<div style="display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 56px;">
  <a href="/blog/article-url.html" style="display: block; padding: 16px 20px; border: 3px solid var(--brand-orange); background: var(--white); border-radius: 12px; text-decoration: none; color: var(--text-dark); transition: background 0.15s;">
    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">Article Title</h3>
    <p style="font-size: 15px; color: var(--text-muted); margin: 0;">Brief description of the article</p>
  </a>
  <a href="/blog/article-url.html" style="display: block; padding: 16px 20px; border: 3px solid var(--brand-orange); background: var(--white); border-radius: 12px; text-decoration: none; color: var(--text-dark); transition: background 0.15s;">
    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">Article Title</h3>
    <p style="font-size: 15px; color: var(--text-muted); margin: 0;">Brief description of the article</p>
  </a>
  <a href="/blog/article-url.html" style="display: block; padding: 16px 20px; border: 3px solid var(--brand-orange); background: var(--white); border-radius: 12px; text-decoration: none; color: var(--text-dark); transition: background 0.15s;">
    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">Article Title</h3>
    <p style="font-size: 15px; color: var(--text-muted); margin: 0;">Brief description of the article</p>
  </a>
</div>
```

### Key Design Elements

#### Section Header
```css
h2 {
  margin-top: 56px;
  padding-top: 40px;
  border-top: 2px solid var(--border-light);
}
```
- **Top border separator**: 2px border creates visual separation from article content
- **Generous spacing**: 56px margin-top + 40px padding-top for clear section break

#### Grid Container
```css
div {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 56px;
}
```
- **Single column layout**: Easy to scan on all screen sizes
- **16px gap**: Compact but breathable spacing between cards
- **Bottom margin**: 56px creates space before footer

#### Article Cards
```css
a {
  display: block;
  padding: 16px 20px;  /* Specific: 16px top/bottom, 20px left/right */
  border: 3px solid var(--brand-orange);
  background: var(--white);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-dark);
  transition: background 0.15s;
}
```
- **3px orange border**: Provides visual weight and brand consistency
- **Specific padding**: 16px vertical, 20px horizontal (not 20px all around)
- **12px border-radius**: Consistent with content card radius
- **Hover effect**: Use `transition: background 0.15s` for smooth hover state

#### Card Title
```css
h3 {
  font-size: 18px;
  font-weight: 600;  /* Semibold */
  margin: 0 0 8px 0;  /* Specific: only bottom margin */
}
```
- **Fixed 18px size**: Does not scale up on desktop (keeps cards compact)
- **Semibold weight**: Balanced emphasis without being too heavy
- **8px bottom margin**: Tight spacing to description

#### Card Description
```css
p {
  font-size: 15px;
  color: var(--text-muted);
  margin: 0;
}
```
- **Smaller 15px size**: Clearly subordinate to title
- **Muted color**: Distinguishes from title text
- **No margin**: Clean alignment at card bottom

### Placement Guidelines

1. **Before FAQ section**: If the blog post has a "Frequently Asked Questions" section, place Related Articles immediately before it
2. **Before `</main>`**: If there's no FAQ section, place Related Articles as the last element before the closing `</main>` tag
3. **After main content**: Always place after all article content and callout boxes

### Best Practices

#### Number of Articles
- **Recommended**: 3-4 related articles
- **Minimum**: 3 articles (fewer looks sparse)
- **Maximum**: 5 articles (more becomes overwhelming)

#### Article Selection
- Choose articles that are genuinely related to the current topic
- Prioritize articles that provide deeper information on subtopics mentioned
- Consider user journey: what would a reader naturally want to learn next?
- Link to both foundational content and advanced topics

#### Title and Description Writing
- **Title**: Keep concise (3-6 words), match the actual article H1
- **Description**: 8-12 words explaining what the article covers
- **Descriptions**: Should be unique and informative, not generic
- **Tone**: Direct and helpful, matching overall site voice

### Inline Styles Required
All Related Articles sections use inline styles (not CSS classes) to ensure consistency and portability. This approach:
- Prevents style inheritance issues
- Makes it easy to copy sections between posts
- Ensures visual consistency even if global CSS changes
- Simplifies maintenance and updates

### Example Implementation
```html
<!-- At end of blog post, before FAQ or before </main> -->
<h2 style="margin-top: 56px; padding-top: 40px; border-top: 2px solid var(--border-light);">Related Articles</h2>

<div style="display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 56px;">
  <a href="/blog/protein-for-dogs.html" style="display: block; padding: 16px 20px; border: 3px solid var(--brand-orange); background: var(--white); border-radius: 12px; text-decoration: none; color: var(--text-dark); transition: background 0.15s;">
    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">Protein for Dogs</h3>
    <p style="font-size: 15px; color: var(--text-muted); margin: 0;">Why active dogs need optimal protein levels</p>
  </a>
  <a href="/blog/beef-liver-for-dogs.html" style="display: block; padding: 16px 20px; border: 3px solid var(--brand-orange); background: var(--white); border-radius: 12px; text-decoration: none; color: var(--text-dark); transition: background 0.15s;">
    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">Beef Liver for Dogs</h3>
    <p style="font-size: 15px; color: var(--text-muted); margin: 0;">Nutrient-dense organ meat for working dogs</p>
  </a>
  <a href="/blog/joint-supplements-for-dogs.html" style="display: block; padding: 16px 20px; border: 3px solid var(--brand-orange); background: var(--white); border-radius: 12px; text-decoration: none; color: var(--text-dark); transition: background 0.15s;">
    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">Joint Supplements for Dogs</h3>
    <p style="font-size: 15px; color: var(--text-muted); margin: 0;">Supporting active dogs' joint health</p>
  </a>
</div>
```

### Common Mistakes to Avoid
- ❌ Don't use padding: 20px (use 16px 20px instead)
- ❌ Don't scale H3 to different sizes on desktop (keep at 18px)
- ❌ Don't give H3 top margin (use margin: 0 0 8px 0)
- ❌ Don't use fewer than 3 or more than 5 articles
- ❌ Don't write generic descriptions like "Learn more about this topic"
- ❌ Don't forget the 2px top border on the H2
- ❌ Don't use CSS classes instead of inline styles

---

## 11. Spacing System

### Vertical Rhythm
```css
/* Minimal gap between header and content */
main { margin-top: 16px; }  /* Mobile */
main { margin-top: 20px; }  /* Desktop */

/* Section spacing */
h2 { margin-top: 56px; }    /* Mobile */
h2 { margin-top: 64px; }    /* Desktop */

h3 { margin-top: 40px; }    /* Mobile */
h3 { margin-top: 48px; }    /* Desktop */

/* Component spacing */
.quick-facts { margin: 48px 0; }
.callout { margin: 32px 0; }
table { margin: 32px 0; }
```

### Horizontal Padding
```css
/* Mobile */
header, footer { padding-left: 20px; padding-right: 20px; }
main { padding-left: 20px; padding-right: 20px; }
article { padding: 40px 24px; }

/* Desktop (768px+) */
header, footer { padding-left: 60px; padding-right: 60px; }
main { padding-left: 40px; padding-right: 40px; }
article { padding: 60px 50px; }
```

---

## 12. Border Radius System

### Standard Values
```css
/* Large elements (headers, footers, cards) */
border-radius: 16px;

/* Medium elements (callouts, content cards) */
border-radius: 12px;

/* Small elements (buttons, badges) */
border-radius: 8px;

/* Sharp elements (layered base) */
border-radius: 4px;

/* Circular curves (footer left side) */
border-radius: 200px;  /* Mobile */
border-radius: 300px;  /* Desktop */
```

---

## 13. Shadow System

### Elevation Levels
```css
/* Subtle elevation (cards) */
box-shadow: 0 2px 12px rgba(0,0,0,0.06);

/* Medium elevation (callout content) */
box-shadow: 0 2px 8px rgba(0,0,0,0.06);

/* Header elevation */
box-shadow: 0 2px 8px rgba(0,0,0,0.2);

/* Table elevation */
box-shadow: 0 2px 8px rgba(0,0,0,0.08);
```

### Key Principles
- Use shadows sparingly for depth
- Darker shadows for interactive/floating elements (header)
- Lighter shadows for content cards
- Always use subtle, natural shadows

---

## 14. Responsive Breakpoint

### Single Breakpoint Strategy
```css
/* Mobile-first: Base styles are for mobile */

/* Desktop: Single breakpoint at 768px */
@media (min-width: 768px) {
  /* Desktop styles */
}
```

### Key Principles
- **Mobile-first**: All base styles are optimized for mobile
- **Single breakpoint**: 768px is the only breakpoint needed
- **Proportional scaling**: Desktop sizes are typically 1.2-1.5x mobile sizes
- **Maintain readability**: Don't make desktop text too large

---

## 15. Logo Assets

### Files
Located in root directory:
- `/watts-logo-white.svg` - White wordmark for orange backgrounds
- `/watts-logo-brown.svg` - Brown wordmark for light backgrounds

### Usage
- **Header**: White logo on orange background
- **Footer**: White logo on orange background
- **Light sections**: Brown logo if needed on white/light backgrounds

### Sizing
```css
/* Header logo */
.logo { height: 32px; }  /* Mobile */
.logo { height: 40px; }  /* Desktop */

/* Footer logo */
.footer-logo { height: 100px; }  /* Mobile */
.footer-logo { height: 160px; }  /* Desktop */
```

---

## 16. Implementation Checklist

When applying this design system to a new page:

### Setup
- [ ] Include all 4 Degular font files in `/fonts/` directory
- [ ] Add @font-face declarations for all weights
- [ ] Define CSS custom properties (color variables)
- [ ] Set body font to Degular Medium (500 weight)
- [ ] Set body background to dark (#191919)

### Header
- [ ] Create header-wrapper with black background
- [ ] Create orange header bar with 16px border-radius
- [ ] Position navigation on left side
- [ ] Center logo absolutely
- [ ] Use white logo SVG
- [ ] Set header to sticky positioning
- [ ] Compact height (40px min-height)

### Footer
- [ ] Create footer-wrapper with black background
- [ ] Apply asymmetric border-radius (300px 16px 16px 300px on desktop)
- [ ] Position content on right side
- [ ] Stack text above logo vertically
- [ ] Push logo to very bottom with large top margin
- [ ] Use white logo SVG
- [ ] Align items to bottom

### Typography
- [ ] H1: 32px/48px, Bold (700), dark color
- [ ] H2: 28px/36px, Bold (700), dark color
- [ ] H3: 24px/28px, Semibold (600), dark color
- [ ] Body: 17px/18px, Medium (500), 1.7 line-height
- [ ] Links: Navy color (#1e3a5f), Semibold (600) for emphasis
- [ ] Strong: Semibold (600), not Bold

### Content Layout
- [ ] Main content: 900px max-width
- [ ] Minimal gap after header (16-20px)
- [ ] White article cards with 12px border-radius
- [ ] Light gray page background
- [ ] Generous internal padding (40-60px)

### Components
- [ ] Layered callout boxes: Orange base (4px radius) + white card (12px radius)
- [ ] Simple callouts: Light gray background + orange left border
- [ ] Tables: Orange header, rounded corners, hover effect
- [ ] FAQ: Orange questions, light background, orange left border
- [ ] Use orange arrows (→) for list bullets in callouts

### Colors
- [ ] Orange: Only for structural elements and accents
- [ ] Navy: All body content links
- [ ] Dark: All headlines and body text
- [ ] No orange headlines in body content
- [ ] White links in footer only

### Spacing
- [ ] 48px margin around callout boxes
- [ ] 56-64px margin above H2 elements
- [ ] 40-48px margin above H3 elements
- [ ] 32px margin around simple callouts and tables

---

## 17. Common Mistakes to Avoid

### Typography
- ❌ Don't use Regular (400) as body text weight
- ❌ Don't use Bold (700) for strong text - use Semibold (600)
- ❌ Don't make H2 too close in size to H1
- ❌ Don't use orange for body headlines

### Colors
- ❌ Don't overuse orange in content
- ❌ Don't use orange for body links - use navy
- ❌ Don't use green or brown link colors (tested and rejected)
- ❌ Don't mix link colors - stay consistent with navy

### Layout
- ❌ Don't make header too tall - keep it compact
- ❌ Don't center footer content - keep it right-aligned
- ❌ Don't use full orange background for callout boxes
- ❌ Don't add excessive gap between header and content

### Components
- ❌ Don't forget the two-layer structure for prominent callouts
- ❌ Don't make footer logo too small - it should be prominent
- ❌ Don't center-align footer logo - keep it bottom-right
- ❌ Don't use symmetric border-radius on footer

---

## 18. File Reference

Test implementation: `/Users/demihorvat/Projects/watts-site/blog/bone-broth-REDESIGN-v2.html`

This file contains the complete working implementation of all design system elements and can be used as a reference when applying the design to other pages.

---

## 19. Version History

**v1.0 - February 10, 2026**
- Initial design system documentation
- Based on new Shopify brand identity
- Tested on blog post redesign
- Includes all component patterns, typography, colors, and layout principles
