const fs = require('fs');
const path = require('path');

const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
const videosDir = path.join(__dirname, '../public/videos');

console.log('🎬 Updating video URLs in database...');

let updatedCount = 0;
const fiveStarIds = ["6", "9", "10", "12", "16", "19", "21", "24", "26", "27", "28", "29", "31", "35"];

data.prompts.forEach(prompt => {
  if (fiveStarIds.includes(prompt.id)) {
    const videoPath = path.join(videosDir, `${prompt.slug}.mp4`);
    
    if (fs.existsSync(videoPath)) {
      prompt.videoUrl = `/videos/${prompt.slug}.mp4`;
      console.log(`✅ Updated: ${prompt.title}`);
      updatedCount++;
    } else {
      console.log(`⚠️  Missing video: ${prompt.slug}.mp4 (${prompt.title})`);
    }
  }
});

fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
console.log(`\n💾 Updated ${updatedCount} prompts with video URLs`);
