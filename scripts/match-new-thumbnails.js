const fs = require('fs');
const path = require('path');

// Read the prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// New thumbnail matches
const thumbnailMatches = [
  { slug: "3d-avatar-stickers", thumbnail: "3D-Avatar-Stickers.png" },
  { slug: "black-white-editorial-portrait", thumbnail: "Black-&-White-Editorial-Portrait.png" },
  { slug: "chrome-mech-caf", thumbnail: "Chrome-Mech-Café.png" },
  { slug: "comic-book-hero", thumbnail: "Comic-Book-Hero.png" },
  { slug: "cyberpunk-hacker", thumbnail: "Cyberpunk-Hacker.png" },
  { slug: "cyberpunk-ramen-market", thumbnail: "Cyberpunk-Ramen-Market.png" },
  { slug: "cyberpunk-street-market", thumbnail: "Cyberpunk-Street-Market.png" },
  { slug: "editorial-food-photography-style", thumbnail: "Editorial-Food-Photography-Style.png" },
  { slug: "expressionist-cityscape", thumbnail: "Expressionist-Cityscape.png" },
  { slug: "glitch-art-dj-booth", thumbnail: "Glitch-Art-DJ-Booth.png" },
  { slug: "hyperrealistic-flash-photography", thumbnail: "Hyperrealistic-Flash-Photography.png" },
  { slug: "pixel-art-retro", thumbnail: "Pixel-Art-Retro.png" },
  { slug: "ufo-cockpit-selfie", thumbnail: "UFO-Cockpit-Selfie.png" }
];

// Update prompts with thumbnail references
let updatedCount = 0;
thumbnailMatches.forEach(match => {
  const prompt = data.prompts.find(p => p.slug === match.slug);
  if (prompt) {
    prompt.thumbnail = {
      before: "woman-sample.jpg",
      after: match.thumbnail
    };
    updatedCount++;
    console.log(`✓ Updated "${prompt.title}" with thumbnail ${match.thumbnail}`);
  } else {
    console.log(`✗ Could not find prompt with slug: ${match.slug}`);
  }
});

// Write the updated data back
fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
console.log(`\n✅ Updated ${updatedCount} prompts with thumbnails`);