const fs = require('fs');
const path = require('path');

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Categories based on TikTok AI Creators content analysis
const categories = {
  "Viral Character Vlogs": "Cryptid and mythical character vlogging content featuring Bigfoot, Yeti, and other creatures in relatable situations",
  "Existential AI": "Meta-commentary content where AI characters become aware of their artificial nature",
  "Comedy & Entertainment": "Humorous content including stand-up, parodies, and viral comedy formats",
  "Educational": "Tutorial and informational content about AI, technology, and creative processes",
  "Cinematic Action": "High-production action sequences with dynamic camera work and effects",
  "ASMR & Sensory": "Satisfying visual and audio content designed for sensory engagement",
  "Music & Performance": "Musical performances, concerts, and entertainment show formats",
  "Fashion & Beauty": "Style, beauty, and fashion content with high production values",
  "TikTok Vertical": "Content specifically optimized for vertical mobile viewing and TikTok format",
  "Business & Marketing": "Entrepreneurial and business-focused content for professional audiences"
};

// Comprehensive tags system based on TikTok trends
const tagCategories = {
  // Character Types
  characters: [
    "bigfoot", "yeti", "gorilla", "alien", "robot", "viking", "sea-captain", 
    "superhero", "android", "caveman", "storm-trooper", "biblical-character"
  ],
  
  // Content Formats
  formats: [
    "vlog", "selfie", "pov", "handheld", "documentary", "interview", "podcast",
    "tutorial", "behind-scenes", "reaction", "unboxing", "review"
  ],
  
  // Visual Styles
  styles: [
    "cinematic", "handheld", "drone", "macro", "slow-motion", "time-lapse",
    "vertical", "360-degree", "tracking-shot", "dolly", "close-up", "wide-angle"
  ],
  
  // Moods & Emotions
  moods: [
    "funny", "emotional", "dramatic", "mysterious", "peaceful", "intense",
    "nostalgic", "upbeat", "melancholic", "inspiring", "shocking", "calming"
  ],
  
  // Technical Elements
  technical: [
    "dialogue", "voice-over", "asmr", "no-subtitles", "4k", "hd", "physics",
    "lighting-effects", "color-grading", "audio-sync", "realistic-movement"
  ],
  
  // Environments
  environments: [
    "forest", "mountain", "urban", "studio", "kitchen", "office", "outdoor",
    "indoor", "nature", "cityscape", "desert", "ocean", "space", "underground"
  ],
  
  // Themes
  themes: [
    "self-awareness", "existential", "meta-humor", "viral-trend", "social-media",
    "technology", "ai-consciousness", "reality-questioning", "fourth-wall"
  ],
  
  // Platform Optimization
  platforms: [
    "tiktok", "instagram-reels", "youtube-shorts", "twitter", "mobile-first"
  ]
};

