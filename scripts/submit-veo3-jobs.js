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
            console.log(`✅ Submitted prompt ${promptId}: "${prompt.title}"`);
            console.log(`   Task ID: ${response.data.taskId}`);
            resolve({
              taskId: response.data.taskId,
              promptId,
              prompt
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

// Main function to submit jobs for specific prompts
async function submitJobsForPrompts(promptIds, options = {}) {
  console.log(`🎬 Submitting Veo3 jobs for ${promptIds.length} prompts...`);
  console.log(`Mode: ${options.mode || 'fast'}, Duration: ${options.duration || 8}s, Audio: ${options.audio !== false}\n`);

  let successCount = 0;
  let errorCount = 0;
  const submittedJobs = [];

  for (const promptId of promptIds) {
    const prompt = data.prompts.find(p => p.id === promptId);
    
    if (!prompt) {
      console.log(`⚠️  Prompt with ID ${promptId} not found`);
      continue;
    }

    try {
      console.log(`🎨 [${promptIds.indexOf(promptId) + 1}/${promptIds.length}] "${prompt.title}"`);
      console.log(`   ${prompt.prompt.substring(0, 80)}...`);
      
      const job = await submitVeo3Job(prompt, promptId, options);
      submittedJobs.push(job);
      successCount++;
      
      // Rate limiting - wait 3 seconds between submissions
      if (promptIds.indexOf(promptId) < promptIds.length - 1) {
        console.log('   ⏱️  Waiting 3 seconds...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error) {
      console.error(`❌ Error submitting prompt ${promptId}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Submission Summary:`);
  console.log(`✅ Successfully submitted: ${successCount} jobs`);
  console.log(`❌ Failed: ${errorCount} jobs`);
  
  // Cost calculation
  const cost = options.mode === 'quality' ? successCount * 2.00 : successCount * 0.40;
  console.log(`💰 Estimated cost: $${cost.toFixed(2)}`);

  console.log(`\n📋 Submitted Task IDs:`);
  submittedJobs.forEach(job => {
    console.log(`   ${job.promptId}: ${job.taskId}`);
  });

  console.log(`\n💡 Next steps:`);
  console.log(`   • Check https://kie.ai for video generation progress`);
  console.log(`   • Videos will appear in your Kie.ai dashboard when ready`);
  console.log(`   • Download completed videos and add them to /public/videos/`);
  console.log(`   • Update prompts.json with video URLs`);

  return submittedJobs;
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎬 Veo3 Job Submission Script

Usage: node submit-veo3-jobs.js [options] <prompt-ids>

Options:
  --mode=fast|quality    Generation mode (default: fast)
  --duration=seconds     Video duration (default: 8)
  --no-audio            Disable audio generation
  --aspect=16:9|9:16    Aspect ratio (default: 16:9)

Examples:
  node submit-veo3-jobs.js 1 2 3
  node submit-veo3-jobs.js --mode=quality 6,9,10,12,16,19,21,24,26,27,28,29,31,35
  node submit-veo3-jobs.js --aspect=9:16 40 41

Get 5-star prompts: node scripts/generate-5star-videos.js
`);
    process.exit(1);
  }

  // Parse options (same as before)
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
  } else if (promptArgs[0] === '5star') {
    promptIds = data.prompts.filter(p => p.rating === 5).map(p => p.id);
  } else {
    promptIds = promptArgs.join(' ').split(/[,\s]+/).filter(id => id.trim());
  }

  submitJobsForPrompts(promptIds, options).catch(console.error);
}

module.exports = { submitJobsForPrompts };