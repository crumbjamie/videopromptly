const fs = require('fs');
const path = require('path');

// Read the current database
const database = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/database/prompts.json'), 'utf8'));

// Category merging mapping
const categoryMerges = {
  // Merge similar artistic categories
  'Artistic Effects': 'Artistic Styles',
  'Minimalist Art': 'Minimalist Design',
  
  // Merge toy categories
  'Toy Photography': 'Toy Transformations',
  
  // Merge action categories
  'Action & sports': 'Action & Sports',
  
  // Merge animation categories
  'Animation Styles': 'Anime & animation',
  
  // Merge fantasy categories
  'Fantasy Characters': 'Fantasy & magic',
  'Surreal & fantasy': 'Fantasy & magic',
  
  // Merge tech/sci-fi categories
  'Technical Effects': 'Futuristic Tech',
  'Robots & mechs': 'Cyberpunk & sci-fi',
  'Sci-fi humor': 'Cyberpunk & sci-fi',
  
  // Merge retro categories
  'Retro Styles': 'Vintage & retro',
  'Y2K aesthetic': 'Vintage & retro',
  
  // Merge art categories
  'Pattern Art': 'Traditional Art',
  'Textile Art': 'Traditional Art',
  'Street Art': 'Traditional Art',
  'Temporary Art': 'Traditional Art',
  
  // Merge digital art categories
  'Pixel Art': 'Digital Art',
  'Pop Art': 'Digital Art',
  'Comic Art': 'Digital Art',
  
  // Merge cinematic categories
  'Director Styles': 'Cinematic Styles',
  'Film Noir': 'Cinematic Styles',
  
  // Merge neon/light categories
  'Neon & light art': 'Creative Effects'
};

// Count prompts before merge
const beforeCategories = {};
database.prompts.forEach(prompt => {
  beforeCategories[prompt.category] = (beforeCategories[prompt.category] || 0) + 1;
});

// Update all prompts with merged categories
const updatedPrompts = database.prompts.map(prompt => {
  const newCategory = categoryMerges[prompt.category] || prompt.category;
  return {
    ...prompt,
    category: newCategory
  };
});

// Sort prompts by category and title
updatedPrompts.sort((a, b) => {
  if (a.category === b.category) {
    return a.title.localeCompare(b.title);
  }
  return a.category.localeCompare(b.category);
});

// Reassign IDs based on new order
updatedPrompts.forEach((prompt, index) => {
  prompt.id = String(index + 1);
});

// Save the updated database
const updatedDatabase = {
  prompts: updatedPrompts
};

fs.writeFileSync(
  path.join(__dirname, '../lib/database/prompts.json'),
  JSON.stringify(updatedDatabase, null, 2)
);

// Get category counts after merge
const afterCategories = {};
updatedPrompts.forEach(prompt => {
  afterCategories[prompt.category] = (afterCategories[prompt.category] || 0) + 1;
});

console.log('Category Merge Summary:');
console.log('======================');
console.log('\nMerged categories:');
Object.entries(categoryMerges).forEach(([from, to]) => {
  if (beforeCategories[from]) {
    console.log(`- "${from}" → "${to}" (${beforeCategories[from]} prompts)`);
  }
});

console.log(`\nBefore: ${Object.keys(beforeCategories).length} categories`);
console.log(`After: ${Object.keys(afterCategories).length} categories`);

console.log('\nFinal categories:');
Object.entries(afterCategories)
  .sort((a, b) => b[1] - a[1])
  .forEach(([category, count]) => {
    console.log(`- ${category}: ${count} prompts`);
  });