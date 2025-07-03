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

// Normalize string for matching
function normalize(str) {
  return str.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens
}

// Try to match thumbnails to prompts
promptsWithoutThumbnails.forEach(prompt => {
  const normalizedSlug = normalize(prompt.slug);
  const normalizedTitle = normalize(prompt.title);
  
  // Find matching thumbnail
  const match = thumbnailFiles.find(file => {
    const fileBaseName = file.replace(/\.(png|jpg|webp)$/i, '');
    const normalizedFileName = normalize(fileBaseName);
    
    // Try exact matches
    return normalizedFileName === normalizedSlug || 
           normalizedFileName === normalizedTitle;
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
  !usedThumbnails.includes(f) && 
  !existingThumbnails.includes(f) &&
  !['animal.jpg', 'landscape-mountain.jpg', 'woman-sample.jpg'].includes(f)
);

console.log(`\n\nUNUSED THUMBNAIL FILES (${unusedThumbnails.length}):`);
console.log(`--------------------------------\n`);
unusedThumbnails.forEach(f => {
  console.log(`- ${f}`);
});

// Save matches
const matchesPath = path.join(__dirname, 'thumbnail-matches.json');
fs.writeFileSync(matchesPath, JSON.stringify({
  matches: matches,
  timestamp: new Date().toISOString()
}, null, 2));

console.log(`\n\n✅ Found ${matches.length} matches and saved to thumbnail-matches.json`);