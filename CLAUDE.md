# Project Guidelines for Claude

## Internal Link Validation

**CRITICAL: Always verify internal links exist before creating them.**

When creating links to ingredient pages, blog posts, or guide pages:

1. **Ingredient pages** (`/ingredient-analyzer/ingredients/[name]/`):
   - Use `ls ingredient-analyzer/ingredients/` or `Glob` to verify the page exists
   - Ingredient page names are specific (e.g., `zinc-amino-acid-chelate`, not `zinc`)
   - Common naming patterns:
     - Minerals often have forms: `iron-amino-acid-chelate`, `zinc-oxide`, `copper-proteinate`
     - Vitamins may use specific forms: `folic-acid` (not `folate`), `omega-3-fatty-acids` (not `dha`)
     - Ingredients use kebab-case: `yeast-beta-glucans`, `choline-chloride`

2. **Blog posts** (`/blog/[name].html`):
   - Verify the file exists in the `blog/` directory before linking

3. **Guide pages** (`/guides/[name].html`):
   - Verify the file exists in the `guides/` directory before linking
   - If a guide is planned but doesn't exist yet, use "Guide coming soon" text instead of a broken link

## Link Fix Reference

When fixing broken links, common mappings:
- `folate` → `folic-acid`
- `dha` → `omega-3-fatty-acids`
- `choline` → `choline-chloride`
- `iron` → `iron-amino-acid-chelate` (or `ferrous-sulfate`, `iron-proteinate`)
- `zinc` → `zinc-amino-acid-chelate` (or `zinc-oxide`, `zinc-methionine-complex`)
- `beta-glucan` → `yeast-beta-glucans`

If no equivalent page exists, remove the link but keep the descriptive text.

## Static Header Specification

The clean static header (used in preview pages) lives in the `<style>` block of each preview HTML file. Key values confirmed against live Shopify site computed styles at desktop viewport:

**Outer wrapper** (`.site-header`):
- `position: sticky; top: 0; z-index: 110`
- `padding: 8px min(2.5vw, 16px)` — creates the black gap around the pill

**Orange pill** (`.header-pill`):
- `background: #c03800`
- `padding: 20px 26px`
- `border-radius: 16px` (desktop), `24px` (≤1024px)
- Total height: ~55px; full header: ~71px

**Nav links** (`.site-header nav a`) and actions:
- `font: 600 14px/1 "Degular", sans-serif`
- `text-transform: uppercase; letter-spacing: 0.04em`
- `color: #f1f1f1`
- CART link gets `text-decoration: underline`

**Logo** (`.header-logo-letters`):
- `height: 20px` — static SVG letters W/A/T/T/S with cropped viewBoxes
- `position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%)`

**Mobile** (≤1024px): nav + account link hidden, burger shown, logo swaps to simple W mark (`height: 18px`)

**Font rendering**: `body { -webkit-font-smoothing: antialiased; }`

**Classes used**: `.site-header`, `.header-pill`, `.header-nav`, `.header-logo`, `.header-logo-letters`, `.header-logo-simple`, `.header-actions`, `.header-cart-btn`, `.header-account-link`, `.header-burger`, `.header-mobile-menu`

## Meta Description Best Practices

**Target length: 120-155 characters** (optimal for SEO, avoids truncation in search results)

Guidelines:
- **Minimum:** 120 characters (under 100 is too short, hurts SEO)
- **Maximum:** 155 characters (over 160 gets truncated in Google)
- **Sweet spot:** 130-150 characters
- Include primary keyword naturally
- Write compelling copy that encourages clicks
- Each page needs a unique meta description
- Start with the most important information
- Use active voice when possible
