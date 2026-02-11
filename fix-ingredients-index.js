const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ingredient-analyzer', 'ingredients', 'index.html');

// Read the careful-fix script logic
const updateScript = fs.readFileSync(path.join(__dirname, 'careful-fix-ingredient-pages.js'), 'utf8');

// Extract the update function and apply it
eval(updateScript.split('function updateFile')[1].split('// Update main page')[0]);

console.log('Updating ingredients index page...');
const result = updateFile(filePath);
console.log(`Result: ${result.status}`);
if (result.error) {
  console.log(`Error: ${result.error}`);
}
