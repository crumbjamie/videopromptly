#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const videosDir = path.join(process.cwd(), 'public', 'videos');
const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');

// Load database
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

// Track renamed files
const renamedVideos = [];
const renamedThumbnails = [];
let updatedCount = 0;

console.log('🎬 Starting video URL renaming process...\n');

// Process each prompt
database.prompts.forEach(prompt => {
  // Check if video URL is numeric format
  const numericMatch = prompt.videoUrl?.match(/\/videos\/prompt-(\d+)\.mp4$/);
  
  if (numericMatch) {
    const promptNumber = numericMatch[1];
    const oldVideoFilename = `prompt-${promptNumber}.mp4`;
    const oldThumbnailFilename = `prompt-${promptNumber}.jpg`;
    
    // Generate new filename from slug
    const newVideoFilename = `${prompt.slug}.mp4`;
    const newThumbnailFilename = `${prompt.slug}.jpg`;
    
    // Paths
    const oldVideoPath = path.join(videosDir, oldVideoFilename);
    const newVideoPath = path.join(videosDir, newVideoFilename);
    const oldThumbnailPath = path.join(thumbnailsDir, oldThumbnailFilename);
    const newThumbnailPath = path.join(thumbnailsDir, newThumbnailFilename);
    
    // Check if video file exists
    if (fs.existsSync(oldVideoPath)) {
      // Check if new filename already exists
      if (fs.existsSync(newVideoPath)) {
        console.log(`⚠️  Skipping ${prompt.title} - ${newVideoFilename} already exists`);
        return;
      }
      
      // Rename video file
      try {
        fs.renameSync(oldVideoPath, newVideoPath);
        renamedVideos.push({ old: oldVideoFilename, new: newVideoFilename });
        console.log(`✅ Renamed video: ${oldVideoFilename} → ${newVideoFilename}`);
        
        // Update database
        prompt.videoUrl = `/videos/${newVideoFilename}`;
        updatedCount++;
      } catch (error) {
        console.error(`❌ Error renaming video ${oldVideoFilename}: ${error.message}`);
      }
    } else {
      console.log(`⚠️  Video file not found: ${oldVideoFilename}`);
    }
    
    // Check if thumbnail exists and rename it
    if (fs.existsSync(oldThumbnailPath)) {
      if (!fs.existsSync(newThumbnailPath)) {
        try {
          fs.renameSync(oldThumbnailPath, newThumbnailPath);
          renamedThumbnails.push({ old: oldThumbnailFilename, new: newThumbnailFilename });
          console.log(`✅ Renamed thumbnail: ${oldThumbnailFilename} → ${newThumbnailFilename}`);
          
          // Update thumbnail URL
          prompt.thumbnailUrl = `/thumbnails/${newThumbnailFilename}`;
        } catch (error) {
          console.error(`❌ Error renaming thumbnail ${oldThumbnailFilename}: ${error.message}`);
        }
      }
    }
  }
});

// Save updated database
if (updatedCount > 0) {
  fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
  console.log(`\n✅ Database updated with ${updatedCount} new video URLs`);
}

// Summary
console.log('\n📊 Summary:');
console.log(`   Videos renamed: ${renamedVideos.length}`);
console.log(`   Thumbnails renamed: ${renamedThumbnails.length}`);
console.log(`   Database entries updated: ${updatedCount}`);

// Create rollback script
if (renamedVideos.length > 0 || renamedThumbnails.length > 0) {
  const rollbackScript = `#!/usr/bin/env node
// Rollback script for video renaming

const fs = require('fs');
const path = require('path');

const videosDir = '${videosDir}';
const thumbnailsDir = '${thumbnailsDir}';

// Videos to rollback
const videos = ${JSON.stringify(renamedVideos, null, 2)};

// Thumbnails to rollback
const thumbnails = ${JSON.stringify(renamedThumbnails, null, 2)};

console.log('🔄 Starting rollback...');

// Rollback videos
videos.forEach(({ old: oldName, new: newName }) => {
  const newPath = path.join(videosDir, newName);
  const oldPath = path.join(videosDir, oldName);
  if (fs.existsSync(newPath)) {
    fs.renameSync(newPath, oldPath);
    console.log(\`✅ Rolled back video: \${newName} → \${oldName}\`);
  }
});

// Rollback thumbnails
thumbnails.forEach(({ old: oldName, new: newName }) => {
  const newPath = path.join(thumbnailsDir, newName);
  const oldPath = path.join(thumbnailsDir, oldName);
  if (fs.existsSync(newPath)) {
    fs.renameSync(newPath, oldPath);
    console.log(\`✅ Rolled back thumbnail: \${newName} → \${oldName}\`);
  }
});

console.log('✅ Rollback complete!');
`;

  fs.writeFileSync(path.join(process.cwd(), 'scripts', 'rollback-video-rename.js'), rollbackScript);
  console.log('\n💾 Rollback script created: scripts/rollback-video-rename.js');
}

console.log('\n✅ Video URL renaming complete!');