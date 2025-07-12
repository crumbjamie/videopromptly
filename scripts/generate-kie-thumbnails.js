const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const KIE_API_URL = 'https://kie.ai/api/v3/generate';
const KIE_API_KEY = process.env.KIE_API_KEY; // Set this in your environment

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Function to make API request to Kie.ai
async function generateKieThumbnail(prompt, promptId) {
  return new Promise((resolve, reject) => {
    if (!KIE_API_KEY) {
      reject(new Error('KIE_API_KEY environment variable not set'));
      return;
    }

    const postData = JSON.stringify({
      prompt: prompt,
      aspect_ratio: '16:9',
      style: 'photographic', // or 'artistic', 'anime', etc.
      quality: 'high',
      size: '1024x576' // 16:9 aspect ratio
    });

    const options = {
      hostname: 'kie.ai',
      port: 443,
      path: '/api/v3/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 200 && response.success) {
            console.log(`✅ Generated thumbnail for prompt ${promptId}: ${response.image_url}`);
            resolve(response.image_url);
          } else {
            console.error(`❌ Failed to generate thumbnail for prompt ${promptId}:`, response.error || response);
            reject(new Error(response.error || 'Unknown API error'));
          }
        } catch (error) {
          console.error(`❌ Failed to parse response for prompt ${promptId}:`, error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Request error for prompt ${promptId}:`, error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Function to download image from URL
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`📥 Downloaded: ${filename}`);
          resolve(filename);
        });
        
        file.on('error', (err) => {
          fs.unlink(filename, () => {}); // Delete incomplete file
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download image: HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to create thumbnail prompt from video prompt
function createThumbnailPrompt(videoPrompt) {
  // Extract key visual elements and convert to static image description
  let thumbnailPrompt = videoPrompt.prompt
    // Remove camera movement instructions
    .replace(/camera\s+(moves|tracks|follows|circles|zooms|dollies|pans)[^,.]*/gi, '')
    .replace(/POV\s+/gi, '')
    .replace(/handheld\s+/gi, '')
    .replace(/selfie-style\s+/gi, '')
    
    // Remove audio instructions
    .replace(/audio[^,.]*[,.]?/gi, '')
    .replace(/sound[s]?[^,.]*[,.]?/gi, '')
    .replace(/music[^,.]*[,.]?/gi, '')
    .replace(/no subtitles[^,.]*[,.]?/gi, '')
    
    // Remove dialogue
    .replace(/saying[^'"]*['"][^'"]*['"][^,.]*[,.]?/gi, '')
    .replace(/speaks?[^,.]*[,.]?/gi, '')
    
    // Focus on key visual elements
    .replace(/\s+/g, ' ')
    .trim();

  // Add static image modifiers
  thumbnailPrompt = `${thumbnailPrompt}, professional movie poster style, dramatic lighting, high quality, cinematic composition, 16:9 aspect ratio`;
  
  return thumbnailPrompt;
}

// Main function to generate thumbnails for specific prompts
async function generateThumbnailsForPrompts(promptIds) {
  console.log(`🎬 Starting thumbnail generation for ${promptIds.length} prompts...`);
  
  // Ensure thumbnails directory exists
  const thumbnailsDir = path.join(__dirname, '../public/thumbnails');
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;

  for (const promptId of promptIds) {
    const prompt = data.prompts.find(p => p.id === promptId);
    
    if (!prompt) {
      console.log(`⚠️  Prompt with ID ${promptId} not found`);
      continue;
    }

    try {
      console.log(`\n🎨 Processing: "${prompt.title}" (ID: ${promptId})`);
      
      // Create thumbnail-optimized prompt
      const thumbnailPrompt = createThumbnailPrompt(prompt);
      console.log(`📝 Thumbnail prompt: ${thumbnailPrompt.substring(0, 100)}...`);
      
      // Generate with Kie.ai
      const imageUrl = await generateKieThumbnail(thumbnailPrompt, promptId);
      
      // Download the image
      const filename = path.join(thumbnailsDir, `${prompt.slug}.jpg`);
      await downloadImage(imageUrl, filename);
      
      // Update prompt with thumbnail URL
      prompt.thumbnailUrl = `/thumbnails/${prompt.slug}.jpg`;
      
      successCount++;
      
      // Rate limiting - wait 2 seconds between requests
      if (promptIds.indexOf(promptId) < promptIds.length - 1) {
        console.log('⏱️  Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`❌ Error processing prompt ${promptId}:`, error.message);
      errorCount++;
    }
  }

  // Save updated prompts data
  if (successCount > 0) {
    fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
    console.log(`\n💾 Updated prompts.json with ${successCount} new thumbnails`);
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Successfully generated: ${successCount} thumbnails`);
  console.log(`❌ Failed: ${errorCount} thumbnails`);
  
  if (!KIE_API_KEY) {
    console.log(`\n⚠️  Note: Set KIE_API_KEY environment variable to use this script`);
    console.log(`   export KIE_API_KEY="your-api-key-here"`);
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage: node generate-kie-thumbnails.js <prompt-ids>

Examples:
  node generate-kie-thumbnails.js 1 2 3
  node generate-kie-thumbnails.js 1,2,3
  node generate-kie-thumbnails.js all

Environment variables required:
  KIE_API_KEY - Your Kie.ai API key

Available prompts:
${data.prompts.map(p => `  ${p.id}: ${p.title}`).join('\n')}
`);
    process.exit(1);
  }

  let promptIds = [];
  
  if (args[0] === 'all') {
    promptIds = data.prompts.map(p => p.id);
  } else {
    // Parse comma-separated or space-separated IDs
    promptIds = args.join(' ').split(/[,\s]+/).filter(id => id.trim());
  }

  generateThumbnailsForPrompts(promptIds).catch(console.error);
}

module.exports = { generateThumbnailsForPrompts, createThumbnailPrompt };