#!/usr/bin/env node

const fs = require('fs');

const db = JSON.parse(fs.readFileSync('./data/ingredients.json', 'utf8'));
const unenhanced = db.ingredients.filter(i => !i.enhanced);

console.log(`Total unenhanced: ${unenhanced.length}`);
console.log(`\nFirst 30 unenhanced ingredients:`);
unenhanced.slice(0, 30).forEach(i => console.log(`- ${i.name}`));
