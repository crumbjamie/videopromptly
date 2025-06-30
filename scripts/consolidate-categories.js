const fs = require('fs');
const path = require('path');

// Read the current database
const database = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/database/prompts.json'), 'utf8'));

// Consolidated category mapping
const categoryConsolidation = {
  // Photography Styles
  'Portrait Photography': 'Photography Styles',
  'Editorial Photography': 'Photography Styles',
  'Underwater Photography': 'Photography Styles',
  'Fashion Photography': 'Photography Styles',
  
  // Artistic Transformations
  'Artistic Styles': 'Artistic Transformations',
  'Artistic Effects': 'Artistic Transformations',
  'Traditional Art': 'Artistic Transformations',
  'Paper Art': 'Artistic Transformations',
  'Street Art': 'Artistic Transformations',
  'Classical Art': 'Artistic Transformations',
  'Sculpture Art': 'Artistic Transformations',
  'Pattern Art': 'Artistic Transformations',
  'Textile Art': 'Artistic Transformations',
  'Minimalist Art': 'Artistic Transformations',
  'Temporary Art': 'Artistic Transformations',
  'Neon & Light Art': 'Artistic Transformations',
  
  // Character & Fantasy
  'Fantasy & Magic': 'Character & Fantasy',
  'Fantasy Characters': 'Character & Fantasy',
  'Horror & Gothic': 'Character & Fantasy',
  'Historical Epic': 'Character & Fantasy',
  'Transformations': 'Character & Fantasy',
  
  // Animation & 3D
  'Anime & Animation': 'Animation & 3D',
  'Animation Styles': 'Animation & 3D',
  'Studio Ghibli': 'Animation & 3D',
  'Puppet & Felt Art': 'Animation & 3D',
  
  // Retro & Vintage
  'Vintage & Retro': 'Retro & Vintage',
  'Retro Styles': 'Retro & Vintage',
  'Y2K Aesthetic': 'Retro & Vintage',
  'Synthwave & Vaporwave': 'Retro & Vintage',
  
  // Sci-Fi & Tech
  'Cyberpunk & Sci-Fi': 'Sci-Fi & Tech',
  'Futuristic Tech': 'Sci-Fi & Tech',
  'Sci-Fi Humor': 'Sci-Fi & Tech',
  'Steampunk': 'Sci-Fi & Tech',
  'Robots & Mechs': 'Sci-Fi & Tech',
  'Technical Effects': 'Sci-Fi & Tech',
  
  // Cinematic & Film
  'Cinematic Styles': 'Cinematic & Film',
  'Film Noir': 'Cinematic & Film',
  'Director Styles': 'Cinematic & Film',
  
  // Digital Art & Gaming
  'Digital Art': 'Digital Art & Gaming',
  'Gaming Culture': 'Digital Art & Gaming',
  'Pixel Art': 'Digital Art & Gaming',
  'Pop Art': 'Digital Art & Gaming',
  'Comic Art': 'Digital Art & Gaming',
  
  // Toys & Collectibles
  'Toy Transformations': 'Toys & Collectibles',
  'Toy Photography': 'Toys & Collectibles',
  
  // Action & Sports
  'Action & Sports': 'Action & Sports',
  
  // Surreal & Conceptual
  'Surreal & Fantasy': 'Surreal & Conceptual',
  'Minimalist Design': 'Surreal & Conceptual',
  'Creative Effects': 'Surreal & Conceptual',
  
  // Social Media
  'Social Media': 'Social Media & Marketing'
};

// Update all prompts with consolidated categories
const updatedPrompts = database.prompts.map(prompt => {
  const newCategory = categoryConsolidation[prompt.category] || prompt.category;
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

// Get category counts
const categoryCounts = {};
updatedPrompts.forEach(prompt => {
  categoryCounts[prompt.category] = (categoryCounts[prompt.category] || 0) + 1;
});

console.log(`Successfully consolidated categories!`);
console.log(`\nNew categories (${Object.keys(categoryCounts).length} total):`);
Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([category, count]) => {
    console.log(`- ${category}: ${count} prompts`);
  });