const fs = require('fs');
const path = require('path');

// Read the prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Find prompts without thumbnails
const promptsWithoutThumbnails = promptsData.prompts.filter(p => !p.thumbnail);

console.log(`Total prompts: ${promptsData.prompts.length}`);
console.log(`Prompts without thumbnails: ${promptsWithoutThumbnails.length}`);
console.log('\nList of prompts without thumbnails:');
console.log('=====================================\n');

promptsWithoutThumbnails.forEach(p => {
  console.log(`ID: ${p.id}`);
  console.log(`Title: ${p.title}`);
  console.log(`Slug: ${p.slug}`);
  console.log(`Category: ${p.category}`);
  console.log('---');
});

// Get list of available thumbnails
const thumbnailsDir = path.join(__dirname, '../public/thumbnails');
const thumbnailFiles = fs.readdirSync(thumbnailsDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));

console.log('\n\nAvailable thumbnail files that might match:');
console.log('==========================================\n');

// Try to find potential matches
promptsWithoutThumbnails.forEach(prompt => {
  const potentialMatches = thumbnailFiles.filter(file => {
    const fileBaseName = file.replace(/\.(png|jpg|webp)$/i, '').toLowerCase();
    const promptSlug = prompt.slug.toLowerCase();
    const promptTitle = prompt.title.toLowerCase().replace(/\s+/g, '-');
    
    return fileBaseName.includes(promptSlug) || 
           fileBaseName.includes(promptTitle) ||
           promptSlug.includes(fileBaseName) ||
           promptTitle.includes(fileBaseName);
  });
  
  if (potentialMatches.length > 0) {
    console.log(`\nPrompt: "${prompt.title}" (${prompt.slug})`);
    console.log(`Potential matches:`);
    potentialMatches.forEach(match => console.log(`  - ${match}`));
  }
});