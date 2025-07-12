const https = require('https');

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";
const taskId = "d06de7d60b12abf563f2b863cb3a715a"; // Recent submission: Yeti's Ice Soup Recipe

// Test the detail endpoint
function testDetailEndpoint(taskId) {
  const requestOptions = {
    hostname: 'api.kie.ai',
    port: 443,
    path: `/api/v1/veo/detail/${taskId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${KIE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  console.log(`🧪 Testing detail endpoint: https://api.kie.ai/api/v1/veo/detail/${taskId}`);

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

testDetailEndpoint(taskId);