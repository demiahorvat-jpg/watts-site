#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// Pages changed in this session - SEO audit batches 6-10 + ingredient pages
const changedUrls = [
  // Blog posts (batch 6)
  'https://wattspet.com/blog/active-working-dog-nutrition.html',
  'https://wattspet.com/blog/all-natural-dog-supplements.html',
  'https://wattspet.com/blog/antioxidants-for-cats.html',
  'https://wattspet.com/blog/arachidonic-acid-for-cats.html',
  'https://wattspet.com/blog/astaxanthin-for-cats.html',
  'https://wattspet.com/blog/astaxanthin-for-dogs.html',
  // Blog posts (batch 7)
  'https://wattspet.com/blog/bone-broth-for-dogs.html',
  'https://wattspet.com/blog/can-dogs-take-human-supplements.html',
  'https://wattspet.com/blog/dog-anal-gland-diet.html',
  // Blog posts (batch 8)
  'https://wattspet.com/blog/dog-vs-human-nutrition.html',
  'https://wattspet.com/blog/epicor-for-dogs.html',
  'https://wattspet.com/blog/food-thickeners-gums-in-dog-food.html',
  // Blog posts (batch 9)
  'https://wattspet.com/blog/immune-support-for-dogs.html',
  'https://wattspet.com/blog/omega-3-for-cats.html',
  // Blog posts (batch 10)
  'https://wattspet.com/blog/pregnant-nursing-dog-nutrition.html',
  'https://wattspet.com/blog/probiotic-supplement-for-dogs.html',
  'https://wattspet.com/blog/probiotics-for-cats.html',
  'https://wattspet.com/blog/probiotics-for-dogs.html',
  'https://wattspet.com/blog/protein-for-dogs.html',
  'https://wattspet.com/blog/protein-requirements-cats.html',
  // Ingredient pages (SEO title/meta updates)
  'https://wattspet.com/ingredient-analyzer/ingredients/animal-digest/',
  'https://wattspet.com/ingredient-analyzer/ingredients/animal-fat/',
  'https://wattspet.com/ingredient-analyzer/ingredients/beef-meal/',
  'https://wattspet.com/ingredient-analyzer/ingredients/bha/',
  'https://wattspet.com/ingredient-analyzer/ingredients/bht/',
  'https://wattspet.com/ingredient-analyzer/ingredients/carrageenan/',
  'https://wattspet.com/ingredient-analyzer/ingredients/cellulose/',
  'https://wattspet.com/ingredient-analyzer/ingredients/chicken-by-products/',
  'https://wattspet.com/ingredient-analyzer/ingredients/chicken-meal/',
  'https://wattspet.com/ingredient-analyzer/ingredients/corn-gluten-meal/',
  'https://wattspet.com/ingredient-analyzer/ingredients/corn/',
  'https://wattspet.com/ingredient-analyzer/ingredients/duck-meal/',
  'https://wattspet.com/ingredient-analyzer/ingredients/ethoxyquin/',
  'https://wattspet.com/ingredient-analyzer/ingredients/guar-gum/',
  'https://wattspet.com/ingredient-analyzer/ingredients/lamb-meal/',
  'https://wattspet.com/ingredient-analyzer/ingredients/meat-and-bone-meal/',
  'https://wattspet.com/ingredient-analyzer/ingredients/meat-meal/',
  'https://wattspet.com/ingredient-analyzer/ingredients/mixed-tocopherols/',
  'https://wattspet.com/ingredient-analyzer/ingredients/soybean-meal/',
  'https://wattspet.com/ingredient-analyzer/ingredients/soybean-oil/',
  'https://wattspet.com/ingredient-analyzer/ingredients/wheat-gluten/',
  'https://wattspet.com/ingredient-analyzer/ingredients/wheat/'
];

// Remove duplicates
const uniqueUrls = [...new Set(changedUrls)];

console.log('Submitting changed pages to IndexNow...\n');
console.log(`Total URLs to submit: ${uniqueUrls.length}`);

const keyContent = fs.readFileSync('c3d5e8f1a4b7c9d2e5f8a1b4c7d9e2f5.txt', 'utf8').trim();

const payload = {
  host: 'wattspet.com',
  key: keyContent,
  keyLocation: 'https://wattspet.com/c3d5e8f1a4b7c9d2e5f8a1b4c7d9e2f5.txt',
  urlList: uniqueUrls
};

const postData = JSON.stringify(payload);

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`\n✅ Successfully submitted ${uniqueUrls.length} URLs to IndexNow`);
    console.log(`   Status: ${res.statusCode}`);
    if (data) {
      console.log(`   Response: ${data}`);
    }
    console.log('\n✅ IndexNow submission complete!');
    console.log('   Search engines have been notified of your updates.');
  });
});

req.on('error', (error) => {
  console.error('Error submitting to IndexNow:', error);
  process.exit(1);
});

req.write(postData);
req.end();
