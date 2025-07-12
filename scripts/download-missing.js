const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

// Read the ready-for-download data
const downloadDataPath = path.join(__dirname, 'ready-for-download.json');
const downloadData = JSON.parse(fs.readFileSync(downloadDataPath, 'utf8'));

// Read prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Function to download video
async function downloadVideo(videoUrl, filepath) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading video to: ${path.basename(filepath)}`);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(videoUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded successfully!`);
          resolve(filepath);
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.log(`🔄 Following redirect to: ${redirectUrl}`);
        file.close();
        fs.unlink(filepath, () => {});
        downloadVideo(redirectUrl, filepath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Function to verify video file
function verifyVideoFile(filepath) {
  try {
    const stats = fs.statSync(filepath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`🔍 Video verification:`);
    console.log(`   File exists: ✅`);
    console.log(`   File size: ${fileSizeMB} MB`);
    
    if (stats.size < 100000) {
      console.log(`   ⚠️  File size seems too small for a video`);
      return false;
    }
    
    console.log(`   ✅ Video file appears valid`);
    return true;
  } catch (error) {
    console.log(`   ❌ File verification failed: ${error.message}`);
    return false;
  }
}

// Main download function
async function downloadMissingVideos() {
  console.log(`\n🎬 Downloading Missing Videos`);
  console.log('='.repeat(40));

  // Ensure videos directory exists
  const videosDir = path.join(__dirname, '../public/videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
    console.log(`📁 Created videos directory`);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const task of downloadData.readyForDownload) {
    console.log(`\n📋 Downloading: ${task.title} (ID: ${task.promptId})`);
    console.log(`   URL: ${task.videoUrl}`);

    try {
      // Find prompt
      const prompt = data.prompts.find(p => p.id === task.promptId);
      if (!prompt) {
        console.log(`❌ Prompt not found in database`);
        errorCount++;
        continue;
      }

      const videoFilepath = path.join(videosDir, `${prompt.slug}.mp4`);
      
      // Check if already exists
      if (fs.existsSync(videoFilepath)) {
        console.log(`⚠️  Video already exists: ${prompt.slug}.mp4`);
        if (verifyVideoFile(videoFilepath)) {
          console.log(`✅ File verified, skipping download`);
          successCount++;
          continue;
        } else {
          console.log(`🗑️  Removing invalid file...`);
          fs.unlinkSync(videoFilepath);
        }
      }

      // Download video
      await downloadVideo(task.videoUrl, videoFilepath);
      
      // Verify download
      if (verifyVideoFile(videoFilepath)) {
        console.log(`🎉 Successfully downloaded: ${prompt.slug}.mp4`);
        successCount++;
      } else {
        console.log(`❌ Download verification failed`);
        errorCount++;
      }

    } catch (error) {
      console.log(`❌ Error downloading video: ${error.message}`);
      errorCount++;
    }
  }

  // Summary
  console.log(`\n📊 DOWNLOAD SUMMARY:`);
  console.log(`   ✅ Successful downloads: ${successCount}`);
  console.log(`   ❌ Failed downloads: ${errorCount}`);
  console.log(`   📋 Total videos: ${downloadData.readyForDownload.length}`);

  if (successCount > 0) {
    console.log(`\n🎉 Successfully downloaded ${successCount} missing videos!`);
    console.log(`   Check: public/videos/ directory`);
  }

  // Clean up
  if (fs.existsSync(downloadDataPath)) {
    fs.unlinkSync(downloadDataPath);
    console.log(`🗑️  Cleaned up temporary download data file`);
  }
}

// Run the download
downloadMissingVideos()
  .then(() => {
    console.log(`\n✅ Download operation completed!`);
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });