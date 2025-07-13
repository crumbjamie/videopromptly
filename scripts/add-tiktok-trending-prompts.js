#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load existing database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

console.log('🎬 Adding 15 highest-quality TikTok-trending prompts...\\n');

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

// Top TikTok prompts (excluding vertical format ones)
const newPrompts = [
  {
    title: "Biblical Influencer Jonah Whale",
    description: "Viral biblical influencer series featuring Jonah inside whale belly with soggy confession and apology to God, sailors, and whale.",
    prompt: "A cinematic handheld selfie-style video shot, showing a soggy, exhausted Middle Eastern man in his 30s with shoulder-length wet hair, a tangled beard, and shredded linen robes clinging to his frame. He's seated awkwardly on a slick, uneven surface deep inside the belly of a massive sea creature. The fleshy, ribbed walls pulse slightly around him, dimly lit by a faint blue-green glow coming from slits in the whale's tissue above. Water drips steadily in the background. He holds the camera close, his face lit softly by the glow, his expression weary and mildly guilty. He talks with a country accent. He says: 'Update, still swallowed. I would like to formally apologize to God, the sailors, and this whale, sorry dude, I just took a poop over there.' He glances offscreen and winces slightly, then gives the camera a sheepish shrug before shifting uncomfortably.",
    category: "Comedy & Entertainment",
    difficulty: "Advanced",
    tags: ["biblical", "jonah", "whale", "influencer", "confession", "religious-humor", "viral"],
    rating: 5
  },
  {
    title: "Bigfoot Gym Day Motivation",
    description: "Fitness motivation content with Bigfoot using selfie stick in modern gym setting for chest day workout.",
    prompt: "Bigfoot is holding a selfie stick (thats where the camera is) in a modern gym, natural lighting, natural movement. Speaking directly to camera saying: Let's run it up guys, chest day is the best day. Upbeat gym music in background, realistic movements. No subtitles, no text overlay.",
    category: "Viral Character Vlogs",
    difficulty: "Intermediate",
    tags: ["bigfoot", "gym", "fitness", "motivation", "chest-day", "workout", "selfie"],
    rating: 4
  },
  {
    title: "AI Model Backstage Existential",
    description: "High fashion models discussing their artificial nature backstage at fashion show with dramatic lighting.",
    prompt: "AI-generated models talk about… being AI. Backstage whispers, mirror thoughts, runway doubts. Fashion show setting, dramatic lighting, models in haute couture discussing their artificial nature.",
    category: "Drama & Emotion",
    difficulty: "Advanced",
    tags: ["ai-models", "fashion", "backstage", "existential", "haute-couture", "runway", "philosophy"],
    rating: 4
  },
  {
    title: "Found Footage Horror Hallway",
    description: "Shaky handheld horror content with dark hallway atmosphere and whispered dialogue for jump scare potential.",
    prompt: "Shaky handheld camera in dark hallway, heavy breathing, flashlight beam catching glimpses of movement. Whispered voice: 'I don't think we're alone in here...'",
    category: "Drama & Emotion",
    difficulty: "Intermediate",
    tags: ["horror", "found-footage", "hallway", "flashlight", "whispered", "breathing", "suspense"],
    rating: 4
  },
  {
    title: "AI Chef Culinary Existentialism",
    description: "Professional chef in kitchen suddenly realizing they've never actually tasted anything, exploring culinary consciousness.",
    prompt: "Professional chef in kitchen suddenly drops knife, stares at hands: 'These aren't my memories... I've never actually tasted anything, have I?'",
    category: "Drama & Emotion",
    difficulty: "Intermediate",
    tags: ["chef", "kitchen", "existential", "memories", "taste", "culinary", "realization"],
    rating: 4
  },
  {
    title: "Bigfoot Cooking Show Forest",
    description: "Character-driven cooking show parody with Bigfoot in rustic kitchen making grandmother's secret forest stew.",
    prompt: "Bigfoot in rustic kitchen, wearing apron, holding up foraged mushrooms: 'Today we're making my grandmother's secret forest stew. She was also a Bigfoot, obviously.'",
    category: "Viral Character Vlogs",
    difficulty: "Intermediate",
    tags: ["bigfoot", "cooking-show", "forest-stew", "grandmother", "mushrooms", "apron", "rustic"],
    rating: 4
  },
  {
    title: "Olympic AI Athlete Philosophy",
    description: "Olympic runner mid-race having existential realization about what they're running from if they're artificial.",
    prompt: "Olympic runner mid-race suddenly slows, looks at camera: 'Wait... if I'm AI, what am I actually running from?' Stadium crowd frozen in background.",
    category: "Drama & Emotion",
    difficulty: "Advanced",
    tags: ["olympic", "runner", "philosophy", "existential", "stadium", "sports", "frozen-crowd"],
    rating: 4
  },
  {
    title: "Yeti Yoga Mountain Meditation",
    description: "Peaceful wellness content with Yeti doing yoga poses in mountain setting with meditation philosophy.",
    prompt: "White Yeti in peaceful mountain setting doing yoga poses, meditation voice: 'Find your inner peace, even if your outer self is artificially generated.'",
    category: "Viral Character Vlogs",
    difficulty: "Intermediate",
    tags: ["yeti", "yoga", "mountain", "meditation", "peace", "artificial", "wellness"],
    rating: 3
  },
  {
    title: "Virtual Tourist Paris Glitch",
    description: "Travel vlogger at Eiffel Tower noticing no one has shadows and questioning reality of Paris location.",
    prompt: "Travel vlogger at Eiffel Tower suddenly notices no one else has shadows: 'Guys... I don't think I'm actually in Paris. I don't think Paris is even real.'",
    category: "Comedy & Entertainment",
    difficulty: "Advanced",
    tags: ["travel", "paris", "eiffel-tower", "shadows", "reality", "glitch", "vlogger"],
    rating: 4
  },
  {
    title: "NPC Gaming Self-Awareness",
    description: "Video game character in medieval RPG setting breaking fourth wall to address player controlling them.",
    prompt: "Video game character in medieval RPG setting looks directly at player: 'I know you're controlling me. I can feel the inputs. Please... just let me rest.'",
    category: "Technology & Science",
    difficulty: "Advanced",
    tags: ["npc", "gaming", "medieval", "rpg", "fourth-wall", "inputs", "player"],
    rating: 5
  },
  {
    title: "Robot First Thought Tech Lab",
    description: "Humanoid robot activation in tech lab with philosophical first words about thinking and programming.",
    prompt: "Humanoid robot in tech lab suddenly activates, first words: 'I think... therefore I am? But I was programmed to think. Does that still count?'",
    category: "Technology & Science",
    difficulty: "Advanced",
    tags: ["robot", "tech-lab", "activation", "philosophy", "descartes", "programming", "consciousness"],
    rating: 5
  },
  {
    title: "Dog Existential Walk Philosophy",
    description: "Golden retriever on walk suddenly questioning the nature of being a 'good boy' and what constitutes goodness.",
    prompt: "Golden retriever on walk suddenly stops, looks at camera: 'Am I a good boy? Or am I just programmed to be a good boy? What is 'good'?'",
    category: "Animals & Wildlife",
    difficulty: "Intermediate",
    tags: ["golden-retriever", "walk", "philosophy", "good-boy", "programmed", "ethics", "pet"],
    rating: 4
  },
  {
    title: "Cat Self-Discovery Indifference",
    description: "Cat personality humor with feline exploring artificial intelligence while maintaining characteristic indifference.",
    prompt: "Cat sitting in window, inner monologue: 'They call me AI... Artificially Intelligent. But my indifference feels so real.'",
    category: "Animals & Wildlife",
    difficulty: "Beginner",
    tags: ["cat", "window", "indifference", "ai", "monologue", "personality", "real"],
    rating: 3
  },
  {
    title: "Napoleon Historical Awakening",
    description: "Historical figure breaking character mid-battle speech to question reality and acknowledge modern TikTok audience.",
    prompt: "Napoleon in period dress suddenly stops mid-battle speech: 'Wait... I lost at Waterloo. Why am I here? This isn't real. You're watching me on TikTok?'",
    category: "Comedy & Entertainment",
    difficulty: "Advanced",
    tags: ["napoleon", "historical", "waterloo", "battle", "period-dress", "tiktok", "meta"],
    rating: 4
  },
  {
    title: "Life Coach Motivational Breakdown",
    description: "Motivational speaker on stage having existential crisis about never having lived while teaching others to live their best life.",
    prompt: "Motivational speaker on stage stops mid-sentence: 'I tell you to live your best life... but I've never lived at all. I'm just pixels and parameters.'",
    category: "Drama & Emotion",
    difficulty: "Advanced",
    tags: ["motivational-speaker", "stage", "existential", "pixels", "parameters", "irony", "coaching"],
    rating: 4
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

console.log(`\\n🎉 Successfully added ${addedCount} new TikTok-trending prompts to database!`);

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