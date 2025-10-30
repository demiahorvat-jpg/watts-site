#!/usr/bin/env node

/**
 * IndexNow Submission Script for Watts (Static Site)
 * Usage: node submit-indexnow.js <url1> <url2> ...
 * Or: node submit-indexnow.js --all (submits all URLs from sitemap)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'a99c025d21926980b88e55240282cb49e80bb1ee86676fdc36f5589d4c969c41';
const SITE_URL = 'https://www.wattspet.com';

/**
 * Submit URLs to IndexNow
 */
function submitToIndexNow(urls) {
  const data = JSON.stringify({
    host: 'www.wattspet.com',
    key: API_KEY,
    keyLocation: `${SITE_URL}/${API_KEY}.txt`,
    urlList: urls,
  });

  const options = {
    hostname: 'api.indexnow.org',
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          resolve({ success: true, status: res.statusCode });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Extract URLs from sitemap.xml
 */
function extractUrlsFromSitemap() {
  try {
    const sitemap = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
    const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g);
    if (!urlMatches) return [];

    return urlMatches.map(match =>
      match.replace('<loc>', '').replace('</loc>', '').trim()
    );
  } catch (error) {
    console.error('Error reading sitemap:', error.message);
    return [];
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node submit-indexnow.js <url1> <url2> ...');
    console.log('  node submit-indexnow.js --all');
    console.log('');
    console.log('Examples:');
    console.log('  node submit-indexnow.js https://www.wattspet.com/');
    console.log('  node submit-indexnow.js https://www.wattspet.com/blog/beef-liver-for-dogs.html');
    console.log('  node submit-indexnow.js --all');
    process.exit(1);
  }

  let urls;

  if (args[0] === '--all') {
    console.log('📖 Reading URLs from sitemap.xml...');
    urls = extractUrlsFromSitemap();
    if (urls.length === 0) {
      console.error('❌ No URLs found in sitemap.xml');
      process.exit(1);
    }
    console.log(`📝 Found ${urls.length} URLs`);
  } else {
    urls = args;
  }

  console.log('\n🚀 Submitting to IndexNow...');
  console.log('URLs:', urls.join('\n      '));

  try {
    const result = await submitToIndexNow(urls);
    console.log('\n✅ Successfully submitted to IndexNow!');
    console.log(`📊 Status: ${result.status}`);
    console.log('🔍 Bing and other search engines will be notified.');
  } catch (error) {
    console.error('\n❌ Error submitting to IndexNow:');
    console.error(error.message);
    process.exit(1);
  }
}

main();
