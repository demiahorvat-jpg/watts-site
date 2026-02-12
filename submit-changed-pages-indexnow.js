#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// Pages changed in this session
const changedUrls = [
  // New page created
  'https://wattspet.com/blog/vitamin-a-supplement.html',

  // Title optimizations (13 pages)
  'https://wattspet.com/blog/whole-food-vs-synthetic-nutrients.html',
  'https://wattspet.com/blog/fillers-in-dog-supplements.html',
  'https://wattspet.com/blog/dog-supplement-formats-compared.html',
  'https://wattspet.com/blog/green-lipped-mussel-for-dogs.html',
  'https://wattspet.com/blog/do-joint-supplements-work-for-dogs.html',
  'https://wattspet.com/blog/digestive-enzymes-for-dogs.html',
  'https://wattspet.com/blog/can-dogs-take-human-supplements.html',
  'https://wattspet.com/blog/how-to-read-dog-supplement-labels.html',
  'https://wattspet.com/blog/active-working-dog-nutrition.html',
  'https://wattspet.com/blog/antioxidants-for-dogs.html',
  'https://wattspet.com/blog/probiotics-for-dogs.html',
  'https://wattspet.com/blog/pregnant-nursing-dog-nutrition.html',
  'https://wattspet.com/blog/immune-support-for-dogs.html',

  // H1/title alignment (8 pages)
  'https://wattspet.com/blog/red-dye-40-dog-food.html',
  'https://wattspet.com/ingredient-analyzer/ingredients/barley/',
  'https://wattspet.com/ingredient-analyzer/ingredients/cellulose/',
  'https://wattspet.com/blog/chicken-by-products-dog-food.html',
  'https://wattspet.com/ingredient-analyzer/ingredients/xanthan-gum/',
  'https://wattspet.com/ingredient-analyzer/ingredients/chickpeas/',
  'https://wattspet.com/ingredient-analyzer/ingredients/colostrum/',
  'https://wattspet.com/blog/spirulina-for-dogs.html',

  // Internal linking changes (blog posts that received links)
  'https://wattspet.com/blog/joint-supplements-for-dogs.html',
  'https://wattspet.com/blog/organ-based-nutrition-for-dogs.html',
  'https://wattspet.com/blog/calming-supplements-for-dogs.html',
  'https://wattspet.com/blog/protein-for-dogs.html',
  'https://wattspet.com/blog/puppy-vitamins.html',
  'https://wattspet.com/blog/omega-3-fish-oil-for-dogs.html',
  'https://wattspet.com/blog/yeast-beta-glucan-for-dogs.html',
  'https://wattspet.com/blog/yeast-fermentate-for-dogs.html',
  'https://wattspet.com/blog/gut-health-for-dogs.html',
  'https://wattspet.com/blog/dog-skin-coat-supplements.html',
  'https://wattspet.com/blog/what-extends-dog-lifespan.html',

  // Callout box styling updates
  'https://wattspet.com/blog/beef-liver-for-dogs.html',
  'https://wattspet.com/blog/bone-broth-for-dogs.html',

  // Table responsiveness updates (sample - many were updated)
  'https://wattspet.com/blog/senior-dog-formula-kibble.html',
  'https://wattspet.com/blog/zinc-for-dogs.html',

  // Main pages with nav updates
  'https://wattspet.com/',
  'https://wattspet.com/about.html',

  // Blog index layout fixes
  'https://wattspet.com/blog/'
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
