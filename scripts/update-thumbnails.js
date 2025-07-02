const fs = require('fs');
const path = require('path');

// Read the prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Get list of thumbnail files
const thumbnailsDir = path.join(__dirname, '../public/thumbnails');
const thumbnailFiles = fs.readdirSync(thumbnailsDir);

// Create a map of slugs to thumbnail filenames
const thumbnailMap = {};
thumbnailFiles.forEach(file => {
  // Skip non-image files
  if (!file.match(/\.(png|jpg|jpeg|webp)$/i)) return;
  
  // Convert filename to slug format
  const nameWithoutExt = file.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const slug = nameWithoutExt.toLowerCase();
  
  thumbnailMap[slug] = file;
});

// Update prompts with thumbnails
let updatedCount = 0;
promptsData.prompts = promptsData.prompts.map(prompt => {
  const thumbnailFile = thumbnailMap[prompt.slug];
  
  if (thumbnailFile) {
    // Add thumbnail information
    prompt.thumbnail = {
      before: 'woman-sample.jpg',
      after: thumbnailFile
    };
    updatedCount++;
    console.log(`Updated prompt "${prompt.title}" with thumbnail: ${thumbnailFile}`);
  } else {
    console.log(`No thumbnail found for prompt: ${prompt.title} (slug: ${prompt.slug})`);
  }
  
  return prompt;
});

// Write the updated prompts back to file
fs.writeFileSync(promptsPath, JSON.stringify(promptsData, null, 2));

console.log(`\nTotal prompts updated: ${updatedCount} out of ${promptsData.prompts.length}`);