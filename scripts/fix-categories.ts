import fs from 'fs';
import path from 'path';

const promptsPath = path.join(process.cwd(), 'lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Convert categories array back to single category
data.prompts = data.prompts.map((prompt: any) => {
  if (prompt.categories && Array.isArray(prompt.categories)) {
    // Use the first category as the primary one
    prompt.category = prompt.categories[0];
    delete prompt.categories;
  }
  return prompt;
});

// Write the updated data
fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));

console.log('✅ Fixed category structure');
console.log(`📊 Total prompts: ${data.prompts.length}`);