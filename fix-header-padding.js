#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'blog/index.html',
  // Get all blog post HTML files
  ...fs.readdirSync('blog')
    .filter(file => file.endsWith('.html') && file !== 'index.html')
    .map(file => `blog/${file}`)
];

let updatedCount = 0;
let alreadyCorrectCount = 0;

for (const file of filesToUpdate) {
  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${file} (not found)`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it already has the correct padding
  if (content.includes('padding: 12px 12px 20px;') &&
      content.includes('.header-wrapper {')) {
    alreadyCorrectCount++;
    continue;
  }

  // Replace padding: 12px; with padding: 12px 12px 20px; in .header-wrapper
  const updated = content.replace(
    /(\.header-wrapper\s*\{[^}]*?)padding:\s*12px;/g,
    '$1padding: 12px 12px 20px;'
  );

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    updatedCount++;
    console.log(`✅ Updated ${file}`);
  }
}

console.log(`\n✅ Updated ${updatedCount} files`);
console.log(`✓  ${alreadyCorrectCount} files already had correct padding`);
