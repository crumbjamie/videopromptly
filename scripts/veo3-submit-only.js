const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Function to submit single video generation job
async function submitVideoJob(prompt, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      aspectRatio = '16:9'
    } = options;

    console.log(`🎬 Submitting job for: "${prompt.title}"`);
    console.log(`   Prompt: ${prompt.prompt.substring(0, 80)}...`);
    console.log(`   Aspect: ${aspectRatio}`);

    const postData = JSON.stringify({
      prompt: prompt.prompt,
      model: "veo3_fast",
      aspectRatio: aspectRatio,
      watermark: "VideoPromptly"
    });

    const requestOptions = {
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

    const req = https.request(requestOptions, function (res) {
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

// Main function to submit video job only
async function submitSingleVideo(promptId, options = {}) {
  console.log(`\n🎬 Submitting Video Job - Prompt ID: ${promptId}`);
  console.log('='.repeat(50));

  // Find the prompt
  const prompt = data.prompts.find(p => p.id === promptId);
  if (!prompt) {
    throw new Error(`Prompt with ID ${promptId} not found`);
  }

  // Check if video already exists
  const videosDir = path.join(__dirname, '../public/videos');
  const videoFilepath = path.join(videosDir, `${prompt.slug}.mp4`);
  
  if (fs.existsSync(videoFilepath)) {
    console.log(`⚠️  Video already exists: ${prompt.slug}.mp4`);
    console.log(`   Delete it first if you want to regenerate`);
    return { success: false, reason: 'Video already exists' };
  }

  try {
    // Submit job
    console.log(`\n📤 Submitting video generation job...`);
    const job = await submitVideoJob(prompt, options);

    // Success summary with manual instructions
    console.log(`\n🎉 SUCCESS! Video job submitted:`)
    console.log(`   Title: "${prompt.title}"`);
    console.log(`   Task ID: ${job.taskId}`);
    console.log(`   Expected filename: ${prompt.slug}.mp4`);
    console.log(`   Rating: ${prompt.rating}⭐`);
    console.log(`   Category: ${prompt.category}`);
    
    console.log(`\n📋 NEXT STEPS:`);
    console.log(`   1. Go to https://kie.ai and check your video generation status`);
    console.log(`   2. When ready, download the video manually`);
    console.log(`   3. Save it as: public/videos/${prompt.slug}.mp4`);
    console.log(`   4. The database already has the videoUrl configured`);

    return { 
      success: true, 
      taskId: job.taskId,
      expectedFilename: `${prompt.slug}.mp4`,
      prompt: prompt
    };

  } catch (error) {
    console.error(`\n❌ Error submitting video job: ${error.message}`);
    return { success: false, error: error.message, prompt: prompt };
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎬 Veo3 Video Job Submitter

Usage: node veo3-submit-only.js <prompt-id>

Examples:
  node veo3-submit-only.js 2     # Submit Yeti's Emotional Vlog
  node veo3-submit-only.js 3     # Submit Gen Z Slang Classroom

Available prompts without video files:
${data.prompts.filter(p => {
  const videoFile = path.join(__dirname, '../public/videos', `${p.slug}.mp4`);
  return !fs.existsSync(videoFile);
}).slice(0, 10).map(p => `  ${p.id}: ${p.title} (${p.rating}⭐)`).join('\n')}

This script submits the video generation job to Kie.ai.
You'll need to manually download the completed video from the platform.
`);
    process.exit(1);
  }

  const promptId = args[0];

  console.log(`🎬 Submitting video job for prompt ${promptId}...`);
  submitSingleVideo(promptId)
    .then(result => {
      if (result.success) {
        console.log(`\n✅ Job submitted! Task ID: ${result.taskId}`);
        console.log(`Expected file: ${result.expectedFilename}`);
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

module.exports = { submitSingleVideo };