const https = require('https');

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// Test the API with a simple request
function testKieAPI() {
  const postData = JSON.stringify({
    prompt: "A simple test video of a cat sitting in sunlight",
    mode: "fast",
    duration: 8,
    audio: true,
    aspectRatio: "16:9"
  });

  const options = {
    hostname: 'api.kie.ai',
    port: 443,
    path: '/api/v1/veo/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KIE_API_KEY}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🧪 Testing Kie.ai API...');
  console.log('📡 Endpoint:', `https://${options.hostname}${options.path}`);
  console.log('🔑 API Key:', KIE_API_KEY.substring(0, 8) + '...');

  const req = https.request(options, (res) => {
    let responseData = '';

    console.log('📊 Status Code:', res.statusCode);
    console.log('📋 Headers:', res.headers);

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('\n📄 Raw Response:');
      console.log(responseData);
      
      try {
        const response = JSON.parse(responseData);
        console.log('\n✅ Parsed Response:');
        console.log(JSON.stringify(response, null, 2));
      } catch (error) {
        console.log('\n❌ Failed to parse JSON response');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });

  req.write(postData);
  req.end();
}

testKieAPI();