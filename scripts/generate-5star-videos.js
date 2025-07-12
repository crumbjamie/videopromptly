const fs = require('fs');
const path = require('path');

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Get all 5-star prompts
const fiveStarPrompts = data.prompts.filter(p => p.rating === 5);
const fiveStarIds = fiveStarPrompts.map(p => p.id);

console.log('🌟 5-Star Prompts for Video Generation:');
console.log('=====================================');

fiveStarPrompts.forEach((prompt, index) => {
  console.log(`${index + 1}. ID: ${prompt.id} - "${prompt.title}"`);
  console.log(`   Category: ${prompt.category}`);
  console.log(`   Tags: ${prompt.tags.slice(0, 3).join(', ')}${prompt.tags.length > 3 ? '...' : ''}`);
  console.log(`   Prompt: ${prompt.prompt.substring(0, 80)}...`);
  console.log('');
});

console.log(`📊 Summary:`);
console.log(`   Total 5-star prompts: ${fiveStarPrompts.length}`);
console.log(`   Estimated cost (fast mode): $${(fiveStarPrompts.length * 0.40).toFixed(2)}`);
console.log(`   Estimated cost (quality mode): $${(fiveStarPrompts.length * 2.00).toFixed(2)}`);
console.log('');

console.log('🎬 To generate all 5-star videos:');
console.log(`   Fast mode: KIE_API_KEY="f8bb5df14a279ae55ba1f49cd3c78acb" node scripts/generate-veo3-videos.js ${fiveStarIds.join(',')}`);
console.log(`   Quality mode: KIE_API_KEY="f8bb5df14a279ae55ba1f49cd3c78acb" node scripts/generate-veo3-videos.js --mode=quality ${fiveStarIds.join(',')}`);
console.log('');

console.log('💡 Recommendations:');
console.log('   • Start with fast mode to test API integration');
console.log('   • These are the highest-rated prompts (5/5 stars)');
console.log('   • Total generation time: ~30-60 minutes');
console.log('   • Videos will be saved to /public/videos/');

// Breakdown by category
const categoryBreakdown = {};
fiveStarPrompts.forEach(prompt => {
  categoryBreakdown[prompt.category] = (categoryBreakdown[prompt.category] || 0) + 1;
});

console.log('');
console.log('📂 Category Breakdown:');
Object.entries(categoryBreakdown).forEach(([category, count]) => {
  console.log(`   ${category}: ${count} prompts`);
});