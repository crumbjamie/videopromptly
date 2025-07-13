#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

console.log('REMOVING DUPLICATES WITHOUT VIDEOS\n');
console.log('='.repeat(50));

// Create backup first
const backupPath = path.join(process.cwd(), 'lib', 'database', 'prompts-before-video-cleanup.json');
fs.writeFileSync(backupPath, JSON.stringify(database, null, 2));
console.log(`✅ Backup created: ${backupPath}\n`);

// Group prompts by title to find duplicates
const promptsByTitle = {};
database.prompts.forEach((prompt) => {
  if (!promptsByTitle[prompt.title]) {
    promptsByTitle[prompt.title] = [];
  }
  promptsByTitle[prompt.title].push(prompt);
});

const idsToRemove = [];
let duplicateGroupsProcessed = 0;
let duplicatesRemovedCount = 0;

// Process each duplicate group
Object.entries(promptsByTitle).forEach(([title, prompts]) => {
  if (prompts.length > 1) {
    duplicateGroupsProcessed++;
    console.log(`\n"${title}" (${prompts.length} copies):`);
    
    // Sort by ID for consistent processing
    prompts.sort((a, b) => a.id - b.id);
    
    // Check which ones have actual video files
    const videoStatus = prompts.map(prompt => {
      const hasVideo = prompt.videoUrl && fs.existsSync(path.join(process.cwd(), 'public', prompt.videoUrl.substring(1)));
      return { prompt, hasVideo };
    });
    
    const withVideos = videoStatus.filter(item => item.hasVideo);
    const withoutVideos = videoStatus.filter(item => !item.hasVideo);
    
    console.log(`  - With videos: ${withVideos.length}`);
    console.log(`  - Without videos: ${withoutVideos.length}`);
    
    // Remove duplicates without videos
    withoutVideos.forEach(item => {
      idsToRemove.push(item.prompt.id);
      duplicatesRemovedCount++;
      console.log(`    ❌ Removing ID ${item.prompt.id} (${item.prompt.category}) - no video`);
    });
    
    // Show which ones we're keeping
    withVideos.forEach(item => {
      console.log(`    ✅ Keeping ID ${item.prompt.id} (${item.prompt.category}) - has video`);
    });
  }
});

// Remove the identified duplicates
const originalCount = database.prompts.length;
database.prompts = database.prompts.filter(prompt => !idsToRemove.includes(prompt.id));
const newCount = database.prompts.length;

// Save updated database
fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

// Summary
console.log('\n' + '='.repeat(50));
console.log('CLEANUP COMPLETE');
console.log('='.repeat(50));
console.log(`Original prompts: ${originalCount}`);
console.log(`Duplicates removed: ${duplicatesRemovedCount}`);
console.log(`Remaining prompts: ${newCount}`);
console.log(`Duplicate groups processed: ${duplicateGroupsProcessed}`);

// Check what duplicates remain
const remainingPromptsByTitle = {};
database.prompts.forEach((prompt) => {
  if (!remainingPromptsByTitle[prompt.title]) {
    remainingPromptsByTitle[prompt.title] = [];
  }
  remainingPromptsByTitle[prompt.title].push(prompt);
});

const remainingDuplicateGroups = Object.values(remainingPromptsByTitle).filter(prompts => prompts.length > 1);
const remainingDuplicateCount = remainingDuplicateGroups.reduce((total, group) => total + (group.length - 1), 0);

console.log(`\nRemaining duplicates:`);
console.log(`- Duplicate groups: ${remainingDuplicateGroups.length}`);
console.log(`- Total duplicate entries: ${remainingDuplicateCount}`);

if (remainingDuplicateGroups.length > 0) {
  console.log(`\nRemaining duplicate groups (all have videos):`);
  remainingDuplicateGroups.forEach(group => {
    const videoCounts = group.filter(p => {
      return p.videoUrl && fs.existsSync(path.join(process.cwd(), 'public', p.videoUrl.substring(1)));
    });
    console.log(`- "${group[0].title}": ${group.length} copies, ${videoCounts.length} with videos`);
  });
}

// Save list of removed IDs for reference
const removedIdsPath = path.join(process.cwd(), 'removed-duplicate-ids.json');
fs.writeFileSync(removedIdsPath, JSON.stringify({
  removedAt: new Date().toISOString(),
  removedIds: idsToRemove,
  reason: 'Duplicates without video files',
  count: idsToRemove.length
}, null, 2));

console.log(`\n📋 Removed IDs saved to: ${removedIdsPath}`);