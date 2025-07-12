const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// All task IDs we've submitted (including earlier ones and recent 4-star submissions)
const allSubmittedTasks = [
  // From our very first submissions
  { promptId: "2", taskId: "d5fa1c0c733545b624d292cf77065ce6", title: "Yeti's Emotional Vlog" },
  { promptId: "3", taskId: "c366dd2fcec907351b94d77b36b2998e", title: "Gen Z Slang Classroom" },
  
  // From 4-star submissions
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

// Read prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

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

// Check which videos exist locally
function checkLocalVideo(promptId) {
  const prompt = data.prompts.find(p => p.id === promptId);
  if (!prompt) return { exists: false, reason: 'Prompt not found' };
  
  const videoPath = path.join(__dirname, '../public/videos', `${prompt.slug}.mp4`);
  const exists = fs.existsSync(videoPath);
  
  if (exists) {
    const stats = fs.statSync(videoPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    return { exists: true, size: fileSizeMB, path: videoPath };
  }
  
  return { exists: false, reason: 'File not found' };
}

// Main function to check all submissions
async function checkAllSubmissions() {
  console.log(`\n🔍 Checking All Video Submissions`);
  console.log('='.repeat(60));

  const needDownload = [];
  const alreadyDownloaded = [];
  const stillProcessing = [];
  const failed = [];

  for (const task of allSubmittedTasks) {
    console.log(`\n📋 ${task.title} (ID: ${task.promptId})`);
    console.log(`   Task ID: ${task.taskId}`);

    // Check if we have it locally
    const localCheck = checkLocalVideo(task.promptId);
    if (localCheck.exists) {
      console.log(`✅ Already downloaded: ${localCheck.size} MB`);
      alreadyDownloaded.push(task);
      continue;
    }

    // Check API status
    try {
      const response = await getVideoRecord(task.taskId);
      
      if (response.code !== 200) {
        console.log(`❌ API Error: ${response.msg}`);
        failed.push({ ...task, error: response.msg });
        continue;
      }

      const record = response.data;
      
      if (record.successFlag === 1 && record.response?.resultUrls?.length > 0) {
        const videoUrl = record.response.resultUrls[0];
        console.log(`🎬 Video ready for download!`);
        console.log(`   URL: ${videoUrl}`);
        needDownload.push({ ...task, videoUrl, record });
      } else if (record.errorCode) {
        console.log(`❌ Generation failed: ${record.errorMessage || 'Unknown error'}`);
        failed.push({ ...task, error: record.errorMessage });
      } else {
        console.log(`⏳ Still processing...`);
        stillProcessing.push(task);
      }

    } catch (error) {
      console.log(`❌ Error checking task: ${error.message}`);
      failed.push({ ...task, error: error.message });
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log(`\n📊 SUMMARY:`);
  console.log(`   ✅ Already downloaded: ${alreadyDownloaded.length}`);
  console.log(`   🎬 Ready to download: ${needDownload.length}`);
  console.log(`   ⏳ Still processing: ${stillProcessing.length}`);
  console.log(`   ❌ Failed/Errors: ${failed.length}`);

  if (needDownload.length > 0) {
    console.log(`\n🎬 Videos ready for download:`);
    needDownload.forEach(task => {
      console.log(`   • ${task.title} (ID: ${task.promptId})`);
    });
  }

  if (stillProcessing.length > 0) {
    console.log(`\n⏳ Videos still processing:`);
    stillProcessing.forEach(task => {
      console.log(`   • ${task.title} (ID: ${task.promptId})`);
    });
  }

  if (failed.length > 0) {
    console.log(`\n❌ Failed videos:`);
    failed.forEach(task => {
      console.log(`   • ${task.title} (ID: ${task.promptId}) - ${task.error}`);
    });
  }

  return { needDownload, alreadyDownloaded, stillProcessing, failed };
}

// Export results for potential download
checkAllSubmissions()
  .then(results => {
    console.log(`\n✅ Check completed!`);
    
    // Save results for potential download script
    if (results.needDownload.length > 0) {
      const downloadData = {
        readyForDownload: results.needDownload,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(
        path.join(__dirname, 'ready-for-download.json'), 
        JSON.stringify(downloadData, null, 2)
      );
      
      console.log(`📝 Saved ${results.needDownload.length} videos ready for download to: ready-for-download.json`);
    }
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });