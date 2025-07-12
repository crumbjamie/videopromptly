const https = require('https');

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// Test different endpoints to retrieve videos
function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.kie.ai',
      port: 443,
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    console.log(`🔍 Testing: https://api.kie.ai${endpoint}`);

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(responseData);
            console.log(`   ✅ Success!`);
            console.log(`   Response:`, JSON.stringify(response, null, 2));
          } catch (error) {
            console.log(`   📄 Raw response:`, responseData);
          }
        } else {
          console.log(`   ❌ Failed: ${responseData}`);
        }
        console.log('');
        resolve({ endpoint, status: res.statusCode, data: responseData });
      });
    });

    req.on('error', (error) => {
      console.error(`   ❌ Request error:`, error.message);
      reject(error);
    });

    req.end();
  });
}

// Test various possible endpoints
async function findVideoRetrievalEndpoints() {
  console.log('🎬 Searching for video retrieval endpoints...\n');

  const endpointsToTest = [
    '/api/v1/veo/videos',
    '/api/v1/veo/tasks',
    '/api/v1/videos',
    '/api/v1/tasks',
    '/api/v1/user/videos',
    '/api/v1/user/tasks',
    '/api/v1/history',
    '/api/v1/veo/history',
    '/api/v1/generations',
    '/api/v1/veo/generations'
  ];

  for (const endpoint of endpointsToTest) {
    try {
      await testEndpoint(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`   ❌ Network error: ${error.message}\n`);
    }
  }

  console.log('🏁 Search complete!');
}

findVideoRetrievalEndpoints();