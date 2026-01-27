#!/usr/bin/env node

const fs = require('fs');

// Read ingredients database
const db = JSON.parse(fs.readFileSync('./data/ingredients.json', 'utf8'));
const ingredients = db.ingredients;

// Sort alphabetically
const sortedIngredients = [...ingredients].sort((a, b) => a.name.localeCompare(b.name));

// Create slug
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Get badge class
function getBadgeClass(position) {
  const map = {
    'good': 'badge-good',
    'neutral': 'badge-neutral',
    'caution': 'badge-caution',
    'avoid': 'badge-avoid'
  };
  return map[position] || 'badge-neutral';
}

// Capitalize
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Generate ingredient cards HTML
const cardsHTML = sortedIngredients.map(ingredient => {
  const slug = slugify(ingredient.name);
  const badgeClass = getBadgeClass(ingredient.wattsPosition);
  const badgeLabel = capitalize(ingredient.wattsPosition);
  const category = capitalize(ingredient.category);
  const description = ingredient.whatItIs.substring(0, 120);

  return `          <a href="/ingredient-analyzer/ingredients/${slug}/" class="ingredient-card" data-category="${ingredient.category}" data-position="${ingredient.wattsPosition}">
            <div class="ingredient-card-header">
              <h2>${ingredient.name}</h2>
              <div class="position-badge ${badgeClass}">${badgeLabel}</div>
            </div>
            <div class="ingredient-category">${category}</div>
            <p class="ingredient-description">${description}...</p>
          </a>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dog Food Ingredient Encyclopedia | 200+ Ingredients Explained | Watts Pet</title>
    <meta name="description" content="Comprehensive encyclopedia of 200+ dog food, treat, and supplement ingredients. Learn what each ingredient is, why it's used, and whether it's good for your dog.">
    <link rel="canonical" href="https://wattspet.com/ingredient-analyzer/ingredients/">

    <style>
      :root {
        --bg: #F1ECE9;
        --fg: #191919;
        --muted: #3a3a3a;
        --border: #191919;
        --good: #2d5016;
        --caution: #b45309;
        --avoid: #991b1b;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      html, body { min-height: 100%; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: "Geologica", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        font-weight: 400;
        line-height: 1.6;
        overflow-x: hidden;
      }

      /* Navigation */
      nav.nav {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 20px 20px;
        border-bottom: 2.5px solid var(--border);
      }
      @media (min-width: 768px) {
        nav.nav {
          padding: 24px 20px;
        }
      }
      nav.nav ul {
        list-style: none;
        display: flex;
        gap: 24px;
        align-items: center;
      }
      @media (min-width: 768px) {
        nav.nav ul {
          gap: 32px;
        }
      }
      nav.nav a {
        color: var(--fg);
        text-decoration: none;
        font-size: 15px;
        font-weight: 500;
        transition: opacity 0.15s;
        position: relative;
      }
      @media (min-width: 768px) {
        nav.nav a {
          font-size: 16px;
        }
      }
      nav.nav a:hover {
        opacity: 0.7;
      }

      /* Main container */
      main {
        max-width: 1100px;
        margin: 0 auto;
        padding: 40px 20px 60px;
      }
      @media (min-width: 768px) {
        main {
          padding: 60px 40px 80px;
        }
      }

      h1 {
        font-family: "Geologica", sans-serif;
        font-size: 36px;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 16px;
        letter-spacing: -0.02em;
      }
      @media (min-width: 768px) {
        h1 {
          font-size: 48px;
        }
      }

      .intro {
        font-size: 18px;
        line-height: 1.6;
        color: var(--muted);
        margin-bottom: 40px;
        max-width: 800px;
      }
      @media (min-width: 768px) {
        .intro {
          font-size: 20px;
          line-height: 1.7;
        }
      }

      /* Search and filters */
      .controls {
        margin-bottom: 32px;
      }

      .search-box {
        width: 100%;
        max-width: 600px;
        padding: 14px 18px;
        font-family: inherit;
        font-size: 16px;
        border: 2.5px solid var(--border);
        background: white;
        margin-bottom: 20px;
      }

      .search-box:focus {
        outline: none;
        border-color: var(--fg);
      }

      .filter-tabs {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .filter-tab {
        padding: 10px 20px;
        border: 2px solid var(--border);
        background: transparent;
        font-family: inherit;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
      }

      .filter-tab:hover {
        background: rgba(25, 25, 25, 0.04);
      }

      .filter-tab.active {
        background: var(--fg);
        color: var(--bg);
      }

      /* Ingredient grid */
      .ingredient-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }

      @media (min-width: 640px) {
        .ingredient-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 900px) {
        .ingredient-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .ingredient-card {
        border: 2.5px solid var(--border);
        padding: 20px;
        text-decoration: none;
        color: var(--fg);
        transition: all 0.15s;
        display: block;
      }

      .ingredient-card:hover {
        background: rgba(25, 25, 25, 0.02);
        transform: translateY(-2px);
      }

      .ingredient-card.hidden {
        display: none;
      }

      .ingredient-card-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 12px;
        gap: 12px;
      }

      .ingredient-card h2 {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
        line-height: 1.3;
      }

      .position-badge {
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: white;
        white-space: nowrap;
      }

      .badge-good {
        background: var(--good);
      }

      .badge-neutral {
        background: var(--muted);
      }

      .badge-caution {
        background: var(--caution);
      }

      .badge-avoid {
        background: var(--avoid);
      }

      .ingredient-category {
        font-size: 14px;
        color: var(--muted);
        text-transform: capitalize;
        margin-bottom: 8px;
      }

      .ingredient-description {
        font-size: 15px;
        line-height: 1.6;
        color: var(--muted);
      }

      .no-results {
        text-align: center;
        padding: 60px 20px;
        color: var(--muted);
      }

      .no-results.hidden {
        display: none;
      }

      /* Footer */
      footer {
        text-align: center;
        padding: 20px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 400;
        border-top: 2.5px solid var(--border);
        margin-top: 60px;
      }
      @media (min-width: 768px) {
        footer {
          padding: 24px;
          font-size: 13px;
        }
      }
    </style>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Dog Food Ingredient Encyclopedia",
      "description": "Comprehensive encyclopedia of 200+ dog food, treat, and supplement ingredients",
      "url": "https://wattspet.com/ingredient-analyzer/ingredients/",
      "publisher": {
        "@type": "Organization",
        "name": "Watts Pet"
      }
    }
    </script>
</head>
<body>
  <nav class="nav">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about.html">About</a></li>
      <li><a href="/blog/">Blog</a></li>
      <li><a href="/ingredient-analyzer/">Ingredient Analyzer</a></li>
    </ul>
  </nav>

  <main>
    <h1>Dog Food Ingredient Encyclopedia</h1>

    <p class="intro">Explore our comprehensive database of 200+ dog food, treat, and supplement ingredients. Learn what each ingredient really is, why manufacturers use it, and whether it provides real nutrition or just cheap filler.</p>

    <div class="controls">
      <input
        type="text"
        id="searchBox"
        class="search-box"
        placeholder="Search ingredients..."
      >

      <div class="filter-tabs">
        <button class="filter-tab active" data-category="all">All</button>
        <button class="filter-tab" data-category="protein">Protein</button>
        <button class="filter-tab" data-category="carbohydrate">Carbohydrate</button>
        <button class="filter-tab" data-category="fat">Fat</button>
        <button class="filter-tab" data-category="fiber">Fiber</button>
        <button class="filter-tab" data-category="vitamin">Vitamins</button>
        <button class="filter-tab" data-category="mineral">Minerals</button>
        <button class="filter-tab" data-category="active">Active Ingredients</button>
        <button class="filter-tab" data-category="preservative">Preservatives</button>
        <button class="filter-tab" data-category="additive">Additives</button>
        <button class="filter-tab" data-category="produce">Produce</button>
      </div>
    </div>

    <div id="ingredientGrid" class="ingredient-grid">
${cardsHTML}
    </div>

    <div id="noResults" class="no-results hidden">
      <p>No ingredients found matching your search.</p>
    </div>
  </main>

  <footer>
    <p>&copy; 2026 Watts Pet. All rights reserved.</p>
  </footer>

  <script>
    // Search and filter functionality
    const searchBox = document.getElementById('searchBox');
    const ingredientGrid = document.getElementById('ingredientGrid');
    const noResults = document.getElementById('noResults');
    const cards = Array.from(document.querySelectorAll('.ingredient-card'));
    let currentCategory = 'all';

    // Search handler
    searchBox.addEventListener('input', filterIngredients);

    // Filter tab handlers
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update category and filter
        currentCategory = tab.getAttribute('data-category');
        filterIngredients();
      });
    });

    function filterIngredients() {
      const searchTerm = searchBox.value.toLowerCase();
      let visibleCount = 0;

      cards.forEach(card => {
        const name = card.querySelector('h2').textContent.toLowerCase();
        const description = card.querySelector('.ingredient-description').textContent.toLowerCase();
        const category = card.getAttribute('data-category');

        const matchesSearch = searchTerm === '' || name.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = currentCategory === 'all' || category === currentCategory;

        if (matchesSearch && matchesCategory) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Show/hide no results message
      if (visibleCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    }
  </script>
</body>
</html>`;

fs.writeFileSync('./ingredient-analyzer/ingredients/index.html', html, 'utf8');

console.log(`✅ Generated static ingredient directory page with ${sortedIngredients.length} pre-rendered ingredient links`);
console.log('✅ All ingredient pages are now crawlable by search engines and link analyzers');
