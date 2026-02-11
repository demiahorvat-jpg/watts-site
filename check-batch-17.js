#!/usr/bin/env node

const fs = require('fs');

const db = JSON.parse(fs.readFileSync('./data/ingredients.json', 'utf8'));

const targets = [
  'Alfalfa Nutrient Concentrate',
  'Anchovies',
  'Anthocyanins',
  'Apple Cider Vinegar',
  'Autolyzed Yeast',
  'Bananas',
  'Barley Grass',
  'Beef Heart'
];

console.log('Batch 17 Enhancement Status Check:\n');

targets.forEach(name => {
  const ing = db.ingredients.find(i => i.name === name);
  if (ing) {
    console.log(`--- ${name} ---`);
    console.log('  Has compareToSimilar:', !!ing.whatItIsExpanded?.compareToSimilar);
    console.log('  Has nutritionalProfile:', !!ing.nutritionalProfile);
    console.log('  Has seoMetadata:', !!ing.seoMetadata);
    console.log('  Has lastUpdated:', !!ing.lastUpdated);
    console.log();
  } else {
    console.log(`--- ${name} --- NOT FOUND`);
    console.log();
  }
});
