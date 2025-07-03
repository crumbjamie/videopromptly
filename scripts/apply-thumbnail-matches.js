const fs = require('fs');
const path = require('path');

// Read the matches file
const matchesPath = path.join(__dirname, 'thumbnail-matches.json');
const matchesData = JSON.parse(fs.readFileSync(matchesPath, 'utf-8'));

// Read the prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

console.log(`\nApplying ${matchesData.matches.length} thumbnail matches...`);
console.log(`=====================================\n`);

let updatedCount = 0;

// Apply matches
matchesData.matches.forEach(match => {
  const prompt = promptsData.prompts.find(p => p.id === match.promptId);
  
  if (prompt) {
    prompt.thumbnail = {
      before: 'woman-sample.jpg',
      after: match.thumbnailFile
    };
    updatedCount++;
    console.log(`✓ Updated "${prompt.title}" with thumbnail: ${match.thumbnailFile}`);
  } else {
    console.log(`✗ Could not find prompt with ID: ${match.promptId}`);
  }
});

// Update the timestamp
promptsData.lastUpdated = new Date().toISOString();

// Write the updated prompts back to file
fs.writeFileSync(promptsPath, JSON.stringify(promptsData, null, 2));

console.log(`\n✅ Successfully updated ${updatedCount} prompts with thumbnails!`);
console.log(`📊 Total prompts in database: ${promptsData.prompts.length}`);