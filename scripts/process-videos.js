#!/usr/bin/env node

/**
 * Video Processing Script for VideoPromptly
 * 
 * This script processes video files for the VideoPromptly platform:
 * 1. Validates video files in the videos directory
 * 2. Generates thumbnails from videos
 * 3. Updates the database with video metadata
 * 4. Optimizes file organization
 */

const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');
const THUMBNAILS_DIR = path.join(VIDEOS_DIR, 'thumbnails');
const PROMPTS_DB = path.join(process.cwd(), 'lib', 'database', 'prompts.json');

// Supported video formats
const SUPPORTED_FORMATS = ['mp4', 'webm', 'mov'];

/**
 * Ensure directories exist
 */
function ensureDirectories() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
    console.log('✅ Created videos directory');
  }
  
  if (!fs.existsSync(THUMBNAILS_DIR)) {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
    console.log('✅ Created thumbnails directory');
  }
}

/**
 * Get all video files in the videos directory
 */
function getVideoFiles() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    return [];
  }
  
  return fs.readdirSync(VIDEOS_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase().slice(1);
      return SUPPORTED_FORMATS.includes(ext) && fs.statSync(path.join(VIDEOS_DIR, file)).isFile();
    });
}

/**
 * Parse video filename to extract metadata
 */
function parseVideoFilename(filename) {
  // Expected format: prompt-id_1920x1080_8s.mp4
  const match = filename.match(/(.+?)(?:_(\d+x\d+))?(?:_(\d+)s)?\.(\w+)$/);
  
  if (!match) {
    return {
      id: filename.replace(/\.[^/.]+$/, ''),
      format: filename.split('.').pop() || 'mp4'
    };
  }
  
  const [, id, resolution, durationStr, format] = match;
  
  return {
    id,
    resolution,
    duration: durationStr ? parseInt(durationStr) : 8, // default 8 seconds
    format
  };
}

/**
 * Get file size in bytes
 */
function getFileSize(filepath) {
  try {
    const stats = fs.statSync(filepath);
    return stats.size;
  } catch (error) {
    console.error(`❌ Error getting file size for ${filepath}:`, error.message);
    return 0;
  }
}

/**
 * Process video files and generate metadata
 */
function processVideoFiles() {
  const videoFiles = getVideoFiles();
  const processedVideos = [];
  
  console.log(`\n📹 Processing ${videoFiles.length} video files...\n`);
  
  for (const filename of videoFiles) {
    const filepath = path.join(VIDEOS_DIR, filename);
    const metadata = parseVideoFilename(filename);
    const fileSize = getFileSize(filepath);
    
    const videoData = {
      filename,
      filepath,
      videoUrl: `/videos/${filename}`,
      thumbnailUrl: `/videos/thumbnails/${metadata.id}.jpg`,
      duration: metadata.duration,
      resolution: metadata.resolution || '1920x1080',
      aspectRatio: getAspectRatio(metadata.resolution),
      format: metadata.format,
      fileSize,
      id: metadata.id
    };
    
    processedVideos.push(videoData);
    
    console.log(`✅ ${filename}`);
    console.log(`   ID: ${videoData.id}`);
    console.log(`   Duration: ${videoData.duration}s`);
    console.log(`   Resolution: ${videoData.resolution}`);
    console.log(`   Size: ${formatFileSize(fileSize)}`);
    console.log(`   Format: ${videoData.format.toUpperCase()}`);
    console.log('');
  }
  
  return processedVideos;
}

/**
 * Get aspect ratio from resolution string
 */
function getAspectRatio(resolution) {
  if (!resolution) return '16:9';
  
  const [width, height] = resolution.split('x').map(Number);
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Format file size to human readable
 */
function formatFileSize(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(1)}MB`;
  }
  const kb = bytes / 1024;
  return `${kb.toFixed(0)}KB`;
}

/**
 * Generate sample video prompts database
 */
function generateSamplePrompts(processedVideos) {
  const samplePrompts = processedVideos.map((video, index) => ({
    id: video.id,
    slug: video.id,
    title: `Video Prompt ${index + 1}`,
    description: `A stunning ${video.duration}-second video showcasing AI-generated content.`,
    prompt: `Create a ${video.duration}-second video with smooth transitions and cinematic quality.`,
    category: 'Animation',
    categories: ['Animation'],
    tags: ['cinematic', 'smooth', 'ai-generated'],
    difficulty: 'Beginner',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    duration: video.duration,
    resolution: video.resolution,
    aspectRatio: video.aspectRatio,
    format: video.format,
    fileSize: video.fileSize,
    featured: index < 3,
    rating: 4 + Math.random(),
    ratingCount: Math.floor(Math.random() * 100) + 10
  }));
  
  return samplePrompts;
}

/**
 * Main execution
 */
function main() {
  console.log('🎬 VideoPromptly Video Processing Script');
  console.log('=========================================\n');
  
  // Ensure directories exist
  ensureDirectories();
  
  // Process video files
  const processedVideos = processVideoFiles();
  
  if (processedVideos.length === 0) {
    console.log('ℹ️  No video files found in /public/videos/');
    console.log('   Add some .mp4 or .webm files to get started!');
    return;
  }
  
  // Generate sample prompts if database doesn't exist
  if (!fs.existsSync(PROMPTS_DB)) {
    const samplePrompts = generateSamplePrompts(processedVideos);
    
    try {
      fs.writeFileSync(PROMPTS_DB, JSON.stringify(samplePrompts, null, 2));
      console.log(`✅ Generated sample prompts database with ${samplePrompts.length} entries`);
    } catch (error) {
      console.error('❌ Error writing prompts database:', error.message);
    }
  }
  
  console.log('\n🎉 Video processing complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Add video files to /public/videos/');
  console.log('   2. Run this script again to process them');
  console.log('   3. Generate thumbnails: npm run generate:thumbnails');
  console.log('   4. Start the dev server: npm run dev');
}

if (require.main === module) {
  main();
}

module.exports = {
  processVideoFiles,
  parseVideoFilename,
  getVideoFiles,
  formatFileSize
};