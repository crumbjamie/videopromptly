#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { generateSingleVideo } = require('./veo3-complete-single-workflow.js');

// Read database to find available prompts
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
const videosDir = path.join(__dirname, '../public/videos');

// Find prompts without videos
function getAvailablePrompts() {
  return data.prompts.filter(prompt => {
    const videoPath = path.join(videosDir, `${prompt.slug}.mp4`);
    return !fs.existsSync(videoPath);
  }).map(p => ({
    id: p.id,
    title: p.title,
    rating: p.rating,
    category: p.category,
    difficulty: p.difficulty
  }));
}

// Batch video generation with rate limiting
async function batchGenerateVideos(promptIds, options = {}) {
  console.log(`\n🎬 BATCH VIDEO GENERATION`);
  console.log('='.repeat(50));
  console.log(`📋 Generating ${promptIds.length} videos`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}\n`);

  const results = [];
  let successCount = 0;
  let errorCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < promptIds.length; i++) {
    const promptId = promptIds[i];
    const prompt = data.prompts.find(p => p.id === promptId);
    
    console.log(`\n📋 [${i + 1}/${promptIds.length}] Processing: "${prompt?.title || 'Unknown'}" (ID: ${promptId})`);
    console.log('─'.repeat(40));

    try {
      const result = await generateSingleVideo(promptId, options);
      
      if (result.success) {
        successCount++;
        console.log(`   ✅ SUCCESS: ${result.prompt.title}`);
        results.push({
          promptId,
          status: 'success',
          title: result.prompt.title,
          videoPath: result.videoPath,
          taskId: result.taskId
        });
      } else {
        errorCount++;
        console.log(`   ❌ FAILED: ${result.error || result.reason}`);
        results.push({
          promptId,
          status: 'failed',
          error: result.error || result.reason
        });
      }
    } catch (error) {
      errorCount++;
      console.log(`   ❌ ERROR: ${error.message}`);
      results.push({
        promptId,
        status: 'error',
        error: error.message
      });
    }

    // Rate limiting: wait 10 seconds between videos to avoid overwhelming the API
    if (i < promptIds.length - 1) {
      console.log(`   ⏱️  Waiting 10 seconds before next video...`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  // Final summary
  const endTime = Date.now();
  const totalTime = ((endTime - startTime) / 1000 / 60).toFixed(1);
  
  console.log(`\n📊 BATCH GENERATION SUMMARY`);
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${successCount} videos`);
  console.log(`❌ Failed: ${errorCount} videos`);
  console.log(`📋 Total: ${promptIds.length} videos`);
  console.log(`⏰ Total time: ${totalTime} minutes`);
  console.log(`💰 Estimated cost: $${(promptIds.length * 0.40).toFixed(2)} (fast mode)`);

  if (successCount > 0) {
    console.log(`\n🎉 ${successCount} videos generated successfully!`);
    console.log(`📁 Check: /public/videos/ directory`);
  }

  if (errorCount > 0) {
    console.log(`\n❌ Failed videos:`);
    results.filter(r => r.status !== 'success').forEach(r => {
      console.log(`   - ID ${r.promptId}: ${r.error}`);
    });
  }

  return results;
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    const available = getAvailablePrompts();
    
    console.log(`
🎬 Batch Video Generation

Usage: node batch-generate-videos.js <count> [options]

Options:
  --model=veo3_fast|veo3_quality    Model to use (default: veo3_fast)
  --aspect=16:9|9:16|1:1           Aspect ratio (default: 16:9)

Examples:
  node batch-generate-videos.js 20              # Generate 20 videos
  node batch-generate-videos.js 10 --model=veo3_quality
  node batch-generate-videos.js all             # Generate all available

Available prompts (${available.length} total):
${available.slice(0, 20).map(p => `  ${p.id}: "${p.title}" (${p.rating}⭐ - ${p.difficulty})`).join('\n')}
${available.length > 20 ? `  ... and ${available.length - 20} more` : ''}

This will generate videos with 10-second delays between each to avoid API rate limits.
Estimated time: ~${((available.length * 4) / 60).toFixed(1)} hours for all videos.
`);
    process.exit(1);
  }

  // Parse arguments
  const countArg = args[0];
  const options = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--model=')) {
      options.model = arg.split('=')[1];
    } else if (arg.startsWith('--aspect=')) {
      options.aspectRatio = arg.split('=')[1];
    }
  }

  // Get prompts to process
  const available = getAvailablePrompts();
  let promptIds;

  if (countArg === 'all') {
    promptIds = available.map(p => p.id);
  } else {
    const count = parseInt(countArg);
    if (isNaN(count) || count <= 0) {
      console.error('❌ Invalid count. Please provide a positive number or "all"');
      process.exit(1);
    }
    
    // Select the highest rated prompts first
    const sorted = available.sort((a, b) => b.rating - a.rating);
    promptIds = sorted.slice(0, count).map(p => p.id);
  }

  if (promptIds.length === 0) {
    console.log('🎉 All videos have already been generated!');
    process.exit(0);
  }

  console.log(`🎬 Starting batch generation for ${promptIds.length} videos...`);
  if (Object.keys(options).length > 0) {
    console.log(`⚙️  Options:`, options);
  }

  batchGenerateVideos(promptIds, options)
    .then(results => {
      const successCount = results.filter(r => r.status === 'success').length;
      console.log(`\n✅ Batch generation completed! ${successCount}/${results.length} videos successful.`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Batch generation failed:', error);
      process.exit(1);
    });
}

module.exports = { batchGenerateVideos };