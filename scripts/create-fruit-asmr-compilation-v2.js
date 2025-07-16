#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of fruit ASMR videos to include (20 selected, NO APPLE, starting with strawberry)
const fruitVideos = [
  'glass-strawberry-slicing.mp4',        // Start with strawberry
  'glass-banana-asmr.mp4',
  'glass-orange-asmr.mp4',
  'glass-grape-asmr.mp4',
  'glass-kiwi-asmr.mp4',
  'glass-mango-asmr.mp4',
  'glass-pineapple-asmr.mp4',
  'glass-watermelon-asmr.mp4',
  'glass-peach-asmr.mp4',
  'glass-cherry-asmr.mp4',
  'glass-lemon-asmr.mp4',
  'glass-lime-asmr.mp4',
  'glass-coconut-asmr.mp4',
  'glass-avocado-asmr.mp4',
  'glass-blueberry-asmr.mp4',
  'glass-blackberry-asmr.mp4',
  'glass-raspberry-asmr.mp4',
  'glass-cranberry-asmr.mp4',
  'glass-grapefruit-asmr.mp4',
  'glass-dragon-fruit-asmr.mp4'
];

const videosDir = '/Users/jamie/Documents/GitHub/videopromptly/public/videos';
const outputDir = '/Users/jamie/Documents/GitHub/videopromptly/public/videos/compilations';
const tempDir = '/tmp/fruit-asmr-temp-v2';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create temp directory for processing
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

console.log('🍓 Creating Fruit ASMR Compilation V2 (No Apple, Starting with Strawberry)...');
console.log(`📁 Processing ${fruitVideos.length} fruit videos`);

// Verify all videos exist
const missingVideos = [];
const existingVideos = [];

fruitVideos.forEach(video => {
  const videoPath = path.join(videosDir, video);
  if (fs.existsSync(videoPath)) {
    existingVideos.push(video);
    console.log(`✅ Found: ${video}`);
  } else {
    missingVideos.push(video);
    console.log(`❌ Missing: ${video}`);
  }
});

if (missingVideos.length > 0) {
  console.log(`\n⚠️  Warning: ${missingVideos.length} videos are missing`);
  console.log('Proceeding with available videos...');
}

if (existingVideos.length === 0) {
  console.error('❌ No videos found! Cannot create compilation.');
  process.exit(1);
}

