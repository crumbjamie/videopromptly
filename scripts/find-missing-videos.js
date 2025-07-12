const fs = require('fs');
const path = require('path');

// Read the prompts file
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/database/prompts.json'), 'utf8'));
const videosDir = path.join(__dirname, '../public/videos');

console.log('🔍 Checking for missing video files...\n');

let missingCount = 0;
for (const prompt of data.prompts) {
  if (prompt.videoUrl) {
    const filename = prompt.videoUrl.replace('/videos/', '');
    const fullPath = path.join(videosDir, filename);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ ${prompt.id}: ${prompt.title} (missing: ${filename})`);
      missingCount++;
    }
  }
}

if (missingCount === 0) {
  console.log('✅ All prompts with videoUrl have corresponding files!');
} else {
  console.log(`\n📊 Found ${missingCount} prompts with missing video files`);
}