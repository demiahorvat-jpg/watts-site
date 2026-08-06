# FAQ answers wrap at inconsistent widths

**Date:** 2026-08-03
**Status:** diagnosed, not fixed — deferred
**Where:** `wattspet.com/pages/faq` (Shopify theme, live)

## Symptom

Some FAQ answers wrap well short of the card's width while others fill it, so the
right-hand ragged edge jumps around between items. Most obvious on short answers —
e.g. "What if my dog doesn't love it?" stops around 60% of the card width across
three lines.

## Cause

Two rules combine. Neither is wrong on its own.

`preload.min.css`:

```css
.wysiwyg p, .wysiwyg ol, .wysiwyg ul { font: var(--t-b-1); text-wrap: balance }
```

`main.min.css`:

```css
.c-accordion__content-interior > * { width: 100%; max-width: 680px }
```

Every FAQ answer picks up the `wysiwyg` class — `snippets/c-accordion.liquid:25` adds
it when rendering the metafield:

```liquid
{{ content | replace: '<div class="', '<div class="wysiwyg ' }}
```

`text-wrap: balance` does not fill each line to the available width; it evens out line
lengths across the block. The resulting wrap point therefore depends on how much text
the answer contains.

It's worse than simple variation, because browsers only apply balancing up to a
line-count limit (Chrome caps at roughly 6 lines). Short answers fall under the cap and
get balanced — visibly narrow. Longer answers exceed it, balancing is dropped, and they
fill the full 680px. Identical CSS, opposite-looking output.

## Ruled out

- **Not a content problem.** All 21 answers render with identical DOM:
  `<div class="wysiwyg metafield-rich_text_field"><p>…</p></div>`.
- **Not `newline_to_br`.** Zero `<br>` tags in any rendered answer, despite the filter
  being applied in `sections/s-faq.liquid`.
- **Not per-item overrides.** No item-level styles or differing block structure.

## Proposed fix

Override to `text-wrap: pretty` for FAQ answers only — fills the line consistently while
still avoiding a single word on the last line:

```liquid
{%- style -%}
	.c-accordion__content-interior .wysiwyg p {
		text-wrap: pretty;
	}
{%- endstyle -%}
```

Add this to `sections/s-faq.liquid`, **not** to `preload.min.css`. That file is
hand-committed from external tooling with no build step in this repo (same constraint as
`assets/*.min.js`), so editing it directly is easy to get wrong and easy to lose.

Scoping to `.c-accordion__content-interior` keeps `text-wrap: balance` where it is
deliberate — headings (`.t-h-1`, `.t-h-2`, `h1`–`h6`), footer titles, comparison-table
cells, ingredient card labels.

## Note

The accordion is used beyond the FAQ page. Check other placements before shipping, so
the change doesn't alter something that currently looks intentional.

---

## Related, also deferred: 6 blog slugs 404 on the primary domain

### The setup

Blog content lives at `learn.wattspet.com`. The Shopify store also accepts
`wattspet.com/blog/<slug>.html` and 301s it across:

```
GET https://wattspet.com/blog/beef-liver-for-dogs.html
  → 301 → https://learn.wattspet.com/blog/beef-liver-for-dogs.html
```

So most articles have two working URLs for the same page.

### The gap

Tested all 104 blog slugs from `learn.wattspet.com/sitemap.xml` against the primary
domain on 2026-08-03: **97 resolve, 6 return 404.** All six return 200 on `learn.*` —
the pages are fine, only the redirect is missing.

```
calming-supplements-for-cats
canine-cognitive-dysfunction-dogs
green-lipped-mussel-vs-glucosamine-for-dogs
is-petlab-co-good-for-dogs
picky-dog-supplements
why-we-built-better-dailies
```

These look like the most recently published posts, which suggests the redirect list is
maintained by hand and new articles get missed as they ship.

### Recommendation (revised)

**Link directly to `learn.wattspet.com/blog/...`.** Earlier in this session the advice
was to use the primary domain and let the 301 do the work — that was wrong on
cost/benefit. Every one of those pages already carries a canonical pointing at
`learn.wattspet.com`, so Google treats that as the real URL either way. Routing through
the primary domain adds a redirect hop and a chance of hitting one of the six dead
slugs, for no ranking gain.

The one legitimate reason to prefer `wattspet.com/blog/` is user-facing: customers see a
familiar domain. If that's the priority, verify the slug resolves before using it.

**Action either way:** add the 6 missing redirects, and make adding one part of the
publish routine so the list stops drifting.

Relevant now because `picky-dog-supplements` is the natural target for the
"Are Better Dailies suitable for picky dogs?" FAQ entry — and it's one of the six.
