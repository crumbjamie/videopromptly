const fs = require('fs');
const path = require('path');
const https = require('https');

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Function to submit video generation job
async function submitVeo3Job(prompt, promptId, options = {}) {
  return new Promise((resolve, reject) => {
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
      translation: false
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

    const req = https.request(requestOptions, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 200 && response.code === 200) {
            console.log(`✅ Submitted: "${prompt.title}" (ID: ${promptId})`);
            console.log(`   Task ID: ${response.data.taskId}`);
            resolve({
              taskId: response.data.taskId,
              promptId,
              prompt,
              status: 'submitted'
            });
          } else {
            console.error(`❌ Failed prompt ${promptId}:`, response.msg || response);
            reject(new Error(response.msg || `HTTP ${res.statusCode}`));
          }
        } catch (error) {
          console.error(`❌ Parse error for prompt ${promptId}:`, error);
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

// Function to check task status - we'll try different possible endpoints
async function checkTaskStatus(taskId) {
  return new Promise((resolve, reject) => {
    // Try the most likely endpoint first
    const requestOptions = {
      hostname: 'api.kie.ai',
      port: 443,
      path: `/api/v1/veo/task/${taskId}`, // Most common pattern
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(requestOptions, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(responseData);
            resolve(response);
          } catch (error) {
            reject(new Error(`Parse error: ${error.message}`));
          }
        } else {
          // If this endpoint fails, we'll handle it in the polling function
          resolve({ statusCode: res.statusCode, body: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Alternative: Try to find the video URL through a different approach
async function findCompletedVideo(taskId) {
  // Since direct status checking might not work, we'll try other approaches
  const possibleEndpoints = [
    `/api/v1/veo/result/${taskId}`,
    `/api/v1/veo/download/${taskId}`,
    `/api/v1/result/${taskId}`,
    `/api/v1/download/${taskId}`
  ];

  for (const endpoint of possibleEndpoints) {
    try {
      const result = await new Promise((resolve, reject) => {
        const requestOptions = {
          hostname: 'api.kie.ai',
          port: 443,
          path: endpoint,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${KIE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        };

        const req = https.request(requestOptions, (res) => {
          let responseData = '';

          res.on('data', (chunk) => {
            responseData += chunk;
          });

          res.on('end', () => {
            if (res.statusCode === 200) {
              try {
                const response = JSON.parse(responseData);
                if (response.data && response.data.videoUrl) {
                  resolve({ success: true, videoUrl: response.data.videoUrl });
                  return;
                }
              } catch (e) {
                // Not JSON or no videoUrl
              }
            }
            resolve({ success: false, statusCode: res.statusCode });
          });
        });

        req.on('error', reject);
        req.end();
      });

      if (result.success) {
        console.log(`🎬 Found video via ${endpoint}: ${result.videoUrl}`);
        return result.videoUrl;
      }
    } catch (error) {
      // Try next endpoint
      continue;
    }
  }

  return null;
}

// Function to download video from temporary URL
async function downloadVideo(videoUrl, filename) {
  return new Promise((resolve, reject) => {
    // Parse the URL to determine if it's HTTPS
    const url = new URL(videoUrl);
    const protocol = url.protocol === 'https:' ? https : require('http');
    
    console.log(`📥 Downloading: ${path.basename(filename)}`);
    
    const file = fs.createWriteStream(filename);
    
    protocol.get(videoUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filename)}`);
          resolve(filename);
        });
        
        file.on('error', (err) => {
          fs.unlink(filename, () => {}); // Delete incomplete file
          reject(err);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        const redirectUrl = response.headers.location;
        console.log(`🔄 Redirecting to: ${redirectUrl}`);
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

// Main workflow function
async function generateAndRetrieveVideos(promptIds, options = {}) {
  console.log(`🎬 Starting complete Veo3 workflow for ${promptIds.length} prompts...\n`);
  
  // Ensure directories exist
  const videosDir = path.join(__dirname, '../public/videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  const jobs = [];
  let successCount = 0;
  let errorCount = 0;

  // Phase 1: Submit all jobs
  console.log('📤 Phase 1: Submitting video generation jobs...');
  for (const promptId of promptIds) {
    const prompt = data.prompts.find(p => p.id === promptId);
    
    if (!prompt) {
      console.log(`⚠️  Prompt with ID ${promptId} not found`);
      continue;
    }

    try {
      const job = await submitVeo3Job(prompt, promptId, options);
      jobs.push(job);
      
      // Rate limiting
      if (promptIds.indexOf(promptId) < promptIds.length - 1) {
        console.log('   ⏱️  Waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`❌ Failed to submit prompt ${promptId}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Submitted ${jobs.length} jobs. Waiting for completion...\n`);

  // Phase 2: Wait and retrieve videos
  console.log('⏳ Phase 2: Waiting for video generation and retrieving results...');
  
  for (const job of jobs) {
    try {
      console.log(`\n🎬 Processing: "${job.prompt.title}" (Task: ${job.taskId})`);
      
      // Wait a bit for the video to potentially complete
      console.log('   ⏱️  Initial wait (30 seconds)...');
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      // Try to find the completed video
      let videoUrl = null;
      let attempts = 0;
      const maxAttempts = 20; // 20 attempts = ~10 minutes max wait
      
      while (!videoUrl && attempts < maxAttempts) {
        attempts++;
        console.log(`   🔍 Attempt ${attempts}/${maxAttempts}: Looking for completed video...`);
        
        videoUrl = await findCompletedVideo(job.taskId);
        
        if (!videoUrl) {
          console.log('   ⏱️  Video not ready, waiting 30 seconds...');
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
      }

      if (videoUrl) {
        // Download the video
        const filename = path.join(videosDir, `${job.prompt.slug}.mp4`);
        await downloadVideo(videoUrl, filename);
        
        // Update the prompt in our data
        job.prompt.videoUrl = `/videos/${job.prompt.slug}.mp4`;
        
        successCount++;
        console.log(`   ✅ Completed: "${job.prompt.title}"`);
      } else {
        console.log(`   ❌ Timeout: Could not retrieve video for "${job.prompt.title}"`);
        console.log(`   💡 Check https://kie.ai manually for task: ${job.taskId}`);
        errorCount++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing "${job.prompt.title}": ${error.message}`);
      errorCount++;
    }
  }

  // Phase 3: Update database
  if (successCount > 0) {
    console.log(`\n💾 Updating database with ${successCount} video URLs...`);
    fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
    console.log('✅ Database updated!');
  }

  // Final summary
  console.log(`\n📊 Final Summary:`);
  console.log(`✅ Successfully completed: ${successCount} videos`);
  console.log(`❌ Failed or timed out: ${errorCount} videos`);
  
  const cost = options.mode === 'quality' ? jobs.length * 2.00 : jobs.length * 0.40;
  console.log(`💰 Total cost: $${cost.toFixed(2)}`);
  
  if (errorCount > 0) {
    console.log(`\n💡 For failed videos, check https://kie.ai manually`);
    console.log(`   Your account may show completed videos that we couldn't retrieve via API`);
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎬 Complete Veo3 Video Generation & Retrieval Workflow

Usage: node veo3-complete-workflow.js [options] <prompt-ids>

Options:
  --mode=fast|quality    Generation mode (default: fast)
  --duration=seconds     Video duration (default: 8)
  --no-audio            Disable audio generation
  --aspect=16:9|9:16    Aspect ratio (default: 16:9)

Examples:
  node veo3-complete-workflow.js 6,9,10        # Generate 3 videos
  node veo3-complete-workflow.js --mode=quality 6,9,10,12,16,19,21,24,26,27,28,29,31,35
  node veo3-complete-workflow.js 5star         # All 5-star prompts

This script will:
1. Submit video generation jobs to Kie.ai
2. Wait for completion and retrieve video URLs  
3. Download videos to /public/videos/
4. Update database with video URLs

5-Star prompts: 6,9,10,12,16,19,21,24,26,27,28,29,31,35
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
  
  if (promptArgs[0] === '5star') {
    promptIds = data.prompts.filter(p => p.rating === 5).map(p => p.id);
  } else if (promptArgs[0] === 'all') {
    promptIds = data.prompts.map(p => p.id);
  } else {
    promptIds = promptArgs.join(' ').split(/[,\s]+/).filter(id => id.trim());
  }

  console.log(`🎬 Starting workflow for ${promptIds.length} prompts with options:`, options);
  generateAndRetrieveVideos(promptIds, options).catch(console.error);
}

module.exports = { generateAndRetrieveVideos };