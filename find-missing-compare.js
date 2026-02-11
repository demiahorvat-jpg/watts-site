#!/usr/bin/env node
const db = require('./data/ingredients.json');
const missing = db.ingredients.filter(i => !i.whatItIsExpanded?.compareToSimilar).map(i => i.name);
console.log('Missing compareToSimilar (' + missing.length + '):');
console.log(missing.join(', '));
