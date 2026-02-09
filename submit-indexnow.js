const fs = require('fs');
const https = require('https');
const path = require('path');

console.log('Submitting URLs to IndexNow...\n');

// Read sitemap and extract URLs
const sitemapPath = path.join(__dirname, 'sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');

// Extract all <loc> URLs from sitemap
const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g);
const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));

console.log(`Found ${urls.length} URLs in sitemap`);

// IndexNow API configuration
const host = 'wattspet.com';
const key = 'c3d5e8f1a4b7c9d2e5f8a1b4c7d9e2f5';
const keyLocation = `https://${host}/${key}.txt`;

// Function to check if key file is accessible
function checkKeyFile() {
  return new Promise((resolve) => {
    https.get(keyLocation, (res) => {
      if (res.statusCode === 200) {
        console.log('✓ Key file is accessible\n');
        resolve(true);
      } else {
        console.log(`⚠️  Key file not yet accessible (Status: ${res.statusCode})`);
        console.log('   Waiting for GitHub Pages deployment...\n');
        resolve(false);
      }
    }).on('error', () => {
      console.log('⚠️  Key file not yet accessible');
      console.log('   Waiting for GitHub Pages deployment...\n');
      resolve(false);
    });
  });
}

// Function to submit URLs
function submitToIndexNow(urlList) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: host,
      key: key,
      keyLocation: keyLocation,
      urlList: urlList
    });

    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ Successfully submitted ${urlList.length} URLs to IndexNow`);
          console.log(`   Status: ${res.statusCode}`);
          resolve();
        } else {
          console.log(`⚠️  IndexNow returned status ${res.statusCode}`);
          console.log(`   Response: ${data}`);
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`✗ Error submitting to IndexNow: ${error.message}`);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

// Main execution
async function main() {
  // Check if key file is accessible
  const keyFileAccessible = await checkKeyFile();

  if (!keyFileAccessible) {
    console.log('Please wait a few minutes for GitHub Pages to deploy, then run this script again.\n');
    return;
  }

  // Submit to IndexNow
  try {
    await submitToIndexNow(urls);
    console.log('\n✅ IndexNow submission complete!');
    console.log('   Search engines have been notified of your updates.');
  } catch (error) {
    console.log('\n⚠️  IndexNow submission failed. You can try again later or search engines will eventually crawl your sitemap.');
  }
}

main().catch(console.error);
