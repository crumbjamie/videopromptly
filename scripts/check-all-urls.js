const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// All 22 URLs to check
const urlsToCheck = [
  // /s/ path (watermarked) - 13 total
  "https://tempfile.aiquickdraw.com/s/5771c055-d0d0-470f-89ce-0c71d63b4d35_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/2163d60f-095b-4cd6-8b7a-4489dd3b7528_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/25176534-3eae-403b-8fd3-74e57912f4fb_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/abc47145-eb42-42c8-98b7-be433e3fd273_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/c8004c23-ae2a-4538-a9a1-784200387957_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/fa39da4c-a8ca-4330-8272-ab27f119020a_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/6cfc68f4-5e81-4454-ab12-0af297c04c99_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/f4c50df0-6794-4d1c-97eb-a55318f8809b_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/0cc1bae4-6d60-4755-84a0-462167e485c4_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/024e68c3-82a1-4ad8-bc91-91e3f923fd15_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/dafa1ba0-17a8-4356-ad99-1bd13a696d67_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/e1b3df00-5e1c-4468-941c-154ee783691f_watermarked.mp4",
  "https://tempfile.aiquickdraw.com/s/615763b1-e6d4-4d76-baed-3457b194fa32_watermarked.mp4",
  
  // /p/ path (timestamped) - 9 total
  "https://tempfile.aiquickdraw.com/p/a2e95b0752e240e5a2a7c914098c25f9_1752237538.mp4",
  "https://tempfile.aiquickdraw.com/p/beeb96cea4ae4bfebe4d9e3c23055118_1752236736.mp4",
  "https://tempfile.aiquickdraw.com/p/1d27072764ef4c56b36a481583f07122_1752236740.mp4",
  "https://tempfile.aiquickdraw.com/p/e2f3f4356e524c428b9209f7f1a2984b_1752236744.mp4",
  "https://tempfile.aiquickdraw.com/p/8e8768dd2e904193878660e9cb1a01e0_1752236247.mp4",
  "https://tempfile.aiquickdraw.com/p/e5679487f75c49d89a7ae6b77e63b6e1_1752235699.mp4",
  "https://tempfile.aiquickdraw.com/p/ff7b0cf6af2c493b9a572ad826023970_1752235740.mp4",
  "https://tempfile.aiquickdraw.com/p/738b5a2ca6334c458e3a88ed1d027165_1752235682.mp4",
  "https://tempfile.aiquickdraw.com/p/bd5f4a6bc8fa4d4fbadbff4b4199df4a_1752235706.mp4"
];

// All our submitted task IDs
const allSubmittedTasks = [
  { promptId: "2", taskId: "d5fa1c0c733545b624d292cf77065ce6", title: "Yeti's Emotional Vlog" },
  { promptId: "3", taskId: "c366dd2fcec907351b94d77b36b2998e", title: "Gen Z Slang Classroom" },
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
          reject(error);
        }
      });

      res.on("error", function (error) {
        reject(error);
      });
    });

    req.end();
  });
}

