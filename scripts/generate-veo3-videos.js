const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const KIE_API_BASE = 'https://api.kie.ai';
const KIE_API_KEY = process.env.KIE_API_KEY; // Set this in your environment

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Function to make API request to Kie.ai Veo3 API
async function generateVeo3Video(prompt, promptId, options = {}) {
  return new Promise((resolve, reject) => {
    if (!KIE_API_KEY) {
      reject(new Error('KIE_API_KEY environment variable not set'));
      return;
    }

    const {
      mode = 'fast', // 'fast' or 'quality'
      duration = 8,   // seconds
      audio = true,
      aspectRatio = '16:9'
    } = options;

    const postData = JSON.stringify({
      prompt: prompt,
      mode: mode, // 'fast' for $0.40, 'quality' for $2.00
      duration: duration,
      audio: audio,
      aspectRatio: aspectRatio,
      translation: false,
      callBackUrl: null // We'll use polling instead for this script
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

    console.log(`🎬 Starting Veo3 generation for prompt ${promptId}...`);
    console.log(`   Mode: ${mode}, Duration: ${duration}s, Audio: ${audio}`);

    const req = https.request(requestOptions, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 200) {
            console.log(`✅ Video generation started for prompt ${promptId}`);
            console.log(`   Job ID: ${response.jobId || response.id || 'N/A'}`);
            console.log(`   Status: ${response.status || 'Processing'}`);
            
            if (response.videoUrl) {
              // Video is ready immediately (unlikely for Veo3)
              resolve({
                jobId: response.jobId || response.id,
                videoUrl: response.videoUrl,
                status: 'completed',
                promptId
              });
            } else {
              // Video is processing, return job info for polling
              resolve({
                jobId: response.jobId || response.id,
                status: response.status || 'processing',
                promptId,
                estimatedTime: response.estimatedTime || 60 // seconds
              });
            }
          } else {
            console.error(`❌ Failed to generate video for prompt ${promptId}:`, response.error || response);
            reject(new Error(response.error || `HTTP ${res.statusCode}: ${response.message || 'Unknown API error'}`));
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

// Function to check job status
async function checkJobStatus(jobId) {
  return new Promise((resolve, reject) => {
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
          const response = JSON.parse(responseData);
          resolve(response);
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

// Function to download video from URL
async function downloadVideo(url, filename) {
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
        reject(new Error(`Failed to download video: HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to poll job until completion
async function pollJobUntilComplete(jobId, promptId, maxWaitTime = 300) {
  const startTime = Date.now();
  const pollInterval = 10000; // 10 seconds
  
  while (Date.now() - startTime < maxWaitTime * 1000) {
    try {
      const status = await checkJobStatus(jobId);
      
      console.log(`⏳ Job ${jobId} status: ${status.status || 'processing'}`);
      
      if (status.status === 'completed' && status.videoUrl) {
        console.log(`✅ Video ready for prompt ${promptId}: ${status.videoUrl}`);
        return status;
      } else if (status.status === 'failed' || status.status === 'error') {
        throw new Error(`Video generation failed: ${status.error || 'Unknown error'}`);
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
    } catch (error) {
      console.error(`❌ Error polling job ${jobId}:`, error.message);
      throw error;
    }
  }
  
  throw new Error(`Timeout: Video generation did not complete within ${maxWaitTime} seconds`);
}

// Main function to generate videos for specific prompts
async function generateVideosForPrompts(promptIds, options = {}) {
  console.log(`🎬 Starting Veo3 video generation for ${promptIds.length} prompts...`);
  
  // Ensure videos directory exists
  const videosDir = path.join(__dirname, '../public/videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;
  const jobs = [];

  // Start all video generation jobs
  for (const promptId of promptIds) {
    const prompt = data.prompts.find(p => p.id === promptId);
    
    if (!prompt) {
      console.log(`⚠️  Prompt with ID ${promptId} not found`);
      continue;
    }

    try {
      console.log(`\n🎨 Processing: "${prompt.title}" (ID: ${promptId})`);
      console.log(`📝 Prompt: ${prompt.prompt.substring(0, 100)}...`);
      
      // Start video generation
      const job = await generateVeo3Video(prompt.prompt, promptId, options);
      jobs.push({ ...job, prompt });
      
      // Rate limiting - wait 5 seconds between job starts
      if (promptIds.indexOf(promptId) < promptIds.length - 1) {
        console.log('⏱️  Waiting 5 seconds before next job...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
    } catch (error) {
      console.error(`❌ Error starting video generation for prompt ${promptId}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Started ${jobs.length} video generation jobs. Waiting for completion...`);

  // Poll all jobs until completion
  for (const job of jobs) {
    try {
      if (job.status !== 'completed') {
        console.log(`\n⏳ Waiting for job ${job.jobId} (${job.prompt.title})...`);
        const completedJob = await pollJobUntilComplete(job.jobId, job.promptId);
        job.videoUrl = completedJob.videoUrl;
      }

      // Download the video
      const filename = path.join(videosDir, `${job.prompt.slug}.mp4`);
      await downloadVideo(job.videoUrl, filename);
      
      // Update prompt with video URL
      job.prompt.videoUrl = `/videos/${job.prompt.slug}.mp4`;
      
      // Update aspect ratio if it was vertical generation
      if (options.aspectRatio === '9:16') {
        job.prompt.aspectRatio = '9:16';
        job.prompt.resolution = '720x1280'; // Assuming 720p for fast mode
      }
      
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error completing video for prompt ${job.promptId}:`, error.message);
      errorCount++;
    }
  }

  // Save updated prompts data
  if (successCount > 0) {
    fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
    console.log(`\n💾 Updated prompts.json with ${successCount} new videos`);
  }

  console.log(`\n📊 Final Summary:`);
  console.log(`✅ Successfully generated: ${successCount} videos`);
  console.log(`❌ Failed: ${errorCount} videos`);
  
  if (!KIE_API_KEY) {
    console.log(`\n⚠️  Note: Set KIE_API_KEY environment variable to use this script`);
    console.log(`   export KIE_API_KEY="your-kie-ai-api-key"`);
    console.log(`   Get your API key at: https://kie.ai/api-key`);
  }

  // Cost calculation
  const cost = options.mode === 'quality' ? successCount * 2.00 : successCount * 0.40;
  console.log(`💰 Estimated cost: $${cost.toFixed(2)} (${successCount} videos x $${options.mode === 'quality' ? '2.00' : '0.40'})`);
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎬 Veo3 Video Generation Script

Usage: node generate-veo3-videos.js [options] <prompt-ids>

Options:
  --mode=fast|quality    Generation mode (default: fast)
  --duration=seconds     Video duration (default: 8)
  --no-audio            Disable audio generation
  --aspect=16:9|9:16    Aspect ratio (default: 16:9)

Examples:
  node generate-veo3-videos.js 1 2 3
  node generate-veo3-videos.js --mode=quality 1,2,3
  node generate-veo3-videos.js --aspect=9:16 1 2 3
  node generate-veo3-videos.js --mode=fast --duration=8 all

Environment variables required:
  KIE_API_KEY - Your Kie.ai API key (get at https://kie.ai/api-key)

Pricing:
  Fast mode: $0.40 per 8-second video
  Quality mode: $2.00 per 8-second video

Available prompts:
${data.prompts.slice(0, 10).map(p => `  ${p.id}: ${p.title}`).join('\n')}
  ... and ${data.prompts.length - 10} more (use 'all' to generate all)
`);
    process.exit(1);
  }

  // Parse options
  const options = { mode: 'fast', duration: 8, audio: true, aspectRatio: '16:9' };
  const promptArgs = [];

  for (const arg of args) {
    if (arg.startsWith('--mode=')) {
      options.mode = arg.split('=')[1];
    } else if (arg.startsWith('--duration=')) {
      options.duration = parseInt(arg.split('=')[1]);
    } else if (arg === '--no-audio') {
      options.audio = false;
    } else if (arg.startsWith('--aspect=')) {
      options.aspectRatio = arg.split('=')[1];
    } else {
      promptArgs.push(arg);
    }
  }

  let promptIds = [];
  
  if (promptArgs[0] === 'all') {
    promptIds = data.prompts.map(p => p.id);
  } else {
    // Parse comma-separated or space-separated IDs
    promptIds = promptArgs.join(' ').split(/[,\s]+/).filter(id => id.trim());
  }

  console.log(`🎬 Generating ${promptIds.length} videos with options:`, options);
  
  generateVideosForPrompts(promptIds, options).catch(console.error);
}

module.exports = { generateVideosForPrompts };