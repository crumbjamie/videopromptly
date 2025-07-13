#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

console.log('Analyzing prompts for duplicates and similarities...\n');

// Group prompts by various criteria
const promptsByTitle = {};
const promptsByPromptText = {};
const promptsBySlug = {};
const similarTitles = [];
const similarPrompts = [];

// Analyze each prompt
database.prompts.forEach((prompt, index) => {
  // Group by exact title
  if (!promptsByTitle[prompt.title]) {
    promptsByTitle[prompt.title] = [];
  }
  promptsByTitle[prompt.title].push({ ...prompt, index });

  // Group by exact prompt text
  if (!promptsByPromptText[prompt.prompt]) {
    promptsByPromptText[prompt.prompt] = [];
  }
  promptsByPromptText[prompt.prompt].push({ ...prompt, index });

  // Group by slug
  if (!promptsBySlug[prompt.slug]) {
    promptsBySlug[prompt.slug] = [];
  }
  promptsBySlug[prompt.slug].push({ ...prompt, index });
});

// Find exact duplicates
console.log('=== EXACT DUPLICATES ===\n');

console.log('1. Duplicate Titles:');
let duplicateTitleCount = 0;
Object.entries(promptsByTitle).forEach(([title, prompts]) => {
  if (prompts.length > 1) {
    duplicateTitleCount++;
    console.log(`\n"${title}" appears ${prompts.length} times:`);
    prompts.forEach(p => {
      console.log(`  - ID: ${p.id}, Slug: ${p.slug}, Category: ${p.category}`);
      if (p.videoUrl) console.log(`    Video: ${p.videoUrl}`);
    });
  }
});
console.log(`\nTotal duplicate titles: ${duplicateTitleCount}`);

console.log('\n2. Duplicate Prompt Texts:');
let duplicatePromptCount = 0;
Object.entries(promptsByPromptText).forEach(([promptText, prompts]) => {
  if (prompts.length > 1) {
    duplicatePromptCount++;
    console.log(`\nPrompt text appears ${prompts.length} times:`);
    console.log(`"${promptText.substring(0, 100)}..."`);
    prompts.forEach(p => {
      console.log(`  - Title: ${p.title}, ID: ${p.id}, Category: ${p.category}`);
    });
  }
});
console.log(`\nTotal duplicate prompt texts: ${duplicatePromptCount}`);

console.log('\n3. Duplicate Slugs:');
let duplicateSlugCount = 0;
Object.entries(promptsBySlug).forEach(([slug, prompts]) => {
  if (prompts.length > 1) {
    duplicateSlugCount++;
    console.log(`\nSlug "${slug}" appears ${prompts.length} times:`);
    prompts.forEach(p => {
      console.log(`  - Title: ${p.title}, ID: ${p.id}`);
    });
  }
});
console.log(`\nTotal duplicate slugs: ${duplicateSlugCount}`);

// Find similar titles (using simple similarity check)
console.log('\n\n=== SIMILAR TITLES ===\n');
const titles = Object.keys(promptsByTitle);
for (let i = 0; i < titles.length; i++) {
  for (let j = i + 1; j < titles.length; j++) {
    const title1 = titles[i].toLowerCase();
    const title2 = titles[j].toLowerCase();
    
    // Check if titles are very similar (contain each other or differ by small amount)
    if (title1.includes(title2) || title2.includes(title1) || 
        levenshteinDistance(title1, title2) <= 3) {
      similarTitles.push({
        title1: titles[i],
        title2: titles[j],
        prompts1: promptsByTitle[titles[i]],
        prompts2: promptsByTitle[titles[j]]
      });
    }
  }
}

if (similarTitles.length > 0) {
  console.log('Found similar titles:');
  similarTitles.forEach(pair => {
    console.log(`\n"${pair.title1}" ≈ "${pair.title2}"`);
    console.log(`  First: ${pair.prompts1.map(p => p.id).join(', ')}`);
    console.log(`  Second: ${pair.prompts2.map(p => p.id).join(', ')}`);
  });
} else {
  console.log('No similar titles found.');
}

// Summary statistics
console.log('\n\n=== SUMMARY ===');
console.log(`Total prompts: ${database.prompts.length}`);
console.log(`Unique titles: ${Object.keys(promptsByTitle).length}`);
console.log(`Unique prompt texts: ${Object.keys(promptsByPromptText).length}`);
console.log(`Unique slugs: ${Object.keys(promptsBySlug).length}`);
console.log(`\nDuplicates found:`);
console.log(`  - Duplicate titles: ${duplicateTitleCount}`);
console.log(`  - Duplicate prompt texts: ${duplicatePromptCount}`);
console.log(`  - Duplicate slugs: ${duplicateSlugCount}`);

// Helper function for string similarity
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

// Check for prompts with missing videos that have duplicates with videos
console.log('\n\n=== DUPLICATES WITH/WITHOUT VIDEOS ===');
const missingVideos = database.prompts.filter(p => p.videoUrl && !fs.existsSync(path.join(process.cwd(), 'public', p.videoUrl.substring(1))));
const hasVideos = database.prompts.filter(p => p.videoUrl && fs.existsSync(path.join(process.cwd(), 'public', p.videoUrl.substring(1))));

missingVideos.forEach(missing => {
  const duplicatesWithVideo = hasVideos.filter(has => 
    has.title === missing.title || 
    has.prompt === missing.prompt
  );
  
  if (duplicatesWithVideo.length > 0) {
    console.log(`\n"${missing.title}" (ID: ${missing.id}) is missing video but has duplicates with videos:`);
    duplicatesWithVideo.forEach(dup => {
      console.log(`  - ID: ${dup.id}, Video: ${dup.videoUrl}`);
    });
  }
});