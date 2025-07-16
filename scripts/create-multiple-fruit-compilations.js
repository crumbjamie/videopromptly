#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// All available fruit ASMR videos (excluding glitchy apple)
const allFruitVideos = [
  'glass-strawberry-slicing.mp4',
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
  'glass-dragon-fruit-asmr.mp4',
  'glass-passionfruit-asmr.mp4',
  'glass-starfruit-asmr.mp4',
  'satisfying-glass-fruit-series.mp4',
  'crystal-kiwi-physics-asmr.mp4',
  'glass-strawberry-asmr-cutting-2.mp4',
  'glass-strawberry-asmr-cutting-3.mp4',
  'glass-strawberry-asmr-cutting-5.mp4'
];

const videosDir = '/Users/jamie/Documents/GitHub/videopromptly/public/videos';
const outputDir = '/Users/jamie/Documents/GitHub/videopromptly/public/videos/compilations';
const tempDir = '/tmp/fruit-asmr-multi-temp';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create temp directory for processing
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random selection of videos
function getRandomSelection(videos, count = 20) {
  const shuffled = shuffleArray(videos);
  return shuffled.slice(0, count);
}

// Verify videos exist
function verifyVideos(videoList) {
  const existing = [];
  const missing = [];
  
  videoList.forEach(video => {
    const videoPath = path.join(videosDir, video);
    if (fs.existsSync(videoPath)) {
      existing.push(video);
    } else {
      missing.push(video);
    }
  });
  
  return { existing, missing };
}

