const fs = require('fs');
const path = require('path');

// Read the prompts database
const dbPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// List of prompts that should be in Headshots category
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
  'Dramatic Spotlight Portrait'
];

// Update categories
let updatedCount = 0;
data.prompts.forEach(prompt => {
  if (headshotPrompts.includes(prompt.title)) {
    console.log(`Updating "${prompt.title}" from "${prompt.category}" to "Headshots"`);
    prompt.category = 'Headshots';
    updatedCount++;
  }
});

// Save the updated data
if (updatedCount > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  console.log(`\nUpdated ${updatedCount} prompts to Headshots category`);
} else {
  console.log('\nNo prompts were updated');
}