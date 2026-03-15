#!/bin/bash
# Update Related Links Script
# Regenerates all ingredient page related sections from the CSV
# Usage: ./scripts/update-related-links.sh [ingredient-slug]
#        Without argument: updates all ingredients
#        With argument: updates single ingredient

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CSV_FILE="$PROJECT_ROOT/watts_ingredient_cluster_internal_links_final.csv"
INGREDIENTS_DIR="$PROJECT_ROOT/ingredient-analyzer/ingredients"
BLOG_DIR="$PROJECT_ROOT/blog"

# Create temp files
TEMP_DIR=$(mktemp -d)
CSV_CLEAN="$TEMP_DIR/csv_clean.csv"
INGREDIENT_META="$TEMP_DIR/ingredient_metadata.txt"
BLOG_META="$TEMP_DIR/blog_metadata.txt"
REDIRECTS="$TEMP_DIR/redirects.txt"

cleanup() {
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

echo "Preparing metadata..."

# Clean CSV (remove carriage returns)
tr -d '\r' < "$CSV_FILE" > "$CSV_CLEAN"

# Build ingredient metadata (slug|title|description)
for dir in "$INGREDIENTS_DIR"/*/; do
  slug=$(basename "$dir")
  if [ -f "$dir/index.html" ]; then
    title=$(grep -o '<h1>[^<]*</h1>' "$dir/index.html" | head -1 | sed 's/<[^>]*>//g')
    desc=$(grep -o 'name="description" content="[^"]*"' "$dir/index.html" | head -1 | sed 's/name="description" content="//;s/"$//' | cut -c1-100)
    echo "$slug|$title|$desc..."
  fi
done > "$INGREDIENT_META"

# Build blog metadata (slug|title)
for file in "$BLOG_DIR"/*.html; do
  slug=$(basename "$file" .html)
  if [ "$slug" != "index" ]; then
    title=$(grep -o '<title>[^<]*</title>' "$file" | head -1 | sed 's/<[^>]*>//g' | sed 's/ | Watts$//')
    echo "$slug|$title"
  fi
done > "$BLOG_META"

# Build redirects map
for dir in "$INGREDIENTS_DIR"/*/; do
  if [ -f "$dir/index.html" ]; then
    if grep -q 'http-equiv="refresh"' "$dir/index.html"; then
      slug=$(basename "$dir")
      target=$(grep -o 'url=/ingredient-analyzer/ingredients/[^/]*/' "$dir/index.html" | head -1 | sed 's|url=/ingredient-analyzer/ingredients/||;s|/$||')
      echo "$slug|$target"
    fi
  fi
done > "$REDIRECTS"

# Function to resolve redirects
resolve_redirect() {
  local slug="$1"
  local target=$(grep "^$slug|" "$REDIRECTS" | cut -d'|' -f2)
  if [ -n "$target" ]; then
    echo "$target"
  else
    echo "$slug"
  fi
}

# Function to get description from metadata
get_desc() {
  local slug=$(resolve_redirect "$1")
  grep "^$slug|" "$INGREDIENT_META" | cut -d'|' -f3
}

# Function to get blog title
get_blog_title() {
  grep "^$1|" "$BLOG_META" | cut -d'|' -f2
}

# Function to convert slug to title with special cases
slug_to_title() {
  local slug="$1"

  # Special case mappings
  case "$slug" in
    msm) echo "MSM"; return ;;
    bha) echo "BHA"; return ;;
    bht) echo "BHT"; return ;;
    gos) echo "GOS"; return ;;
    mos) echo "MOS"; return ;;
    l-carnitine) echo "L-Carnitine"; return ;;
    l-lysine) echo "L-Lysine"; return ;;
    l-theanine) echo "L-Theanine"; return ;;
    l-threonine) echo "L-Threonine"; return ;;
    l-glutamine) echo "L-Glutamine"; return ;;
    dl-methionine) echo "DL-Methionine"; return ;;
    l-ascorbyl-2-polyphosphate) echo "L-Ascorbyl-2-Polyphosphate"; return ;;
    l-lysine-monohydrochloride) echo "L-Lysine Monohydrochloride"; return ;;
    omega-3-fatty-acids) echo "Omega-3 Fatty Acids"; return ;;
    coenzyme-q10) echo "CoQ10"; return ;;
    bioperine) echo "BioPerine"; return ;;
  esac

  # Default: convert slug to title case
  echo "$slug" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1'
}

