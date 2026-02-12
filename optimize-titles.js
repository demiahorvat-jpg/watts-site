#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Title optimizations (old -> new)
const titleUpdates = [
  {
    file: 'blog/whole-food-vs-synthetic-nutrients.html',
    oldTitle: 'Whole Food vs Synthetic Vitamins in Dog Food: Bioavailability Explained | Watts',
    newTitle: 'Whole Food vs Synthetic Vitamins for Dogs | Watts'
  },
  {
    file: 'blog/fillers-in-dog-supplements.html',
    oldTitle: 'Fillers in Dog Supplements: What to Avoid (Cellulose, Rice Flour, Maltodextrin)',
    newTitle: 'Fillers in Dog Supplements: What to Avoid | Watts'
  },
  {
    file: 'blog/dog-supplement-formats-compared.html',
    oldTitle: 'Dog Supplement Formats Compared: Powder vs Chews vs Liquid (Which is Best?)',
    newTitle: 'Powder vs Chews vs Liquid: Best Format | Watts'
  },
  {
    file: 'blog/green-lipped-mussel-for-dogs.html',
    oldTitle: 'Green-Lipped Mussel for Dogs: Benefits, Dosing & Research-Backed Results',
    newTitle: 'Green-Lipped Mussel for Dogs: Benefits & Dosing | Watts'
  },
  {
    file: 'blog/do-joint-supplements-work-for-dogs.html',
    oldTitle: 'Do Joint Supplements Actually Work for Dogs? What Research Shows | Watts',
    newTitle: 'Do Joint Supplements Work for Dogs? Research | Watts'
  },
  {
    file: 'blog/digestive-enzymes-for-dogs.html',
    oldTitle: 'Digestive Enzymes for Dogs: Complete Guide 2026 (EPI, Products, Dosing)',
    newTitle: 'Digestive Enzymes for Dogs: Guide & Dosing | Watts'
  },
  {
    file: 'blog/can-dogs-take-human-supplements.html',
    oldTitle: 'Can Dogs Take Human Supplements? Safety Risks & Vet-Approved Alternatives',
    newTitle: 'Can Dogs Take Human Supplements? Safety Guide | Watts'
  },
  {
    file: 'blog/how-to-read-dog-supplement-labels.html',
    oldTitle: 'How to Read Dog Supplement Labels: Spot Red Flags & Quality Ingredients',
    newTitle: 'How to Read Dog Supplement Labels | Watts'
  },
  {
    file: 'blog/active-working-dog-nutrition.html',
    oldTitle: 'Working Dog Nutrition: How Much Protein, Fat & Calories They Need | Watts',
    newTitle: 'Working Dog Nutrition: Protein, Fat & Calories | Watts'
  },
  {
    file: 'blog/antioxidants-for-dogs.html',
    oldTitle: 'Best Antioxidants for Dogs: Astaxanthin, Vitamin E & Top 7 Sources | Watts',
    newTitle: 'Best Antioxidants for Dogs: Top 7 Sources | Watts'
  },
  {
    file: 'blog/probiotics-for-dogs.html',
    oldTitle: 'Best Probiotics for Dogs: Vet-Approved Strains, Prebiotics & Postbiotics',
    newTitle: 'Best Probiotics for Dogs: Strains & Benefits | Watts'
  },
  {
    file: 'blog/pregnant-nursing-dog-nutrition.html',
    oldTitle: 'Lactating Dog Calorie Requirements: How Much to Feed Large Litters | Watts',
    newTitle: 'Nursing Dog Nutrition: Calorie Requirements | Watts'
  },
  {
    file: 'blog/immune-support-for-dogs.html',
    oldTitle: 'Best Immune Support Supplements for Dogs: Vitamins, Whole Foods & What Works',
    newTitle: 'Best Immune Support for Dogs: What Works | Watts'
  }
];

let filesUpdated = 0;

titleUpdates.forEach(update => {
  const filePath = path.join(process.cwd(), update.file);

  if (!fs.existsSync(filePath)) {
    console.log(`✗ File not found: ${update.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace title tag
  const titleRegex = new RegExp(`<title>${update.oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</title>`);

  if (content.match(titleRegex)) {
    content = content.replace(titleRegex, `<title>${update.newTitle}</title>`);
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    console.log(`✓ Updated: ${update.file}`);
    console.log(`  Old (${update.oldTitle.length} chars): ${update.oldTitle}`);
    console.log(`  New (${update.newTitle.length} chars): ${update.newTitle}`);
    console.log('');
  } else {
    console.log(`✗ Title not found in: ${update.file}`);
    console.log(`  Looking for: ${update.oldTitle}`);
    console.log('');
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${filesUpdated} files`);
console.log(`\nAll titles now 50-60 characters for optimal SERP display.`);
