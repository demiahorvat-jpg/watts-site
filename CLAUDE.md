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
