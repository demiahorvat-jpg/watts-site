#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('data/ingredients.json', 'utf8'));

// Find ingredient by name
function findIngredient(name) {
  return data.ingredients.find(i => i.name === name);
}

// Add aliases to an ingredient
function addAliases(name, newAliases) {
  const ing = findIngredient(name);
  if (!ing) {
    console.log(`⚠️  Could not find: ${name}`);
    return;
  }

  if (!ing.aliases) {
    ing.aliases = [];
  }

  const added = [];
  newAliases.forEach(alias => {
    if (!ing.aliases.includes(alias)) {
      ing.aliases.push(alias);
      added.push(alias);
    }
  });

  if (added.length > 0) {
    console.log(`✅ ${name}: added ${added.join(', ')}`);
  }
}

// Remove aliases from an ingredient
function removeAliases(name, aliasesToRemove) {
  const ing = findIngredient(name);
  if (!ing) {
    console.log(`⚠️  Could not find: ${name}`);
    return;
  }

  if (!ing.aliases) {
    return;
  }

  const removed = [];
  aliasesToRemove.forEach(alias => {
    const index = ing.aliases.indexOf(alias);
    if (index > -1) {
      ing.aliases.splice(index, 1);
      removed.push(alias);
    }
  });

  if (removed.length > 0) {
    console.log(`🗑️  ${name}: removed ${removed.join(', ')}`);
  }
}

console.log('Adding missing aliases...\n');

// HIGH PRIORITY - No aliases currently
addAliases('Melatonin', ['melatonin supplement']);
addAliases('Ethoxyquin', ['EMQ', 'ethoxyquin preservative']);
addAliases('Digestive Enzymes', ['enzyme blend', 'digestive enzyme blend']);
addAliases('Krill Oil', ['antarctic krill oil', 'krill omega-3']);
addAliases('Prebiotics', ['prebiotic fiber', 'prebiotic blend']);
addAliases('Blue 1', ['brilliant blue FCF', 'FD&C blue 1', 'blue dye 1']);
addAliases('Red 3', ['erythrosine', 'FD&C red 3', 'red dye 3']);
addAliases('Beet Juice Color', ['beetroot juice color', 'beet juice for color', 'beet juice concentrate for color']);
addAliases('Fermented Ingredients', ['fermented blend', 'fermentation products']);
addAliases('Natural Color', ['natural coloring', 'natural food coloring']);
addAliases('Anchovies', ['anchovy', 'whole anchovies']);
addAliases('Spirulina Color', ['spirulina extract for color', 'blue spirulina color']);
addAliases('Herring', ['whole herring', 'fresh herring', 'atlantic herring']);
addAliases('Whitefish Meal', ['white fish meal', 'dehydrated whitefish']);

// MEDIUM PRIORITY - Missing common aliases
addAliases('Calcium Carbonate', ['ground limestone']);
addAliases('Cassava', ['tapioca']);
addAliases('Chia Seed', ['chia']);
addAliases('Corn Gluten Meal', ['CGM']);
addAliases('Dicalcium Phosphate', ['DCP']);
addAliases('Tricalcium Phosphate', ['TCP']);
addAliases('Dried Kelp', ['kelp powder']);
addAliases('Dried Plasma', ['spray dried animal plasma', 'SDAP']);
addAliases('Duck', ['whole duck']);
addAliases('Egg', ['fresh eggs']);
addAliases('Fish Oil', ['fish body oil']);
addAliases('Gelatin', ['gelatine']);
addAliases('Green-Lipped Mussel', ['GLM']);
addAliases('Locust Bean Gum', ['carob bean gum']);
addAliases('Parsley', ['parsley flakes']);
// Skip canned pumpkin per user request
addAliases('Rice Bran', ['defatted rice bran']);
addAliases('Anthocyanins', ['anthocyanin color']);
// Skip nooch per user request

console.log('\nRemoving incorrect aliases...\n');

// CRITICAL - Remove incorrect aliases
removeAliases('Coconut Oil', ['mct oil', 'medium chain triglycerides']);
removeAliases('Potato Starch', ['tapioca starch']);

// Save updated data
fs.writeFileSync('data/ingredients.json', JSON.stringify(data, null, 2), 'utf8');

console.log('\n✅ Updated ingredients.json');
