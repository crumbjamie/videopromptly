#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

console.log('MERGING DUPLICATE PROMPTS INTO MULTI-VIDEO ENTRIES\n');
console.log('='.repeat(60));

// Create backup first
const backupPath = path.join(process.cwd(), 'lib', 'database', 'prompts-before-merge.json');
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

const mergedPrompts = [];
let duplicateGroupsMerged = 0;
let totalDuplicatesProcessed = 0;

// Process each group
Object.entries(promptsByTitle).forEach(([title, prompts]) => {
  if (prompts.length === 1) {
    // Single prompt - convert to new format with backward compatibility
    const prompt = prompts[0];
    
    // Check if video file exists
    const hasVideo = prompt.videoUrl && fs.existsSync(path.join(process.cwd(), 'public', prompt.videoUrl.substring(1)));
    
    if (hasVideo) {
      // Create video variant
      const videoVariant = {
        id: `${prompt.id}-v1`,
        videoUrl: prompt.videoUrl,
        thumbnailUrl: prompt.thumbnailUrl || '',
        category: prompt.category,
        duration: prompt.duration || 8,
        resolution: prompt.resolution || '1280x720',
        aspectRatio: prompt.aspectRatio || '16:9',
        format: prompt.format || 'mp4',
        fileSize: prompt.fileSize || 1000000,
        rating: prompt.rating,
        featured: prompt.featured
      };

      // Convert to new format
      const mergedPrompt = {
        ...prompt,
        videos: [videoVariant],
        categories: [prompt.category],
        // Keep legacy fields for backward compatibility
        videoUrl: prompt.videoUrl,
        thumbnailUrl: prompt.thumbnailUrl,
        duration: prompt.duration,
        resolution: prompt.resolution,
        aspectRatio: prompt.aspectRatio,
        format: prompt.format,
        fileSize: prompt.fileSize
      };

      mergedPrompts.push(mergedPrompt);
      console.log(`✅ Single prompt: "${title}" (kept as-is)`);
    } else {
      console.log(`⚠️  Skipping "${title}" - no video file`);
    }
  } else {
    // Multiple prompts - merge them
    duplicateGroupsMerged++;
    totalDuplicatesProcessed += prompts.length;
    
    console.log(`\n📦 Merging "${title}" (${prompts.length} copies):`);
    
    // Sort by ID to get consistent primary
    prompts.sort((a, b) => a.id - b.id);
    
    // Use first prompt as base
    const basePrompt = prompts[0];
    
    // Create video variants from all duplicates that have videos
    const videoVariants = [];
    const allCategories = new Set();
    let videosWithFiles = 0;
    
    prompts.forEach((prompt, index) => {
      const hasVideo = prompt.videoUrl && fs.existsSync(path.join(process.cwd(), 'public', prompt.videoUrl.substring(1)));
      
      if (hasVideo) {
        videosWithFiles++;
        allCategories.add(prompt.category);
        
        const videoVariant = {
          id: `${basePrompt.id}-v${index + 1}`,
          videoUrl: prompt.videoUrl,
          thumbnailUrl: prompt.thumbnailUrl || '',
          category: prompt.category,
          duration: prompt.duration || 8,
          resolution: prompt.resolution || '1280x720',
          aspectRatio: prompt.aspectRatio || '16:9',
          format: prompt.format || 'mp4',
          fileSize: prompt.fileSize || 1000000,
          rating: prompt.rating,
          featured: prompt.featured
        };
        
        videoVariants.push(videoVariant);
        console.log(`  ✅ Video ${index + 1}: ID ${prompt.id} (${prompt.category}) - has video`);
      } else {
        console.log(`  ❌ Video ${index + 1}: ID ${prompt.id} (${prompt.category}) - no video file`);
      }
    });
    
    if (videoVariants.length > 0) {
      // Calculate average rating from all variants with ratings
      const ratingsWithValues = prompts.filter(p => p.rating).map(p => p.rating);
      const averageRating = ratingsWithValues.length > 0 
        ? Math.round(ratingsWithValues.reduce((sum, r) => sum + r, 0) / ratingsWithValues.length)
        : basePrompt.rating;
      
      // Check if any variant is featured
      const isFeatured = prompts.some(p => p.featured);
      
      // Merge tags from all variants
      const allTags = new Set();
      prompts.forEach(p => {
        if (p.tags && Array.isArray(p.tags)) {
          p.tags.forEach(tag => {
            if (tag !== 'featured') allTags.add(tag);
          });
        }
      });
      
      // Create merged prompt
      const mergedPrompt = {
        ...basePrompt,
        videos: videoVariants,
        categories: Array.from(allCategories),
        tags: Array.from(allTags),
        rating: averageRating,
        featured: isFeatured,
        // Keep legacy fields pointing to first video for backward compatibility
        videoUrl: videoVariants[0].videoUrl,
        thumbnailUrl: videoVariants[0].thumbnailUrl,
        duration: videoVariants[0].duration,
        resolution: videoVariants[0].resolution,
        aspectRatio: videoVariants[0].aspectRatio,
        format: videoVariants[0].format,
        fileSize: videoVariants[0].fileSize
      };
      
      mergedPrompts.push(mergedPrompt);
      console.log(`  📊 Result: ${videoVariants.length} videos, categories: ${Array.from(allCategories).join(', ')}`);
      console.log(`  ⭐ Rating: ${averageRating}, Featured: ${isFeatured}`);
    } else {
      console.log(`  ❌ Skipping group - no videos with files`);
    }
  }
});

// Update database
database.prompts = mergedPrompts;

// Save updated database
fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

// Summary
console.log('\n' + '='.repeat(60));
console.log('MERGE COMPLETE');
console.log('='.repeat(60));
console.log(`Original prompts: ${totalDuplicatesProcessed + (mergedPrompts.length - duplicateGroupsMerged)}`);
console.log(`Duplicate groups merged: ${duplicateGroupsMerged}`);
console.log(`Final unique prompts: ${mergedPrompts.length}`);

// Calculate total videos
let totalVideos = 0;
let multiVideoPrompts = 0;
mergedPrompts.forEach(prompt => {
  totalVideos += prompt.videos.length;
  if (prompt.videos.length > 1) {
    multiVideoPrompts++;
  }
});

console.log(`Total video variants preserved: ${totalVideos}`);
console.log(`Prompts with multiple videos: ${multiVideoPrompts}`);

// Show multi-video prompts
if (multiVideoPrompts > 0) {
  console.log('\nPrompts with multiple videos:');
  mergedPrompts
    .filter(p => p.videos.length > 1)
    .forEach(prompt => {
      const categories = prompt.videos.map(v => v.category).join(', ');
      console.log(`- "${prompt.title}": ${prompt.videos.length} videos (${categories})`);
    });
}

// Save merge report
const reportPath = path.join(process.cwd(), 'merge-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  mergedAt: new Date().toISOString(),
  originalCount: totalDuplicatesProcessed + (mergedPrompts.length - duplicateGroupsMerged),
  mergedCount: mergedPrompts.length,
  duplicateGroupsMerged,
  totalVideosPreserved: totalVideos,
  multiVideoPrompts,
  multiVideoDetails: mergedPrompts
    .filter(p => p.videos.length > 1)
    .map(p => ({
      title: p.title,
      id: p.id,
      videoCount: p.videos.length,
      categories: p.videos.map(v => v.category)
    }))
}, null, 2));

console.log(`\n📋 Merge report saved to: ${reportPath}`);