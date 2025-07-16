#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

// API Configuration
const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";
const API_BASE_URL = "api.kie.ai";

// Output directory
const OUTPUT_DIR = path.join(__dirname, '../public/yeti-videos');

// Video prompts
const YETI_VIDEOS = [
  {
    id: 'yeti-gaming-rant',
    title: 'Gen-Z Yeti Gaming Rant',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while sitting on a fallen log in a dense pine forest. Dappled sunlight filters through the canopy. The Yeti gestures wildly with his free hand, looking genuinely frustrated. Natural camera shake. Documentary vibe. He speaks in a high-energy Gen-Z accent: "Bruh, I've been grinding this game for like six hours straight, and it's straight up mid! Like, the graphics are bussin but the gameplay is absolutely trash, no cap!" Audio: forest ambience, birds chirping, gentle wind through trees, authentic Yeti breathing. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-touching-grass',
    title: 'Gen-Z Yeti "Touching Grass"',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while standing in a sun-dappled forest clearing, literally touching grass with his free hand. Golden hour lighting. The Yeti looks directly at camera with mock seriousness, then breaks into a grin. Natural camera shake. Documentary vibe. He speaks in a sarcastic Gen-Z accent: "Okay boomers, I'm literally touching grass right now. Are you proud of me? This is what y'all wanted, right? Peak outdoor content, fr fr!" Audio: rustling grass sounds, forest ambience, gentle breeze, authentic Yeti chuckling. No subtitles, no text overlay.`
  },
  {
    id: 'grumpy-dad-yeti',
    title: 'Grumpy Dad Yeti Complains',
    prompt: `A large, grumpy older white Yeti with thick, matted grey-white fur and stern amber eyes holds a selfie stick (that's where the camera is) while standing between tall pine trees in a dark forest. Overcast lighting creates dramatic shadows. The Yeti's expression is thoroughly annoyed as he shakes his head disapprovingly. Natural camera shake. Documentary vibe. He speaks in a deep, irritated Australian accent: "Right, so apparently everything is either 'bussin' or 'mid' now. Back in my day, we just said 'good' or 'bad.' And don't get me started on this 'no cap' nonsense. What's wrong with just saying 'honestly'?" Audio: forest ambience, distant thunder rumble, frustrated Yeti breathing, twigs snapping underfoot. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-tests-dad',
    title: 'Gen-Z Yeti Tests Dad',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while standing in a misty forest clearing. Soft morning light creates an ethereal atmosphere. The Yeti grins mischievously at the camera, then cups his free hand to his mouth as if calling out. Natural camera shake. Documentary vibe. He speaks in a playful Gen-Z accent: "Yo Dad! Your dinner last night was absolutely fire! But your dance moves at the family gathering were lowkey cringe, periodt! Also, you're looking pretty sus lately, just saying!" Audio: forest ambience, gentle mist sounds, distant grumpy yeti grumbling in response, authentic Yeti giggling. No subtitles, no text overlay.`
  }
];

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
    console.log(`   Prompt: ${videoData.prompt.substring(0, 100)}...`);

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
          console.error(`   Raw response:`, responseData);
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
          console.error(`   ❌ Parse error:`, error);
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
          } else {
            console.log(`   ⚠️  Video marked as complete but no URL found`);
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

// Generate a single video
async function generateSingleVideo(videoData) {
  console.log(`\n🎬 Starting generation for: ${videoData.title}`);
  console.log('=' + '='.repeat(50));

  try {
    const videoFilepath = path.join(OUTPUT_DIR, `${videoData.id}.mp4`);

    // Check if video already exists
    if (fs.existsSync(videoFilepath)) {
      console.log(`⚠️  Video already exists: ${videoData.id}.mp4`);
      const stats = fs.statSync(videoFilepath);
      if (stats.size > 100000) { // If file is bigger than 100KB, assume it's valid
        console.log(`✅ Existing video is valid. Skipping generation.`);
        return {
          success: true,
          alreadyExists: true,
          videoPath: videoFilepath,
          videoData: videoData
        };
      } else {
        console.log(`🗑️  Removing invalid existing file...`);
        fs.unlinkSync(videoFilepath);
      }
    }

    // Step 1: Submit generation job
    const job = await submitVideoGeneration(videoData);

    // Step 2: Wait for completion
    const completionResult = await waitForVideoCompletion(job.taskId, videoData.title);

    // Step 3: Download video
    await downloadVideo(completionResult.videoUrl, videoFilepath, videoData.title);

    // Step 4: Verify download
    const stats = fs.statSync(videoFilepath);
    if (stats.size < 100000) {
      throw new Error('Downloaded video file is too small');
    }

    console.log(`\n🎉 SUCCESS! "${videoData.title}" completed!`);
    console.log(`📁 File: ${videoData.id}.mp4`);
    console.log(`📊 Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`📍 Path: ${videoFilepath}`);

    return {
      success: true,
      videoPath: videoFilepath,
      videoData: videoData,
      taskId: job.taskId,
      videoUrl: completionResult.videoUrl,
      size: stats.size
    };

  } catch (error) {
    console.error(`\n❌ FAILED: ${videoData.title}`);
    console.error(`Error: ${error.message}`);
    
    // Clean up partial files
    const videoFilepath = path.join(OUTPUT_DIR, `${videoData.id}.mp4`);
    if (fs.existsSync(videoFilepath)) {
      fs.unlinkSync(videoFilepath);
    }
    
    return {
      success: false,
      error: error.message,
      videoData: videoData
    };
  }
}

// Main function
async function main() {
  console.log('🧊 GEN-Z YETI VIDEO GENERATOR');
  console.log('=' + '='.repeat(50));
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🎯 Model: veo3_fast`);
  console.log(`📐 Aspect ratio: 9:16 (vertical)`);
  console.log(`⏱️  Duration: 8 seconds each`);
  console.log(`🎬 Videos to generate: ${YETI_VIDEOS.length}`);
  console.log('=' + '='.repeat(50));

  // Ensure output directory exists
  ensureOutputDir();

  // Generate each video
  const results = [];
  for (let i = 0; i < YETI_VIDEOS.length; i++) {
    const result = await generateSingleVideo(YETI_VIDEOS[i]);
    results.push(result);
    
    // Add delay between videos to avoid rate limiting
    if (i < YETI_VIDEOS.length - 1) {
      console.log(`\n⏱️  Waiting 30 seconds before next video...`);
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }

  // Summary
  console.log('\n📊 FINAL SUMMARY');
  console.log('=' + '='.repeat(50));
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const existing = results.filter(r => r.alreadyExists);

  console.log(`✅ Successfully generated: ${successful.length - existing.length}`);
  console.log(`⚠️  Already existed: ${existing.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📁 Total videos available: ${successful.length}`);

  if (successful.length > 0) {
    const totalSize = successful.reduce((sum, r) => sum + (r.size || 0), 0);
    console.log(`💾 Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
  }

  if (failed.length > 0) {
    console.log(`\n❌ Failed videos:`);
    failed.forEach(r => {
      console.log(`   - ${r.videoData.title}: ${r.error}`);
    });
  }

  console.log(`\n📍 All videos saved to: ${OUTPUT_DIR}`);
  console.log('🎉 Yeti video generation complete!');
}

// Handle script execution
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateSingleVideo, YETI_VIDEOS };