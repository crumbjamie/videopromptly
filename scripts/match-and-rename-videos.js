const fs = require('fs');
const path = require('path');

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

const videosDir = path.join(__dirname, '../public/videos');

// Mapping of current filenames to expected slugs
const videoMappings = [
  {
    current: "Batman's Dating Dilemma.mp4",
    expected: "batman-dating-dilemma.mp4",
    promptId: "10",
    title: "Batman's Dating Dilemma"
  },
  {
    current: "Caveman Rock Discovery Series.mp4", 
    expected: "caveman-rock-discovery.mp4",
    promptId: "12",
    title: "Caveman Rock Discovery Series"
  },
  {
    current: "Cliff-Edge Destiny.mp4",
    expected: "cliff-edge-destiny.mp4", 
    promptId: "28",
    title: "Cliff-Edge Destiny"
  },
  {
    current: "Crystal Kiwi Physics ASMR.mp4",
    expected: "crystal-kiwi-physics-asmr.mp4",
    promptId: "16", 
    title: "Crystal Kiwi Physics ASMR"
  },
  {
    current: "Elevator Corporate Comedy.mp4",
    expected: "elevator-corporate-comedy.mp4",
    promptId: "9",
    title: "Elevator Corporate Comedy"
  },
  {
    current: "Glass Strawberry Slicing.mp4",
    expected: "glass-strawberry-slicing.mp4",
    promptId: "21",
    title: "Glass Strawberry Slicing"
  },
  {
    current: "Gorilla's Social Media Post.mp4",
    expected: "gorilla-social-media-post.mp4", 
    promptId: "6",
    title: "Gorilla's Social Media Post"
  },
  {
    current: "Rain-Slick Car Chase.mp4",
    expected: "rain-slick-car-chase.mp4",
    promptId: "27",
    title: "Rain-Slick Car Chase"
  },
  {
    current: "Satisfying Glass Fruit Series.mp4",
    expected: "satisfying-glass-fruit-series.mp4",
    promptId: "24", 
    title: "Satisfying Glass Fruit Series"
  },
  {
    current: "Superhero Physics Demo.mp4",
    expected: "superhero-physics-demo.mp4",
    promptId: "19",
    title: "Superhero Physics Demo"
  },
  {
    current: "Viking Last Stand.mp4",
    expected: "viking-last-stand.mp4",
    promptId: "26",
    title: "Viking Last Stand"
  },
  {
    current: "Weathered Sea Captain.mp4",
    expected: "weathered-sea-captain.mp4", 
    promptId: "29",
    title: "Weathered Sea Captain"
  },
  {
    current: "Yeti Mountain Blogger.mp4",
    expected: "yeti-mountain-blogger.mp4",
    promptId: "31",
    title: "Yeti Mountain Blogger"
  },
  {
    current: "bigfoots-morning-routine.mp4",
    expected: "bigfoot-morning-routine.mp4", // Fix hyphen
    promptId: "1",
    title: "Bigfoot's Morning Routine"
  }
];

console.log('🎬 Video Matching and Renaming Tool');
console.log('=====================================\n');

let renamedCount = 0;
let updatedPrompts = 0;
let alreadyCorrect = 0;

console.log('📋 Processing videos...\n');

videoMappings.forEach((mapping, index) => {
  const currentPath = path.join(videosDir, mapping.current);
  const expectedPath = path.join(videosDir, mapping.expected);
  
  console.log(`${index + 1}. ${mapping.title} (ID: ${mapping.promptId})`);
  
  // Check if current file exists
  if (fs.existsSync(currentPath)) {
    if (mapping.current === mapping.expected) {
      console.log(`   ✅ Already correctly named: ${mapping.expected}`);
      alreadyCorrect++;
    } else {
      try {
        // Rename the file
        fs.renameSync(currentPath, expectedPath);
        console.log(`   🔄 Renamed: ${mapping.current} → ${mapping.expected}`);
        renamedCount++;
      } catch (error) {
        console.log(`   ❌ Failed to rename: ${error.message}`);
        return;
      }
    }
    
    // Update the prompt in the database
    const prompt = data.prompts.find(p => p.id === mapping.promptId);
    if (prompt) {
      prompt.videoUrl = `/videos/${mapping.expected}`;
      console.log(`   💾 Updated database entry`);
      updatedPrompts++;
    } else {
      console.log(`   ⚠️  Prompt ID ${mapping.promptId} not found in database`);
    }
  } else {
    console.log(`   ⚠️  File not found: ${mapping.current}`);
  }
  
  console.log('');
});

// Save the updated database
if (updatedPrompts > 0) {
  fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
  console.log(`💾 Database updated with ${updatedPrompts} video URLs!\n`);
}

// Summary
console.log('📊 Summary:');
console.log(`   ✅ Already correct: ${alreadyCorrect} videos`);
console.log(`   🔄 Renamed: ${renamedCount} videos`);
console.log(`   💾 Database updated: ${updatedPrompts} prompts`);
console.log('');

// Check for missing 5-star videos
const fiveStarPrompts = data.prompts.filter(p => p.rating === 5);
const foundVideoIds = videoMappings.map(m => m.promptId);
const missingVideos = fiveStarPrompts.filter(p => !foundVideoIds.includes(p.id));

if (missingVideos.length > 0) {
  console.log('📋 Missing 5-star videos:');
  missingVideos.forEach(prompt => {
    console.log(`   ${prompt.id}: ${prompt.title}`);
    console.log(`      Expected: ${prompt.slug}.mp4`);
  });
  console.log('');
}

// List all current videos
console.log('📂 Current videos in /public/videos/:');
const currentVideos = fs.readdirSync(videosDir)
  .filter(file => file.endsWith('.mp4'))
  .sort();

currentVideos.forEach(video => {
  const matchedPrompt = data.prompts.find(p => p.videoUrl === `/videos/${video}`);
  if (matchedPrompt) {
    console.log(`   ✅ ${video} → "${matchedPrompt.title}" (${matchedPrompt.rating}⭐)`);
  } else {
    console.log(`   ❓ ${video} → No database match`);
  }
});

console.log(`\n🎯 Total videos: ${currentVideos.length}`);
const fiveStarWithVideos = fiveStarPrompts.filter(p => p.videoUrl).length;
console.log(`🌟 5-star videos: ${fiveStarWithVideos}/${fiveStarPrompts.length}`);

if (fiveStarWithVideos === fiveStarPrompts.length) {
  console.log('🎉 All 5-star prompts now have videos!');
} else {
  console.log(`📥 Still need ${fiveStarPrompts.length - fiveStarWithVideos} more 5-star videos`);
}