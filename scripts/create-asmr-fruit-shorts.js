#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Configuration
const INPUT_DIR = path.join(__dirname, '../public/videos');
const OUTPUT_DIR = path.join(__dirname, '../public/asmr-shorts');
const TEMP_DIR = path.join(__dirname, '../temp-asmr-processing');

// ASMR fruit video files (excluding the 3 special ones for variety)
const ASMR_VIDEOS = [
  // Fruits
  'glass-apple-asmr.mp4', 'glass-apricot-asmr.mp4', 'glass-avocado-asmr.mp4',
  'glass-banana-asmr.mp4', 'glass-blackberry-asmr.mp4', 'glass-blueberry-asmr.mp4',
  'glass-cantaloupe-asmr.mp4', 'glass-cherry-asmr.mp4', 'glass-coconut-asmr.mp4',
  'glass-cranberry-asmr.mp4', 'glass-dragon-fruit-asmr.mp4', 'glass-fig-asmr.mp4',
  'glass-grape-asmr.mp4', 'glass-grapefruit-asmr.mp4', 'glass-guava-asmr.mp4',
  'glass-kiwi-asmr.mp4', 'glass-lemon-asmr.mp4', 'glass-lime-asmr.mp4',
  'glass-mango-asmr.mp4', 'glass-orange-asmr.mp4', 'glass-papaya-asmr.mp4',
  'glass-passionfruit-asmr.mp4', 'glass-peach-asmr.mp4', 'glass-pear-asmr.mp4',
  'glass-persimmon-asmr.mp4', 'glass-pineapple-asmr.mp4', 'glass-plum-asmr.mp4',
  'glass-pomegranate-asmr.mp4', 'glass-raspberry-asmr.mp4', 'glass-starfruit-asmr.mp4',
  'glass-watermelon-asmr.mp4',
  // Nuts
  'glass-almond-asmr.mp4', 'glass-cashew-asmr.mp4', 'glass-hazelnut-asmr.mp4',
  'glass-macadamia-asmr.mp4', 'glass-pecan-asmr.mp4', 'glass-pistachio-asmr.mp4',
  'glass-walnut-asmr.mp4',
  // Vegetables
  'glass-beetroot-asmr.mp4', 'glass-bell-pepper-asmr.mp4', 'glass-broccoli-asmr.mp4',
  'glass-carrot-asmr.mp4', 'glass-chilli-asmr.mp4', 'glass-cucumber-asmr.mp4',
  'glass-garlic-asmr.mp4', 'glass-olive-asmr.mp4', 'glass-onion-asmr.mp4',
  'glass-radish-asmr.mp4', 'glass-tomato-asmr.mp4', 'glass-zucchini-asmr.mp4',
  // Special videos
  'crystal-kiwi-physics-asmr.mp4', 'glass-strawberry-slicing.mp4',
  'satisfying-glass-fruit-series.mp4'
];

// Target duration in seconds (2 minutes)
const TARGET_DURATION = 120;
// Each video is 8 seconds
const VIDEO_DURATION = 8;
// Number of videos needed per compilation (120 / 8 = 15)
const VIDEOS_PER_COMPILATION = Math.ceil(TARGET_DURATION / VIDEO_DURATION);
// Number of compilations to create
const NUM_COMPILATIONS = 20;

