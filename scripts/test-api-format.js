const https = require('follow-redirects').https;

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// Test both endpoints with different parameter formats
async function testRecordInfoFormats() {
  console.log('🧪 Testing different API formats for record-info endpoint\n');

  // Test 1: Simple GET request
  console.log('📋 Test 1: Simple GET request to /api/v1/veo/record-info');
  await testEndpoint('GET', '/api/v1/veo/record-info', null);

  // Test 2: GET with query parameters
  console.log('\n📋 Test 2: GET with query parameters');
  await testEndpoint('GET', '/api/v1/veo/record-info?limit=10', null);

  // Test 3: POST with empty body
  console.log('\n📋 Test 3: POST with empty body');
  await testEndpoint('POST', '/api/v1/veo/record-info', {});

  // Test 4: POST with pagination parameters
  console.log('\n📋 Test 4: POST with pagination parameters');
  await testEndpoint('POST', '/api/v1/veo/record-info', { limit: 10, offset: 0 });
}

async function testEndpoint(method, path, body) {
  return new Promise((resolve) => {
    const requestOptions = {
      method: method,
      hostname: 'api.kie.ai',
      path: path,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`
      },
      maxRedirects: 20
    };

    if (body) {
      const postData = JSON.stringify(body);
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(requestOptions, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var responseBody = Buffer.concat(chunks);
        const responseData = responseBody.toString();
        
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${responseData}`);
        
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.code === 200 && parsed.data) {
            console.log(`   ✅ SUCCESS - Found data array with ${parsed.data.length} records`);
          } else {
            console.log(`   ❌ Error - Code: ${parsed.code}, Message: ${parsed.msg}`);
          }
        } catch (error) {
          console.log(`   ❌ Parse error`);
        }
        resolve();
      });

      res.on("error", function (error) {
        console.log(`   ❌ Request error: ${error}`);
        resolve();
      });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

testRecordInfoFormats();