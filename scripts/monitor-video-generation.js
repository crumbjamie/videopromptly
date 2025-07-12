#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const videosDir = path.join(__dirname, '../public/videos');
const checkInterval = 10000; // Check every 10 seconds

let lastVideoCount = 0;
let knownVideos = new Set();

// Initialize known videos
function initializeKnownVideos() {
  try {
    const videos = fs.readdirSync(videosDir)
      .filter(file => file.endsWith('.mp4'))
      .map(file => path.join(videosDir, file));
    
    knownVideos = new Set(videos);
    lastVideoCount = knownVideos.size;
    
    console.log(`🎬 VIDEO GENERATION MONITOR STARTED`);
    console.log('='.repeat(50));
    console.log(`⏰ Started: ${new Date().toLocaleString()}`);
    console.log(`📊 Initial video count: ${lastVideoCount}`);
    console.log(`🔍 Monitoring: ${videosDir}`);
    console.log(`⏱️  Check interval: ${checkInterval/1000} seconds`);
    console.log('='.repeat(50));
    console.log('Waiting for new videos...\n');
  } catch (error) {
    console.error('❌ Error initializing:', error.message);
    process.exit(1);
  }
}

// Get video file stats
function getVideoStats(filepath) {
  try {
    const stats = fs.statSync(filepath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const filename = path.basename(filepath, '.mp4');
    return {
      filename,
      size: fileSizeMB,
      created: stats.mtime
    };
  } catch (error) {
    return null;
  }
}

// Check for new videos
function checkForNewVideos() {
  try {
    const currentVideos = fs.readdirSync(videosDir)
      .filter(file => file.endsWith('.mp4'))
      .map(file => path.join(videosDir, file));
    
    const currentVideoSet = new Set(currentVideos);
    const currentCount = currentVideoSet.size;
    
    // Check if count changed
    if (currentCount !== lastVideoCount) {
      console.log(`📊 Video count changed: ${lastVideoCount} → ${currentCount} (+${currentCount - lastVideoCount})`);
      
      // Find new videos
      const newVideos = currentVideos.filter(video => !knownVideos.has(video));
      
      if (newVideos.length > 0) {
        console.log(`\n🎉 NEW VIDEO${newVideos.length > 1 ? 'S' : ''} DETECTED!`);
        console.log('─'.repeat(40));
        
        newVideos.forEach(videoPath => {
          const stats = getVideoStats(videoPath);
          if (stats) {
            console.log(`✅ ${stats.filename}`);
            console.log(`   📊 Size: ${stats.size} MB`);
            console.log(`   ⏰ Added: ${stats.created.toLocaleTimeString()}`);
            console.log('');
          }
        });
        
        // Update thumbnail count
        const thumbnailsDir = path.join(__dirname, '../public/thumbnails');
        try {
          const thumbnailCount = fs.readdirSync(thumbnailsDir)
            .filter(file => file.endsWith('.jpg')).length;
          console.log(`📸 Current thumbnails: ${thumbnailCount}`);
        } catch (e) {
          console.log(`📸 Thumbnails: (error reading directory)`);
        }
        
        console.log('─'.repeat(40));
        console.log(`⏰ ${new Date().toLocaleTimeString()}\n`);
      }
      
      // Update tracking
      knownVideos = currentVideoSet;
      lastVideoCount = currentCount;
    }
    
  } catch (error) {
    console.error(`❌ Error checking videos: ${error.message}`);
  }
}

// Show periodic status update
let statusUpdateCount = 0;
function showPeriodicStatus() {
  statusUpdateCount++;
  
  // Show status every 30 checks (5 minutes)
  if (statusUpdateCount % 30 === 0) {
    try {
      // Check batch processes
      const { execSync } = require('child_process');
      const batchProcesses = execSync('ps aux | grep "batch-generate-by-rating" | grep -v grep | wc -l', {encoding: 'utf8'}).trim();
      
      console.log(`📋 STATUS UPDATE (${new Date().toLocaleTimeString()})`);
      console.log(`   🎬 Videos: ${lastVideoCount}`);
      console.log(`   🔄 Batch processes: ${batchProcesses}`);
      console.log(`   ⏱️  Uptime: ${Math.floor(statusUpdateCount * checkInterval / 1000 / 60)} minutes\n`);
    } catch (error) {
      console.log(`📋 STATUS UPDATE (${new Date().toLocaleTimeString()}): ${lastVideoCount} videos\n`);
    }
  }
}

// Signal handlers for clean exit
process.on('SIGINT', () => {
  console.log('\n\n🛑 Monitor stopped by user');
  console.log(`📊 Final count: ${lastVideoCount} videos`);
  console.log(`⏰ Stopped: ${new Date().toLocaleString()}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Monitor terminated');
  process.exit(0);
});

// Main monitoring loop
function startMonitoring() {
  initializeKnownVideos();
  
  setInterval(() => {
    checkForNewVideos();
    showPeriodicStatus();
  }, checkInterval);
}

// Start if run directly
if (require.main === module) {
  startMonitoring();
}

module.exports = { startMonitoring };