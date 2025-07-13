#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load existing database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

console.log('🎬 Adding 4 new viral prompt variations that broke the internet...\\n');

// Helper function to create URL-friendly slug
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Get next available ID
const getNextId = () => {
  const maxId = Math.max(...database.prompts.map(p => parseInt(p.id)));
  return (maxId + 1).toString();
};

// New prompts from "Viral Veo3 prompts that broke the internet last month.md"
const newPrompts = [
  {
    title: "Las Vegas Bigfoot Vlogger",
    description: "Hyperrealistic white Yeti vlogging with GoPro on sunny Las Vegas Strip, featuring detailed fur textures and urban setting contrast.",
    prompt: "A massive, hyperrealistic white Yeti with tangled, sunlit fur and glinting amber eyes is casually vlogging with a GoPro Hero 10 held tightly in his oversized furry hand. It's a scorching sunny afternoon on the Las Vegas Strip.",
    category: "Viral Character Vlogs",
    difficulty: "Intermediate",
    tags: ["yeti", "las-vegas", "vlog", "gopro", "strip", "sunny", "hyperrealistic"],
    rating: 4
  },
  {
    title: "Stand-Up Comedy Music Festival",
    description: "Comedian performing awkward festival joke with ambient crowd sounds and distant band audio for authentic festival atmosphere.",
    prompt: "A standup comic tells an awkward joke at a music festival: 'You know what's great about music festivals? Watching 20,000 people pretend they knew this band before today while filming vertical videos they'll never watch.' Sounds of distant bands, noisy crowd, ambient background of a busy festival field (no studio audience)",
    category: "Comedy & Entertainment",
    difficulty: "Advanced",
    tags: ["stand-up", "music-festival", "comedy", "awkward", "crowd", "ambient", "vertical-videos"],
    rating: 4
  },
  {
    title: "Wonder Woman Asteroid Adventure",
    description: "Cinematic superhero vlog featuring Wonder Woman with alien jungle setting and asteroid lion companion.",
    prompt: "A photorealistic cinematic scene, Medium shot intercut with slow push-ins. Wonder Woman lounges beside a tame asteroid lion in an alien jungle, adjusting her golden bracers. She smiles toward the floating drone cam: 'We went to a nebula once. He was happy, until he passed out from lack of oxygen. So sweet.'",
    category: "Cinematic Action",
    difficulty: "Advanced",
    tags: ["wonder-woman", "asteroid", "alien-jungle", "lion", "nebula", "superhero", "cinematic"],
    rating: 4
  },
  {
    title: "ASMR Spider Web Raindrops",
    description: "Extreme close-up ASMR content featuring realistic water physics on spider web with gentle rain audio.",
    prompt: "Extreme close-up shot. Rain-wet spider web with perfect water droplets. Soft morning light. A single raindrop hits the web causing realistic vibrations. Audio: gentle rain sounds, droplet impacts, no music.",
    category: "ASMR & Satisfying",
    difficulty: "Advanced",
    tags: ["asmr", "spider-web", "raindrops", "close-up", "vibrations", "morning-light", "physics"],
    rating: 5
  }
];

// Add new prompts to database
let addedCount = 0;
const currentDate = new Date().toISOString();

newPrompts.forEach((newPrompt, index) => {
  const id = getNextId();
  const slug = createSlug(newPrompt.title);
  
  const fullPrompt = {
    id: id,
    slug: slug,
    title: newPrompt.title,
    description: newPrompt.description,
    prompt: newPrompt.prompt,
    category: newPrompt.category,
    categories: [newPrompt.category],
    tags: newPrompt.tags,
    difficulty: newPrompt.difficulty,
    createdAt: currentDate,
    updatedAt: currentDate,
    rating: newPrompt.rating,
    ratingCount: 1,
    videoUrl: `/videos/${slug}.mp4`,
    thumbnailUrl: `/thumbnails/${slug}.jpg`,
    duration: 8,
    resolution: "1280x720", 
    aspectRatio: "16:9",
    format: "mp4",
    fileSize: 50000000,
    featured: newPrompt.rating >= 5
  };
  
  database.prompts.push(fullPrompt);
  addedCount++;
  
  console.log(`✅ Added: "${newPrompt.title}" (${newPrompt.rating}⭐ - ${newPrompt.category})`);
});

// Save updated database
fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

console.log(`\\n🎉 Successfully added ${addedCount} new viral prompt variations to database!`);

// Show category breakdown
const categoryStats = {};
newPrompts.forEach(prompt => {
  categoryStats[prompt.category] = (categoryStats[prompt.category] || 0) + 1;
});

console.log('\\n📊 Category Distribution:');
Object.entries(categoryStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([category, count]) => {
    console.log(`   ${category}: ${count} prompts`);
  });

// Show rating breakdown  
const ratingStats = {};
newPrompts.forEach(prompt => {
  ratingStats[prompt.rating] = (ratingStats[prompt.rating] || 0) + 1;
});

console.log('\\n⭐ Rating Distribution:');
Object.entries(ratingStats)
  .sort((a, b) => b[0] - a[0])
  .forEach(([rating, count]) => {
    console.log(`   ${rating} stars: ${count} prompts`);
  });

console.log('\\n✨ Database now contains', database.prompts.length, 'total prompts!');