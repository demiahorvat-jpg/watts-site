# Callout Box Guide

## Problem We Encountered

**Symptom**: Orange background extending from a callout box all the way down to the end of the article.

**Root Cause**: Missing closing `</div>` tags in callout box structures, causing the orange background to never end.

## Correct Callout Structure

### Standard Callout (Watts Layered Design)

```html
<div class="callout">
  <div class="callout-content">
    <p>Your content here...</p>
  </div>
</div>
```

**CRITICAL**: Both divs must close! The structure is:
1. Outer div with orange background (`callout`)
2. Inner div with white content area (`callout-content`)
3. Close inner div
4. Close outer div

### Quick Facts Box

```html
<div class="quick-facts">
  <div class="quick-facts-content">
    <h3>Title</h3>
    <p>Content...</p>
  </div>
</div>
```

Same rule: **both divs must close**.

### Table Inside Quick Facts

```html
<div class="quick-facts">
  <div class="quick-facts-content">
    <h3>Title</h3>

    <div class="table-scroll">
      <table>
        <!-- table content -->
      </table>
    </div>

    <p>Additional content...</p>
  </div>
</div>
```

**Common mistake**: Forgetting to close the outer `quick-facts` div after closing `quick-facts-content`.

## How to Diagnose Unclosed Divs

### Quick Visual Check
If you see orange background extending far beyond where a callout box should end, you have unclosed divs.

### Python Validation Script
Run the validation script (see `validate-blog-divs.py`):

```bash
python3 validate-blog-divs.py
```

This will check all blog posts for:
- Overall div balance (opens vs closes)
- Callout sections that don't close properly
- Quick-facts sections that don't close properly

### Manual Check
Count divs in a suspected section:

```python
with open('blog/yourfile.html', 'r') as f:
    content = f.read()
    opens = content.count('<div')
    closes = content.count('</div>')
    print(f"Opens: {opens}, Closes: {closes}")
```

If opens ≠ closes, you have a problem.

## How to Fix

1. **Find the unclosed section**: Look for callout/quick-facts divs
2. **Count the structure**: Should have 2 opening divs and 2 closing divs
3. **Add missing closing div**: Usually right after the content ends, before the next section
4. **Remove orphaned closing divs**: Often found hundreds of lines later near Related Articles section
5. **Validate**: Run the validation script to confirm it's fixed

## Prevention Checklist

When creating or editing callout boxes:

- [ ] Open outer div (`callout` or `quick-facts`)
- [ ] Open inner div (`callout-content` or `quick-facts-content`)
- [ ] Add your content
- [ ] Close inner div
- [ ] Close outer div immediately after
- [ ] Run validation script before committing

## CSS Reference

The orange background comes from:

```css
.callout, .quick-facts {
  background: var(--brand-orange);
  border-radius: 4px;
  padding: 8px;
}

.callout-content, .quick-facts-content {
  background: var(--white);
  border-radius: 12px;
  padding: 24px 28px;
}
```

If the outer div never closes, `background: var(--brand-orange)` applies to everything below it.

## Files That Had This Issue (Fixed)

- `fillers-in-dog-supplements.html` - quick-facts div unclosed for 425 lines
- `chicken-by-products-dog-food.html` - quick-facts div unclosed for 288 lines

Both fixed in commit 268a825.
