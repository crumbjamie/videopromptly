const fs = require('fs');
const path = require('path');

// Read the prompts database
const promptsData = JSON.parse(fs.readFileSync('lib/database/prompts.json', 'utf-8'));

// Get all thumbnail files
const thumbnailFiles = fs.readdirSync('public/thumbnails')
  .filter(f => f.match(/\.(png|jpg|jpeg|webp)$/i));

// Create a set of all prompt slugs
const promptSlugs = new Set(promptsData.prompts.map(p => p.slug));

// Find thumbnails without matching prompts
const unmatchedThumbnails = [];
thumbnailFiles.forEach(file => {
  const nameWithoutExt = file.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const slug = nameWithoutExt.toLowerCase();
  
  if (!promptSlugs.has(slug)) {
    unmatchedThumbnails.push(file);
  }
});

console.log('Thumbnails without matching prompts:');
unmatchedThumbnails.forEach(file => console.log('- ' + file));
console.log('\nTotal unmatched thumbnails:', unmatchedThumbnails.length);