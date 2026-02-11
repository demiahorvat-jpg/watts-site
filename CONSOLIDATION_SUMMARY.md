# Ingredient Consolidation Summary

This document summarizes the ingredient consolidations performed on the ingredients.json file.

## Successfully Consolidated

The following duplicate ingredients were consolidated and redirect pages were created:

### 1. Salt ← Sodium Chloride
- **Main ingredient**: Salt
- **Removed**: Sodium Chloride
- **Redirect created**: `/ingredient-analyzer/ingredients/sodium-chloride/` → `/ingredient-analyzer/ingredients/salt/`
- **Alias added**: "sodium chloride" (already existed)

### 2. Ferrous Sulfate ← Iron Sulfate
- **Main ingredient**: Ferrous Sulfate
- **Removed**: Iron Sulfate
- **Redirect created**: `/ingredient-analyzer/ingredients/iron-sulfate/` → `/ingredient-analyzer/ingredients/ferrous-sulfate/`
- **Alias added**: "iron sulfate"

### 3. Green Tea Extract ← Camellia Sinensis
- **Main ingredient**: Green Tea Extract
- **Removed**: Camellia Sinensis
- **Redirect created**: `/ingredient-analyzer/ingredients/camellia-sinensis/` → `/ingredient-analyzer/ingredients/green-tea-extract/`
- **Alias added**: "camellia sinensis"

### 4. Niacin ← Niacin Supplement
- **Main ingredient**: Niacin
- **Removed**: Niacin Supplement
- **Redirect created**: `/ingredient-analyzer/ingredients/niacin-supplement/` → `/ingredient-analyzer/ingredients/niacin/`
- **Alias added**: "niacin supplement"

### 5. Riboflavin ← Riboflavin Supplement
- **Main ingredient**: Riboflavin
- **Removed**: Riboflavin Supplement
- **Redirect created**: `/ingredient-analyzer/ingredients/riboflavin-supplement/` → `/ingredient-analyzer/ingredients/riboflavin/`
- **Alias added**: "riboflavin supplement"

### 6. Vitamin K1 ← Vitamin K1 Supplement
- **Main ingredient**: Vitamin K1
- **Removed**: Vitamin K1 Supplement
- **Redirect created**: `/ingredient-analyzer/ingredients/vitamin-k1-supplement/` → `/ingredient-analyzer/ingredients/vitamin-k1/`
- **Alias added**: "vitamin k1 supplement" (already existed)

### 7. Sodium Alginate ← Alginic Acid
- **Main ingredient**: Sodium Alginate
- **Removed**: Alginic Acid
- **Redirect created**: `/ingredient-analyzer/ingredients/alginic-acid/` → `/ingredient-analyzer/ingredients/sodium-alginate/`
- **Alias added**: "alginic acid"

### 8. Calcium Pantothenate ← Calcium D-pantothenate
- **Main ingredient**: Calcium Pantothenate
- **Removed**: Calcium D-pantothenate
- **Redirect created**: `/ingredient-analyzer/ingredients/calcium-d-pantothenate/` → `/ingredient-analyzer/ingredients/calcium-pantothenate/`
- **Alias added**: "calcium d-pantothenate"

## Not Found (No Action Taken)

The following ingredients were not found in the database and could not be consolidated:

1. **MSM ← Methylsulfonylmethane**: "Methylsulfonylmethane" not found (MSM exists as standalone)
2. **Chondroitin Sulfate ← Chondroitin**: "Chondroitin Sulfate" not found (Chondroitin exists as standalone)
3. **Glucosamine Hydrochloride ← Glucosamine**: "Glucosamine Hydrochloride" not found (Glucosamine exists as standalone)
4. **Calcium Pantothenate ← D-Calcium Pantothenate**: "D-Calcium Pantothenate" not found (but "Calcium D-pantothenate" was consolidated)

## Statistics

- **Original ingredient count**: 395
- **Final ingredient count**: 387
- **Ingredients removed**: 8
- **Redirect pages created**: 8

## Next Steps

You should update the ingredient index page to reflect these changes. The removed ingredients now redirect to their main counterparts, and all aliases have been added to the main ingredients for proper matching in the analyzer tool.

## Files Modified

1. `/Users/demihorvat/Projects/watts-site/data/ingredients.json` - Updated with consolidated ingredients
2. Created redirect pages in `/Users/demihorvat/Projects/watts-site/ingredient-analyzer/ingredients/`:
   - `sodium-chloride/index.html`
   - `iron-sulfate/index.html`
   - `camellia-sinensis/index.html`
   - `niacin-supplement/index.html`
   - `riboflavin-supplement/index.html`
   - `vitamin-k1-supplement/index.html`
   - `alginic-acid/index.html`
   - `calcium-d-pantothenate/index.html`