try {
  // Step 1: Create a file list for ffmpeg concat
  const fileListPath = path.join(tempDir, 'filelist.txt');
  const fileListContent = existingVideos.map(video => 
    `file '${path.join(videosDir, video)}'`
  ).join('\n');
  
  fs.writeFileSync(fileListPath, fileListContent);
  console.log(`📝 Created file list with ${existingVideos.length} videos`);

  // Step 2: Concatenate all videos into one
  const compilationPath = path.join(tempDir, 'fruit-compilation-v2.mp4');
  console.log('🔄 Concatenating videos...');
  
  execSync(`ffmpeg -f concat -safe 0 -i "${fileListPath}" -c copy -y "${compilationPath}"`, {
    stdio: 'inherit'
  });

  // Step 3: Get duration of the compilation
  const durationOutput = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${compilationPath}"`);
  const compilationDuration = parseFloat(durationOutput.toString().trim());
  
  console.log(`⏱️  Compilation duration: ${compilationDuration.toFixed(2)} seconds`);

  // Step 4: Calculate how many loops we need for 15 minutes (900 seconds)
  const targetDuration = 900; // 15 minutes in seconds
  const loopCount = Math.ceil(targetDuration / compilationDuration);
  
  console.log(`🔁 Need ${loopCount} loops to reach 15 minutes`);

  // Step 5: Create the looped version
  const finalOutputPath = path.join(outputDir, 'fruit-asmr-15min-compilation-v2.mp4');
  
  console.log('🔄 Creating 15-minute looped version...');
  
  // Create a filter that loops the video and cuts it at exactly 15 minutes
  execSync(`ffmpeg -stream_loop ${loopCount - 1} -i "${compilationPath}" -t 900 -c copy -y "${finalOutputPath}"`, {
    stdio: 'inherit'
  });

  // Step 6: Create a shorter 5-minute version as well
  const shortOutputPath = path.join(outputDir, 'fruit-asmr-5min-compilation-v2.mp4');
  console.log('🔄 Creating 5-minute version...');
  
  execSync(`ffmpeg -stream_loop ${Math.ceil(300 / compilationDuration) - 1} -i "${compilationPath}" -t 300 -c copy -y "${shortOutputPath}"`, {
    stdio: 'inherit'
  });

  // Step 7: Generate thumbnail (from strawberry at the beginning)
  const thumbnailPath = path.join(outputDir, 'fruit-asmr-15min-compilation-v2.jpg');
  console.log('🖼️  Generating thumbnail...');
  
  execSync(`ffmpeg -i "${finalOutputPath}" -ss 00:00:02 -vframes 1 -q:v 2 -y "${thumbnailPath}"`, {
    stdio: 'inherit'
  });

  // Step 8: Create a 10-minute version as well
  const mediumOutputPath = path.join(outputDir, 'fruit-asmr-10min-compilation-v2.mp4');
  console.log('🔄 Creating 10-minute version...');
  
  execSync(`ffmpeg -stream_loop ${Math.ceil(600 / compilationDuration) - 1} -i "${compilationPath}" -t 600 -c copy -y "${mediumOutputPath}"`, {
    stdio: 'inherit'
  });

  // Step 9: Get final file info
  const finalStats = fs.statSync(finalOutputPath);
  const finalSize = (finalStats.size / (1024 * 1024)).toFixed(2);
  
  const shortStats = fs.statSync(shortOutputPath);
  const shortSize = (shortStats.size / (1024 * 1024)).toFixed(2);
  
  const mediumStats = fs.statSync(mediumOutputPath);
  const mediumSize = (mediumStats.size / (1024 * 1024)).toFixed(2);
  
  console.log('\n🎉 Compilation V2 Complete!');
  console.log('='.repeat(50));
  console.log(`📹 15-minute version: ${finalOutputPath} (${finalSize} MB)`);
  console.log(`📹 10-minute version: ${mediumOutputPath} (${mediumSize} MB)`);
  console.log(`📹 5-minute version: ${shortOutputPath} (${shortSize} MB)`);
  console.log(`🖼️  Thumbnail: ${thumbnailPath}`);
  console.log(`🍎 Videos included: ${existingVideos.length}`);
  console.log(`🍓 Starting with: Strawberry (no glitchy apple)`);
  console.log(`⏱️  Duration: Exactly 15:00 minutes`);
  
  console.log('\n🎬 Video Order:');
  existingVideos.forEach((video, index) => {
    const fruitName = video.replace('glass-', '').replace('-asmr.mp4', '').replace('-slicing.mp4', '');
    console.log(`   ${index + 1}. ${fruitName.charAt(0).toUpperCase() + fruitName.slice(1)}`);
  });
  
  // Step 10: Clean up temp files
  console.log('\n🧹 Cleaning up temporary files...');
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  console.log('\n✅ All done! Your fruit ASMR compilation V2 is ready.');
  console.log('\nTo use in your project:');
  console.log(`- 15min Video URL: /videos/compilations/fruit-asmr-15min-compilation-v2.mp4`);
  console.log(`- 10min Video URL: /videos/compilations/fruit-asmr-10min-compilation-v2.mp4`);
  console.log(`- 5min Video URL: /videos/compilations/fruit-asmr-5min-compilation-v2.mp4`);
  console.log(`- Thumbnail URL: /videos/compilations/fruit-asmr-15min-compilation-v2.jpg`);

} catch (error) {
  console.error('❌ Error creating compilation:', error.message);
  
  // Clean up on error
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  process.exit(1);
}