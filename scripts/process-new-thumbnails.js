const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🖼️  Processing New Thumbnails - Complete Workflow\n');

// Step 1: Rename files with spaces to use hyphens
console.log('📝 Step 1: Renaming files with spaces to use hyphens...');
try {
  execSync('node scripts/rename-spaces-to-hyphens.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error in renaming step:', error.message);
}

// Step 2: Generate square thumbnails
console.log('\n🔲 Step 2: Generating square thumbnails...');
try {
  execSync('npx ts-node scripts/generate-square-thumbnails.ts', { stdio: 'inherit' });
} catch (error) {
  console.error('Error in square thumbnail generation:', error.message);
}

// Step 3: Auto-match thumbnails to prompts in database
console.log('\n🔗 Step 3: Auto-matching thumbnails to prompts in database...');
try {
  execSync('node scripts/auto-match-thumbnails.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error in matching step:', error.message);
}

console.log('\n✅ Thumbnail processing complete!');
console.log('\n📋 Summary of steps completed:');
console.log('1. Renamed files with spaces to use hyphens');
console.log('2. Generated square WebP thumbnails (1024x1024)');
console.log('3. Auto-matched thumbnails to prompts based on:');
console.log('   - Exact slug matching');
console.log('   - Normalized title matching');
console.log('   - Partial/fuzzy matching');
console.log('\n💡 To run this process again: npm run process:thumbnails');