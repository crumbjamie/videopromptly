const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Function to submit video generation job
async function submitVideoJob(prompt, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      mode = 'fast',
      duration = 8,
      audio = true,
      aspectRatio = '16:9'
    } = options;

    console.log(`🎬 Submitting job for: "${prompt.title}"`);
    console.log(`   Prompt: ${prompt.prompt.substring(0, 80)}...`);
    console.log(`   Mode: ${mode}, Duration: ${duration}s, Audio: ${audio}, Aspect: ${aspectRatio}`);

    const postData = JSON.stringify({
      prompt: prompt.prompt,
      model: "veo3",
      aspectRatio: aspectRatio,
      watermark: "VideoPromptly"
    });

    const options_req = {
      method: 'POST',
      hostname: 'api.kie.ai',
      path: '/api/v1/veo/generate',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`
      },
      maxRedirects: 20
    };

    const req = https.request(options_req, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        const responseData = body.toString();
        
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 200 && response.code === 200) {
            console.log(`✅ Job submitted successfully!`);
            console.log(`   Task ID: ${response.data.taskId}`);
            resolve({
              taskId: response.data.taskId,
              prompt: prompt
            });
          } else {
            console.error(`❌ API Error:`, response);
            reject(new Error(response.msg || `HTTP ${res.statusCode}`));
          }
        } catch (error) {
          console.error(`❌ Parse error:`, error);
          console.error(`Raw response:`, responseData);
          reject(error);
        }
      });

      res.on("error", function (error) {
        console.error(`❌ Request error:`, error);
        reject(error);
      });
    });

    req.write(postData);
    req.end();
  });
}

// Function to get video records/status
async function getVideoRecords() {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Getting video records...`);

    const options_req = {
      method: 'GET',
      hostname: 'api.kie.ai',
      path: '/api/v1/veo/record-info',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`
      },
      maxRedirects: 20
    };

    const req = https.request(options_req, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        const responseData = body.toString();
        
        try {
          const response = JSON.parse(responseData);
          console.log(`📋 Records response:`, JSON.stringify(response, null, 2));
          resolve(response);
        } catch (error) {
          console.error(`❌ Parse error:`, error);
          console.error(`Raw response:`, responseData);
          reject(error);
        }
      });

      res.on("error", function (error) {
        console.error(`❌ Request error:`, error);
        reject(error);
      });
    });

    req.end();
  });
}

// Function to find video by task ID in records
function findVideoInRecords(records, taskId) {
  if (!records.data || !Array.isArray(records.data)) {
    console.log(`❌ No records data found or data is not an array`);
    return null;
  }

  const video = records.data.find(record => record.taskId === taskId || record.id === taskId);
  
  if (video) {
    console.log(`🎬 Found video record:`, JSON.stringify(video, null, 2));
    
    // Look for video URL in various possible fields
    const videoUrl = video.videoUrl || video.url || video.result?.videoUrl || video.downloadUrl;
    
    if (videoUrl) {
      console.log(`✅ Video URL found: ${videoUrl}`);
      return { ready: true, videoUrl, video };
    } else {
      console.log(`⏳ Video found but no URL yet. Status: ${video.status || 'unknown'}`);
      return { ready: false, status: video.status, video };
    }
  }

  console.log(`❌ Video with task ID ${taskId} not found in records`);
  return null;
}

// Function to download video from URL
async function downloadVideo(videoUrl, filepath) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading video from: ${videoUrl}`);
    console.log(`💾 Saving as: ${path.basename(filepath)}`);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(videoUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`✅ Download completed!`);
          resolve(filepath);
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.log(`🔄 Following redirect to: ${redirectUrl}`);
        file.close();
        fs.unlink(filepath, () => {});
        downloadVideo(redirectUrl, filepath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
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

// Main function to process single video
async function processSingleVideo(promptId, options = {}) {
  console.log(`\n🎬 Processing Single Video - Prompt ID: ${promptId}`);
  console.log('='.repeat(50));

  // Find the prompt
  const prompt = data.prompts.find(p => p.id === promptId);
  if (!prompt) {
    throw new Error(`Prompt with ID ${promptId} not found`);
  }

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
    console.log(`   Delete it first if you want to regenerate`);
    return { success: false, reason: 'Video already exists' };
  }

  try {
    // Step 1: Submit job
    console.log(`\n📤 Step 1: Submitting video generation job...`);
    const job = await submitVideoJob(prompt, options);

    // Step 2: Wait for completion
    console.log(`\n⏳ Step 2: Waiting for video generation to complete...`);
    console.log(`   This usually takes 2-5 minutes...`);

    let videoReady = false;
    let videoUrl = null;
    let attempts = 0;
    const maxAttempts = 20; // 20 attempts × 30 seconds = 10 minutes max

    while (!videoReady && attempts < maxAttempts) {
      attempts++;
      console.log(`\n🔍 Check ${attempts}/${maxAttempts}: Looking for completed video...`);
      
      try {
        const records = await getVideoRecords();
        const videoInfo = findVideoInRecords(records, job.taskId);
        
        if (videoInfo && videoInfo.ready) {
          videoReady = true;
          videoUrl = videoInfo.videoUrl;
          console.log(`🎬 Video generation complete!`);
          break;
        } else if (videoInfo && !videoInfo.ready) {
          console.log(`   ⏳ Video found but still processing...`);
        } else {
          console.log(`   ⏳ Video not found in records yet...`);
        }
      } catch (error) {
        console.log(`   ❌ Error checking records: ${error.message}`);
      }

      if (attempts < maxAttempts) {
        console.log(`   ⏱️  Waiting 30 seconds before next check...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }

    if (!videoReady) {
      throw new Error(`Video generation timed out after ${maxAttempts} attempts`);
    }

    // Step 3: Download video
    console.log(`\n📥 Step 3: Downloading video...`);
    await downloadVideo(videoUrl, videoFilepath);

    // Step 4: Verify video
    console.log(`\n🔍 Step 4: Verifying downloaded video...`);
    const isValid = verifyVideoFile(videoFilepath);
    
    if (!isValid) {
      throw new Error('Downloaded video failed verification');
    }

    // Step 5: Update database
    console.log(`\n💾 Step 5: Updating database...`);
    prompt.videoUrl = `/videos/${prompt.slug}.mp4`;
    fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
    console.log(`   ✅ Database updated with video URL`);

    // Success summary
    console.log(`\n🎉 SUCCESS! Video processing complete:`);
    console.log(`   Title: "${prompt.title}"`);
    console.log(`   File: ${prompt.slug}.mp4`);
    console.log(`   Rating: ${prompt.rating}⭐`);
    console.log(`   Category: ${prompt.category}`);

    return { 
      success: true, 
      videoPath: videoFilepath, 
      prompt: prompt,
      taskId: job.taskId 
    };

  } catch (error) {
    console.error(`\n❌ Error processing video: ${error.message}`);
    
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
  
  if (args.length === 0) {
    console.log(`
🎬 Veo3 Single Video Generator (Fixed API)

Usage: node veo3-fixed-workflow.js <prompt-id>

Examples:
  node veo3-fixed-workflow.js 35    # Generate Biblical Influencer: Jonah

Available prompts without videos:
${data.prompts.filter(p => !p.videoUrl).slice(0, 10).map(p => `  ${p.id}: ${p.title} (${p.rating}⭐)`).join('\n')}

This script uses the correct Kie.ai API endpoints:
- POST /api/v1/veo/generate (to create videos)  
- GET /api/v1/veo/record-info (to check status)
`);
    process.exit(1);
  }

  const promptId = args[0];

  console.log(`🎬 Generating video for prompt ${promptId}...`);
  processSingleVideo(promptId)
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

module.exports = { processSingleVideo };