#!/usr/bin/env node

const fs = require('fs');

console.log('Adding Squash and Butternut Squash ingredients...\n');

const data = JSON.parse(fs.readFileSync('data/ingredients.json', 'utf8'));

// Add Squash (generic)
const squash = {
  "name": "Squash",
  "aliases": [
    "organic squash",
    "winter squash"
  ],
  "category": "vegetable",
  "whatItIs": "Winter squash varieties (excluding pumpkin and zucchini) used in pet foods. Typically refers to varieties like acorn, butternut, or kabocha squash.",
  "whyUsed": [
    "Source of beta-carotene and vitamins",
    "Provides natural sweetness and fiber",
    "Low-calorie vegetable filler"
  ],
  "nutritionValue": "moderate",
  "qualityNote": "Nutritious vegetable when squash type is specified. Generic \"squash\" without variety indicated may be less transparent labeling.",
  "wattsPosition": "good",
  "wattsTake": "Good vegetable source. More specific labeling (butternut, acorn, etc.) is preferred for transparency.",
  "citations": [],
  "compareToSimilar": [
    "pumpkin",
    "butternut-squash",
    "sweet-potatoes",
    "carrots"
  ]
};

// Add Butternut Squash
const butternutSquash = {
  "name": "Butternut Squash",
  "aliases": [
    "butternut",
    "organic butternut squash"
  ],
  "category": "vegetable",
  "whatItIs": "Butternut squash (Cucurbita moschata) is a winter squash variety with sweet, nutty-flavored orange flesh. Rich in beta-carotene, vitamins, and minerals.",
  "whyUsed": [
    "High in beta-carotene (vitamin A precursor)",
    "Natural source of vitamins C and E",
    "Provides fiber and potassium",
    "Naturally sweet and palatable"
  ],
  "nutritionValue": "high",
  "qualityNote": "Excellent vegetable choice. Higher in vitamin A and sweeter than many other squash varieties. Whole food ingredient with good nutrient density.",
  "wattsPosition": "good",
  "wattsTake": "Top-tier vegetable ingredient. Specific variety labeling shows transparency. Nutrient-dense with high beta-carotene content.",
  "citations": [
    {
      "type": "general",
      "text": "USDA FoodData Central: Squash, winter, butternut, raw",
      "url": "https://fdc.nal.usda.gov/fdc-app.html#/food-details/169278/nutrients"
    }
  ],
  "compareToSimilar": [
    "pumpkin",
    "squash",
    "sweet-potatoes",
    "carrots"
  ]
};

// Insert in alphabetical order
const insertAlphabetically = (ingredient) => {
  const index = data.ingredients.findIndex(i => i.name > ingredient.name);
  if (index === -1) {
    data.ingredients.push(ingredient);
  } else {
    data.ingredients.splice(index, 0, ingredient);
  }
};

insertAlphabetically(squash);
insertAlphabetically(butternutSquash);

fs.writeFileSync('data/ingredients.json', JSON.stringify(data, null, 2), 'utf8');

console.log('✅ Added Squash to ingredients.json');
console.log('✅ Added Butternut Squash to ingredients.json');
console.log('\nNow run the page generation script...');
