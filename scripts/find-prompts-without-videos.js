#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const videosDir = path.join(process.cwd(), 'public', 'videos');

// Read database
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

console.log('Finding prompts without videos...\n');

let totalPrompts = 0;
let promptsWithVideos = 0;
let promptsWithoutVideos = [];

database.prompts.forEach(prompt => {
  totalPrompts++;
  
  const videoPath = path.join(videosDir, `${prompt.slug}.mp4`);
  const videoExists = fs.existsSync(videoPath);
  
  if (videoExists) {
    promptsWithVideos++;
  } else {
    promptsWithoutVideos.push({
      id: prompt.id,
      title: prompt.title,
      slug: prompt.slug,
      category: prompt.category,
      rating: prompt.rating || 'No rating'
    });
  }
});

console.log(`📊 Summary:`);
console.log(`Total prompts: ${totalPrompts}`);
console.log(`Prompts with videos: ${promptsWithVideos}`);
console.log(`Prompts without videos: ${promptsWithoutVideos.length}`);
console.log(`Completion: ${((promptsWithVideos / totalPrompts) * 100).toFixed(1)}%\n`);

if (promptsWithoutVideos.length > 0) {
  console.log(`📋 Prompts without videos (${promptsWithoutVideos.length}):`);
  console.log('=' + '='.repeat(50));
  
  // Sort by rating (highest first), then by ID
  promptsWithoutVideos.sort((a, b) => {
    const ratingA = typeof a.rating === 'number' ? a.rating : 0;
    const ratingB = typeof b.rating === 'number' ? b.rating : 0;
    if (ratingB !== ratingA) return ratingB - ratingA;
    return parseInt(a.id) - parseInt(b.id);
  });
  
  promptsWithoutVideos.forEach((prompt, index) => {
    console.log(`${index + 1}. ID: ${prompt.id} | Rating: ${prompt.rating}⭐`);
    console.log(`   Title: "${prompt.title}"`);
    console.log(`   Slug: ${prompt.slug}`);
    console.log(`   Category: ${prompt.category}`);
    console.log('');
  });
}