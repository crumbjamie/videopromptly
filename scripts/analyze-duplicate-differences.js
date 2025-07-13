#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

// Group prompts by title to find duplicates
const promptsByTitle = {};
database.prompts.forEach((prompt) => {
  if (!promptsByTitle[prompt.title]) {
    promptsByTitle[prompt.title] = [];
  }
  promptsByTitle[prompt.title].push(prompt);
});

console.log('ANALYZING DIFFERENCES BETWEEN EXACT DUPLICATES\n');
console.log('='.repeat(60));

// Analyze differences for each duplicate group
Object.entries(promptsByTitle).forEach(([title, prompts]) => {
  if (prompts.length > 1) {
    console.log(`\n"${title}" (${prompts.length} copies):`);
    console.log('-'.repeat(title.length + 20));
    
    // Sort by ID for consistent ordering
    prompts.sort((a, b) => a.id - b.id);
    
    // Check what fields differ
    const fields = ['id', 'slug', 'title', 'description', 'prompt', 'category', 'categories', 'tags', 'difficulty', 'videoUrl', 'thumbnailUrl', 'rating', 'featured'];
    const differences = {};
    
    fields.forEach(field => {
      const values = prompts.map(p => p[field]);
      const uniqueValues = [...new Set(values.filter(v => v !== undefined))];
      if (uniqueValues.length > 1) {
        differences[field] = uniqueValues;
      }
    });
    
    // Show each instance with its unique properties
    prompts.forEach((prompt, index) => {
      const hasVideo = prompt.videoUrl && fs.existsSync(path.join(process.cwd(), 'public', prompt.videoUrl.substring(1)));
      console.log(`  ${index + 1}. ID: ${prompt.id}`);
      console.log(`     Slug: ${prompt.slug}`);
      console.log(`     Category: ${prompt.category}`);
      console.log(`     Difficulty: ${prompt.difficulty}`);
      console.log(`     Rating: ${prompt.rating || 'Not set'}`);
      console.log(`     Featured: ${prompt.featured || false}`);
      console.log(`     Video: ${prompt.videoUrl || 'None'} ${hasVideo ? '✅' : '❌'}`);
      if (prompt.tags && prompt.tags.length > 0) {
        console.log(`     Tags: ${prompt.tags.join(', ')}`);
      }
      if (prompt.categories && prompt.categories.length > 0) {
        console.log(`     Categories: ${prompt.categories.join(', ')}`);
      }
    });
    
    // Summary of differences
    console.log(`\n  DIFFERENCES:`);
    if (Object.keys(differences).length === 0) {
      console.log(`    - Only ID and slug differ (expected)`);
    } else {
      Object.entries(differences).forEach(([field, values]) => {
        if (field !== 'id' && field !== 'slug' && field !== 'videoUrl' && field !== 'thumbnailUrl') {
          console.log(`    - ${field}: ${values.join(' | ')}`);
        }
      });
    }
    
    // Check if prompt text is identical
    const uniquePromptTexts = [...new Set(prompts.map(p => p.prompt))];
    if (uniquePromptTexts.length === 1) {
      console.log(`    - Prompt text: IDENTICAL`);
    } else {
      console.log(`    - Prompt text: DIFFERENT (${uniquePromptTexts.length} variations)`);
      uniquePromptTexts.forEach((text, i) => {
        console.log(`      ${i + 1}. "${text.substring(0, 50)}..."`);
      });
    }
    
    // Check if descriptions are identical
    const uniqueDescriptions = [...new Set(prompts.map(p => p.description))];
    if (uniqueDescriptions.length === 1) {
      console.log(`    - Description: IDENTICAL`);
    } else {
      console.log(`    - Description: DIFFERENT (${uniqueDescriptions.length} variations)`);
    }
  }
});

// Overall analysis
console.log('\n\n' + '='.repeat(60));
console.log('OVERALL DUPLICATE ANALYSIS');
console.log('='.repeat(60));

const duplicateGroups = Object.values(promptsByTitle).filter(prompts => prompts.length > 1);

// Analyze what fields vary across all duplicates
const allDifferences = {};
duplicateGroups.forEach(prompts => {
  const fields = ['category', 'difficulty', 'rating', 'featured', 'tags'];
  
  fields.forEach(field => {
    if (!allDifferences[field]) allDifferences[field] = new Set();
    
    const values = prompts.map(p => p[field]);
    const uniqueValues = [...new Set(values.filter(v => v !== undefined))];
    if (uniqueValues.length > 1) {
      uniqueValues.forEach(val => allDifferences[field].add(val));
    }
  });
});

console.log('\nFields that vary between duplicates:');
Object.entries(allDifferences).forEach(([field, values]) => {
  if (values.size > 0) {
    console.log(`- ${field}: ${Array.from(values).join(', ')}`);
  }
});

// Category distribution analysis
console.log('\nCategory distribution in duplicates:');
const categoryCount = {};
duplicateGroups.forEach(prompts => {
  prompts.forEach(prompt => {
    if (!categoryCount[prompt.category]) categoryCount[prompt.category] = 0;
    categoryCount[prompt.category]++;
  });
});

Object.entries(categoryCount)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`- ${category}: ${count} instances`);
  });

// Video status analysis
let totalDuplicates = 0;
let duplicatesWithVideos = 0;
let duplicatesWithMissingVideos = 0;

duplicateGroups.forEach(prompts => {
  prompts.forEach(prompt => {
    totalDuplicates++;
    if (prompt.videoUrl) {
      const hasVideo = fs.existsSync(path.join(process.cwd(), 'public', prompt.videoUrl.substring(1)));
      if (hasVideo) {
        duplicatesWithVideos++;
      } else {
        duplicatesWithMissingVideos++;
      }
    }
  });
});

console.log('\nVideo status in duplicates:');
console.log(`- Total duplicate instances: ${totalDuplicates}`);
console.log(`- Have videos: ${duplicatesWithVideos}`);
console.log(`- Missing videos: ${duplicatesWithMissingVideos}`);
console.log(`- No video URL: ${totalDuplicates - duplicatesWithVideos - duplicatesWithMissingVideos}`);