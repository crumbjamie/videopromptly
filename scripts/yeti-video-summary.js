#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.join(__dirname, '../public/yeti-videos');

console.log('🧊 GEN-Z YETI VIDEO SUMMARY');
console.log('=' + '='.repeat(40));

const expectedVideos = [
  { id: 'yeti-gaming-rant', title: 'Gen-Z Yeti Gaming Rant' },
  { id: 'yeti-touching-grass', title: 'Gen-Z Yeti "Touching Grass"' },
  { id: 'grumpy-dad-yeti', title: 'Grumpy Dad Yeti Complains' },
  { id: 'yeti-tests-dad', title: 'Gen-Z Yeti Tests Dad' }
];

let totalSize = 0;
let completedCount = 0;

console.log('📁 Video Status:');
expectedVideos.forEach((video, index) => {
  const filePath = path.join(OUTPUT_DIR, `${video.id}.mp4`);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    totalSize += stats.size;
    completedCount++;
    
    // Get video info
    try {
      const ffprobeCmd = `ffprobe -v quiet -print_format json -show_streams "${filePath}"`;
      const result = execSync(ffprobeCmd, { encoding: 'utf8' });
      const videoInfo = JSON.parse(result);
      const videoStream = videoInfo.streams.find(s => s.codec_type === 'video');
      
      const resolution = videoStream ? `${videoStream.width}x${videoStream.height}` : 'Unknown';
      const duration = videoStream ? parseFloat(videoStream.duration).toFixed(1) : 'Unknown';
      
      console.log(`   ✅ ${index + 1}. ${video.title}`);
      console.log(`      File: ${video.id}.mp4 (${sizeMB} MB)`);
      console.log(`      Resolution: ${resolution} (${resolution === '720x1280' ? '9:16 ✓' : 'Invalid aspect ratio ❌'})`);
      console.log(`      Duration: ${duration} seconds`);
      console.log('');
    } catch (error) {
      console.log(`   ✅ ${index + 1}. ${video.title}`);
      console.log(`      File: ${video.id}.mp4 (${sizeMB} MB)`);
      console.log(`      Error getting video info: ${error.message}`);
      console.log('');
    }
  } else {
    console.log(`   ❌ ${index + 1}. ${video.title}`);
    console.log(`      File: ${video.id}.mp4 (Missing)`);
    console.log('');
  }
});

console.log('📊 Summary:');
console.log(`   Completed: ${completedCount}/${expectedVideos.length} videos`);
console.log(`   Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
console.log(`   Model: veo3_fast`);
console.log(`   Aspect ratio: 9:16 (vertical)`);
console.log(`   Duration: 8 seconds each`);
console.log(`   Format: H.264 MP4`);

if (completedCount === expectedVideos.length) {
  console.log('\n🎉 All yeti videos completed successfully!');
} else {
  console.log(`\n⚠️  ${expectedVideos.length - completedCount} video(s) still missing.`);
  console.log('   Run the generator script again to complete them.');
}

console.log(`\n📍 Location: ${OUTPUT_DIR}`);
console.log('\n🎯 Video Concepts:');
console.log('   1. Gaming Rant - Yeti complains about mid games');
console.log('   2. Touching Grass - Sarcastic response to "go outside"');
console.log('   3. Grumpy Dad - Older yeti complains about Gen-Z slang');
console.log('   4. Tests Dad - Gen-Z yeti uses slang with dad');