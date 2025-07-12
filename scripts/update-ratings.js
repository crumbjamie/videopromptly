const fs = require('fs');
const path = require('path');

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Rating criteria based on prompt quality, length, detail, and technical sophistication
const ratings = {
  "1": 4,   // Bigfoot Morning Routine - Excellent detail, POV, audio, character-driven (4★)
  "2": 3,   // Yeti Emotional Vlog - Good structure, lighting, emotion (3★)  
  "3": 2,   // Gen Z Slang Classroom - Simple but effective concept (2★)
  "4": 2,   // Stand-Up Comedy AI Test - Very basic prompt (2★)
  "5": 3,   // Blockchain Parody Ad - Creative meta concept (3★)
  "6": 5,   // Gorilla Social Media Post - Masterclass: detailed POV, character, dialogue, movement (5★)
  "7": 3,   // Sports Fan Bigfoot - Good character consistency with audio (3★)
  "8": 1,   // Horse Walks Into Bar - Extremely minimal prompt (1★)
  "9": 5,   // Elevator Corporate Comedy - Perfect scene setting, dialogue, character detail (5★)
  "10": 5,  // Batman Dating Dilemma - Cinematic excellence, character voice, atmosphere (5★)
  "11": 4,  // Bigfoot Secret Spot - Excellent POV, lighting, audio design (4★)
  "12": 5,  // Caveman Rock Discovery - Ultra-detailed character, cinematography, energy (5★)
  "13": 4,  // Storm Trooper Daily Vlog - Good technical detail, audio, movement (4★)
  "14": 4,  // Yeti Ice Soup Recipe - Excellent setting, audio, character consistency (4★)
  "15": 2,  // MEN Behavioral Comedy - Basic concept prompt (2★)
  "16": 5,  // Crystal Kiwi Physics ASMR - Technical masterpiece: 8K, lighting, physics (5★)
  "17": 2,  // Bee Flight Aerodynamics - Simple but effective concept (2★)
  "18": 3,  // Dachshund Motion Study - Good movement tracking, environment (3★)
  "19": 5,  // Superhero Physics Demo - Complex physics, cinematography, action (5★)
  "20": 1,  // Paper Boat Water Physics - Extremely minimal prompt (1★)
  "21": 5,  // Glass Strawberry Slicing - Perfect ASMR technical detail, audio-visual sync (5★)
  "22": 4,  // Volcanic Egg ASMR - Excellent visual effects, lighting, material science (4★)
  "23": 2,  // ASMR Audio Breakthrough - Undisclosed prompt, minimal detail (2★)
  "24": 5,  // Satisfying Glass Fruit Series - Masterclass ASMR prompt with technical precision (5★)
  "25": 4,  // Crystal Material Cutting - Good template with technical detail (4★)
  "26": 5,  // Viking Last Stand - Epic cinematography, audio, movement (5★)
  "27": 5,  // Rain-Slick Car Chase - Hollywood-level action cinematography (5★)
  "28": 5,  // Cliff-Edge Destiny - Dramatic cinematography, audio synchronization (5★)
  "29": 5,  // Weathered Sea Captain - Professional cinematography, color palette, audio (5★)
  "30": 4,  // Android Awakening - Good sci-fi atmosphere, lighting, sound (4★)
  "31": 5,  // Yeti Mountain Blogger - Ultra-detailed POV, environment, audio (5★)
  "32": 3,  // Bigfoot Gym Day - Good character consistency, audio (3★)
  "33": 4,  // Heartbreak Revelation - Excellent emotional depth, cinematography (4★)
  "34": 3,  // AI Model Backstage - Good fashion concept, atmosphere (3★)
  "35": 5,  // Biblical Influencer Jonah - Masterclass: detailed setting, character, humor (5★)
  "36": 4,  // Impossible MrBeast Challenge - Creative concept with visual elements (4★)
  "37": 3,  // Lonely Duck Journey - Good cinematography, emotion (3★)
  "38": 3,  // Bigfoot Music Video - Good performance concept (3★)
  "39": 3,  // Model Self-Awareness - Good fashion fourth-wall concept (3★)
  "40": 4,  // Vertical Bigfoot Dance - Excellent platform optimization detail (4★)
  "41": 3,  // Phone POV Alien - Good character concept, relatable (3★)
  "42": 3,  // NPC Becomes Aware - Good gaming meta-narrative (3★)
  "43": 3,  // Robot First Thought - Good philosophical concept (3★)
  "44": 3,  // Dog Existential Walk - Good pet philosophy concept (3★)
  "45": 3,  // Cat Self-Discovery - Good character humor (3★)
  "46": 4,  // Pure Consciousness - Excellent abstract artistic concept (4★)
  "47": 3,  // Bigfoot Cooking Show - Good character cooking concept (3★)
  "48": 3,  // Historical Figure Awakens - Good meta-historical concept (3★)
  "49": 3,  // Ancient Philosopher Take - Good philosophical concept (3★)
  "50": 3   // Life Coach Breakdown - Good motivational irony concept (3★)
};

// Update ratings in the data
data.prompts.forEach(prompt => {
  if (ratings[prompt.id]) {
    prompt.rating = ratings[prompt.id];
    prompt.ratingCount = 1; // Set to 1 to indicate it's been rated
  }
});

// Write the updated data back to the file
fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));

console.log('✅ Updated all prompt ratings successfully!');
console.log('\n📊 Rating Distribution:');
const ratingCounts = {};
data.prompts.forEach(prompt => {
  ratingCounts[prompt.rating] = (ratingCounts[prompt.rating] || 0) + 1;
});

for (let i = 1; i <= 5; i++) {
  const count = ratingCounts[i] || 0;
  const stars = '⭐'.repeat(i);
  console.log(`${stars} (${i} star): ${count} prompts`);
}