# Function to generate new HTML for an ingredient
generate_html() {
  local ingredient="$1"

  # Get CSV row
  local row=$(grep "^$ingredient," "$CSV_CLEAN")
  if [ -z "$row" ]; then
    return 1
  fi

  # Parse CSV
  IFS=',' read -r ing cluster rel1 rel2 rel3 rel4 art1 art2 <<< "$row"

  # Generate HTML
  echo "    <div class=\"related-grid\">"
  for rel in "$rel1" "$rel2" "$rel3" "$rel4"; do
    local resolved=$(resolve_redirect "$rel")
    local title=$(slug_to_title "$rel")
    local desc=$(get_desc "$rel")
    echo "      <a href=\"/ingredient-analyzer/ingredients/$resolved/\" class=\"related-card\">"
    echo "        <h3>$title</h3>"
    echo "        <p>$desc</p>"
    echo "      </a>"
    echo ""
  done
  echo "    </div>"
  echo ""

  # Get blog titles
  local title1=$(get_blog_title "$art1")
  local title2=$(get_blog_title "$art2")
  echo "    <p style=\"margin-top: 40px; margin-bottom: 40px;\"><strong>Learn more:</strong> <a href=\"/blog/$art1.html\">$title1</a> · <a href=\"/blog/$art2.html\">$title2</a></p>"
}

# Function to update a single ingredient
update_ingredient() {
  local ingredient="$1"
  local file="$INGREDIENTS_DIR/$ingredient/index.html"

  # Check if file exists
  if [ ! -f "$file" ]; then
    echo "ERROR: File not found: $file"
    return 1
  fi

  # Check if it's a redirect page
  if grep -q 'http-equiv="refresh"' "$file"; then
    echo "SKIP_REDIRECT: $ingredient"
    return 0
  fi

  # Generate new HTML
  local new_html=$(generate_html "$ingredient")
  if [ -z "$new_html" ]; then
    echo "ERROR: Could not generate HTML for $ingredient (not in CSV?)"
    return 1
  fi

  # Determine which class name is used
  local grid_class
  if grep -q 'class="related-ingredients-grid"' "$file"; then
    grid_class="related-ingredients-grid"
  elif grep -q 'class="related-grid"' "$file"; then
    grid_class="related-grid"
  else
    echo "ERROR: No related grid found in $ingredient"
    return 1
  fi

  # Check if page has "Learn more" section
  local has_learn_more=false
  if grep -q "Learn more:</strong>" "$file"; then
    has_learn_more=true
  fi

  # Create Python script for replacement (handles multiline better)
  python3 - "$file" "$grid_class" "$has_learn_more" "$new_html" << 'PYTHON_SCRIPT'
import sys
import re

file_path = sys.argv[1]
grid_class = sys.argv[2]
has_learn_more = sys.argv[3] == "true"
new_html = sys.argv[4]

with open(file_path, 'r') as f:
    content = f.read()

if has_learn_more:
    pattern = rf'<div class="{grid_class}">.*?</div>\s*<p style="margin-top: 40px; margin-bottom: 40px;"><strong>Learn more:</strong>.*?</p>'
    replacement = new_html.strip()
else:
    pattern = rf'<div class="{grid_class}">.*?</div>\s*(?=\s*<div class="cta-section">)'
    replacement = new_html.strip() + '\n\n'

new_content, count = re.subn(pattern, replacement, content, flags=re.DOTALL)

if count == 0:
    sys.exit(1)

with open(file_path, 'w') as f:
    f.write(new_content)
PYTHON_SCRIPT

  if [ $? -eq 0 ]; then
    echo "UPDATED: $ingredient"
    return 0
  else
    echo "ERROR: Pattern replacement failed for $ingredient"
    return 1
  fi
}

# Main execution
echo ""

if [ -n "$1" ]; then
  # Update single ingredient
  echo "Updating single ingredient: $1"
  update_ingredient "$1"
else
  # Update all ingredients
  echo "Updating all ingredients..."
  echo ""

  success=0
  skipped=0
  failed=0

  tail -n +2 "$CSV_CLEAN" | cut -d',' -f1 | while read ingredient; do
    result=$(update_ingredient "$ingredient" 2>&1)
    echo "$result"
  done

  echo ""
  echo "Update complete."
fi