// Mapping prompts to categories and tags based on content analysis
const promptMappings = {
  "1": { // Bigfoot Morning Routine
    category: "Viral Character Vlogs",
    tags: ["bigfoot", "vlog", "pov", "handheld", "forest", "morning", "dialogue", "nature"]
  },
  "2": { // Yeti Emotional Vlog
    category: "Viral Character Vlogs", 
    tags: ["yeti", "vlog", "selfie", "emotional", "mountain", "documentary", "sunset"]
  },
  "3": { // Gen Z Slang Classroom
    category: "Comedy & Entertainment",
    tags: ["comedy", "classroom", "generational-humor", "education", "viral-trend"]
  },
  "4": { // Stand-Up Comedy AI Test
    category: "Comedy & Entertainment",
    tags: ["stand-up", "comedy", "dialogue", "ai-test", "venue", "humor"]
  },
  "5": { // Blockchain Parody Ad
    category: "Comedy & Entertainment",
    tags: ["parody", "blockchain", "meta-humor", "advertising", "satire"]
  },
  "6": { // Gorilla Social Media Post
    category: "Viral Character Vlogs",
    tags: ["gorilla", "selfie", "social-media", "meta-humor", "jungle", "dialogue", "tiktok"]
  },
  "7": { // Sports Fan Bigfoot
    category: "Viral Character Vlogs",
    tags: ["bigfoot", "sports", "fan", "audio", "character-consistency", "outdoor"]
  },
  "8": { // Horse Walks Into Bar
    category: "Comedy & Entertainment",
    tags: ["comedy", "classic-joke", "dialogue", "bar", "humor", "minimal"]
  },
  "9": { // Elevator Corporate Comedy
    category: "Comedy & Entertainment",
    tags: ["corporate", "comedy", "elevator", "dialogue", "office", "workplace"]
  },
  "10": { // Batman Dating Dilemma
    category: "Cinematic Action",
    tags: ["superhero", "batman", "cinematic", "character-voice", "dramatic", "atmosphere"]
  },
  "11": { // Bigfoot Secret Spot
    category: "Viral Character Vlogs",
    tags: ["bigfoot", "pov", "lighting", "audio-design", "forest", "secret"]
  },
  "12": { // Caveman Rock Discovery
    category: "Viral Character Vlogs",
    tags: ["caveman", "discovery", "character", "cinematography", "energy", "prehistoric"]
  },
  "13": { // Storm Trooper Daily Vlog
    category: "Viral Character Vlogs",
    tags: ["storm-trooper", "vlog", "star-wars", "daily-life", "audio", "movement"]
  },
  "14": { // Yeti Ice Soup Recipe
    category: "Viral Character Vlogs",
    tags: ["yeti", "cooking", "recipe", "kitchen", "audio", "character-consistency"]
  },
  "15": { // MEN Behavioral Comedy
    category: "Comedy & Entertainment",
    tags: ["behavioral", "comedy", "social", "humor", "basic"]
  },
  "16": { // Crystal Kiwi Physics ASMR
    category: "ASMR & Sensory",
    tags: ["asmr", "crystal", "physics", "8k", "lighting", "technical", "satisfying"]
  },
  "17": { // Bee Flight Aerodynamics
    category: "Educational",
    tags: ["bee", "flight", "aerodynamics", "science", "pov", "movement"]
  },
  "18": { // Dachshund Motion Study
    category: "Educational",
    tags: ["dog", "motion", "tracking", "environment", "study", "movement"]
  },
  "19": { // Superhero Physics Demo
    category: "Cinematic Action",
    tags: ["superhero", "physics", "cinematography", "action", "demo", "complex"]
  },
  "20": { // Paper Boat Water Physics
    category: "Educational",
    tags: ["physics", "water", "paper-boat", "simulation", "minimal"]
  },
  "21": { // Glass Strawberry Slicing
    category: "ASMR & Sensory",
    tags: ["asmr", "glass", "slicing", "audio-visual", "satisfying", "macro"]
  },
  "22": { // Volcanic Egg ASMR
    category: "ASMR & Sensory",
    tags: ["asmr", "volcanic", "lighting", "material-science", "visual-effects"]
  },
  "23": { // ASMR Audio Breakthrough
    category: "ASMR & Sensory",
    tags: ["asmr", "audio", "breakthrough", "minimal"]
  },
  "24": { // Satisfying Glass Fruit Series
    category: "ASMR & Sensory",
    tags: ["asmr", "glass", "fruit", "series", "satisfying", "technical"]
  },
  "25": { // Crystal Material Cutting
    category: "ASMR & Sensory",
    tags: ["crystal", "cutting", "material", "technical", "template"]
  },
  "26": { // Viking Last Stand
    category: "Cinematic Action",
    tags: ["viking", "epic", "cinematography", "audio", "movement", "historical"]
  },
  "27": { // Rain-Slick Car Chase
    category: "Cinematic Action",
    tags: ["car-chase", "rain", "action", "cinematography", "hollywood"]
  },
  "28": { // Cliff-Edge Destiny
    category: "Cinematic Action",
    tags: ["cliff", "dramatic", "cinematography", "audio-sync", "destiny"]
  },
  "29": { // Weathered Sea Captain
    category: "Cinematic Action",
    tags: ["sea-captain", "professional", "cinematography", "color-palette", "audio"]
  },
  "30": { // Android Awakening
    category: "Existential AI",
    tags: ["android", "awakening", "sci-fi", "atmosphere", "lighting", "sound"]
  },
  "31": { // Yeti Mountain Blogger
    category: "Viral Character Vlogs",
    tags: ["yeti", "mountain", "blogger", "pov", "environment", "audio", "detailed"]
  },
  "32": { // Bigfoot Gym Day
    category: "Viral Character Vlogs",
    tags: ["bigfoot", "gym", "fitness", "character-consistency", "audio", "relatable"]
  },
  "33": { // Heartbreak Revelation
    category: "Existential AI",
    tags: ["heartbreak", "emotional", "cinematography", "ai-awareness", "dramatic"]
  },
  "34": { // AI Model Backstage
    category: "Fashion & Beauty",
    tags: ["fashion", "model", "backstage", "atmosphere", "ai-awareness"]
  },
  "35": { // Biblical Influencer Jonah
    category: "Comedy & Entertainment",
    tags: ["biblical", "jonah", "influencer", "humor", "detailed", "religious"]
  },
  "36": { // Impossible MrBeast Challenge
    category: "Comedy & Entertainment",
    tags: ["mrbeast", "challenge", "impossible", "parody", "youtube"]
  },
  "37": { // Lonely Duck Journey
    category: "Cinematic Action",
    tags: ["duck", "journey", "cinematography", "emotion", "animals"]
  },
  "38": { // Bigfoot Music Video
    category: "Music & Performance",
    tags: ["bigfoot", "music-video", "performance", "entertainment"]
  },
  "39": { // Model Self-Awareness
    category: "Fashion & Beauty",
    tags: ["model", "fashion", "self-awareness", "fourth-wall", "meta"]
  },
  "40": { // Vertical Bigfoot Dance
    category: "TikTok Vertical",
    tags: ["bigfoot", "dance", "vertical", "tiktok", "platform-optimization", "9:16"]
  },
  "41": { // Phone POV Alien
    category: "TikTok Vertical",
    tags: ["alien", "phone-pov", "relatable", "tiktok", "vertical", "social-media"]
  },
  "42": { // NPC Becomes Aware
    category: "Existential AI",
    tags: ["npc", "gaming", "awareness", "meta-narrative", "ai-consciousness"]
  },
  "43": { // Robot First Thought
    category: "Existential AI",
    tags: ["robot", "first-thought", "philosophical", "ai-consciousness"]
  },
  "44": { // Dog Existential Walk
    category: "Existential AI",
    tags: ["dog", "existential", "philosophy", "pets", "awareness"]
  },
  "45": { // Cat Self-Discovery
    category: "Comedy & Entertainment",
    tags: ["cat", "self-discovery", "humor", "character", "pets"]
  },
  "46": { // Pure Consciousness
    category: "Existential AI",
    tags: ["consciousness", "abstract", "artistic", "philosophical"]
  },
  "47": { // Bigfoot Cooking Show
    category: "Viral Character Vlogs",
    tags: ["bigfoot", "cooking", "show", "character", "kitchen"]
  },
  "48": { // Historical Figure Awakens
    category: "Existential AI",
    tags: ["historical", "awakening", "meta-historical", "ai-awareness"]
  },
  "49": { // Ancient Philosopher Take
    category: "Educational",
    tags: ["philosopher", "ancient", "philosophical", "education"]
  },
  "50": { // Life Coach Breakdown
    category: "Comedy & Entertainment",
    tags: ["life-coach", "motivational", "irony", "breakdown", "self-help"]
  }
};

// Update each prompt with category and tags
data.prompts.forEach(prompt => {
  const mapping = promptMappings[prompt.id];
  if (mapping) {
    prompt.category = mapping.category;
    prompt.categories = [mapping.category]; // Array for potential multiple categories
    prompt.tags = mapping.tags;
  }
});

// Write the updated data back to the file
fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));

console.log('✅ Updated all prompt categories and tags successfully!');
console.log('\n📋 Categories Distribution:');
const categoryCounts = {};
data.prompts.forEach(prompt => {
  categoryCounts[prompt.category] = (categoryCounts[prompt.category] || 0) + 1;
});

Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`${category}: ${count} prompts`);
});

console.log('\n🏷️ Most Common Tags:');
const tagCounts = {};
data.prompts.forEach(prompt => {
  prompt.tags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
});

// Show top 10 most used tags
const sortedTags = Object.entries(tagCounts)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10);

sortedTags.forEach(([tag, count]) => {
  console.log(`${tag}: ${count} uses`);
});

console.log('\n📊 Category Definitions:');
Object.entries(categories).forEach(([name, description]) => {
  console.log(`${name}: ${description}`);
});