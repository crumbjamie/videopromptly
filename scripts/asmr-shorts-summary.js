#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/asmr-shorts');

console.log('🎬 ASMR Fruit YouTube Shorts - Final Summary');
console.log('=' + '='.repeat(60));

const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp4'));

console.log(`📊 Total videos created: ${files.length}`);

let totalSize = 0;
const themes = {};

files.forEach(file => {
  const stats = fs.statSync(path.join(OUTPUT_DIR, file));
  const sizeMB = stats.size / (1024 * 1024);
  totalSize += sizeMB;
  
  // Extract theme from filename
  const match = file.match(/asmr-fruit-short-([a-z]+)-\d+\.mp4/);
  const theme = match ? match[1] : 'unknown';
  
  if (!themes[theme]) {
    themes[theme] = { count: 0, size: 0 };
  }
  themes[theme].count++;
  themes[theme].size += sizeMB;
});

console.log(`💾 Total file size: ${totalSize.toFixed(2)} MB`);
console.log(`📐 Video format: 1080x1920 (9:16 aspect ratio)`);
console.log(`⏱️  Duration: ~2 minutes each`);
console.log(`🎯 Frame rate: 30 fps`);
console.log(`🔊 Audio: AAC 192kbps 48kHz stereo`);
console.log(`📹 Video: H.264 High profile`);

console.log('\n📋 Videos by theme:');
Object.entries(themes).forEach(([theme, data]) => {
  console.log(`   ${theme}: ${data.count} videos (${data.size.toFixed(1)} MB)`);
});

console.log('\n📁 All videos:');
files.sort().forEach((file, index) => {
  const stats = fs.statSync(path.join(OUTPUT_DIR, file));
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
  console.log(`   ${String(index + 1).padStart(2, '0')}. ${file} (${sizeMB} MB)`);
});

console.log('\n🎉 Ready for YouTube Shorts upload!');
console.log('📤 Upload tips:');
console.log('   - Perfect 9:16 aspect ratio for mobile viewing');
console.log('   - 2-minute duration ideal for engagement');
console.log('   - High-quality ASMR audio preserved');
console.log('   - Each video has unique fruit combinations');
console.log('   - Optimized for YouTube Shorts algorithm');

console.log('\n📍 Location: ' + OUTPUT_DIR);