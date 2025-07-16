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

// ASMR fruit video files
const ASMR_VIDEOS = [
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
  'glass-watermelon-asmr.mp4', 'glass-almond-asmr.mp4', 'glass-cashew-asmr.mp4',
  'glass-hazelnut-asmr.mp4', 'glass-macadamia-asmr.mp4', 'glass-pecan-asmr.mp4',
  'glass-pistachio-asmr.mp4', 'glass-walnut-asmr.mp4', 'glass-beetroot-asmr.mp4',
  'glass-bell-pepper-asmr.mp4', 'glass-broccoli-asmr.mp4', 'glass-carrot-asmr.mp4',
  'glass-chilli-asmr.mp4', 'glass-cucumber-asmr.mp4', 'glass-garlic-asmr.mp4',
  'glass-olive-asmr.mp4', 'glass-onion-asmr.mp4', 'glass-radish-asmr.mp4',
  'glass-tomato-asmr.mp4', 'glass-zucchini-asmr.mp4', 'crystal-kiwi-physics-asmr.mp4',
  'glass-strawberry-slicing.mp4', 'satisfying-glass-fruit-series.mp4'
];

const TARGET_DURATION = 120;
const VIDEO_DURATION = 8;
const VIDEOS_PER_COMPILATION = Math.ceil(TARGET_DURATION / VIDEO_DURATION);

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
  const strategies = [
    // Strategy 1: Random shuffle
    () => shuffle(ASMR_VIDEOS).slice(0, VIDEOS_PER_COMPILATION),
    
    // Strategy 2: Citrus theme
    () => {
      const citrus = ASMR_VIDEOS.filter(v => 
        ['lemon', 'lime', 'orange', 'grapefruit'].some(item => v.includes(item)));
      const others = shuffle(ASMR_VIDEOS.filter(v => !citrus.includes(v)));
      return shuffle([...citrus, ...others]).slice(0, VIDEOS_PER_COMPILATION);
    },
    
    // Strategy 3: Berry theme
    () => {
      const berries = ASMR_VIDEOS.filter(v => 
        ['strawberry', 'raspberry', 'blackberry', 'blueberry', 'cranberry'].some(item => v.includes(item)));
      const others = shuffle(ASMR_VIDEOS.filter(v => !berries.includes(v)));
      return shuffle([...berries, ...others]).slice(0, VIDEOS_PER_COMPILATION);
    },
    
    // Strategy 4: Exotic fruits
    () => {
      const exotic = ASMR_VIDEOS.filter(v => 
        ['dragon-fruit', 'starfruit', 'guava', 'passionfruit', 'persimmon', 'fig'].some(item => v.includes(item)));
      const others = shuffle(ASMR_VIDEOS.filter(v => !exotic.includes(v)));
      return shuffle([...exotic, ...others]).slice(0, VIDEOS_PER_COMPILATION);
    },
    
    // Strategy 5: Nuts and seeds
    () => {
      const nuts = ASMR_VIDEOS.filter(v => 
        ['almond', 'cashew', 'hazelnut', 'macadamia', 'pecan', 'pistachio', 'walnut'].some(item => v.includes(item)));
      const others = shuffle(ASMR_VIDEOS.filter(v => !nuts.includes(v)));
      return shuffle([...nuts, ...others]).slice(0, VIDEOS_PER_COMPILATION);
    }
  ];
  
  const strategy = strategies[index % strategies.length];
  let videos = strategy();
  
  // Fill with random ones if needed
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
  const actualIndex = index + 11; // Start from 11 since we have 10 already
  console.log(`\n🎬 Creating ASMR Fruit Short #${actualIndex}...`);
  
  const videoMix = createVideoMix(index);
  console.log(`   📋 Using ${videoMix.length} videos`);
  
  const concatFile = path.join(TEMP_DIR, `concat_${actualIndex}.txt`);
  await createConcatFile(videoMix, concatFile);
  
  const themes = ['mixed', 'citrus', 'berry', 'exotic', 'nuts'];
  const theme = themes[index % themes.length];
  const outputFile = path.join(OUTPUT_DIR, `asmr-fruit-short-${theme}-${String(actualIndex).padStart(2, '0')}.mp4`);
  
  // Check if file already exists
  if (fs.existsSync(outputFile)) {
    console.log(`   ⚠️  File already exists, skipping...`);
    return { success: true, skipped: true };
  }
  
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
    
    if (fs.existsSync(outputFile)) {
      const stats = fs.statSync(outputFile);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`   ✅ Created: ${path.basename(outputFile)} (${sizeMB} MB)`);
      
      const mixLog = videoMix.map(v => v.replace('.mp4', '').replace('glass-', '').replace('-asmr', '')).join(', ');
      console.log(`   🎯 Mix: ${mixLog}`);
      
      return { success: true, file: outputFile, size: sizeMB };
    } else {
      throw new Error('Output file not created');
    }
  } catch (error) {
    console.error(`   ❌ Error creating compilation #${actualIndex}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Main function
async function main() {
  console.log('🎬 Completing ASMR Fruit YouTube Shorts (11-20)');
  console.log('=' + '='.repeat(50));
  
  // Check ffmpeg
  try {
    await execAsync('ffmpeg -version');
  } catch (error) {
    console.error('❌ FFmpeg is not installed. Please install FFmpeg first.');
    process.exit(1);
  }
  
  ensureDirectories();
  
  // Check existing files
  const existingFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp4'));
  console.log(`📁 Found ${existingFiles.length} existing videos`);
  
  // Generate remaining 10 compilations
  const results = [];
  for (let i = 0; i < 10; i++) {
    const result = await generateCompilation(i);
    results.push(result);
    
    if (i < 9) {
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
  
  // Final summary
  console.log('\n📊 COMPLETION SUMMARY');
  console.log('=' + '='.repeat(50));
  const successful = results.filter(r => r.success && !r.skipped);
  const skipped = results.filter(r => r.skipped);
  
  console.log(`✅ Successfully created: ${successful.length} new videos`);
  console.log(`⚠️  Skipped (already existed): ${skipped.length} videos`);
  
  // Check total count
  const finalFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp4'));
  console.log(`📁 Total videos in output directory: ${finalFiles.length}`);
  
  if (finalFiles.length >= 20) {
    console.log('\n🎉 All 20 ASMR Fruit YouTube Shorts completed!');
    console.log('📤 Ready for upload to YouTube Shorts');
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});