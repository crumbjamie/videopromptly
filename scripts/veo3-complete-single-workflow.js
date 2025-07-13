#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

// API Configuration
const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";
const API_BASE_URL = "api.kie.ai";

// Paths
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const videosDir = path.join(__dirname, '../public/videos');

// Ensure directories exist
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// Read database
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

/**
 * Step 1: Submit video generation job to Kie.ai API
 */
async function submitVideoGeneration(prompt, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      model = 'veo3_fast',
      aspectRatio = '16:9',
      watermark = 'VideoPromptly'
    } = options;

    console.log(`🎬 STEP 1: Submitting video generation job`);
    console.log(`   Title: "${prompt.title}"`);
    console.log(`   Prompt: ${prompt.prompt.substring(0, 100)}...`);
    console.log(`   Model: ${model}`);
    console.log(`   Aspect Ratio: ${aspectRatio}`);

    const postData = JSON.stringify({
      prompt: prompt.prompt,
      model: model,
      aspectRatio: aspectRatio,
      watermark: watermark
    });

    const requestOptions = {
      method: 'POST',
      hostname: API_BASE_URL,
      path: '/api/v1/veo/generate',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      maxRedirects: 20
    };

    const req = https.request(requestOptions, function (res) {
      let chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const responseData = body.toString();
        
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 200 && response.code === 200) {
            console.log(`   ✅ Job submitted successfully!`);
            console.log(`   📋 Task ID: ${response.data.taskId}`);
            resolve({
              taskId: response.data.taskId,
              prompt: prompt,
              submittedAt: new Date().toISOString()
            });
          } else if (response.code === 402) {
            console.error(`   💳 Insufficient credits: ${response.msg}`);
            reject(new Error(`CREDIT_EXHAUSTED: ${response.msg}`));
          } else if (response.code === 429) {
            console.error(`   ⏱️  Rate limit exceeded: ${response.msg}`);
            reject(new Error(`RATE_LIMITED: ${response.msg}`));
          } else {
            console.error(`   ❌ API Error (code ${response.code}):`, response.msg);
            reject(new Error(`API_ERROR_${response.code}: ${response.msg}`));
          }
        } catch (error) {
          console.error(`   ❌ Parse error:`, error);
          console.error(`   Raw response:`, responseData);
          reject(error);
        }
      });

      res.on("error", function (error) {
        console.error(`   ❌ Request error:`, error);
        reject(error);
      });
    });

    req.on('error', (error) => {
      console.error(`   ❌ Request setup error:`, error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Step 2: Check video generation status using record-info API
 */
async function checkVideoStatus(taskId) {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Checking status for task: ${taskId}`);

    const requestOptions = {
      method: 'GET',
      hostname: API_BASE_URL,
      path: `/api/v1/veo/record-info?taskId=${taskId}`,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`
      },
      maxRedirects: 20
    };

    const req = https.request(requestOptions, function (res) {
      let chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const responseData = body.toString();
        
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 200) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        } catch (error) {
          console.error(`   ❌ Parse error:`, error);
          console.error(`   Raw response:`, responseData);
          reject(error);
        }
      });

      res.on("error", function (error) {
        console.error(`   ❌ Request error:`, error);
        reject(error);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * Step 3: Poll for video completion
 */
async function waitForVideoCompletion(taskId, maxAttempts = 24, intervalSeconds = 30) {
  console.log(`\n⏳ STEP 2: Waiting for video generation to complete`);
  console.log(`   Max wait time: ${(maxAttempts * intervalSeconds / 60).toFixed(1)} minutes`);
  console.log(`   Check interval: ${intervalSeconds} seconds`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`\n🔍 Attempt ${attempt}/${maxAttempts}: Checking completion status...`);
    
    try {
      const statusResponse = await checkVideoStatus(taskId);
      
      // Log the full response for debugging
      console.log(`   📋 Status response:`, JSON.stringify(statusResponse, null, 2));
      
      // Check if video is ready - look for various possible completion indicators
      if (statusResponse.data) {
        const record = statusResponse.data;
        
        // Check for completion using successFlag (1 = success, 0 = processing)
        if (record.successFlag === 1) {
          console.log(`   ✅ Video generation completed!`);
          
          // Look for video URL in response object and various other fields
          const videoUrl = record.response?.resultUrls?.[0] || 
                          record.videoUrl || 
                          record.url || 
                          record.downloadUrl || 
                          record.result?.videoUrl;
          
          if (videoUrl) {
            console.log(`   🎬 Video URL found: ${videoUrl}`);
            return {
              ready: true,
              videoUrl: videoUrl,
              record: record
            };
          } else {
            console.log(`   ⚠️  Video marked as complete but no URL found`);
            console.log(`   📋 Record data:`, JSON.stringify(record, null, 2));
          }
        } else if (record.successFlag === -1 || record.errorCode) {
          throw new Error(`Video generation failed: ${record.errorMessage || 'Unknown error'}`);
        } else {
          console.log(`   ⏳ Status: processing (successFlag: ${record.successFlag}) - Still generating...`);
        }
      } else {
        console.log(`   ⏳ No data in response - Still generating...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error checking status: ${error.message}`);
    }

    if (attempt < maxAttempts) {
      console.log(`   ⏱️  Waiting ${intervalSeconds} seconds before next check...`);
      await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
    }
  }

  throw new Error(`Video generation timed out after ${maxAttempts} attempts (${(maxAttempts * intervalSeconds / 60).toFixed(1)} minutes)`);
}

/**
 * Step 4: Download video from URL
 */
async function downloadVideo(videoUrl, filepath) {
  return new Promise((resolve, reject) => {
    console.log(`\n📥 STEP 3: Downloading video`);
    console.log(`   From: ${videoUrl}`);
    console.log(`   To: ${path.basename(filepath)}`);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(videoUrl, (response) => {
      if (response.statusCode === 200) {
        const totalSize = parseInt(response.headers['content-length']) || 0;
        let downloadedSize = 0;
        
        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          if (totalSize > 0) {
            const progress = ((downloadedSize / totalSize) * 100).toFixed(1);
            process.stdout.write(`\r   📊 Progress: ${progress}% (${(downloadedSize / 1024 / 1024).toFixed(2)} MB)`);
          }
        });
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`\n   ✅ Download completed!`);
          resolve(filepath);
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.log(`   🔄 Following redirect to: ${redirectUrl}`);
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

/**
 * Step 5: Verify downloaded video file
 */
function verifyVideoFile(filepath) {
  console.log(`\n🔍 STEP 4: Verifying downloaded video`);
  
  try {
    const stats = fs.statSync(filepath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`   📊 File size: ${fileSizeMB} MB`);
    console.log(`   📁 File path: ${filepath}`);
    
    if (stats.size < 100000) { // Less than 100KB
      console.log(`   ❌ File size too small for a video (${stats.size} bytes)`);
      return false;
    }
    
    console.log(`   ✅ Video file verification passed`);
    return true;
  } catch (error) {
    console.log(`   ❌ File verification failed: ${error.message}`);
    return false;
  }
}

/**
 * Step 6: Update database with video URL
 */
function updateDatabase(prompt, videoPath) {
  console.log(`\n💾 STEP 5: Updating database`);
  
  try {
    // Update the prompt with video URL
    prompt.videoUrl = `/videos/${prompt.slug}.mp4`;
    
    // Update the file creation timestamp
    prompt.updatedAt = new Date().toISOString();
    
    // Write updated database
    fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
    
    console.log(`   ✅ Database updated successfully`);
    console.log(`   🔗 Video URL: ${prompt.videoUrl}`);
    
    return true;
  } catch (error) {
    console.log(`   ❌ Database update failed: ${error.message}`);
    return false;
  }
}

/**
 * Main workflow function
 */
async function generateSingleVideo(promptId, options = {}) {
  console.log(`\n🎬 VEO3 SINGLE VIDEO GENERATION WORKFLOW`);
  console.log('='.repeat(50));
  console.log(`📋 Prompt ID: ${promptId}`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}\n`);

  try {
    // Find the prompt
    const prompt = data.prompts.find(p => p.id === promptId);
    if (!prompt) {
      throw new Error(`Prompt with ID ${promptId} not found in database`);
    }

    const videoFilepath = path.join(videosDir, `${prompt.slug}.mp4`);

    // Check if video already exists
    if (fs.existsSync(videoFilepath)) {
      console.log(`⚠️  Video already exists: ${prompt.slug}.mp4`);
      if (verifyVideoFile(videoFilepath)) {
        console.log(`✅ Existing video is valid. Skipping generation.`);
        return {
          success: true,
          alreadyExists: true,
          videoPath: videoFilepath,
          prompt: prompt
        };
      } else {
        console.log(`🗑️  Removing invalid existing file...`);
        fs.unlinkSync(videoFilepath);
      }
    }

    // Step 1: Submit generation job
    const job = await submitVideoGeneration(prompt, options);

    // Step 2: Wait for completion
    const completionResult = await waitForVideoCompletion(job.taskId);

    // Step 3: Download video
    await downloadVideo(completionResult.videoUrl, videoFilepath);

    // Step 4: Verify download
    if (!verifyVideoFile(videoFilepath)) {
      throw new Error('Downloaded video failed verification');
    }

    // Step 5: Update database
    if (!updateDatabase(prompt, videoFilepath)) {
      throw new Error('Failed to update database');
    }

    // Success summary
    console.log(`\n🎉 SUCCESS! Video generation workflow completed`);
    console.log('='.repeat(50));
    console.log(`📋 Title: "${prompt.title}"`);
    console.log(`📁 File: ${prompt.slug}.mp4`);
    console.log(`⭐ Rating: ${prompt.rating}/5`);
    console.log(`📂 Category: ${prompt.category}`);
    console.log(`🔗 Video URL: ${prompt.videoUrl}`);
    console.log(`📍 Local Path: ${videoFilepath}`);
    console.log(`📋 Task ID: ${job.taskId}`);
    console.log(`⏰ Completed: ${new Date().toLocaleString()}`);

    return {
      success: true,
      videoPath: videoFilepath,
      prompt: prompt,
      taskId: job.taskId,
      videoUrl: completionResult.videoUrl
    };

  } catch (error) {
    console.error(`\n❌ WORKFLOW FAILED`);
    console.error('='.repeat(50));
    console.error(`Error: ${error.message}`);
    console.error(`⏰ Failed at: ${new Date().toLocaleString()}`);
    
    // Clean up partial files
    const videoFilepath = path.join(videosDir, `${data.prompts.find(p => p.id === promptId)?.slug || 'unknown'}.mp4`);
    if (fs.existsSync(videoFilepath)) {
      fs.unlinkSync(videoFilepath);
      console.error(`🧹 Cleaned up partial file: ${path.basename(videoFilepath)}`);
    }
    
    return {
      success: false,
      error: error.message,
      promptId: promptId
    };
  }
}

/**
 * Command line interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎬 Veo3 Complete Single Video Workflow

Usage: node veo3-complete-single-workflow.js <prompt-id> [options]

Options:
  --model=veo3_fast|veo3_quality    Model to use (default: veo3_fast)
  --aspect=16:9|9:16|1:1           Aspect ratio (default: 16:9)
  --watermark=text                 Watermark text (default: VideoPromptly)

Examples:
  node veo3-complete-single-workflow.js 42
  node veo3-complete-single-workflow.js 42 --model=veo3_quality --aspect=9:16

Available prompts without videos:
${data.prompts.filter(p => !p.videoUrl || !fs.existsSync(path.join(videosDir, `${p.slug}.mp4`))).slice(0, 10).map(p => `  ${p.id}: "${p.title}" (${p.rating}⭐)`).join('\n')}

This workflow will:
1. ✅ Submit video generation job to Kie.ai
2. ⏳ Monitor completion status via /record-info API
3. 📥 Download completed video to /public/videos/
4. 🔍 Verify file integrity
5. 💾 Update database with video URL
6. 🎉 Provide confirmation and video URL
`);
    process.exit(1);
  }

  // Parse arguments
  const promptId = args[0];
  const options = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--model=')) {
      options.model = arg.split('=')[1];
    } else if (arg.startsWith('--aspect=')) {
      options.aspectRatio = arg.split('=')[1];
    } else if (arg.startsWith('--watermark=')) {
      options.watermark = arg.split('=')[1];
    }
  }

  console.log(`🎬 Starting video generation for prompt ${promptId}...`);
  if (Object.keys(options).length > 0) {
    console.log(`⚙️  Options:`, options);
  }

  generateSingleVideo(promptId, options)
    .then(result => {
      if (result.success) {
        console.log(`\n✅ COMPLETE! Check your video at: ${result.videoPath}`);
        if (result.prompt?.videoUrl) {
          console.log(`🌐 URL for verification: ${result.prompt.videoUrl}`);
        }
        process.exit(0);
      } else {
        console.log(`\n❌ Generation failed: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { generateSingleVideo };