#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { generateSingleVideo } = require('./veo3-complete-single-workflow.js');

// Read database to find available prompts
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
const videosDir = path.join(__dirname, '../public/videos');

// Find prompts without videos, sorted by rating
function getAvailablePromptsByRating() {
  return data.prompts.filter(prompt => {
    const videoPath = path.join(videosDir, `${prompt.slug}.mp4`);
    return !fs.existsSync(videoPath);
  })
  .map(p => ({
    id: p.id,
    title: p.title,
    rating: p.rating,
    category: p.category,
    difficulty: p.difficulty,
    slug: p.slug
  }))
  .sort((a, b) => {
    // Sort by rating (highest first), then by ID for consistency
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return parseInt(a.id) - parseInt(b.id);
  });
}

// Batch video generation with rate limiting
async function batchGenerateByRating(count, options = {}) {
  console.log(`\n🎬 BATCH VIDEO GENERATION BY STAR RATING`);
  console.log('='.repeat(55));
  console.log(`📋 Generating ${count} videos (highest rated first)`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}\n`);

  // Get available prompts sorted by rating
  const availablePrompts = getAvailablePromptsByRating();
  
  if (availablePrompts.length === 0) {
    console.log('🎉 All videos have already been generated!');
    return [];
  }

  const promptsToGenerate = availablePrompts.slice(0, count);
  
  // Show the queue
  console.log('📊 Generation Queue (by rating):');
  promptsToGenerate.forEach((prompt, index) => {
    console.log(`   ${index + 1}. ${prompt.title} (${prompt.rating}⭐ - ${prompt.difficulty})`);
  });
  console.log('');

  const results = [];
  let successCount = 0;
  let errorCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < promptsToGenerate.length; i++) {
    const prompt = promptsToGenerate[i];
    
    console.log(`\n📋 [${i + 1}/${promptsToGenerate.length}] Processing: "${prompt.title}" (${prompt.rating}⭐)`);
    console.log('─'.repeat(50));

    try {
      const result = await generateSingleVideo(prompt.id, options);
      
      if (result.success) {
        successCount++;
        console.log(`   ✅ SUCCESS: ${result.prompt.title} (${prompt.rating}⭐)`);
        results.push({
          promptId: prompt.id,
          status: 'success',
          title: result.prompt.title,
          rating: prompt.rating,
          videoPath: result.videoPath,
          taskId: result.taskId
        });
      } else {
        errorCount++;
        console.log(`   ❌ FAILED: ${result.error || result.reason}`);
        results.push({
          promptId: prompt.id,
          status: 'failed',
          title: prompt.title,
          rating: prompt.rating,
          error: result.error || result.reason
        });
      }
    } catch (error) {
      errorCount++;
      console.log(`   ❌ ERROR: ${error.message}`);
      results.push({
        promptId: prompt.id,
        status: 'error',
        title: prompt.title,
        rating: prompt.rating,
        error: error.message
      });
    }

    // Rate limiting: wait 10 seconds between videos
    if (i < promptsToGenerate.length - 1) {
      console.log(`   ⏱️  Waiting 10 seconds before next video...`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  // Final summary with rating breakdown
  const endTime = Date.now();
  const totalTime = ((endTime - startTime) / 1000 / 60).toFixed(1);
  
  console.log(`\n📊 BATCH GENERATION SUMMARY`);
  console.log('='.repeat(55));
  console.log(`✅ Successful: ${successCount} videos`);
  console.log(`❌ Failed: ${errorCount} videos`);
  console.log(`📋 Total: ${promptsToGenerate.length} videos`);
  console.log(`⏰ Total time: ${totalTime} minutes`);
  console.log(`💰 Estimated cost: $${(promptsToGenerate.length * 0.40).toFixed(2)} (fast mode)`);

  // Rating breakdown
  const ratingBreakdown = {};
  results.filter(r => r.status === 'success').forEach(r => {
    ratingBreakdown[r.rating] = (ratingBreakdown[r.rating] || 0) + 1;
  });
  
  console.log(`\n⭐ Rating Breakdown of Successful Videos:`);
  [5, 4, 3, 2, 1].forEach(rating => {
    if (ratingBreakdown[rating]) {
      console.log(`   ${rating}⭐: ${ratingBreakdown[rating]} videos`);
    }
  });

  if (successCount > 0) {
    console.log(`\n🎉 ${successCount} videos generated successfully!`);
    console.log(`📁 Check: /public/videos/ directory`);
  }

  if (errorCount > 0) {
    console.log(`\n❌ Failed videos:`);
    results.filter(r => r.status !== 'success').forEach(r => {
      console.log(`   - ${r.title} (${r.rating}⭐): ${r.error}`);
    });
  }

  return results;
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    const available = getAvailablePromptsByRating();
    
    console.log(`
🎬 Batch Video Generation by Star Rating

Usage: node batch-generate-by-rating.js <count> [options]

Options:
  --model=veo3_fast|veo3_quality    Model to use (default: veo3_fast)
  --aspect=16:9|9:16|1:1           Aspect ratio (default: 16:9)

Examples:
  node batch-generate-by-rating.js 50             # Generate 50 highest-rated videos
  node batch-generate-by-rating.js 20 --model=veo3_quality
  node batch-generate-by-rating.js all            # Generate all available

Available prompts sorted by rating (${available.length} total):
${available.slice(0, 25).map((p, i) => `  ${i+1}. ${p.title} (${p.rating}⭐ - ${p.difficulty})`).join('\n')}
${available.length > 25 ? `  ... and ${available.length - 25} more` : ''}

Rating distribution:
${[5, 4, 3, 2, 1].map(rating => {
  const count = available.filter(p => p.rating === rating).length;
  return count > 0 ? `  ${rating}⭐: ${count} videos` : null;
}).filter(Boolean).join('\n')}

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
  const available = getAvailablePromptsByRating();
  let count;

  if (countArg === 'all') {
    count = available.length;
  } else {
    count = parseInt(countArg);
    if (isNaN(count) || count <= 0) {
      console.error('❌ Invalid count. Please provide a positive number or "all"');
      process.exit(1);
    }
  }

  if (available.length === 0) {
    console.log('🎉 All videos have already been generated!');
    process.exit(0);
  }

  const actualCount = Math.min(count, available.length);
  
  console.log(`🎬 Starting batch generation for ${actualCount} highest-rated videos...`);
  if (Object.keys(options).length > 0) {
    console.log(`⚙️  Options:`, options);
  }

  batchGenerateByRating(actualCount, options)
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

module.exports = { batchGenerateByRating };