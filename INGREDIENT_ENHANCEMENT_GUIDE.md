# Ingredient Enhancement Guide

## Preventing Broken Links in compareToSimilar Sections

### The Problem
When AI agents create compareToSimilar links, they may reference ingredient slugs that don't actually exist in the database, resulting in 404 errors.

### The Solution: Always Verify Slugs Exist

**Before adding any ingredient slug to a compareToSimilar section, you MUST:**

1. **Check the actual slug exists in data/ingredients.json**
2. **Use exact slug matches** - don't guess or assume slugs

### Common Slug Mistakes

| ❌ Wrong (assumed) | ✅ Correct (actual) |
|-------------------|-------------------|
| vitamin-c | ascorbic-acid |
| brewers-yeast | brewers-dried-yeast |
| vitamin-e | mixed-tocopherols |
| chicory-root | dried-chicory-root |
| cornstarch | corn-starch |
| methionine | dl-methionine |
| psyllium | psyllium-husk |
| wheatgrass | barley-grass (or similar) |
| vitamin-b12 | vitamin-b12-supplement |
| corn-flour | corn-meal |
| thiamine | thiamine-mononitrate |
| sweet-potato | dried-sweet-potatoes |
| zinc | zinc-proteinate |
| fos | fructooligosaccharides |

### How to Verify Slugs

**Method 1: Query the JSON**
```javascript
const db = require('./data/ingredients.json');
const ingredientNames = db.ingredients.map(i => i.name);
// Check if ingredient exists before using its slug
```

**Method 2: Check the slug map**
```javascript
const slugMap = require('./ingredient-analyzer/ingredient-slugs.json');
// slugMap contains all valid ingredient slugs
```

**Method 3: Use the slugify function**
```javascript
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
// But ALWAYS verify the result exists in the database
```

### Best Practice Prompt Template

When creating compareToSimilar sections, use this approach:

```
1. Read data/ingredients.json
2. Extract all ingredient names: db.ingredients.map(i => i.name)
3. For each comparison you want to make:
   a. Check if the target ingredient exists in the ingredient list
   b. If it exists, create the slug: slugify(ingredientName)
   c. Add to compareToSimilar array
4. Never use a slug without verifying the ingredient exists
```

### Validation Script

Run this after making changes to check for broken links:

```bash
node -e "const db = require('./data/ingredients.json'); const allSlugs = db.ingredients.map(i => slugify(i.name)); db.ingredients.forEach(ing => { if (ing.whatItIsExpanded?.compareToSimilar) { ing.whatItIsExpanded.compareToSimilar.forEach(c => { if (!allSlugs.includes(c.ingredient)) { console.log('BROKEN:', ing.name, '->', c.ingredient); } }); } });"
```

### Redirect Pages to Exclude

These ingredient slugs are redirect pages (not real ingredients):
- alginic-acid → sodium-alginate
- calcium-d-pantothenate → calcium-pantothenate
- camellia-sinensis → green-tea-extract
- iron-sulfate → ferrous-sulfate
- niacin-supplement → niacin
- riboflavin-supplement → riboflavin
- sodium-chloride → salt
- vitamin-k1-supplement → vitamin-k1
- guar-fiber → guar-gum
- lions-mane → (redirect)

**Never link to these in compareToSimilar sections - use the main ingredient instead.**

## Summary

✅ **DO:**
- Verify every slug exists before using it
- Use exact ingredient names from the database
- Check the ingredients.json file
- Use the main ingredient, not the redirect

❌ **DON'T:**
- Assume logical slugs exist
- Guess slug formats
- Link to redirect pages
- Create comparisons without verification
