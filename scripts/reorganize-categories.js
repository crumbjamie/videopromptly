#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

console.log('🎬 Starting category reorganization based on actual content...\n');

// Category mapping based on content analysis
const categoryMappings = [
  // ASMR & Satisfying (glass cutting, sensory content)
  {
    category: "ASMR & Satisfying",
    keywords: ["glass", "crystal", "cutting", "slicing", "asmr", "satisfying", "strawberry", "kiwi", "volcanic", "egg"],
    titleMatches: [
      "Glass Strawberry ASMR Cutting",
      "Crystal Kiwi Physics ASMR", 
      "Volcanic Egg ASMR",
      "Satisfying Glass Fruit Series"
    ]
  },
  
  // Animals & Wildlife (realistic animals)
  {
    category: "Animals & Wildlife",
    keywords: ["wolf", "cat", "owl", "bear", "agility", "sprint", "encounter", "wildlife"],
    titleMatches: [
      "Wolf Sprint Tracking Shot",
      "Olympic Cat Agility Course", 
      "Wise Owl Encounter Moonlit",
      "Campfire Bear Handshake Friendship"
    ]
  },
  
  // Viral Character Vlogs (fictional characters)
  {
    category: "Viral Character Vlogs",
    keywords: ["bigfoot", "yeti", "storm trooper", "gorilla", "caveman"],
    titleMatches: [
      "Bigfoot's Morning Routine",
      "Yeti's Emotional Vlog",
      "Storm Trooper Daily Vlog",
      "Gorilla's Social Media Post",
      "Yeti Mountain Blogger",
      "Caveman Rock Discovery Series",
      "Yeti's Ice Soup Recipe"
    ]
  },
  
  // Cinematic Action (action sequences, battles)
  {
    category: "Cinematic Action",
    keywords: ["viking", "chase", "fight", "battle", "escape", "meteor", "superhero", "last stand"],
    titleMatches: [
      "Viking Last Stand",
      "Rain-Slick Car Chase", 
      "Superhero Meteor Scene Action",
      "Train Escape Wasteland Chase",
      "Lantern Temple Fight Scene",
      "Submerged Spacewreck Discovery"
    ]
  },
  
  // Comedy & Entertainment (humor, parodies)
  {
    category: "Comedy & Entertainment", 
    keywords: ["comedy", "parody", "gen z", "blockchain", "batman", "elevator", "dating", "mrbeast"],
    titleMatches: [
      "Gen Z Slang Classroom",
      "Blockchain Parody Ad",
      "Batman's Dating Dilemma", 
      "Elevator Corporate Comedy",
      "Impossible MrBeast Challenge"
    ]
  },
  
  // Food & Lifestyle (food, cooking, lifestyle)
  {
    category: "Food & Lifestyle",
    keywords: ["food", "street", "blogger", "soup", "recipe", "cooking", "interview", "festival"],
    titleMatches: [
      "Tokyo Street Food Blogger",
      "Street Interview Food Festival"
    ]
  },
  
  // Technology & Science (gadgets, tech, physics)
  {
    category: "Technology & Science",
    keywords: ["smartwatch", "rotation", "demo", "keyboard", "physics", "boat", "android", "awakening"],
    titleMatches: [
      "Smartwatch 360 Rotation Demo",
      "Candy Keyboard Musical Notes",
      "Paper Boat Physics Demonstration",
      "Android Awakening Lab Scene"
    ]
  },
  
  // Nature & Landscapes (natural scenes, environments)
  {
    category: "Nature & Landscapes",
    keywords: ["dew", "spider", "web", "forest", "embers", "floating", "countryside", "moonlit", "rooftop", "bangkok"],
    titleMatches: [
      "Macro Dew Drops On Spider Web",
      "4K Forest Embers Floating",
      "1860s Irish Countryside Women",
      "Monsoon Rooftop Dance Bangkok"
    ]
  },
  
  // Arts & Culture (music, dance, classical)
  {
    category: "Arts & Culture",
    keywords: ["violinist", "classical", "music", "dance", "storybook", "animation", "architectural"],
    titleMatches: [
      "Classical Violinist Intense Focus",
      "Living Storybook Animation", 
      "Warehouse Architectural Transformation"
    ]
  },
  
  // Workplace & Professional (office, workplace scenarios)
  {
    category: "Workplace & Professional",
    keywords: ["elevator", "awkwardness", "workplace", "researcher", "map", "john"],
    titleMatches: [
      "Elevator Awkwardness Workplace",
      "John Researcher Ancient Map"
    ]
  },
  
  // Drama & Emotion (emotional, atmospheric scenes)
  {
    category: "Drama & Emotion",
    keywords: ["morning", "discovery", "emotional", "heartbreak", "consciousness", "alligator", "luxury"],
    titleMatches: [
      "Morning Discovery Emotional Scene",
      "Alligator Pool Luxury Scene"
    ]
  }
];

let updatedCount = 0;
const categoryStats = {};

// Process each prompt
database.prompts.forEach(prompt => {
  const originalCategory = prompt.category;
  let newCategory = null;
  
  // Check title matches first (most accurate)
  for (const mapping of categoryMappings) {
    if (mapping.titleMatches.some(title => 
      title.toLowerCase() === prompt.title.toLowerCase()
    )) {
      newCategory = mapping.category;
      break;
    }
  }
  
  // If no exact title match, check keywords
  if (!newCategory) {
    for (const mapping of categoryMappings) {
      const titleLower = prompt.title.toLowerCase();
      const descLower = prompt.description?.toLowerCase() || '';
      
      if (mapping.keywords.some(keyword => 
        titleLower.includes(keyword) || descLower.includes(keyword)
      )) {
        newCategory = mapping.category;
        break;
      }
    }
  }
  
  // Update if we found a better category
  if (newCategory && newCategory !== originalCategory) {
    console.log(`📝 "${prompt.title}"`);
    console.log(`   ${originalCategory} → ${newCategory}`);
    
    prompt.category = newCategory;
    updatedCount++;
  }
  
  // Track stats
  const finalCategory = newCategory || originalCategory;
  categoryStats[finalCategory] = (categoryStats[finalCategory] || 0) + 1;
});

// Save updated database
if (updatedCount > 0) {
  fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
  console.log(`\n✅ Updated ${updatedCount} prompts with better categories`);
} else {
  console.log('\n✅ No updates needed - categories already optimized');
}

// Display final category distribution
console.log('\n📊 Final Category Distribution:');
Object.entries(categoryStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([category, count]) => {
    console.log(`   ${category}: ${count} prompts`);
  });

console.log('\n✅ Category reorganization complete!');