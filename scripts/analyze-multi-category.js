const fs = require('fs');
const path = require('path');

// Read the prompts database
const dbPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Define category keywords and related categories
const categoryRelations = {
  'Portrait Photography': {
    keywords: ['portrait', 'face', 'headshot', 'person', 'model', 'beauty', 'professional'],
    relatedCategories: ['Headshots', 'Fashion Photography', 'Editorial Photography', 'Studio Ghibli', 'Artistic Styles']
  },
  'Headshots': {
    keywords: ['executive', 'professional', 'corporate', 'linkedin', 'business', 'attorney', 'medical', 'academic'],
    relatedCategories: ['Portrait Photography', 'Editorial Photography']
  },
  'Fashion Photography': {
    keywords: ['fashion', 'style', 'model', 'runway', 'editorial', 'vogue', 'glamour', 'beauty'],
    relatedCategories: ['Portrait Photography', 'Editorial Photography', 'Artistic Styles']
  },
  'Artistic Styles': {
    keywords: ['art', 'painting', 'artistic', 'style', 'abstract', 'modern', 'contemporary'],
    relatedCategories: ['Digital Art', 'Traditional Art', 'Classical Art', 'Creative Effects']
  },
  'Digital Art': {
    keywords: ['digital', 'cgi', '3d', 'render', 'computer', 'graphic', 'pixar', 'animation'],
    relatedCategories: ['Artistic Styles', 'Anime & animation', 'Creative Effects']
  },
  'Anime & animation': {
    keywords: ['anime', 'manga', 'cartoon', 'animated', 'pixar', 'disney', 'studio ghibli', 'animation'],
    relatedCategories: ['Digital Art', 'Studio Ghibli', 'Gaming Culture']
  },
  'Cyberpunk & sci-fi': {
    keywords: ['cyberpunk', 'sci-fi', 'futuristic', 'neon', 'tech', 'blade runner', 'dystopian', 'cyber'],
    relatedCategories: ['Futuristic Tech', 'Synthwave & vaporwave', 'Gaming Culture']
  },
  'Horror & gothic': {
    keywords: ['horror', 'gothic', 'dark', 'scary', 'halloween', 'vampire', 'zombie', 'nightmare'],
    relatedCategories: ['Fantasy & magic', 'Creative Effects']
  },
  'Fantasy & magic': {
    keywords: ['fantasy', 'magic', 'wizard', 'dragon', 'fairy', 'mythical', 'enchanted', 'spell'],
    relatedCategories: ['Horror & gothic', 'Gaming Culture', 'Creative Effects']
  },
  'Vintage & retro': {
    keywords: ['vintage', 'retro', 'classic', 'old', 'nostalgia', '80s', '90s', 'antique'],
    relatedCategories: ['Synthwave & vaporwave', 'Historical Epic', 'Editorial Photography']
  },
  'Cinematic Styles': {
    keywords: ['cinematic', 'movie', 'film', 'hollywood', 'dramatic', 'theatrical', 'blockbuster'],
    relatedCategories: ['Editorial Photography', 'Action & Sports', 'Creative Effects']
  },
  'Gaming Culture': {
    keywords: ['gaming', 'video game', 'pixel', '8-bit', 'arcade', 'console', 'rpg', 'fps'],
    relatedCategories: ['Anime & animation', 'Cyberpunk & sci-fi', 'Fantasy & magic']
  },
  'Studio Ghibli': {
    keywords: ['ghibli', 'miyazaki', 'totoro', 'spirited', 'anime', 'japanese', 'animation'],
    relatedCategories: ['Anime & animation', 'Fantasy & magic', 'Artistic Styles']
  },
  'Editorial Photography': {
    keywords: ['editorial', 'magazine', 'publication', 'journalism', 'documentary', 'professional'],
    relatedCategories: ['Fashion Photography', 'Portrait Photography', 'Cinematic Styles']
  },
  'Creative Effects': {
    keywords: ['effect', 'transformation', 'creative', 'unique', 'special', 'experimental'],
    relatedCategories: ['Digital Art', 'Artistic Styles', 'Fantasy & magic']
  }
};

// Function to analyze if a prompt matches a category
function promptMatchesCategory(prompt, category, categoryInfo) {
  const searchText = `${prompt.title} ${prompt.description} ${prompt.tags.join(' ')}`.toLowerCase();
  
  // Check if any keywords match
  return categoryInfo.keywords.some(keyword => searchText.includes(keyword));
}

// Analyze all prompts
const suggestions = [];

data.prompts.forEach(prompt => {
  const currentCategories = prompt.categories || [prompt.category];
  const potentialCategories = new Set();
  
  // Check each category for potential matches
  Object.entries(categoryRelations).forEach(([category, info]) => {
    // Skip if already has this category
    if (currentCategories.includes(category)) return;
    
    // Check if prompt matches this category
    if (promptMatchesCategory(prompt, category, info)) {
      potentialCategories.add(category);
    }
    
    // Also check if current category suggests this as related
    currentCategories.forEach(currentCat => {
      if (categoryRelations[currentCat]?.relatedCategories?.includes(category)) {
        if (promptMatchesCategory(prompt, category, info)) {
          potentialCategories.add(category);
        }
      }
    });
  });
  
  if (potentialCategories.size > 0) {
    suggestions.push({
      prompt: prompt.title,
      currentCategories: currentCategories,
      suggestedCategories: Array.from(potentialCategories),
      id: prompt.id
    });
  }
});

// Display suggestions
console.log('=== Multi-Category Analysis ===\n');
console.log(`Found ${suggestions.length} prompts that could belong to multiple categories:\n`);

suggestions.forEach((suggestion, index) => {
  console.log(`${index + 1}. "${suggestion.prompt}"`);
  console.log(`   Current: [${suggestion.currentCategories.join(', ')}]`);
  console.log(`   Could also be: [${suggestion.suggestedCategories.join(', ')}]`);
  console.log('');
});

// Ask for confirmation before applying
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nDo you want to apply these category suggestions? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    // Apply the suggestions
    let updateCount = 0;
    
    suggestions.forEach(suggestion => {
      const promptIndex = data.prompts.findIndex(p => p.id === suggestion.id);
      if (promptIndex !== -1) {
        // Initialize categories array if not exists
        if (!data.prompts[promptIndex].categories) {
          data.prompts[promptIndex].categories = [data.prompts[promptIndex].category];
        }
        
        // Add suggested categories
        suggestion.suggestedCategories.forEach(cat => {
          if (!data.prompts[promptIndex].categories.includes(cat)) {
            data.prompts[promptIndex].categories.push(cat);
            updateCount++;
          }
        });
      }
    });
    
    // Save the updated data
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    console.log(`\nSuccessfully added ${updateCount} category assignments!`);
  } else {
    console.log('\nNo changes were made.');
  }
  
  rl.close();
});