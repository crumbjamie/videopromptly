const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// URL to check
const targetUrl = "https://tempfile.aiquickdraw.com/s/5771c055-d0d0-470f-89ce-0c71d63b4d35_watermarked.mp4";

// Read prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Get all our submitted task IDs
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

// Function to check if we have this URL
async function checkForUrl() {
  console.log(`🔍 Checking for URL: ${targetUrl}`);
  console.log('='.repeat(80));

  let foundMatch = false;

  for (const task of allSubmittedTasks) {
    try {
      const response = await getVideoRecord(task.taskId);
      
      if (response.code === 200 && response.data?.response?.resultUrls?.length > 0) {
        const videoUrl = response.data.response.resultUrls[0];
        
        if (videoUrl === targetUrl) {
          console.log(`✅ FOUND MATCH!`);
          console.log(`   Task: ${task.title} (ID: ${task.promptId})`);
          console.log(`   Task ID: ${task.taskId}`);
          console.log(`   URL: ${videoUrl}`);
          
          // Check if we have it downloaded
          const prompt = data.prompts.find(p => p.id === task.promptId);
          if (prompt) {
            const videoPath = path.join(__dirname, '../public/videos', `${prompt.slug}.mp4`);
            const exists = fs.existsSync(videoPath);
            
            if (exists) {
              const stats = fs.statSync(videoPath);
              const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
              console.log(`   Status: ✅ Downloaded (${fileSizeMB} MB)`);
            } else {
              console.log(`   Status: 🎬 Generated but not downloaded`);
            }
          }
          
          foundMatch = true;
          break;
        }
      }
    } catch (error) {
      console.log(`❌ Error checking ${task.title}: ${error.message}`);
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  if (!foundMatch) {
    console.log(`❌ URL not found in any of our ${allSubmittedTasks.length} submitted tasks`);
    console.log(`\nThis video was either:`);
    console.log(`   • Generated from a different API key`);
    console.log(`   • Generated from a task ID we don't have tracked`);
    console.log(`   • From a task that failed or was regenerated`);
  }

  return foundMatch;
}

// Run the check
checkForUrl()
  .then(found => {
    console.log(`\n📊 Result: ${found ? '✅ Found' : '❌ Not found'}`);
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
  });