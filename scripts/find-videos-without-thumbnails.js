#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const videosDir = path.join(process.cwd(), 'public', 'videos');
const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');

// Read database
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

console.log('Analyzing video prompts for missing thumbnails...\n');

let totalVideos = 0;
let videosWithoutThumbnails = [];
let videosWithMissingFiles = [];
let videosNeedingGeneration = [];

database.prompts.forEach(prompt => {
  if (prompt.videoUrl) {
    totalVideos++;
    
    const videoFilename = path.basename(prompt.videoUrl, '.mp4');
    const videoPath = path.join(videosDir, `${videoFilename}.mp4`);
    const thumbnailPath = path.join(thumbnailsDir, `${videoFilename}.jpg`);
    
    // Check if video file exists
    const videoExists = fs.existsSync(videoPath);
    
    // Check if thumbnail URL is set
    if (!prompt.thumbnailUrl) {
      videosWithoutThumbnails.push({
        id: prompt.id,
        title: prompt.title,
        slug: prompt.slug,
        videoUrl: prompt.videoUrl,
        videoExists
      });
    }
    
    // Check if thumbnail file exists
    const thumbnailExists = fs.existsSync(thumbnailPath);
    
    if (!thumbnailExists && videoExists) {
      videosNeedingGeneration.push({
        id: prompt.id,
        title: prompt.title,
        slug: prompt.slug,
        videoUrl: prompt.videoUrl,
        videoPath,
        thumbnailPath
      });
    }
    
    if (!videoExists) {
      videosWithMissingFiles.push({
        id: prompt.id,
        title: prompt.title,
        slug: prompt.slug,
        videoUrl: prompt.videoUrl
      });
    }
  }
});

console.log(`Total video prompts: ${totalVideos}`);
console.log(`Videos without thumbnail URLs: ${videosWithoutThumbnails.length}`);
console.log(`Videos needing thumbnail generation: ${videosNeedingGeneration.length}`);
console.log(`Videos with missing video files: ${videosWithMissingFiles.length}`);

if (videosWithoutThumbnails.length > 0) {
  console.log('\n--- Videos without thumbnail URLs ---');
  videosWithoutThumbnails.forEach(video => {
    console.log(`- ${video.title} (${video.slug})`);
    console.log(`  Video URL: ${video.videoUrl}`);
    console.log(`  Video exists: ${video.videoExists ? 'Yes' : 'No'}`);
  });
}

if (videosNeedingGeneration.length > 0) {
  console.log('\n--- Videos needing thumbnail generation ---');
  videosNeedingGeneration.forEach(video => {
    console.log(`- ${video.title} (${video.slug})`);
    console.log(`  Video: ${video.videoUrl}`);
  });
}

if (videosWithMissingFiles.length > 0) {
  console.log('\n--- Videos with missing video files ---');
  videosWithMissingFiles.forEach(video => {
    console.log(`- ${video.title} (${video.slug})`);
    console.log(`  Expected: ${video.videoUrl}`);
  });
}

console.log('\nRun "node scripts/generate-video-thumbnails.js" to generate missing thumbnails.');