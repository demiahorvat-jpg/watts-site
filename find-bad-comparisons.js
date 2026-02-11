#!/usr/bin/env node
const db = require('./data/ingredients.json');

const batch = [
  'Fermented Ingredients', 'Ferrous Sulfate', 'Fish Digest', 'Folic Acid',
  'Fructooligosaccharides', 'Ginger', 'Ginkgo Biloba', 'Glutamine',
  'Glutathione', 'Glycerin', 'GOS', 'Green Lipped Mussel',
  'Guar Fiber', 'Heart', 'Herring', 'Hickory Smoke Flavor',
  'Hyaluronic Acid', 'Hydrolyzed Poultry Liver', 'Hydrolyzed Yeast', 'Inulin',
  'Iron Amino Acid Chelate', 'Iron Proteinate', 'Iron Sulfate', 'Kefir'
];

let foundErrors = false;

batch.forEach(name => {
  const ing = db.ingredients.find(i => i.name === name);
  if (ing?.whatItIsExpanded?.compareToSimilar) {
    ing.whatItIsExpanded.compareToSimilar.forEach((c, idx) => {
      if (!c.ingredient || !c.difference) {
        console.log(`ERROR in "${name}" comparison ${idx}:`);
        console.log(`  ingredient: ${c.ingredient}`);
        console.log(`  difference: ${c.difference}`);
        console.log();
        foundErrors = true;
      }
    });
  }
});

if (!foundErrors) {
  console.log('No errors found in batch 21-23 comparisons');
}
