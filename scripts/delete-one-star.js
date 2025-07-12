const fs = require('fs');

const database = JSON.parse(fs.readFileSync('/Users/jamie/Documents/GitHub/videopromptly/lib/database/prompts.json', 'utf8'));

const beforeCount = database.prompts.length;
const oneStarPrompts = database.prompts.filter(p => p.rating === 1);

console.log('1-star prompts found:');
oneStarPrompts.forEach(p => {
  console.log(`ID: ${p.id} - ${p.title}`);
  console.log(`  Category: ${p.category}`);
  console.log(`  Views: ${p.views || 'Not specified'}`);
  console.log(`  Prompt: ${p.prompt.substring(0, 80)}...`);
  console.log('');
});

// Remove all 1-star prompts
database.prompts = database.prompts.filter(p => p.rating !== 1);

const afterCount = database.prompts.length;
const deletedCount = beforeCount - afterCount;

fs.writeFileSync('/Users/jamie/Documents/GitHub/videopromptly/lib/database/prompts.json', JSON.stringify(database, null, 2));

console.log(`DELETED: ${deletedCount} prompts with 1-star ratings`);
console.log(`Database reduced from ${beforeCount} to ${afterCount} prompts`);

// Show rating distribution after cleanup
const ratingDist = {};
database.prompts.forEach(p => {
  ratingDist[p.rating] = (ratingDist[p.rating] || 0) + 1;
});

console.log('\nRating distribution after cleanup:');
Object.keys(ratingDist).sort().forEach(rating => {
  console.log(`${rating}★: ${ratingDist[rating]} prompts`);
});