// Ensure directories exist
function ensureDirectories() {
  [OUTPUT_DIR, TEMP_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Shuffle array function
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Create a unique mix of videos for each compilation
function createVideoMix(index) {
  // Create different mixes for variety
  const strategies = [
    // Strategy 1: Random shuffle
    () => shuffle(ASMR_VIDEOS).slice(0, VIDEOS_PER_COMPILATION),
    
    // Strategy 2: Fruits only
    () => shuffle(ASMR_VIDEOS.filter(v => v.includes('fruit') || 
      ['apple', 'orange', 'banana', 'grape', 'cherry', 'peach', 'mango', 'kiwi', 'lemon', 'lime'].some(f => v.includes(f))))
      .slice(0, VIDEOS_PER_COMPILATION),
    
    // Strategy 3: Mix of all types
    () => {
      const fruits = ASMR_VIDEOS.filter(v => !v.includes('nut') && !['carrot', 'cucumber', 'tomato', 'pepper', 'broccoli', 'garlic', 'onion', 'radish', 'beetroot', 'chilli', 'olive', 'zucchini'].some(veg => v.includes(veg)));
      const nuts = ASMR_VIDEOS.filter(v => v.includes('nut') || ['almond', 'cashew', 'hazelnut', 'macadamia', 'pecan', 'pistachio', 'walnut'].some(n => v.includes(n)));
      const veggies = ASMR_VIDEOS.filter(v => ['carrot', 'cucumber', 'tomato', 'pepper', 'broccoli', 'garlic', 'onion', 'radish', 'beetroot', 'chilli', 'olive', 'zucchini'].some(veg => v.includes(veg)));
      
      return shuffle([
        ...shuffle(fruits).slice(0, 8),
        ...shuffle(nuts).slice(0, 4),
        ...shuffle(veggies).slice(0, 3)
      ]);
    },
    
    // Strategy 4: Color themed (red/orange)
    () => shuffle(ASMR_VIDEOS.filter(v => 
      ['apple', 'cherry', 'strawberry', 'raspberry', 'cranberry', 'tomato', 'pepper', 'orange', 'apricot', 'peach', 'papaya', 'persimmon', 'chilli'].some(item => v.includes(item))))
      .slice(0, VIDEOS_PER_COMPILATION),
    
    // Strategy 5: Tropical theme
    () => shuffle(ASMR_VIDEOS.filter(v => 
      ['mango', 'pineapple', 'coconut', 'papaya', 'guava', 'passionfruit', 'dragon-fruit', 'starfruit', 'banana', 'lime', 'kiwi'].some(item => v.includes(item))))
      .slice(0, VIDEOS_PER_COMPILATION)
  ];
  
  // Use different strategies for different videos
  const strategy = strategies[index % strategies.length];
  let videos = strategy();
  
  // If we don't have enough videos, fill with random ones
  while (videos.length < VIDEOS_PER_COMPILATION) {
    const randomVideo = ASMR_VIDEOS[Math.floor(Math.random() * ASMR_VIDEOS.length)];
    if (!videos.includes(randomVideo)) {
      videos.push(randomVideo);
    }
  }
  
  return videos.slice(0, VIDEOS_PER_COMPILATION);
}

// Create concat file for ffmpeg
async function createConcatFile(videos, outputPath) {
  const content = videos.map(video => 
    `file '${path.join(INPUT_DIR, video)}'`
  ).join('\n');
  
  await fs.promises.writeFile(outputPath, content);
  return outputPath;
}

// Generate a single compilation
async function generateCompilation(index) {
  console.log(`\n🎬 Creating ASMR Fruit Short #${index + 1}...`);
  
  // Create unique video mix
  const videoMix = createVideoMix(index);
  console.log(`   📋 Using ${videoMix.length} videos`);
  
  // Create concat file
  const concatFile = path.join(TEMP_DIR, `concat_${index}.txt`);
  await createConcatFile(videoMix, concatFile);
  
  // Output filename with descriptive name
  const themes = ['mixed', 'fruits', 'variety', 'colorful', 'tropical'];
  const theme = themes[index % themes.length];
  const outputFile = path.join(OUTPUT_DIR, `asmr-fruit-short-${theme}-${String(index + 1).padStart(2, '0')}.mp4`);
  
  // FFmpeg command to:
  // 1. Concatenate videos
  // 2. Crop to 9:16 aspect ratio (vertical video for YouTube Shorts)
  // 3. Ensure proper encoding for YouTube
  const ffmpegCmd = `ffmpeg -f concat -safe 0 -i "${concatFile}" \
    -vf "crop=ih*9/16:ih,scale=1080:1920,fps=30" \
    -c:v libx264 -preset medium -crf 23 \
    -c:a aac -b:a 192k -ar 48000 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -y "${outputFile}"`;
  
  try {
    console.log(`   🔧 Processing with FFmpeg...`);
    const { stdout, stderr } = await execAsync(ffmpegCmd);
    
    // Check if file was created
    if (fs.existsSync(outputFile)) {
      const stats = fs.statSync(outputFile);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`   ✅ Created: ${path.basename(outputFile)} (${sizeMB} MB)`);
      
      // Log the video mix for reference
      const mixLog = videoMix.map(v => v.replace('.mp4', '').replace('glass-', '').replace('-asmr', '')).join(', ');
      console.log(`   🎯 Mix: ${mixLog}`);
      
      return { success: true, file: outputFile, size: sizeMB };
    } else {
      throw new Error('Output file not created');
    }
  } catch (error) {
    console.error(`   ❌ Error creating compilation #${index + 1}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Main function
async function main() {
  console.log('🎬 ASMR Fruit YouTube Shorts Creator');
  console.log('=' + '='.repeat(50));
  console.log(`📁 Input directory: ${INPUT_DIR}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🎯 Creating ${NUM_COMPILATIONS} compilations`);
  console.log(`⏱️  Target duration: ${TARGET_DURATION} seconds per video`);
  console.log(`📐 Output format: 9:16 (1080x1920) YouTube Shorts`);
  console.log('=' + '='.repeat(50));
  
  // Check if ffmpeg is installed
  try {
    await execAsync('ffmpeg -version');
  } catch (error) {
    console.error('❌ FFmpeg is not installed. Please install FFmpeg first.');
    process.exit(1);
  }
  
  // Ensure directories exist
  ensureDirectories();
  
  // Check if all videos exist
  console.log('\n🔍 Checking video files...');
  const missingVideos = ASMR_VIDEOS.filter(video => 
    !fs.existsSync(path.join(INPUT_DIR, video))
  );
  
  if (missingVideos.length > 0) {
    console.error(`❌ Missing ${missingVideos.length} videos:`);
    missingVideos.forEach(v => console.error(`   - ${v}`));
    console.log(`\n⚠️  Continuing with ${ASMR_VIDEOS.length - missingVideos.length} available videos...`);
    
    // Remove missing videos from the list
    ASMR_VIDEOS.splice(0, ASMR_VIDEOS.length, 
      ...ASMR_VIDEOS.filter(v => !missingVideos.includes(v))
    );
  } else {
    console.log(`✅ All ${ASMR_VIDEOS.length} videos found!`);
  }
  
  // Generate compilations
  const results = [];
  for (let i = 0; i < NUM_COMPILATIONS; i++) {
    const result = await generateCompilation(i);
    results.push(result);
    
    // Add a small delay between processing
    if (i < NUM_COMPILATIONS - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Clean up temp files
  console.log('\n🧹 Cleaning up temporary files...');
  try {
    const tempFiles = await fs.promises.readdir(TEMP_DIR);
    for (const file of tempFiles) {
      await fs.promises.unlink(path.join(TEMP_DIR, file));
    }
    await fs.promises.rmdir(TEMP_DIR);
  } catch (error) {
    console.warn('⚠️  Could not clean all temp files:', error.message);
  }
  
  // Summary
  console.log('\n📊 SUMMARY');
  console.log('=' + '='.repeat(50));
  const successful = results.filter(r => r.success);
  console.log(`✅ Successfully created: ${successful.length}/${NUM_COMPILATIONS} videos`);
  
  if (successful.length > 0) {
    const totalSize = successful.reduce((sum, r) => sum + parseFloat(r.size), 0);
    console.log(`💾 Total size: ${totalSize.toFixed(2)} MB`);
    console.log(`📁 Output location: ${OUTPUT_DIR}`);
    console.log('\n🎉 Your ASMR Fruit YouTube Shorts are ready!');
    console.log('📤 You can now upload these to YouTube Shorts');
  }
  
  if (results.some(r => !r.success)) {
    console.log(`\n❌ Failed compilations:`);
    results.forEach((r, i) => {
      if (!r.success) {
        console.log(`   - Compilation #${i + 1}: ${r.error}`);
      }
    });
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});