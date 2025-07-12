const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Function to download video from URL
async function downloadVideo(videoUrl, filename) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading video from: ${videoUrl}`);
    console.log(`💾 Saving as: ${path.basename(filename)}`);
    
    const file = fs.createWriteStream(filename);
    
    https.get(videoUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`✅ Download completed!`);
          resolve(filename);
        });
        
        file.on('error', (err) => {
          fs.unlink(filename, () => {});
          reject(err);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.log(`🔄 Following redirect to: ${redirectUrl}`);
        file.close();
        fs.unlink(filename, () => {});
        downloadVideo(redirectUrl, filename).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlink(filename, () => {});
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

// Function to verify video file
function verifyVideoFile(filepath) {
  try {
    const stats = fs.statSync(filepath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`🔍 Video verification:`);
    console.log(`   File exists: ✅`);
    console.log(`   File size: ${fileSizeMB} MB`);
    
    if (stats.size < 100000) { // Less than 100KB is suspicious
      console.log(`   ⚠️  File size seems too small for a video`);
      return false;
    }
    
    console.log(`   ✅ Video file appears valid`);
    return true;
  } catch (error) {
    console.log(`   ❌ File verification failed: ${error.message}`);
    return false;
  }
}

// Main function
async function downloadAndSaveVideo(promptId, videoUrl) {
  console.log(`🎬 Downloading video for prompt ID: ${promptId}`);
  console.log('='.repeat(50));

  // Find the prompt
  const prompt = data.prompts.find(p => p.id === promptId);
  if (!prompt) {
    throw new Error(`Prompt with ID ${promptId} not found`);
  }

  console.log(`📋 Prompt: "${prompt.title}"`);
  console.log(`⭐ Rating: ${prompt.rating} stars`);

  // Ensure videos directory exists
  const videosDir = path.join(__dirname, '../public/videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
    console.log(`📁 Created videos directory`);
  }

  const videoFilepath = path.join(videosDir, `${prompt.slug}.mp4`);

  // Check if video already exists
  if (fs.existsSync(videoFilepath)) {
    console.log(`⚠️  Video already exists: ${prompt.slug}.mp4`);
    console.log(`   Delete it first if you want to re-download`);
    return { success: false, reason: 'Video already exists' };
  }

  try {
    // Download the video
    await downloadVideo(videoUrl, videoFilepath);

    // Verify the downloaded video
    const isValid = verifyVideoFile(videoFilepath);
    
    if (!isValid) {
      throw new Error('Downloaded video failed verification');
    }

    // Update database
    console.log(`\n💾 Updating database...`);
    prompt.videoUrl = `/videos/${prompt.slug}.mp4`;
    fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
    console.log(`   ✅ Database updated with video URL`);

    // Success summary
    console.log(`\n🎉 SUCCESS! Video saved and database updated:`);
    console.log(`   Title: "${prompt.title}"`);
    console.log(`   File: ${prompt.slug}.mp4`);
    console.log(`   Path: ${videoFilepath}`);
    console.log(`   Rating: ${prompt.rating}⭐`);
    console.log(`   Category: ${prompt.category}`);

    return { 
      success: true, 
      videoPath: videoFilepath, 
      prompt: prompt
    };

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    
    // Clean up partial files
    if (fs.existsSync(videoFilepath)) {
      fs.unlinkSync(videoFilepath);
      console.log(`🧹 Cleaned up partial file`);
    }
    
    return { success: false, error: error.message, prompt: prompt };
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
🎬 Direct Video Download Tool

Usage: node download-specific-video.js <prompt-id> <video-url>

Example:
  node download-specific-video.js 35 "https://tempfile.aiquickdraw.com/p/a2e95b0752e240e5a2a7c914098c25f9_1752237538.mp4"

This tool downloads a video from a direct URL and saves it with the correct filename
for the specified prompt ID.
`);
    process.exit(1);
  }

  const promptId = args[0];
  const videoUrl = args[1];

  console.log(`🎬 Starting download for prompt ${promptId}...`);
  downloadAndSaveVideo(promptId, videoUrl)
    .then(result => {
      if (result.success) {
        console.log(`\n✅ All done! Video ready at: ${result.videoPath}`);
      } else {
        console.log(`\n❌ Failed: ${result.error || result.reason}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { downloadAndSaveVideo };