const fs = require('fs');
const path = require('path');

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Get 5-star prompts for reference
const fiveStarPrompts = data.prompts.filter(p => p.rating === 5);

console.log('🎬 Video Organization Guide for Downloaded Kie.ai Videos');
console.log('=====================================================\n');

console.log('📋 5-Star Prompts that were generated:');
console.log('--------------------------------------');

fiveStarPrompts.forEach((prompt, index) => {
  console.log(`${index + 1}. ID: ${prompt.id} - "${prompt.title}"`);
  console.log(`   Expected filename: ${prompt.slug}.mp4`);
  console.log(`   Target location: /public/videos/${prompt.slug}.mp4`);
  console.log(`   Prompt: ${prompt.prompt.substring(0, 60)}...`);
  console.log('');
});

console.log('📁 Manual Organization Steps:');
console.log('-----------------------------');
console.log('1. Go to https://kie.ai and download all your generated videos');
console.log('2. Create a folder: /Users/jamie/Downloads/veo3-videos/');
console.log('3. Move all downloaded videos to that folder');
console.log('4. Rename each video to match the expected filename above');
console.log('5. Run the organization script below');
console.log('');

console.log('🔧 Auto-Organization Script:');
console.log('----------------------------');

// Create the organization script
const organizationScript = `
# VideoPromptly Video Organization Script
# Run this after downloading videos from Kie.ai

DOWNLOAD_DIR="/Users/jamie/Downloads/veo3-videos"
TARGET_DIR="/Users/jamie/Documents/GitHub/videopromptly/public/videos"

echo "🎬 Organizing Kie.ai videos for VideoPromptly..."

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Check if download directory exists
if [ ! -d "$DOWNLOAD_DIR" ]; then
    echo "❌ Download directory not found: $DOWNLOAD_DIR"
    echo "   Please create it and add your downloaded videos"
    exit 1
fi

echo "📁 Moving videos from $DOWNLOAD_DIR to $TARGET_DIR"

# Copy videos with expected filenames
${fiveStarPrompts.map(prompt => 
  `# ${prompt.title}\nif [ -f "$DOWNLOAD_DIR/${prompt.slug}.mp4" ]; then\n    cp "$DOWNLOAD_DIR/${prompt.slug}.mp4" "$TARGET_DIR/"\n    echo "✅ Copied: ${prompt.slug}.mp4"\nelse\n    echo "⚠️  Missing: ${prompt.slug}.mp4 (${prompt.title})"\nfi`
).join('\n\n')}

echo ""
echo "📊 Organization complete!"
echo "🔍 Checking what videos are now available:"
ls -la "$TARGET_DIR"/*.mp4 2>/dev/null || echo "No .mp4 files found in target directory"
`;

// Write the shell script
fs.writeFileSync(path.join(__dirname, 'organize-videos.sh'), organizationScript);
console.log('💾 Created script: scripts/organize-videos.sh');
console.log('');

console.log('🚀 Quick Setup Commands:');
console.log('------------------------');
console.log('mkdir -p /Users/jamie/Downloads/veo3-videos');
console.log('chmod +x scripts/organize-videos.sh');
console.log('./scripts/organize-videos.sh');
console.log('');

console.log('📝 After organizing videos, update the database:');
console.log('node scripts/update-video-urls.js');
console.log('');

// Create database update script
const updateScript = `const fs = require('fs');
const path = require('path');

const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
const videosDir = path.join(__dirname, '../public/videos');

console.log('🎬 Updating video URLs in database...');

let updatedCount = 0;
const fiveStarIds = [${fiveStarPrompts.map(p => `"${p.id}"`).join(', ')}];

data.prompts.forEach(prompt => {
  if (fiveStarIds.includes(prompt.id)) {
    const videoPath = path.join(videosDir, \`\${prompt.slug}.mp4\`);
    
    if (fs.existsSync(videoPath)) {
      prompt.videoUrl = \`/videos/\${prompt.slug}.mp4\`;
      console.log(\`✅ Updated: \${prompt.title}\`);
      updatedCount++;
    } else {
      console.log(\`⚠️  Missing video: \${prompt.slug}.mp4 (\${prompt.title})\`);
    }
  }
});

fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
console.log(\`\\n💾 Updated \${updatedCount} prompts with video URLs\`);
`;

fs.writeFileSync(path.join(__dirname, 'update-video-urls.js'), updateScript);
console.log('💾 Created script: scripts/update-video-urls.js');
console.log('');

console.log('🎯 Summary of generated 5-star prompts:');
console.log(`   • Total: ${fiveStarPrompts.length} videos`);
console.log(`   • Categories: ${[...new Set(fiveStarPrompts.map(p => p.category))].length} different types`);
console.log(`   • Cost: ~$${(fiveStarPrompts.length * 0.40).toFixed(2)} (fast mode)`);
console.log('');

console.log('🔗 Next: Visit https://kie.ai to download your generated videos!');