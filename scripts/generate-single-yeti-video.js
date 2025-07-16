#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

// API Configuration
const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";
const API_BASE_URL = "api.kie.ai";

// Output directory
const OUTPUT_DIR = path.join(__dirname, '../public/yeti-videos');

// The specific video to generate
const VIDEO_DATA = {
  id: 'yeti-touching-grass-v2',
  title: 'Gen-Z Yeti "Touching Grass" (Version 2)',
  prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while standing in a sun-dappled forest clearing, literally touching grass with his free hand. Golden hour lighting. The Yeti looks directly at camera with mock seriousness, then breaks into a grin. Natural camera shake. Documentary vibe. He speaks in a sarcastic Gen-Z accent: "Okay boomers, I'm literally touching grass right now. Are you proud of me? This is what y'all wanted, right? Peak outdoor content, fr fr!" Audio: rustling grass sounds, forest ambience, gentle breeze, authentic Yeti chuckling. No subtitles, no text overlay.`
};

// Ensure output directory exists
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// Submit video generation job
async function submitVideoGeneration(videoData) {
  return new Promise((resolve, reject) => {
    console.log(`🎬 Submitting: ${videoData.title}`);
    console.log(`   Prompt: ${videoData.prompt.substring(0, 150)}...`);

    const postData = JSON.stringify({
      prompt: videoData.prompt,
      model: 'veo3_fast',
      aspectRatio: '9:16',
      watermark: 'YetiGen'
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
              videoData: videoData,
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
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`   ❌ Request error:`, error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Check video generation status
async function checkVideoStatus(taskId) {
  return new Promise((resolve, reject) => {
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
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Wait for video completion
async function waitForVideoCompletion(taskId, title, maxAttempts = 24, intervalSeconds = 30) {
  console.log(`\n⏳ Waiting for "${title}" to complete...`);
  console.log(`   Max wait time: ${(maxAttempts * intervalSeconds / 60).toFixed(1)} minutes`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`   🔍 Attempt ${attempt}/${maxAttempts}: Checking status...`);
    
    try {
      const statusResponse = await checkVideoStatus(taskId);
      
      if (statusResponse.data) {
        const record = statusResponse.data;
        
        if (record.successFlag === 1) {
          console.log(`   ✅ Video generation completed!`);
          
          const videoUrl = record.response?.resultUrls?.[0] || 
                          record.videoUrl || 
                          record.url || 
                          record.downloadUrl || 
                          record.result?.videoUrl;
          
          if (videoUrl) {
            console.log(`   🎬 Video URL: ${videoUrl}`);
            return {
              ready: true,
              videoUrl: videoUrl,
              record: record
            };
          }
        } else if (record.successFlag === -1 || record.errorCode) {
          throw new Error(`Video generation failed: ${record.errorMessage || 'Unknown error'}`);
        } else {
          console.log(`   ⏳ Status: processing - Still generating...`);
        }
      } else {
        console.log(`   ⏳ No data in response - Still generating...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error checking status: ${error.message}`);
    }

    if (attempt < maxAttempts) {
      console.log(`   ⏱️  Waiting ${intervalSeconds} seconds...`);
      await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
    }
  }

  throw new Error(`Video generation timed out after ${maxAttempts} attempts`);
}

// Download video
async function downloadVideo(videoUrl, filepath, title) {
  return new Promise((resolve, reject) => {
    console.log(`\n📥 Downloading "${title}"...`);
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
            process.stdout.write(`\r   📊 Progress: ${progress}%`);
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
        console.log(`   🔄 Following redirect...`);
        file.close();
        fs.unlink(filepath, () => {});
        downloadVideo(redirectUrl, filepath, title).then(resolve).catch(reject);
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

// Main function
async function main() {
  console.log('🧊 GENERATING SINGLE YETI VIDEO (TOUCHING GRASS V2)');
  console.log('=' + '='.repeat(60));
  console.log(`🎯 Model: veo3_fast`);
  console.log(`📐 Aspect ratio: 9:16`);
  console.log(`⏱️  Duration: 8 seconds`);
  console.log('=' + '='.repeat(60));

  ensureOutputDir();

  try {
    const videoFilepath = path.join(OUTPUT_DIR, `${VIDEO_DATA.id}.mp4`);

    // Step 1: Submit generation job
    const job = await submitVideoGeneration(VIDEO_DATA);

    // Step 2: Wait for completion
    const completionResult = await waitForVideoCompletion(job.taskId, VIDEO_DATA.title);

    // Step 3: Download video
    await downloadVideo(completionResult.videoUrl, videoFilepath, VIDEO_DATA.title);

    // Step 4: Verify download
    const stats = fs.statSync(videoFilepath);
    if (stats.size < 100000) {
      throw new Error('Downloaded video file is too small');
    }

    console.log(`\n🎉 SUCCESS! "${VIDEO_DATA.title}" completed!`);
    console.log(`📁 File: ${VIDEO_DATA.id}.mp4`);
    console.log(`📊 Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`📍 Path: ${videoFilepath}`);
    console.log(`🎬 Content: Yeti sarcastically touching grass for boomers`);

  } catch (error) {
    console.error(`\n❌ FAILED: ${VIDEO_DATA.title}`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});