// Function to check if we have a local video file
function checkLocalVideo(promptId) {
  const prompt = data.prompts.find(p => p.id === promptId);
  if (!prompt) return { exists: false, reason: 'Prompt not found' };
  
  const videoPath = path.join(__dirname, '../public/videos', `${prompt.slug}.mp4`);
  const exists = fs.existsSync(videoPath);
  
  if (exists) {
    const stats = fs.statSync(videoPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    return { exists: true, size: fileSizeMB, path: videoPath, slug: prompt.slug };
  }
  
  return { exists: false, reason: 'File not found', slug: prompt.slug };
}

// Main function to check all URLs
async function checkAllUrls() {
  console.log(`\n🔍 Checking ${urlsToCheck.length} Video URLs Against Our System`);
  console.log('='.repeat(80));

  const results = {
    foundAndDownloaded: [],
    foundButNotDownloaded: [],
    notFound: [],
    errors: []
  };

  // First, get all our task data
  console.log(`📋 Getting API data for ${allSubmittedTasks.length} submitted tasks...`);
  const taskData = new Map();

  for (const task of allSubmittedTasks) {
    try {
      const response = await getVideoRecord(task.taskId);
      
      if (response.code === 200 && response.data?.response?.resultUrls?.length > 0) {
        const videoUrl = response.data.response.resultUrls[0];
        taskData.set(videoUrl, {
          ...task,
          videoUrl,
          record: response.data
        });
      }
    } catch (error) {
      console.log(`❌ Error getting data for ${task.title}: ${error.message}`);
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`✅ Got API data for ${taskData.size} completed videos\n`);

  // Now check each URL
  for (let i = 0; i < urlsToCheck.length; i++) {
    const url = urlsToCheck[i];
    const urlId = url.split('/').pop().split('_')[0]; // Extract unique ID
    
    console.log(`\n${i + 1}/${urlsToCheck.length}. Checking: ...${urlId}`);
    
    if (taskData.has(url)) {
      const taskInfo = taskData.get(url);
      console.log(`✅ Found: ${taskInfo.title} (ID: ${taskInfo.promptId})`);
      
      // Check if downloaded
      const localCheck = checkLocalVideo(taskInfo.promptId);
      if (localCheck.exists) {
        console.log(`   📁 Downloaded: ${localCheck.slug}.mp4 (${localCheck.size} MB)`);
        results.foundAndDownloaded.push({
          url,
          task: taskInfo,
          file: localCheck
        });
      } else {
        console.log(`   ⚠️  Not downloaded: ${localCheck.slug}.mp4`);
        results.foundButNotDownloaded.push({
          url,
          task: taskInfo,
          expectedFile: localCheck.slug + '.mp4'
        });
      }
    } else {
      console.log(`❌ Not found in our submitted tasks`);
      results.notFound.push(url);
    }
  }

  // Summary
  console.log(`\n📊 FINAL SUMMARY:`);
  console.log('='.repeat(50));
  console.log(`   ✅ Found & Downloaded: ${results.foundAndDownloaded.length}`);
  console.log(`   🎬 Found but NOT Downloaded: ${results.foundButNotDownloaded.length}`);
  console.log(`   ❌ Not Found in our system: ${results.notFound.length}`);
  console.log(`   📋 Total URLs checked: ${urlsToCheck.length}`);

  if (results.foundAndDownloaded.length > 0) {
    console.log(`\n✅ DOWNLOADED VIDEOS (${results.foundAndDownloaded.length}):`);
    results.foundAndDownloaded.forEach((item, i) => {
      console.log(`   ${i + 1}. ${item.task.title} → ${item.file.slug}.mp4 (${item.file.size} MB)`);
    });
  }

  if (results.foundButNotDownloaded.length > 0) {
    console.log(`\n🎬 READY TO DOWNLOAD (${results.foundButNotDownloaded.length}):`);
    results.foundButNotDownloaded.forEach((item, i) => {
      console.log(`   ${i + 1}. ${item.task.title} → ${item.expectedFile}`);
    });
  }

  if (results.notFound.length > 0) {
    console.log(`\n❌ NOT IN OUR SYSTEM (${results.notFound.length}):`);
    results.notFound.forEach((url, i) => {
      const urlId = url.split('/').pop().split('_')[0];
      console.log(`   ${i + 1}. ...${urlId}`);
    });
  }

  // Calculate coverage
  const coverage = ((results.foundAndDownloaded.length + results.foundButNotDownloaded.length) / urlsToCheck.length * 100).toFixed(1);
  console.log(`\n📈 Coverage: ${coverage}% of provided URLs are from our submissions`);

  return results;
}

// Run the check
checkAllUrls()
  .then(results => {
    console.log(`\n✅ Check completed!`);
    
    if (results.foundButNotDownloaded.length > 0) {
      console.log(`\n💡 To download missing videos, you can run the download script.`);
    }
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });