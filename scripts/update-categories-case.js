const fs = require('fs');
const path = require('path');

// Read the current database
const database = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/database/prompts.json'), 'utf8'));

// Function to convert to sentence case
function toSentenceCase(str) {
  // Special words that should remain lowercase
  const lowercaseWords = ['&', 'and', 'or', 'the', 'of', 'in', 'on', 'at', 'to', 'for'];
  
  return str.split(' ').map((word, index) => {
    // Always capitalize first word
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    
    // Keep special words lowercase unless they're the first word
    if (lowercaseWords.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    
    // Regular word - capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

// Update all prompts with sentence case categories
const updatedPrompts = database.prompts.map(prompt => {
  // Special cases that should keep their specific formatting
  const specialCases = {
    'Studio Ghibli': 'Studio Ghibli',
    'Y2K Aesthetic': 'Y2K aesthetic',
    'Y2K aesthetic': 'Y2K aesthetic',
    'Sci-Fi Humor': 'Sci-fi humor',
    'Sci-fi humor': 'Sci-fi humor',
    'Cyberpunk & Sci-Fi': 'Cyberpunk & sci-fi',
    'Cyberpunk & sci-fi': 'Cyberpunk & sci-fi',
    'Surreal & Fantasy': 'Surreal & fantasy',
    'Fantasy & Magic': 'Fantasy & magic',
    'Vintage & Retro': 'Vintage & retro',
    'Synthwave & Vaporwave': 'Synthwave & vaporwave',
    'Synthwave & vaporwave': 'Synthwave & vaporwave',
    'Robots & Mechs': 'Robots & mechs',
    'Puppet & Felt Art': 'Puppet & felt art',
    'Puppet & Felt art': 'Puppet & felt art',
    'Neon & Light Art': 'Neon & light art',
    'Neon & Light art': 'Neon & light art',
    'Horror & Gothic': 'Horror & gothic',
    'Anime & Animation': 'Anime & animation',
    'Action & Sports': 'Action & sports'
  };
  
  let newCategory = prompt.category;
  
  if (specialCases[prompt.category]) {
    newCategory = specialCases[prompt.category];
  } else {
    newCategory = toSentenceCase(prompt.category);
  }
  
  return {
    ...prompt,
    category: newCategory
  };
});

// Save the updated database
const updatedDatabase = {
  prompts: updatedPrompts
};

fs.writeFileSync(
  path.join(__dirname, '../lib/database/prompts.json'),
  JSON.stringify(updatedDatabase, null, 2)
);

// Get unique categories
const uniqueCategories = [...new Set(updatedPrompts.map(p => p.category))].sort();

console.log(`Successfully updated ${updatedPrompts.length} prompts to sentence case!`);
console.log(`\nCategories (${uniqueCategories.length} total):`);
uniqueCategories.forEach(cat => console.log(`- ${cat}`));