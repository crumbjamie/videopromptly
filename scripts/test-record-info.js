const https = require('https');

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";
const taskId = "66ce8f847893a6ac01556f1dea2e57ed"; // From our previous test

// Test the record-info endpoint
function testRecordInfo(taskId) {
  const requestOptions = {
    hostname: 'api.kie.ai',
    port: 443,
    path: `/api/v1/veo/record-info`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${KIE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  console.log(`🧪 Testing record-info endpoint: https://api.kie.ai/api/v1/veo/record-info`);

  const req = https.request(requestOptions, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log(`📊 Status Code: ${res.statusCode}`);
      console.log(`📄 Response:`, responseData);
      
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(responseData);
          console.log(`✅ Parsed Response:`, JSON.stringify(response, null, 2));
        } catch (e) {
          console.log(`❌ Failed to parse JSON`);
        }
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });

  req.end();
}

// Also test with POST in case it needs parameters
function testRecordInfoPost(taskId) {
  const postData = JSON.stringify({
    taskId: taskId
  });

  const requestOptions = {
    hostname: 'api.kie.ai',
    port: 443,
    path: `/api/v1/veo/record-info`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KIE_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log(`\n🧪 Testing record-info POST: https://api.kie.ai/api/v1/veo/record-info`);

  const req = https.request(requestOptions, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log(`📊 Status Code: ${res.statusCode}`);
      console.log(`📄 Response:`, responseData);
      
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(responseData);
          console.log(`✅ Parsed Response:`, JSON.stringify(response, null, 2));
        } catch (e) {
          console.log(`❌ Failed to parse JSON`);
        }
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });

  req.write(postData);
  req.end();
}

console.log(`🔍 Testing with task ID: ${taskId}`);
testRecordInfo(taskId);
testRecordInfoPost(taskId);