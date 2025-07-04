const fs = require('fs');
const path = require('path');

// Read the prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Get all thumbnail files
const thumbnailsDir = path.join(__dirname, '../public/thumbnails');
const thumbnailFiles = fs.readdirSync(thumbnailsDir)
  .filter(file => file.endsWith('.png') || file.endsWith('.jpg'))
  .filter(file => !['woman-sample.jpg', 'animal.jpg', 'landscape-mountain.jpg', 'pet-to-human.png'].includes(file));

console.log(`Found ${thumbnailFiles.length} thumbnail files to process\n`);

// Function to normalize names for matching
function normalizeForMatching(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric
    .replace(/\s+/g, ''); // Remove spaces
}

// Function to create slug from filename
function filenameToSlug(filename) {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Track matches and unmatched items
const matches = [];
const unmatchedThumbnails = [];
const promptsWithoutThumbnails = [];

// Try to match each thumbnail to a prompt
thumbnailFiles.forEach(thumbnailFile => {
  const thumbnailName = thumbnailFile.replace(/\.[^/.]+$/, ''); // Remove extension
  const normalizedThumbnail = normalizeForMatching(thumbnailName);
  const thumbnailSlug = filenameToSlug(thumbnailFile);
  
  // Try different matching strategies
  let matchedPrompt = null;
  
  // Strategy 1: Exact slug match
  matchedPrompt = data.prompts.find(p => p.slug === thumbnailSlug);
  
  // Strategy 2: Normalized title match
  if (!matchedPrompt) {
    matchedPrompt = data.prompts.find(p => 
      normalizeForMatching(p.title) === normalizedThumbnail
    );
  }
  
  // Strategy 3: Partial match (thumbnail name contains prompt title or vice versa)
  if (!matchedPrompt) {
    matchedPrompt = data.prompts.find(p => {
      const normalizedTitle = normalizeForMatching(p.title);
      return normalizedTitle.includes(normalizedThumbnail) || 
             normalizedThumbnail.includes(normalizedTitle);
    });
  }
  
  if (matchedPrompt) {
    matches.push({
      prompt: matchedPrompt,
      thumbnailFile: thumbnailFile
    });
  } else {
    unmatchedThumbnails.push(thumbnailFile);
  }
});

// Find prompts without thumbnails
data.prompts.forEach(prompt => {
  if (!prompt.thumbnail || (typeof prompt.thumbnail === 'object' && !prompt.thumbnail.after)) {
    const hasMatch = matches.find(m => m.prompt.id === prompt.id);
    if (!hasMatch) {
      promptsWithoutThumbnails.push(prompt);
    }
  }
});

// Display results
console.log('📊 MATCHING RESULTS:\n');
console.log(`✅ Matched: ${matches.length} thumbnails to prompts`);
console.log(`❌ Unmatched thumbnails: ${unmatchedThumbnails.length}`);
console.log(`📝 Prompts without thumbnails: ${promptsWithoutThumbnails.length}\n`);

// Show matches
if (matches.length > 0) {
  console.log('🔗 MATCHES FOUND:');
  matches.forEach(({ prompt, thumbnailFile }) => {
    console.log(`  "${prompt.title}" → ${thumbnailFile}`);
  });
  console.log('');
}

// Show unmatched thumbnails
if (unmatchedThumbnails.length > 0) {
  console.log('🖼️  UNMATCHED THUMBNAILS:');
  unmatchedThumbnails.forEach(file => {
    console.log(`  - ${file}`);
  });
  console.log('');
}

// Show prompts without thumbnails
if (promptsWithoutThumbnails.length > 0) {
  console.log('📄 PROMPTS WITHOUT THUMBNAILS:');
  promptsWithoutThumbnails.slice(0, 10).forEach(prompt => {
    console.log(`  - "${prompt.title}" (slug: ${prompt.slug})`);
  });
  if (promptsWithoutThumbnails.length > 10) {
    console.log(`  ... and ${promptsWithoutThumbnails.length - 10} more`);
  }
  console.log('');
}

// Ask for confirmation before applying
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Do you want to apply these matches? (y/n) ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    // Apply matches
    let updatedCount = 0;
    matches.forEach(({ prompt, thumbnailFile }) => {
      const promptToUpdate = data.prompts.find(p => p.id === prompt.id);
      if (promptToUpdate) {
        promptToUpdate.thumbnail = {
          before: "woman-sample.jpg",
          after: thumbnailFile
        };
        updatedCount++;
      }
    });
    
    // Write the updated data back
    fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
    console.log(`\n✅ Updated ${updatedCount} prompts with thumbnails`);
  } else {
    console.log('\n❌ Cancelled - no changes made');
  }
  
  rl.close();
});