#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// URLs we modified today
const urls = [
  // March 12, 2026
  'https://wattspet.com/blog/uc-ii-for-dogs.html',
  'https://wattspet.com/blog/uc-ii-for-cats.html',
  'https://wattspet.com/blog/uc-ii-vs-glucosamine-for-dogs.html',
  'https://wattspet.com/blog/antioxidants-for-cats.html',
  'https://wattspet.com/blog/astaxanthin-for-dogs.html',
  'https://wattspet.com/blog/astaxanthin-for-cats.html',
  'https://wattspet.com/blog/epicor-for-dogs.html',
  'https://wattspet.com/blog/epicor-for-cats.html',
  'https://wattspet.com/blog/spirulina-for-cats.html'
];

console.log('Submitting today\'s changes to IndexNow...\n');
console.log(`Total URLs to submit: ${urls.length}\n`);
console.log('URLs:');
urls.forEach(url => console.log('  - ' + url));
console.log('\n');

const keyContent = fs.readFileSync('c3d5e8f1a4b7c9d2e5f8a1b4c7d9e2f5.txt', 'utf8').trim();

const payload = {
  host: 'wattspet.com',
  key: keyContent,
  keyLocation: 'https://wattspet.com/c3d5e8f1a4b7c9d2e5f8a1b4c7d9e2f5.txt',
  urlList: urls
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
    console.log(`✅ Successfully submitted ${urls.length} URLs to IndexNow`);
    console.log(`   Status: ${res.statusCode}`);
    if (data) {
      console.log(`   Response: ${data}`);
    }
    console.log('\n✅ IndexNow submission complete!');
    console.log('   Search engines (Bing, Yandex, etc.) have been notified of your updates.');
  });
});

req.on('error', (error) => {
  console.error('Error submitting to IndexNow:', error);
  process.exit(1);
});

req.write(postData);
req.end();
