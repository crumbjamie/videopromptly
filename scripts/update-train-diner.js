const fs = require('fs');
const path = require('path');

// Read the prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Find and update the Symmetrical Train Diner prompt
const prompt = data.prompts.find(p => p.slug === "symmetrical-train-diner");
if (prompt) {
  prompt.thumbnail = {
    before: "woman-sample.jpg",
    after: "Symmetrical-Train-Diner.png"
  };
  console.log('✓ Updated "Symmetrical Train Diner" with thumbnail');
  
  // Write the updated data back
  fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
  console.log('✅ Database updated successfully');
} else {
  console.log('✗ Could not find Symmetrical Train Diner prompt');
}