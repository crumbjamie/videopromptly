const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// Read the current prompts file
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Task IDs from our 4-star submissions
const submittedTasks = [
  { promptId: "11", taskId: "516a62a3b3e9c5635cc36fc3e7ee416f", title: "Bigfoot's Secret Spot" },
  { promptId: "13", taskId: "1dc949ddcc1031b363cd3bb654b1b2d1", title: "Storm Trooper Daily Vlog" },
  { promptId: "14", taskId: "d06de7d60b12abf563f2b863cb3a715a", title: "Yeti's Ice Soup Recipe" },
  { promptId: "22", taskId: "74b50e2f7438773be8284ce45435c5bb", title: "Volcanic Egg ASMR" },
  { promptId: "25", taskId: "a782ed267fac87606d56ef44157a8e94", title: "Crystal Material Cutting" },
  { promptId: "30", taskId: "28aa5c5d4c46878bd8582742ca3f82cc", title: "Android Awakening" },
  { promptId: "33", taskId: "d11781b7154219bb76d71d15201f9b1b", title: "Heartbreak Revelation" },
  { promptId: "36", taskId: "4819730f16003d1b7d7c62eafb7fa01a", title: "Impossible MrBeast Challenge" },
  { promptId: "40", taskId: "29caf8eac0b3f978763413fb45bf1f93", title: "Vertical Bigfoot Dance" },
  { promptId: "46", taskId: "bb0981d423896f11e66563796a2f81b9", title: "Pure Consciousness" }
];

// Function to get video record by task ID
async function getVideoRecord(taskId) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'GET',
      hostname: 'api.kie.ai',
      path: `/api/v1/veo/record-info?taskId=${taskId}`,
      headers: {
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
          resolve(response);
        } catch (error) {
          console.error(`❌ Parse error:`, error);
          reject(error);
        }
      });

      res.on("error", function (error) {
        console.error(`❌ Request error:`, error);
        reject(error);
      });
    });

    req.end();
  });
}

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

// Main function to fetch all completed videos
async function fetchCompletedVideos() {
  console.log(`\n🎬 Fetching Completed 4-Star Videos`);
  console.log('='.repeat(50));

  // Ensure videos directory exists
  const videosDir = path.join(__dirname, '../public/videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
    console.log(`📁 Created videos directory`);
  }

  let completedCount = 0;
  let processingCount = 0;
  let errorCount = 0;

  for (const task of submittedTasks) {
    console.log(`\n📋 Processing: ${task.title} (ID: ${task.promptId})`);
    console.log(`   Task ID: ${task.taskId}`);

    try {
      // Get video record
      const response = await getVideoRecord(task.taskId);
      
      if (response.code !== 200) {
        console.log(`❌ API Error: ${response.msg}`);
        errorCount++;
        continue;
      }

      const record = response.data;
      
      // Check if completed
      if (record.successFlag === 1 && record.response?.resultUrls?.length > 0) {
        const videoUrl = record.response.resultUrls[0];
        console.log(`✅ Video ready! URL: ${videoUrl}`);
        
        // Find prompt and prepare download
        const prompt = data.prompts.find(p => p.id === task.promptId);
        if (!prompt) {
          console.log(`❌ Prompt not found in database`);
          errorCount++;
          continue;
        }

        const videoFilepath = path.join(videosDir, `${prompt.slug}.mp4`);
        
        // Check if already downloaded
        if (fs.existsSync(videoFilepath)) {
          console.log(`⚠️  Video already exists: ${prompt.slug}.mp4`);
          if (verifyVideoFile(videoFilepath)) {
            console.log(`✅ File verified, skipping download`);
            completedCount++;
            continue;
          } else {
            console.log(`🗑️  Removing invalid file...`);
            fs.unlinkSync(videoFilepath);
          }
        }

        // Download video
        await downloadVideo(videoUrl, videoFilepath);
        
        // Verify download
        if (verifyVideoFile(videoFilepath)) {
          console.log(`🎉 Successfully downloaded: ${prompt.slug}.mp4`);
          completedCount++;
        } else {
          console.log(`❌ Download verification failed`);
          errorCount++;
        }
        
      } else if (record.errorCode) {
        console.log(`❌ Video generation failed: ${record.errorMessage || 'Unknown error'}`);
        errorCount++;
      } else {
        console.log(`⏳ Video still processing...`);
        processingCount++;
      }

    } catch (error) {
      console.log(`❌ Error processing task: ${error.message}`);
      errorCount++;
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log(`\n📊 SUMMARY:`);
  console.log(`   ✅ Completed downloads: ${completedCount}`);
  console.log(`   ⏳ Still processing: ${processingCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📋 Total tasks: ${submittedTasks.length}`);

  if (completedCount > 0) {
    console.log(`\n🎉 Successfully downloaded ${completedCount} videos!`);
    console.log(`   Check: public/videos/ directory`);
  }

  if (processingCount > 0) {
    console.log(`\n⏳ ${processingCount} videos are still processing. Run this script again later.`);
  }
}

// Run the script
fetchCompletedVideos()
  .then(() => {
    console.log(`\n✅ Fetch operation completed!`);
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });