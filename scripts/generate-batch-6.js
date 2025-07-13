#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Configuration
const KIE_API_BASE = 'https://api.kie.ai';
const KIE_API_KEY = process.env.KIE_API_KEY;

// Batch 6 Configuration
const BATCH_6_CONFIG = {
  batchNumber: 6,
  priority: 'featured-5star-first',
  mode: 'fast', // $0.40 per video
  maxVideos: 30, // Limit for this batch
  logFile: `batch_generation_6.log`
};

// Priority-ordered prompt IDs for Batch 6 (missing videos)
const BATCH_6_PROMPT_IDS = [
  // HIGHEST PRIORITY - Featured 5-Star (21 prompts)
  406, 408, 409, 411, 412, 415, 416, 417, 419, 422, 423, 431, 437, 444, 446, 450, 202, 454, 455, 464, 465,
  
  // HIGH PRIORITY - Featured 4-Star (1 prompt) 
  204,
  
  // MEDIUM PRIORITY - 4-Star (first 8 of 31 to reach batch limit of 30)
  407, 410, 413, 414, 418, 420, 421, 424
];

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
let data;

try {
  data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
} catch (error) {
  console.error('❌ Error reading prompts.json:', error.message);
  process.exit(1);
}

// Logging function
function log(message, writeToFile = true) {
  const timestamp = new Date().toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  
  const logMessage = message.includes('🎬') || message.includes('📊') ? message : `${message}`;
  console.log(logMessage);
  
  if (writeToFile) {
    const logPath = path.join(__dirname, '..', BATCH_6_CONFIG.logFile);
    fs.appendFileSync(logPath, logMessage + '\n');
  }
}

// Initialize log file
function initLogFile() {
  const logPath = path.join(__dirname, '..', BATCH_6_CONFIG.logFile);
  const startTime = new Date().toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    month: '2-digit',
    day: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const batchSize = Math.min(BATCH_6_PROMPT_IDS.length, BATCH_6_CONFIG.maxVideos);
  
  const header = `🎬 Starting batch generation for ${batchSize} highest-priority videos...

🎬 BATCH VIDEO GENERATION ${BATCH_6_CONFIG.batchNumber} - FEATURED CONTENT FOCUS
=======================================================
📋 Generating ${batchSize} videos (featured 5-star first)
⏰ Started: ${startTime}

📊 Generation Queue (by priority):`;

  fs.writeFileSync(logPath, header + '\n');
  
  // Log the queue
  BATCH_6_PROMPT_IDS.slice(0, BATCH_6_CONFIG.maxVideos).forEach((promptId, index) => {
    const prompt = data.prompts.find(p => p.id === String(promptId));
    if (prompt) {
      const priority = index < 21 ? '5⭐ Featured' : index < 22 ? '4⭐ Featured' : '4⭐';
      log(`   ${index + 1}. ${prompt.title} (${priority} - ${prompt.difficulty})`);
    }
  });
  
  log('\n');
}

// API Functions (same as generate-veo3-videos.js)
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
          
          if (res.statusCode === 200 && result.success) {
            log(`✅ Job submitted successfully! Task ID: ${result.taskId}`);
            resolve({
              jobId: result.taskId,
              promptId: promptId,
              status: 'submitted'
            });
          } else {
            log(`❌ API Error: ${result.message || responseData}`);
            reject(new Error(result.message || `HTTP ${res.statusCode}: ${responseData}`));
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

async function pollJobUntilComplete(jobId, promptId, maxWaitTime = 600) {
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

// Main batch generation function
async function generateBatch6() {
  log(`🎬 BATCH ${BATCH_6_CONFIG.batchNumber} VIDEO GENERATION WORKFLOW`);
  log('==================================================');
  
  if (!KIE_API_KEY) {
    log('❌ KIE_API_KEY environment variable not set');
    log('   Set it with: export KIE_API_KEY="your-api-key"');
    process.exit(1);
  }

  // Ensure videos directory exists
  const videosDir = path.join(__dirname, '../public/videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  const promptIds = BATCH_6_PROMPT_IDS.slice(0, BATCH_6_CONFIG.maxVideos);
  let successCount = 0;
  let failureCount = 0;
  const startTime = Date.now();
  const failedVideos = [];
  const successfulVideos = [];

  for (let i = 0; i < promptIds.length; i++) {
    const promptId = promptIds[i];
    const prompt = data.prompts.find(p => p.id === String(promptId));
    
    if (!prompt) {
      log(`⚠️  Prompt with ID ${promptId} not found`);
      continue;
    }

    try {
      log(`\n📋 [${i + 1}/${promptIds.length}] Processing: "${prompt.title}" (${prompt.rating}⭐)`);
      log('──────────────────────────────────────────────────');
      log('');
      log('🎬 VEO3 SINGLE VIDEO GENERATION WORKFLOW');
      log('==================================================');
      log(`📋 Prompt ID: ${promptId}`);
      log(`⏰ Started: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour12: true })}`);
      log('');
      log('🎬 STEP 1: Submitting video generation job');
      log(`   Title: "${prompt.title}"`);
      log(`   Prompt: ${prompt.prompt.substring(0, 80)}...`);
      log(`   Model: veo3_${BATCH_6_CONFIG.mode}`);
      log(`   Aspect Ratio: 16:9`);

      // Start video generation
      const job = await generateVeo3Video(prompt.prompt, promptId, {
        mode: BATCH_6_CONFIG.mode,
        aspectRatio: '16:9'
      });

      log('');
      log('🎬 STEP 2: Monitoring job status');
      log(`   Task ID: ${job.jobId}`);
      log(`   Checking every 15 seconds...`);

      // Wait for completion
      const completedJob = await pollJobUntilComplete(job.jobId, promptId);

      log('');
      log('🎬 STEP 3: Downloading generated video');
      
      // Create filename based on prompt slug or title
      const slug = prompt.slug || prompt.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const filename = path.join(videosDir, `prompt-${promptId}.mp4`);
      
      await downloadVideo(completedJob.videoUrl, filename);

      // Update prompt with video URL in new format
      if (!prompt.videos) {
        prompt.videos = [];
      }
      
      prompt.videos.push({
        id: `${promptId}-1`,
        videoUrl: `/videos/prompt-${promptId}.mp4`,
        thumbnailUrl: `/thumbnails/prompt-${promptId}.jpg`,
        category: prompt.category,
        duration: 8,
        resolution: "1280x720",
        aspectRatio: "16:9", 
        format: "mp4",
        fileSize: fs.statSync(filename).size,
        featured: prompt.featured || false
      });

      // Also set legacy fields for backward compatibility
      prompt.videoUrl = `/videos/prompt-${promptId}.mp4`;
      prompt.thumbnailUrl = `/thumbnails/prompt-${promptId}.jpg`;

      log('');
      log('✅ WORKFLOW COMPLETED');
      log('==================================================');
      log(`📁 File: prompt-${promptId}.mp4`);
      log(`⭐ Rating: ${prompt.rating}/5`);
      log(`📂 Category: ${prompt.category}`);
      log(`🔗 Video URL: /videos/prompt-${promptId}.mp4`);
      log(`📍 Local Path: ${filename}`);
      log(`📋 Task ID: ${job.jobId}`);
      log(`⏰ Completed: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour12: true })}`);
      log(`   ✅ SUCCESS: ${prompt.title} (${prompt.rating}⭐)`);

      successCount++;
      successfulVideos.push({
        title: prompt.title,
        rating: prompt.rating,
        category: prompt.category
      });

    } catch (error) {
      log('');
      log('❌ WORKFLOW FAILED');
      log('==================================================');
      log(`Error: ${error.message}`);
      log(`⏰ Failed at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour12: true })}`);
      log(`   ❌ FAILED: ${error.message}`);

      failureCount++;
      failedVideos.push({
        title: prompt.title,
        rating: prompt.rating,
        error: error.message
      });
    }

    log('');
  }

  // Save updated database
  if (successCount > 0) {
    fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
    log(`💾 Updated prompts.json with ${successCount} new videos`);
  }

  // Final summary
  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  const estimatedCost = (successCount * 0.40).toFixed(2);

  log('');
  log('📊 BATCH GENERATION SUMMARY');
  log('=======================================================');
  log(`✅ Successful: ${successCount} videos`);
  log(`❌ Failed: ${failureCount} videos`);
  log(`📋 Total: ${promptIds.length} videos`);
  log(`⏰ Total time: ${totalTime} minutes`);
  log(`💰 Estimated cost: $${estimatedCost} (fast mode)`);
  log('');

  // Rating breakdown
  if (successCount > 0) {
    const ratingCounts = {};
    successfulVideos.forEach(video => {
      const rating = `${video.rating}⭐`;
      ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    });
    
    log('⭐ Rating Breakdown of Successful Videos:');
    Object.entries(ratingCounts).forEach(([rating, count]) => {
      log(`   ${rating}: ${count} videos`);
    });
    log('');
  }

  log(`🎉 ${successCount} videos generated successfully!`);
  log('📁 Check: /public/videos/ directory');
  log('');

  if (failedVideos.length > 0) {
    log('❌ Failed videos:');
    failedVideos.forEach(video => {
      log(`   - ${video.title} (${video.rating}⭐): ${video.error}`);
    });
    log('');
  }

  log(`✅ Batch generation completed! ${successCount}/${promptIds.length} videos successful.`);
}

// Run the batch generation
if (require.main === module) {
  initLogFile();
  generateBatch6().catch(error => {
    log(`❌ Batch generation failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { generateBatch6, BATCH_6_PROMPT_IDS };