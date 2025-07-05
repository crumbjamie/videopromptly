const fs = require('fs');
const path = require('path');

// Read the prompts database
const dbPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// List of prompts that should have Headshots category
const headshotPrompts = [
  'Ultra-Realistic Portrait Photography',
  'Senior Executive Portrait',
  'Classic Studio Portrait with Butterfly Lighting',
  'Executive Portrait with Environmental Context',
  'Fine Art Portrait with Dramatic Lighting',
  'Academic Scholar Portrait',
  'Attorney Portrait',
  'Beauty Portrait with Ring Light Effect',
  'Fashion Style Studio Portrait',
  'Professional LinkedIn Portrait',
  'AI Professional Portrait',
  'Filmmaker Portrait with Equipment',
  'Medical Professional Portrait',
  'Creative Professional Portrait',
  'Startup Founder Portrait',
  'Portrait Photography',
  'Black & White Editorial Portrait',
  'Corporate Executive Portrait',
  'Dramatic Spotlight Portrait',
  'Anime Boss Portrait',
  'Chessboard Pattern Portrait',
  'Blueprint Tech Portrait',
  'Minimalist Tech Portrait'
];

// Update categories
let updatedCount = 0;
data.prompts.forEach(prompt => {
  if (headshotPrompts.includes(prompt.title)) {
    // Check if categories array exists, if not, convert category to categories
    if (!prompt.categories) {
      prompt.categories = [prompt.category];
    }
    
    // Add Headshots if not already present
    if (!prompt.categories.includes('Headshots')) {
      prompt.categories.push('Headshots');
      console.log(`Added "Headshots" to "${prompt.title}" - Categories: [${prompt.categories.join(', ')}]`);
      updatedCount++;
    }
  }
});

// Save the updated data
if (updatedCount > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  console.log(`\nAdded Headshots category to ${updatedCount} prompts`);
} else {
  console.log('\nNo prompts were updated');
}