#!/usr/bin/env node

const https = require('follow-redirects').https;

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";
const API_BASE_URL = "api.kie.ai";

async function checkTaskStatus(taskId) {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Checking status for task: ${taskId}`);

    const requestOptions = {
      method: 'GET',
      hostname: API_BASE_URL,
      path: `/api/v1/veo/record-info?taskId=${taskId}`,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`
      },
      maxRedirects: 20
    };

    const req = https.request(requestOptions, function (res) {
      let chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const responseData = body.toString();
        
        try {
          const response = JSON.parse(responseData);
          console.log('\n📋 Task Status Response:');
          console.log(JSON.stringify(response, null, 2));
          
          if (response.data) {
            const record = response.data;
            console.log(`\n📊 Task Summary:`);
            console.log(`   Task ID: ${record.taskId}`);
            console.log(`   Success Flag: ${record.successFlag} (0=processing, 1=complete, -1=failed)`);
            console.log(`   Created: ${new Date(record.createTime).toLocaleString()}`);
            console.log(`   Completed: ${record.completeTime ? new Date(record.completeTime).toLocaleString() : 'Not yet'}`);
            
            if (record.successFlag === 1 && record.response) {
              console.log(`   ✅ VIDEO READY!`);
              const videoUrls = record.response.resultUrls || [];
              videoUrls.forEach((url, i) => {
                console.log(`   🎬 Video URL ${i+1}: ${url}`);
              });
            } else if (record.successFlag === 0) {
              console.log(`   ⏳ Still processing...`);
            } else if (record.successFlag === -1) {
              console.log(`   ❌ Generation failed: ${record.errorMessage || 'Unknown error'}`);
            }
          }
          
          resolve(response);
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

    req.on('error', (error) => {
      console.error(`❌ Request setup error:`, error);
      reject(error);
    });

    req.end();
  });
}

// Command line usage
if (require.main === module) {
  const taskId = process.argv[2];
  
  if (!taskId) {
    console.log('Usage: node check-task-status.js <taskId>');
    console.log('Example: node check-task-status.js 7d48fa29bc62ac04e9a6ada6261579d4');
    process.exit(1);
  }
  
  checkTaskStatus(taskId)
    .then(() => {
      console.log('\n✅ Status check completed.');
    })
    .catch(error => {
      console.error('❌ Status check failed:', error.message);
      process.exit(1);
    });
}

module.exports = { checkTaskStatus };