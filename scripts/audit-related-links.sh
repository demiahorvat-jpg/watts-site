#!/bin/bash
# Related Links Audit Script
# Run periodically to identify maintenance needs for ingredient/blog internal linking
# Usage: ./scripts/audit-related-links.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CSV_FILE="$PROJECT_ROOT/watts_ingredient_cluster_internal_links_final.csv"
INGREDIENTS_DIR="$PROJECT_ROOT/ingredient-analyzer/ingredients"
BLOG_DIR="$PROJECT_ROOT/blog"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "  Related Links Audit Report"
echo "  $(date '+%Y-%m-%d %H:%M')"
echo "========================================"
echo ""

# Check CSV exists
if [ ! -f "$CSV_FILE" ]; then
  echo -e "${RED}ERROR: CSV file not found at $CSV_FILE${NC}"
  exit 1
fi

# ============================================
# 1. New ingredients not in CSV
# ============================================
echo -e "${BLUE}1. NEW INGREDIENTS (not in CSV)${NC}"
echo "----------------------------------------"

# Get all ingredient folders (excluding redirects)
new_count=0
for dir in "$INGREDIENTS_DIR"/*/; do
  slug=$(basename "$dir")

  # Skip if it's a redirect page
  if grep -q 'http-equiv="refresh"' "$dir/index.html" 2>/dev/null; then
    continue
  fi

  # Check if in CSV
  if ! grep -q "^$slug," "$CSV_FILE"; then
    echo "  - $slug"
    ((new_count++))
  fi
done

if [ $new_count -eq 0 ]; then
  echo -e "  ${GREEN}None - all ingredients are mapped${NC}"
else
  echo ""
  echo -e "  ${YELLOW}Action: Add these $new_count ingredients to the CSV${NC}"
fi
echo ""

# ============================================
# 2. Blog articles not linked from any ingredient
# ============================================
echo -e "${BLUE}2. UNLINKED BLOG ARTICLES${NC}"
echo "----------------------------------------"

# Get all blog articles from CSV
linked_blogs=$(tail -n +2 "$CSV_FILE" | cut -d',' -f7,8 | tr ',' '\n' | sort -u)

unlinked_count=0
for file in "$BLOG_DIR"/*.html; do
  slug=$(basename "$file" .html)

  # Skip index
  if [ "$slug" = "index" ]; then
    continue
  fi

  # Check if linked
  if ! echo "$linked_blogs" | grep -q "^$slug$"; then
    title=$(grep -o '<title>[^<]*</title>' "$file" | head -1 | sed 's/<[^>]*>//g' | sed 's/ | Watts$//')
    echo "  - $slug"
    echo "    \"$title\""
    ((unlinked_count++))
  fi
done

if [ $unlinked_count -eq 0 ]; then
  echo -e "  ${GREEN}None - all blogs are linked${NC}"
else
  echo ""
  echo -e "  ${YELLOW}Action: Consider linking these $unlinked_count blogs from relevant ingredients${NC}"
fi
echo ""

# ============================================
# 3. Cluster size distribution
# ============================================
echo -e "${BLUE}3. CLUSTER SIZE DISTRIBUTION${NC}"
echo "----------------------------------------"

echo "  Cluster                        Count"
echo "  ------------------------------  -----"
tail -n +2 "$CSV_FILE" | cut -d',' -f2 | sort | uniq -c | sort -rn | while read count cluster; do
  printf "  %-30s  %s" "$cluster" "$count"
  if [ "$count" -lt 3 ]; then
    echo -e " ${YELLOW}(small)${NC}"
  elif [ "$count" -gt 40 ]; then
    echo -e " ${YELLOW}(large - consider splitting)${NC}"
  else
    echo ""
  fi
done
echo ""

# ============================================
# 4. Most/least linked blog articles
# ============================================
echo -e "${BLUE}4. BLOG ARTICLE LINK FREQUENCY${NC}"
echo "----------------------------------------"

echo "  Most linked:"
tail -n +2 "$CSV_FILE" | cut -d',' -f7,8 | tr ',' '\n' | sort | uniq -c | sort -rn | head -5 | while read count slug; do
  printf "    %3d links: %s\n" "$count" "$slug"
done

echo ""
echo "  Least linked (excluding unlinked):"
tail -n +2 "$CSV_FILE" | cut -d',' -f7,8 | tr ',' '\n' | sort | uniq -c | sort -n | head -5 | while read count slug; do
  if [ -n "$slug" ]; then
    printf "    %3d links: %s\n" "$count" "$slug"
  fi
done
echo ""

# ============================================
# 5. Broken related ingredient links
# ============================================
echo -e "${BLUE}5. BROKEN RELATED INGREDIENT LINKS${NC}"
echo "----------------------------------------"

broken_count=0
# Check each related ingredient in CSV exists
tail -n +2 "$CSV_FILE" | while IFS=',' read -r ing cluster rel1 rel2 rel3 rel4 art1 art2; do
  for rel in "$rel1" "$rel2" "$rel3" "$rel4"; do
    if [ -n "$rel" ] && [ ! -d "$INGREDIENTS_DIR/$rel" ]; then
      echo "  - $ing references non-existent: $rel"
      ((broken_count++))
    fi
  done
done

if [ $broken_count -eq 0 ]; then
  echo -e "  ${GREEN}None - all related ingredient links are valid${NC}"
fi
echo ""

# ============================================
# 6. Summary stats
# ============================================
echo -e "${BLUE}6. SUMMARY STATS${NC}"
echo "----------------------------------------"

total_ingredients=$(ls -d "$INGREDIENTS_DIR"/*/ 2>/dev/null | wc -l | tr -d ' ')
redirect_count=$(grep -l 'http-equiv="refresh"' "$INGREDIENTS_DIR"/*/index.html 2>/dev/null | wc -l | tr -d ' ')
mapped_count=$(($(tail -n +2 "$CSV_FILE" | wc -l | tr -d ' ')))
total_blogs=$(ls "$BLOG_DIR"/*.html 2>/dev/null | grep -v index.html | wc -l | tr -d ' ')
linked_blog_count=$(tail -n +2 "$CSV_FILE" | cut -d',' -f7,8 | tr ',' '\n' | sort -u | wc -l | tr -d ' ')
cluster_count=$(tail -n +2 "$CSV_FILE" | cut -d',' -f2 | sort -u | wc -l | tr -d ' ')

echo "  Total ingredient pages:     $total_ingredients"
echo "  Redirect pages:             $redirect_count"
echo "  Mapped in CSV:              $mapped_count"
echo "  Total blog articles:        $total_blogs"
echo "  Blogs linked from ingredients: $linked_blog_count"
echo "  Number of clusters:         $cluster_count"
echo ""

echo "========================================"
echo "  Audit complete"
echo "========================================"
