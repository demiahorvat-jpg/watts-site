#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// Pages changed in this session - ingredient consolidation
const changedUrls = [
  // Pages with merged content from consolidated redirects
  'https://wattspet.com/ingredient-analyzer/ingredients/vitamin-a-supplement/',
  'https://wattspet.com/ingredient-analyzer/ingredients/vitamin-e-supplement/',
  'https://wattspet.com/ingredient-analyzer/ingredients/thiamine-mononitrate/',

  // Target pages of redirects (may have alias updates)
  'https://wattspet.com/ingredient-analyzer/ingredients/brewers-dried-yeast/',
  'https://wattspet.com/ingredient-analyzer/ingredients/pea-protein/',
  'https://wattspet.com/ingredient-analyzer/ingredients/sweet-potatoes/',
  'https://wattspet.com/ingredient-analyzer/ingredients/egg-product/',
  'https://wattspet.com/ingredient-analyzer/ingredients/whey-powder/',
  'https://wattspet.com/ingredient-analyzer/ingredients/banana/',
  'https://wattspet.com/ingredient-analyzer/ingredients/glutamine/',
  'https://wattspet.com/ingredient-analyzer/ingredients/l-lysine/',

  // Pages with updated internal links
  'https://wattspet.com/blog/immune-support-for-dogs.html',
  'https://wattspet.com/ingredient-analyzer/ingredients/peas/',
  'https://wattspet.com/ingredient-analyzer/ingredients/pea-flour/',
  'https://wattspet.com/ingredient-analyzer/ingredients/nutritional-yeast/',
  'https://wattspet.com/ingredient-analyzer/ingredients/yeast-fermentate/',
  'https://wattspet.com/ingredient-analyzer/ingredients/hydrolyzed-yeast/',
  'https://wattspet.com/ingredient-analyzer/ingredients/yeast-beta-glucans/',
  'https://wattspet.com/ingredient-analyzer/ingredients/mos/',

  // Index page (cards removed)
  'https://wattspet.com/ingredient-analyzer/ingredients/'
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
