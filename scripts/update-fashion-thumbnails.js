const fs = require('fs');
const path = require('path');

// Read the prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Fashion thumbnail updates with proper capitalization
const thumbnailUpdates = [
  { slug: "dior-inspired-cinematic-shoot", thumbnail: "Dior-Inspired-Cinematic-Shoot.png" },
  { slug: "futuristic-avant-garde-portrait", thumbnail: "Futuristic-Avant-Garde-Portrait.png" },
  { slug: "high-fashion-editorial-portrait", thumbnail: "High-Fashion-Editorial-Portrait.png" },
  { slug: "luxury-brand-campaign", thumbnail: "Luxury-Brand-Campaign.png" },
  { slug: "sculptural-fashion-editorial", thumbnail: "Sculptural-Fashion-Editorial.png" },
  { slug: "streetwear-commercial-photography", thumbnail: "Streetwear-Commercial-Photography.png" },
  { slug: "vogue-style-beauty-editorial", thumbnail: "Vogue-Style-Beauty-Editorial.png" }
];

// Update prompts with corrected thumbnail references
let updatedCount = 0;
thumbnailUpdates.forEach(update => {
  const prompt = data.prompts.find(p => p.slug === update.slug);
  if (prompt) {
    // Update the thumbnail reference
    if (typeof prompt.thumbnail === 'object') {
      prompt.thumbnail.after = update.thumbnail;
    } else {
      prompt.thumbnail = {
        before: "woman-sample.jpg",
        after: update.thumbnail
      };
    }
    updatedCount++;
    console.log(`✓ Updated "${prompt.title}" with thumbnail ${update.thumbnail}`);
  } else {
    console.log(`✗ Could not find prompt with slug: ${update.slug}`);
  }
});

// Write the updated data back
fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
console.log(`\n✅ Updated ${updatedCount} fashion prompts with corrected thumbnails`);