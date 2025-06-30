const fs = require('fs');
const path = require('path');

// Read the markdown file
const mdContent = fs.readFileSync(path.join(__dirname, '../chatgpt-prompts-collection.md'), 'utf8');

// Parse the prompts
const prompts = [];
const lines = mdContent.split('\n');
let id = 1;

// Categories mapping
const categoryMap = {
  'portrait': 'Portrait Photography',
  'pattern': 'Artistic Styles',
  'toy': 'Toy Transformations',
  'editorial': 'Editorial Photography',
  'anime': 'Anime & Animation',
  'surreal': 'Surreal & Fantasy',
  'action': 'Action & Sports',
  'cinematic': 'Cinematic Styles',
  'fantasy': 'Fantasy & Magic',
  'underwater': 'Underwater Photography',
  'vintage': 'Vintage & Retro',
  'cyberpunk': 'Cyberpunk & Sci-Fi',
  'noir': 'Film Noir',
  'gaming': 'Gaming Culture',
  'ghibli': 'Studio Ghibli',
  'futuristic': 'Futuristic Tech',
  'double-exposure': 'Artistic Effects',
  'minimalist': 'Minimalist Design',
  'wizard': 'Fantasy Characters',
  'pet-to-human': 'Transformations',
  'youtube': 'Social Media',
  'stickers': 'Digital Art',
  '80s': 'Retro Styles',
  'pop-art': 'Pop Art',
  'horror': 'Horror & Gothic',
  'wes-anderson': 'Director Styles',
  'vaporwave': 'Synthwave & Vaporwave',
  'y2k': 'Y2K Aesthetic',
  'ufo': 'Sci-Fi Humor',
  'fashion': 'Fashion Photography',
  'viking': 'Historical Epic',
  'barbie': 'Toy Photography',
  'synthwave': 'Synthwave & Vaporwave',
  'steampunk': 'Steampunk',
  'glitch-art': 'Digital Art',
  'mech': 'Robots & Mechs',
  'action-figure': 'Toy Transformations',
  'origami': 'Paper Art',
  'claymation': 'Animation Styles',
  'puppet': 'Puppet & Felt Art',
  'lego': 'Toy Transformations',
  'pixar': 'Animation Styles',
  'watercolor': 'Traditional Art',
  'comic': 'Comic Art',
  'renaissance': 'Classical Art',
  'pixel': 'Pixel Art',
  'disney': 'Animation Styles',
  'ascii': 'Digital Art',
  'holographic': 'Futuristic Tech',
  'stained-glass': 'Traditional Art',
  'thermal': 'Technical Effects',
  'graffiti': 'Street Art',
  'mosaic': 'Classical Art',
  'neon': 'Neon & Light Art',
  'paper': 'Paper Art',
  'bronze': 'Sculpture Art',
  'kaleidoscope': 'Pattern Art',
  'embroidery': 'Textile Art',
  'silhouette': 'Minimalist Art',
  'ice': 'Sculpture Art',
  'sand': 'Temporary Art',
  'hologram': 'Futuristic Tech'
};

// Difficulty mapping based on complexity
const getDifficulty = (prompt) => {
  const complexKeywords = ['ultra-realistic', 'hyper-detailed', 'cinematic', 'professional', 'award-winning', 'complex', 'intricate'];
  const mediumKeywords = ['detailed', 'realistic', 'styled', 'aesthetic', 'artistic'];
  
  const promptLower = prompt.toLowerCase();
  
  if (complexKeywords.some(keyword => promptLower.includes(keyword))) {
    return 'Advanced';
  } else if (mediumKeywords.some(keyword => promptLower.includes(keyword))) {
    return 'Intermediate';
  }
  return 'Beginner';
};

// Get category from tags
const getCategory = (tags) => {
  for (const tag of tags) {
    if (categoryMap[tag]) {
      return categoryMap[tag];
    }
  }
  // Default categories based on first tag
  return 'Creative Effects';
};

let i = 0;
while (i < lines.length) {
  const line = lines[i];
  
  // Check if this is a title line (starts with ##)
  if (line.startsWith('## ') && !line.includes('ChatGPT Image Prompts Collection')) {
    const title = line.replace('## ', '').trim();
    
    // Look for the prompt in the next few lines
    let promptText = '';
    let tags = [];
    
    i++; // Move to next line
    
    // Skip empty lines
    while (i < lines.length && lines[i].trim() === '') {
      i++;
    }
    
    // Find the prompt (enclosed in ```)
    if (i < lines.length && lines[i] === '```') {
      i++; // Skip the opening ```
      while (i < lines.length && lines[i] !== '```') {
        promptText += lines[i] + '\n';
        i++;
      }
      promptText = promptText.trim();
      i++; // Skip the closing ```
    }
    
    // Skip empty lines
    while (i < lines.length && lines[i].trim() === '') {
      i++;
    }
    
    // Find tags
    if (i < lines.length && lines[i].startsWith('**Tags:**')) {
      const tagLine = lines[i].replace('**Tags:**', '').trim();
      tags = tagLine.split(',').map(t => t.trim());
      i++;
    }
    
    if (promptText && tags.length > 0) {
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const category = getCategory(tags);
      const difficulty = getDifficulty(promptText);
      
      prompts.push({
        id: String(id++),
        slug: slug,
        title: title,
        description: `Transform your images with this ${title.toLowerCase()} prompt for stunning creative effects.`,
        prompt: promptText,
        category: category,
        tags: tags,
        difficulty: difficulty,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  } else {
    i++;
  }
}

// Write the new database
const database = {
  prompts: prompts
};

fs.writeFileSync(
  path.join(__dirname, '../lib/database/prompts.json'),
  JSON.stringify(database, null, 2)
);

console.log(`Successfully parsed and saved ${prompts.length} prompts!`);
console.log(`Categories: ${[...new Set(prompts.map(p => p.category))].join(', ')}`);