#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.join(__dirname, '../public/viral-yeti-videos');

// Expected viral yeti videos
const EXPECTED_VIDEOS = [
  'yeti-ohio-rizz.mp4',
  'yeti-skibidi-explained.mp4', 
  'yeti-sigma-grindset.mp4',
  'yeti-cap-no-cap.mp4',
  'yeti-amongus-sussy.mp4',
  'yeti-gyatt-meaning.mp4',
  'yeti-fanum-tax.mp4',
  'yeti-mewing-tutorial.mp4',
  'yeti-npc-behavior.mp4',
  'yeti-based-cringe.mp4',
  'yeti-alpha-beta-sigma.mp4',
  'yeti-drip-check.mp4',
  'yeti-gen-alpha-slang.mp4',
  'yeti-main-character.mp4',
  'yeti-bussin-food.mp4',
  'yeti-ratio-explained.mp4',
  'yeti-sheesh-moment.mp4',
  'yeti-lowkey-highkey.mp4',
  'yeti-slay-queen.mp4',
  'yeti-toxic-positivity.mp4'
];

const VIDEO_TITLES = [
  'Yeti Explains Ohio Rizz',
  'Yeti Reacts to Skibidi Toilet',
  'Yeti Sigma Male Grindset',
  'Yeti Explains Cap vs No Cap',
  'Yeti Sus Behavior Analysis',
  'Yeti Discovers Gyatt',
  'Yeti Explains Fanum Tax',
  'Yeti Mewing Tutorial',
  'Yeti Calls Out NPC Behavior',
  'Yeti Based vs Cringe Tier List',
  'Yeti Explains Male Hierarchy',
  'Yeti Drip Check',
  'Yeti Teaches Gen Alpha Slang',
  'Yeti Main Character Energy',
  'Yeti Reviews Bussin Food',
  'Yeti Explains Getting Ratioed',
  'Yeti Sheesh Moment',
  'Yeti Lowkey Highkey Explanation',
  'Yeti Slay Queen Energy',
  'Yeti Calls Out Toxic Positivity'
];

console.log('🧊 VIRAL GEN ALPHA YETI VIDEO SUMMARY');
console.log('=' + '='.repeat(50));

let totalSize = 0;
let completedCount = 0;
let completedVideos = [];
let missingVideos = [];

console.log('📁 Video Generation Status:');
EXPECTED_VIDEOS.forEach((filename, index) => {
  const filePath = path.join(OUTPUT_DIR, filename);
  const title = VIDEO_TITLES[index];
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    totalSize += stats.size;
    completedCount++;
    completedVideos.push({ filename, title, size: sizeMB });
    
    console.log(`   ✅ ${index + 1}. ${title} (${sizeMB} MB)`);
  } else {
    missingVideos.push({ filename, title, index: index + 1 });
    console.log(`   ❌ ${index + 1}. ${title} (Missing)`);
  }
});

console.log('\n📊 Summary:');
console.log(`   Completed: ${completedCount}/${EXPECTED_VIDEOS.length} videos`);
console.log(`   Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
console.log(`   Progress: ${((completedCount / EXPECTED_VIDEOS.length) * 100).toFixed(1)}%`);

if (completedCount > 0) {
  console.log('\n✅ Successfully Generated Videos:');
  completedVideos.forEach(video => {
    console.log(`   - ${video.title} (${video.size} MB)`);
  });
}

if (missingVideos.length > 0) {
  console.log('\n❌ Missing Videos:');
  missingVideos.forEach(video => {
    console.log(`   ${video.index}. ${video.title}`);
  });
  
  console.log('\n⚠️  To complete generation, run:');
  console.log('   node scripts/generate-viral-yeti-videos.js');
}

console.log('\n🎬 Content Overview:');
console.log('   - Gen Alpha/Gen Z humor and language');
console.log('   - Viral TikTok trends and memes');
console.log('   - Educational content about slang');
console.log('   - Perfect 9:16 aspect ratio');
console.log('   - 8-second duration each');
console.log('   - Documentary-style selfie format');

console.log('\n🚀 Viral Strategies Used:');
console.log('   - Bigfoot/Yeti vlog phenomenon');
console.log('   - Character consistency (exact descriptions)');
console.log('   - Audio-first design approach');
console.log('   - Camera specificity (selfie stick)');
console.log('   - No subtitles directive');
console.log('   - Emotional authenticity');

console.log(`\n📍 Location: ${OUTPUT_DIR}`);

if (completedCount === EXPECTED_VIDEOS.length) {
  console.log('\n🎉 ALL VIRAL YETI VIDEOS COMPLETE!');
  console.log('📱 Ready to dominate TikTok and Instagram Reels!');
} else {
  console.log(`\n⏳ ${missingVideos.length} videos still need to be generated`);
  console.log('   Estimated time remaining: ~' + (missingVideos.length * 8) + ' minutes');
}