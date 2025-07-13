#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Import all batch generation functions
const { generateBatch6, BATCH_6_PROMPT_IDS } = require('./generate-batch-6');
const { generateBatch7, BATCH_7_PROMPT_IDS } = require('./generate-batch-7');
const { generateBatch8, BATCH_8_PROMPT_IDS } = require('./generate-batch-8');

console.log('🎬 VIDEOPROMPTLY COMPLETE DATABASE GENERATION');
console.log('=======================================================');
console.log('');

// Check environment
if (!process.env.KIE_API_KEY) {
  console.log('❌ KIE_API_KEY environment variable not set');
  console.log('   Set it with: export KIE_API_KEY="your-api-key"');
  console.log('   Get your API key at: https://kie.ai/api-key');
  process.exit(1);
}

// Show batch summary
console.log('📊 BATCH GENERATION PLAN');
console.log('=======================================================');
console.log(`🎯 Batch 6: ${BATCH_6_PROMPT_IDS.length} videos (Featured 5⭐ + 4⭐)`);
console.log(`   • Priority: Featured content first`);
console.log(`   • Cost: $${(BATCH_6_PROMPT_IDS.length * 0.40).toFixed(2)}`);
console.log(`   • Time: ~${Math.round(BATCH_6_PROMPT_IDS.length * 2.5)} minutes`);
console.log('');

console.log(`🎯 Batch 7: ${BATCH_7_PROMPT_IDS.length} videos (Remaining 4⭐)`);
console.log(`   • Priority: 4-star completion`);
console.log(`   • Cost: $${(BATCH_7_PROMPT_IDS.length * 0.40).toFixed(2)}`);
console.log(`   • Time: ~${Math.round(BATCH_7_PROMPT_IDS.length * 2.5)} minutes`);
console.log('');

console.log(`🎯 Batch 8: ${BATCH_8_PROMPT_IDS.length} videos (Final 3⭐)`);
console.log(`   • Priority: Database completion`);
console.log(`   • Cost: $${(BATCH_8_PROMPT_IDS.length * 0.40).toFixed(2)}`);
console.log(`   • Time: ~${Math.round(BATCH_8_PROMPT_IDS.length * 2.5)} minutes`);
console.log('');

const totalVideos = BATCH_6_PROMPT_IDS.length + BATCH_7_PROMPT_IDS.length + BATCH_8_PROMPT_IDS.length;
const totalCost = totalVideos * 0.40;
const totalTime = Math.round(totalVideos * 2.5);

console.log('📊 TOTAL SUMMARY');
console.log('=======================================================');
console.log(`🎬 Total videos: ${totalVideos}`);
console.log(`💰 Total cost: $${totalCost.toFixed(2)} (fast mode)`);
console.log(`⏱️  Total time: ~${totalTime} minutes (${Math.round(totalTime/60)} hours)`);
console.log(`🎯 Result: 100% database completion`);
console.log('');

console.log('⚠️  IMPORTANT NOTES:');
console.log('• These batches will run sequentially');
console.log('• Each batch waits for the previous to complete');
console.log('• Check your Kie.ai credit balance before starting');
console.log('• Monitor logs in batch_generation_*.log files');
console.log('• Videos will be saved to /public/videos/');
console.log('• Run thumbnail generation after completion');
console.log('');

// Prompt for confirmation
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('🚀 Do you want to start all batch generations? (y/N): ', async (answer) => {
  rl.close();
  
  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    console.log('❌ Batch generation cancelled.');
    process.exit(0);
  }

  console.log('');
  console.log('🚀 Starting complete database generation...');
  console.log('=======================================================');

  try {
    // Run Batch 6
    console.log('');
    console.log('🎬 STARTING BATCH 6 - FEATURED CONTENT');
    console.log('=======================================================');
    await generateBatch6();
    console.log('✅ Batch 6 completed!');

    // Wait 30 seconds between batches
    console.log('');
    console.log('⏱️  Waiting 30 seconds before next batch...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Run Batch 7
    console.log('');
    console.log('🎬 STARTING BATCH 7 - 4-STAR COMPLETION');
    console.log('=======================================================');
    await generateBatch7();
    console.log('✅ Batch 7 completed!');

    // Wait 30 seconds between batches
    console.log('');
    console.log('⏱️  Waiting 30 seconds before next batch...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Run Batch 8
    console.log('');
    console.log('🎬 STARTING BATCH 8 - FINAL COMPLETION');
    console.log('=======================================================');
    await generateBatch8();
    console.log('✅ Batch 8 completed!');

    // Final success message
    console.log('');
    console.log('🎉🎉🎉 ALL BATCHES COMPLETED SUCCESSFULLY! 🎉🎉🎉');
    console.log('=======================================================');
    console.log('✅ VideoPromptly database is now 100% complete');
    console.log('✅ All prompts have generated videos');
    console.log('✅ Ready for thumbnail generation and production');
    console.log('');
    console.log('📋 NEXT STEPS:');
    console.log('1. Run: node scripts/generate-video-thumbnails.js');
    console.log('2. Check all videos in /public/videos/');
    console.log('3. Verify thumbnails in /public/thumbnails/');
    console.log('4. Deploy to production');
    console.log('5. Monitor analytics and performance');
    console.log('');
    console.log('🚀 VideoPromptly is ready to launch! 🚀');

  } catch (error) {
    console.error('');
    console.error('❌ BATCH GENERATION FAILED');
    console.error('=======================================================');
    console.error(`Error: ${error.message}`);
    console.error('');
    console.error('📋 Troubleshooting:');
    console.error('• Check your Kie.ai API key and credits');
    console.error('• Review the latest batch_generation_*.log file');
    console.error('• Restart from the failed batch manually');
    console.error('• Contact support if issues persist');
    process.exit(1);
  }
});

module.exports = {
  generateBatch6,
  generateBatch7, 
  generateBatch8,
  BATCH_6_PROMPT_IDS,
  BATCH_7_PROMPT_IDS,
  BATCH_8_PROMPT_IDS
};