// Create a single compilation
async function createCompilation(compilationNumber, videoList) {
  console.log(`\n🍓 Creating Compilation ${compilationNumber}...`);
  console.log(`📁 Using ${videoList.length} randomized videos`);
  
  const { existing, missing } = verifyVideos(videoList);
  
  if (missing.length > 0) {
    console.log(`⚠️  ${missing.length} videos missing, using ${existing.length} available`);
  }
  
  if (existing.length === 0) {
    console.error(`❌ No videos available for compilation ${compilationNumber}`);
    return false;
  }
  
  // Show the order for this compilation
  console.log(`🎬 Video Order for Compilation ${compilationNumber}:`);
  existing.forEach((video, index) => {
    const fruitName = video.replace('glass-', '').replace('-asmr', '').replace('-slicing', '').replace('-cutting-2', '').replace('-cutting-3', '').replace('-cutting-5', '').replace('-physics', '').replace('satisfying-', '').replace('-series', '').replace('crystal-', '').replace('.mp4', '');
    console.log(`   ${index + 1}. ${fruitName.charAt(0).toUpperCase() + fruitName.slice(1).replace('-', ' ')}`);
  });
  
  try {
    // Create file list
    const fileListPath = path.join(tempDir, `filelist-${compilationNumber}.txt`);
    const fileListContent = existing.map(video => 
      `file '${path.join(videosDir, video)}'`
    ).join('\n');
    
    fs.writeFileSync(fileListPath, fileListContent);
    
    // Concatenate videos
    const compilationPath = path.join(tempDir, `fruit-compilation-${compilationNumber}.mp4`);
    console.log(`🔄 Concatenating videos for compilation ${compilationNumber}...`);
    
    execSync(`ffmpeg -f concat -safe 0 -i "${fileListPath}" -c copy -y "${compilationPath}"`, {
      stdio: 'pipe'
    });
    
    // Get duration
    const durationOutput = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${compilationPath}"`);
    const compilationDuration = parseFloat(durationOutput.toString().trim());
    
    console.log(`⏱️  Duration: ${compilationDuration.toFixed(2)} seconds`);
    
    // Calculate loops needed for 15 minutes
    const targetDuration = 900; // 15 minutes
    const loopCount = Math.ceil(targetDuration / compilationDuration);
    
    console.log(`🔁 Need ${loopCount} loops for 15 minutes`);
    
    // Create 15-minute version
    const finalOutputPath = path.join(outputDir, `fruit-asmr-15min-compilation-${compilationNumber}.mp4`);
    console.log(`🔄 Creating 15-minute version ${compilationNumber}...`);
    
    execSync(`ffmpeg -stream_loop ${loopCount - 1} -i "${compilationPath}" -t 900 -c copy -y "${finalOutputPath}"`, {
      stdio: 'pipe'
    });
    
    // Create 10-minute version
    const mediumOutputPath = path.join(outputDir, `fruit-asmr-10min-compilation-${compilationNumber}.mp4`);
    console.log(`🔄 Creating 10-minute version ${compilationNumber}...`);
    
    execSync(`ffmpeg -stream_loop ${Math.ceil(600 / compilationDuration) - 1} -i "${compilationPath}" -t 600 -c copy -y "${mediumOutputPath}"`, {
      stdio: 'pipe'
    });
    
    // Create 5-minute version
    const shortOutputPath = path.join(outputDir, `fruit-asmr-5min-compilation-${compilationNumber}.mp4`);
    console.log(`🔄 Creating 5-minute version ${compilationNumber}...`);
    
    execSync(`ffmpeg -stream_loop ${Math.ceil(300 / compilationDuration) - 1} -i "${compilationPath}" -t 300 -c copy -y "${shortOutputPath}"`, {
      stdio: 'pipe'
    });
    
    // Generate thumbnail
    const thumbnailPath = path.join(outputDir, `fruit-asmr-15min-compilation-${compilationNumber}.jpg`);
    console.log(`🖼️  Generating thumbnail ${compilationNumber}...`);
    
    execSync(`ffmpeg -i "${finalOutputPath}" -ss 00:00:03 -vframes 1 -q:v 2 -y "${thumbnailPath}"`, {
      stdio: 'pipe'
    });
    
    // Get file sizes
    const finalStats = fs.statSync(finalOutputPath);
    const mediumStats = fs.statSync(mediumOutputPath);
    const shortStats = fs.statSync(shortOutputPath);
    
    const finalSize = (finalStats.size / (1024 * 1024)).toFixed(2);
    const mediumSize = (mediumStats.size / (1024 * 1024)).toFixed(2);
    const shortSize = (shortStats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`✅ Compilation ${compilationNumber} Complete!`);
    console.log(`   📹 15min: ${finalSize} MB`);
    console.log(`   📹 10min: ${mediumSize} MB`);
    console.log(`   📹 5min: ${shortSize} MB`);
    console.log(`   🍎 Videos: ${existing.length}`);
    
    return {
      number: compilationNumber,
      videoCount: existing.length,
      sizes: { final: finalSize, medium: mediumSize, short: shortSize },
      firstFruit: existing[0].replace('glass-', '').replace('-asmr.mp4', '').replace('-slicing.mp4', '')
    };
    
  } catch (error) {
    console.error(`❌ Error creating compilation ${compilationNumber}:`, error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🎬 Creating 4 Randomized Fruit ASMR Compilations...');
  console.log('='.repeat(60));
  
  const results = [];
  
  // Create 4 different compilations
  for (let i = 3; i <= 6; i++) {
    const randomSelection = getRandomSelection(allFruitVideos, 20);
    const result = await createCompilation(i, randomSelection);
    if (result) {
      results.push(result);
    }
    
    // Small delay between compilations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Final summary
  console.log('\n🎉 ALL COMPILATIONS COMPLETE!');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    console.log(`📹 Compilation ${result.number}:`);
    console.log(`   🍓 Starting with: ${result.firstFruit}`);
    console.log(`   📊 Videos: ${result.videoCount}`);
    console.log(`   💾 Sizes: 15min(${result.sizes.final}MB) 10min(${result.sizes.medium}MB) 5min(${result.sizes.short}MB)`);
    console.log(`   🔗 URLs:`);
    console.log(`      - /videos/compilations/fruit-asmr-15min-compilation-${result.number}.mp4`);
    console.log(`      - /videos/compilations/fruit-asmr-10min-compilation-${result.number}.mp4`);
    console.log(`      - /videos/compilations/fruit-asmr-5min-compilation-${result.number}.mp4`);
    console.log(`      - /videos/compilations/fruit-asmr-15min-compilation-${result.number}.jpg`);
    console.log('');
  });
  
  console.log(`✅ Created ${results.length} complete compilations!`);
  console.log(`📁 Total files: ${results.length * 4} (${results.length * 3} videos + ${results.length} thumbnails)`);
  
  // Clean up temp files
  console.log('\n🧹 Cleaning up temporary files...');
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  console.log('\n🎬 All fruit ASMR compilations are ready for use!');
}

main().catch(console.error);