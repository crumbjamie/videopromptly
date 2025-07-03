const fs = require('fs');
const path = require('path');

// Read the prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Get list of thumbnail files
const thumbnailsDir = path.join(__dirname, '../public/thumbnails');
const thumbnailFiles = fs.readdirSync(thumbnailsDir)
  .filter(f => (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp')) && !f.includes('square'));

// Find prompts without thumbnails
const promptsWithoutThumbnails = promptsData.prompts.filter(p => !p.thumbnail);

console.log(`\nMatching thumbnails to prompts...`);
console.log(`=================================\n`);

const matches = [];
const unmatched = [];

// Try to match thumbnails to prompts
promptsWithoutThumbnails.forEach(prompt => {
  // Clean up the slug and title for matching
  const promptSlug = prompt.slug.toLowerCase();
  const promptTitleSlug = prompt.title.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Replace multiple hyphens with single

  // Find matching thumbnail
  const match = thumbnailFiles.find(file => {
    const fileBaseName = file.replace(/\.(png|jpg|webp)$/i, '').toLowerCase();
    
    // Try exact match first
    if (fileBaseName === promptSlug || fileBaseName === promptTitleSlug) {
      return true;
    }
    
    // Try partial matches
    // Remove common words for better matching
    const cleanFileName = fileBaseName.replace(/-/g, '');
    const cleanSlug = promptSlug.replace(/-/g, '');
    const cleanTitle = promptTitleSlug.replace(/-/g, '');
    
    return cleanFileName === cleanSlug || cleanFileName === cleanTitle;
  });

  if (match) {
    matches.push({
      promptId: prompt.id,
      promptTitle: prompt.title,
      promptSlug: prompt.slug,
      thumbnailFile: match
    });
  } else {
    unmatched.push(prompt);
  }
});

// Display matches
console.log(`FOUND ${matches.length} MATCHES:`);
console.log(`--------------------------\n`);
matches.forEach(m => {
  console.log(`✓ "${m.promptTitle}" (${m.promptSlug})`);
  console.log(`  → ${m.thumbnailFile}\n`);
});

// Display unmatched prompts
console.log(`\n\nUNMATCHED PROMPTS (${unmatched.length}):`);
console.log(`-----------------------------\n`);
unmatched.forEach(p => {
  console.log(`✗ "${p.title}" (${p.slug})`);
});

// Display unmatched thumbnails
const usedThumbnails = matches.map(m => m.thumbnailFile);
const existingThumbnails = promptsData.prompts
  .filter(p => p.thumbnail && p.thumbnail.after)
  .map(p => p.thumbnail.after);
const unusedThumbnails = thumbnailFiles.filter(f => 
  !usedThumbnails.includes(f) && !existingThumbnails.includes(f)
);

console.log(`\n\nUNUSED THUMBNAIL FILES (${unusedThumbnails.length}):`);
console.log(`--------------------------------\n`);
unusedThumbnails.forEach(f => {
  console.log(`- ${f}`);
});

// Export matches for use in update script
fs.writeFileSync(
  path.join(__dirname, 'thumbnail-matches.json'),
  JSON.stringify(matches, null, 2)
);

console.log(`\n\n✅ Matches saved to thumbnail-matches.json`);
console.log(`Run 'node scripts/apply-thumbnail-matches.js' to apply these matches.`);