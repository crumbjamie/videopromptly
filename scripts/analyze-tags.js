const fs = require('fs');
const path = require('path');

// Read the prompts database
const dbPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Analyze prompts with few tags
console.log('=== PROMPTS WITH FEW TAGS ===\n');

const promptsWithFewTags = data.prompts
  .filter(p => p.tags.length < 3)
  .sort((a, b) => a.tags.length - b.tags.length);

console.log(`Found ${promptsWithFewTags.length} prompts with less than 3 tags:\n`);

promptsWithFewTags.forEach(prompt => {
  console.log(`${prompt.title} (${prompt.category})`);
  console.log(`  Current tags: [${prompt.tags.join(', ')}]`);
  console.log(`  Prompt: ${prompt.prompt.substring(0, 100)}...`);
  console.log('');
});

// Analyze tag distribution
console.log('\n=== TAG DISTRIBUTION ===\n');

const tagCounts = {};
data.prompts.forEach(prompt => {
  prompt.tags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
});

const sortedTags = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1]);

console.log('Most used tags:');
sortedTags.slice(0, 20).forEach(([tag, count]) => {
  console.log(`  ${tag}: ${count} prompts`);
});

console.log('\nLeast used tags:');
sortedTags.slice(-20).forEach(([tag, count]) => {
  console.log(`  ${tag}: ${count} prompts`);
});

// Analyze prompts without common style tags
console.log('\n=== PROMPTS MISSING COMMON STYLE TAGS ===\n');

const commonStyleTags = ['portrait', 'action', 'cinematic', 'artistic', 'fantasy', 'retro', 'futuristic', 'minimalist', 'dramatic', 'vintage'];

const promptsMissingStyleTags = data.prompts.filter(prompt => {
  const hasStyleTag = prompt.tags.some(tag => 
    commonStyleTags.some(style => tag.toLowerCase().includes(style))
  );
  return !hasStyleTag;
});

console.log(`Found ${promptsMissingStyleTags.length} prompts without common style tags:`);
promptsMissingStyleTags.slice(0, 10).forEach(prompt => {
  console.log(`  - ${prompt.title}: [${prompt.tags.join(', ')}]`);
});