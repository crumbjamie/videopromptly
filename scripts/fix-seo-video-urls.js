#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const videosDir = path.join(process.cwd(), 'public', 'videos');
const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');

// Helper function to create a URL-friendly slug
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

// Load database
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

// Track operations
const operations = [];
let updatedCount = 0;

console.log('🎬 Starting SEO-friendly video URL generation...\n');

// Process each prompt
database.prompts.forEach((prompt, index) => {
  // Skip if already has a good SEO-friendly URL
  if (prompt.videoUrl && !prompt.videoUrl.match(/\/videos\/prompt-\d+\.mp4$/)) {
    return;
  }
  
  // Extract current prompt number if exists
  const numericMatch = prompt.videoUrl?.match(/\/videos\/prompt-(\d+)\.mp4$/);
  
  if (numericMatch) {
    const promptNumber = numericMatch[1];
    const oldVideoFilename = `prompt-${promptNumber}.mp4`;
    const oldThumbnailFilename = `prompt-${promptNumber}.jpg`;
    
    // Generate new slug from title
    let baseSlug = createSlug(prompt.title);
    
    // If slug is empty or too short, use a fallback
    if (!baseSlug || baseSlug.length < 3) {
      baseSlug = `video-prompt-${promptNumber}`;
    }
    
    // Make filename unique by checking existing files and database entries
    let uniqueSlug = baseSlug;
    let counter = 1;
    
    // Check against existing video files and other prompts
    while (true) {
      const testVideoFilename = `${uniqueSlug}.mp4`;
      const testVideoPath = path.join(videosDir, testVideoFilename);
      
      // Check if file exists or if another prompt already uses this slug
      const slugInUse = database.prompts.some((p, i) => 
        i !== index && // Don't check against itself
        (p.videoUrl === `/videos/${testVideoFilename}` || p.slug === uniqueSlug)
      );
      
      if (!fs.existsSync(testVideoPath) && !slugInUse) {
        break; // Found unique slug
      }
      
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }
    
    const newVideoFilename = `${uniqueSlug}.mp4`;
    const newThumbnailFilename = `${uniqueSlug}.jpg`;
    
    // Paths
    const oldVideoPath = path.join(videosDir, oldVideoFilename);
    const newVideoPath = path.join(videosDir, newVideoFilename);
    const oldThumbnailPath = path.join(thumbnailsDir, oldThumbnailFilename);
    const newThumbnailPath = path.join(thumbnailsDir, newThumbnailFilename);
    
    const operation = {
      title: prompt.title,
      oldSlug: prompt.slug,
      newSlug: uniqueSlug,
      oldVideo: oldVideoFilename,
      newVideo: newVideoFilename,
      oldThumbnail: oldThumbnailFilename,
      newThumbnail: newThumbnailFilename,
      videoExists: fs.existsSync(oldVideoPath),
      thumbnailExists: fs.existsSync(oldThumbnailPath)
    };
    
    // Rename video file if it exists
    if (operation.videoExists) {
      try {
        fs.renameSync(oldVideoPath, newVideoPath);
        console.log(`✅ Video: ${oldVideoFilename} → ${newVideoFilename}`);
        operation.videoRenamed = true;
      } catch (error) {
        console.error(`❌ Error renaming video ${oldVideoFilename}: ${error.message}`);
        operation.videoError = error.message;
        return; // Skip this prompt if video rename fails
      }
    } else {
      console.log(`⚠️  Video not found: ${oldVideoFilename}`);
      operation.videoRenamed = false;
    }
    
    // Rename thumbnail if it exists
    if (operation.thumbnailExists) {
      try {
        fs.renameSync(oldThumbnailPath, newThumbnailPath);
        console.log(`✅ Thumbnail: ${oldThumbnailFilename} → ${newThumbnailFilename}`);
        operation.thumbnailRenamed = true;
      } catch (error) {
        console.error(`❌ Error renaming thumbnail ${oldThumbnailFilename}: ${error.message}`);
        operation.thumbnailError = error.message;
      }
    }
    
    // Update database entries
    prompt.slug = uniqueSlug;
    prompt.videoUrl = `/videos/${newVideoFilename}`;
    if (operation.thumbnailExists || operation.thumbnailRenamed) {
      prompt.thumbnailUrl = `/thumbnails/${newThumbnailFilename}`;
    }
    
    operations.push(operation);
    updatedCount++;
    
    console.log(`📝 Updated: "${prompt.title}" → ${uniqueSlug}\n`);
  }
});

// Save updated database
if (updatedCount > 0) {
  fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
  console.log(`✅ Database updated with ${updatedCount} SEO-friendly URLs\n`);
}

// Summary
console.log('📊 Summary:');
console.log(`   Prompts processed: ${operations.length}`);
console.log(`   Videos renamed: ${operations.filter(op => op.videoRenamed).length}`);
console.log(`   Thumbnails renamed: ${operations.filter(op => op.thumbnailRenamed).length}`);
console.log(`   Database entries updated: ${updatedCount}`);

// Create rollback information
if (operations.length > 0) {
  const rollbackData = {
    timestamp: new Date().toISOString(),
    operations: operations
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'scripts', 'seo-url-rollback.json'), 
    JSON.stringify(rollbackData, null, 2)
  );
  console.log('\n💾 Rollback data saved: scripts/seo-url-rollback.json');
}

console.log('\n✅ SEO-friendly URL generation complete!');