const https = require('https');

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";
const taskId = "87aa7416e9f49cd75480ccd62dd12933"; // From the test

// Test different status endpoints
function checkTaskStatus(endpoint) {
  const options = {
    hostname: 'api.kie.ai',
    port: 443,
    path: endpoint,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${KIE_API_KEY}`
    }
  };

  console.log(`🔍 Testing endpoint: https://api.kie.ai${endpoint}`);

  const req = https.request(options, (res) => {
    let responseData = '';

    console.log('📊 Status Code:', res.statusCode);

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('📄 Response:', responseData);
      console.log('');
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });

  req.end();
}

// Try different possible endpoints
console.log('🧪 Testing different status endpoints...\n');

checkTaskStatus(`/api/v1/veo/status/${taskId}`);
checkTaskStatus(`/api/v1/veo/task/${taskId}`);
checkTaskStatus(`/api/v1/task/${taskId}`);
checkTaskStatus(`/api/v1/status/${taskId}`);