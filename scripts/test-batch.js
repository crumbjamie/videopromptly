#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
let data;

try {
  data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
  console.log('✅ Database loaded successfully');
  console.log(`📊 Total prompts in database: ${data.prompts.length}`);
} catch (error) {
  console.error('❌ Error reading prompts.json:', error.message);
  process.exit(1);
}

// Test if specific prompt IDs exist
const testIds = [202, 203, 204, 205, 406, 407, 408];

console.log('\n🔍 Testing specific prompt IDs:');
testIds.forEach(id => {
  const prompt = data.prompts.find(p => p.id === String(id));
  if (prompt) {
    console.log(`✅ ID ${id}: "${prompt.title}" (${prompt.rating}⭐)`);
    console.log(`   Expected video: ${prompt.videoUrl}`);
    
    // Check if video file exists
    const videoPath = path.join(__dirname, '../public', prompt.videoUrl);
    const exists = fs.existsSync(videoPath);
    console.log(`   Video exists: ${exists ? '✅' : '❌'}`);
  } else {
    console.log(`❌ ID ${id}: NOT FOUND in database`);
  }
});

// Check database structure
console.log('\n📊 Database Structure Analysis:');
console.log('First prompt:', data.prompts[0]?.id, data.prompts[0]?.title);
console.log('Last prompt:', data.prompts[data.prompts.length - 1]?.id, data.prompts[data.prompts.length - 1]?.title);

// Show all prompt IDs
const allIds = data.prompts.map(p => p.id).sort((a, b) => a - b);
console.log('All prompt IDs:', allIds.slice(0, 20), '...', allIds.slice(-10));

console.log('\n🎯 API Key Status:');
console.log('KIE_API_KEY loaded:', process.env.KIE_API_KEY ? '✅ Yes' : '❌ No');
if (process.env.KIE_API_KEY) {
  console.log('API Key preview:', process.env.KIE_API_KEY.substring(0, 8) + '...');
}