const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/database/prompts.json'), 'utf8'));
const videosDir = path.join(__dirname, '../public/videos');

const fourStarWithoutVideos = data.prompts.filter(p => {
  const videoFile = path.join(videosDir, `${p.slug}.mp4`);
  return p.rating === 4 && !fs.existsSync(videoFile);
});

console.log('4-star prompts without video files:');
fourStarWithoutVideos.forEach(p => console.log(`${p.id}: ${p.title}`));