#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Configuration
const KIE_API_BASE = 'https://api.kie.ai';
const KIE_API_KEY = process.env.KIE_API_KEY;

// Test with just 2 high-priority videos
const TEST_PROMPT_IDS = [406, 407]; // Two Talking Muffins (5⭐), Blockchain Ad Disaster (4⭐)

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
let data;

try {
  data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
} catch (error) {
  console.error('❌ Error reading prompts.json:', error.message);
  process.exit(1);
}

function log(message) {
  console.log(message);
}

// API Functions
async function generateVeo3Video(prompt, promptId, options = {}) {
  return new Promise((resolve, reject) => {
    if (!KIE_API_KEY) {
      reject(new Error('KIE_API_KEY environment variable not set'));
      return;
    }

    const {
      mode = 'fast',
      duration = 8,
      audio = true,
      aspectRatio = '16:9'
    } = options;

    const postData = JSON.stringify({
      prompt: prompt,
      mode: mode,
      duration: duration,
      audio: audio,
      aspectRatio: aspectRatio,
      translation: false,
      callBackUrl: null
    });

    const requestOptions = {
      hostname: 'api.kie.ai',
      port: 443,
      path: '/api/v1/veo/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    log(`🎬 Starting Veo3 generation for prompt ${promptId}...`);

    const req = https.request(requestOptions, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          
          if (res.statusCode === 200 && result.code === 200 && result.data && result.data.taskId) {
            log(`✅ Job submitted successfully! Task ID: ${result.data.taskId}`);
            resolve({
              jobId: result.data.taskId,
              promptId: promptId,
              status: 'submitted'
            });
          } else {
            log(`❌ API Error: ${result.msg || result.message || responseData}`);
            reject(new Error(result.msg || result.message || `HTTP ${res.statusCode}: ${responseData}`));
          }
        } catch (error) {
          log(`❌ Error parsing API response: ${error.message}`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      log(`❌ Request error: ${error.message}`);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function pollJobUntilComplete(jobId, promptId, maxWaitTime = 300) {
  const checkInterval = 15000; // 15 seconds
  const maxChecks = Math.ceil(maxWaitTime * 1000 / checkInterval);
  let checks = 0;

  log(`⏳ Polling job ${jobId} every ${checkInterval/1000} seconds...`);

  return new Promise((resolve, reject) => {
    const poll = () => {
      checks++;
      
      if (checks > maxChecks) {
        log(`❌ Timeout: Job ${jobId} did not complete within ${maxWaitTime} seconds`);
        reject(new Error(`Timeout: Video generation did not complete within ${maxWaitTime} seconds`));
        return;
      }

      const requestOptions = {
        hostname: 'api.kie.ai',
        port: 443,
        path: `/api/v1/veo/status/${jobId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${KIE_API_KEY}`
        }
      };

      const req = https.request(requestOptions, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const result = JSON.parse(responseData);
            
            if (result.status === 'completed' && result.videoUrl) {
              log(`✅ Video generation completed! URL: ${result.videoUrl}`);
              resolve(result);
            } else if (result.status === 'failed') {
              log(`❌ Video generation failed: ${result.message || 'Unknown error'}`);
              reject(new Error(result.message || 'Video generation failed'));
            } else {
              log(`⏳ Status: ${result.status}... (check ${checks}/${maxChecks})`);
              setTimeout(poll, checkInterval);
            }
          } catch (error) {
            log(`❌ Error parsing status response: ${error.message}`);
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        log(`❌ Status check error: ${error.message}`);
        reject(error);
      });

      req.end();
    };

    poll();
  });
}

async function downloadVideo(videoUrl, filename) {
  return new Promise((resolve, reject) => {
    log(`📥 Downloading video to ${path.basename(filename)}...`);
    
    const file = fs.createWriteStream(filename);
    
    https.get(videoUrl, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filename);
        log(`✅ Video downloaded successfully (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        resolve();
      });
    }).on('error', (error) => {
      fs.unlink(filename, () => {}); // Delete partial file
      log(`❌ Download error: ${error.message}`);
      reject(error);
    });
  });
}

// Main test function
async function runTestBatch() {
  log('🎬 TEST BATCH - 2 Videos');
  log('==================================================');
  
  if (!KIE_API_KEY) {
    log('❌ KIE_API_KEY environment variable not set');
    process.exit(1);
  }

  // Ensure videos directory exists
  const videosDir = path.join(__dirname, '../public/videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < TEST_PROMPT_IDS.length; i++) {
    const promptId = TEST_PROMPT_IDS[i];
    const prompt = data.prompts.find(p => p.id === String(promptId));
    
    if (!prompt) {
      log(`⚠️  Prompt with ID ${promptId} not found`);
      continue;
    }

    try {
      log(`\n📋 [${i + 1}/${TEST_PROMPT_IDS.length}] Processing: "${prompt.title}" (${prompt.rating}⭐)`);
      log(`📝 Prompt: ${prompt.prompt.substring(0, 100)}...`);

      // Start video generation
      const job = await generateVeo3Video(prompt.prompt, promptId, {
        mode: 'fast',
        aspectRatio: '16:9'
      });

      // Wait for completion
      const completedJob = await pollJobUntilComplete(job.jobId, promptId, 300);

      // Download the video
      const slug = prompt.slug || prompt.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const filename = path.join(videosDir, `${slug}.mp4`);
      
      await downloadVideo(completedJob.videoUrl, filename);

      // Update prompt with video URL
      prompt.videoUrl = `/videos/${slug}.mp4`;
      prompt.thumbnailUrl = `/thumbnails/${slug}.jpg`;

      log(`✅ SUCCESS: ${prompt.title} (${prompt.rating}⭐)`);
      successCount++;

    } catch (error) {
      log(`❌ FAILED: ${prompt.title} - ${error.message}`);
      failureCount++;
    }
  }

  // Save updated database
  if (successCount > 0) {
    fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
    log(`\n💾 Updated prompts.json with ${successCount} new videos`);
  }

  log(`\n📊 TEST SUMMARY:`);
  log(`✅ Successful: ${successCount} videos`);
  log(`❌ Failed: ${failureCount} videos`);
  log(`💰 Cost: $${(successCount * 0.40).toFixed(2)}`);
  
  if (successCount > 0) {
    log(`\n🎉 Test successful! Ready to run full batches.`);
  }
}

// Run the test
runTestBatch().catch(error => {
  log(`❌ Test batch failed: ${error.message}`);
  process.exit(1);
});