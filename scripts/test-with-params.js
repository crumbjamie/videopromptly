var https = require('follow-redirects').https;

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// Test different parameter combinations
const testCases = [
  { path: '/api/v1/veo/record-info', desc: 'No parameters' },
  { path: '/api/v1/veo/record-info?page=0', desc: 'With page parameter' },
  { path: '/api/v1/veo/record-info?limit=10', desc: 'With limit parameter' },
  { path: '/api/v1/veo/record-info?page=0&limit=10', desc: 'With page and limit' },
  { path: '/api/v1/veo/record-info?page=1&size=10', desc: 'With page and size' },
];

async function testEndpoint(testCase) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Testing: ${testCase.desc}`);
    console.log(`📡 Path: ${testCase.path}`);

    var options = {
      'method': 'GET',
      'hostname': 'api.kie.ai',
      'path': testCase.path,
      'headers': {
        'Accept': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`
      },
      'maxRedirects': 20
    };

    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        const responseText = body.toString();
        
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📄 Response: ${responseText}`);
        
        try {
          const parsed = JSON.parse(responseText);
          if (parsed.code === 200 && parsed.data) {
            console.log(`✅ SUCCESS! Found data: ${JSON.stringify(parsed.data)}`);
          } else {
            console.log(`❌ Error: Code ${parsed.code}, Message: ${parsed.msg}`);
          }
        } catch (error) {
          console.log(`❌ Parse error: ${error.message}`);
        }
        
        resolve();
      });

      res.on("error", function (error) {
        console.error(`❌ Request error: ${error}`);
        resolve();
      });
    });

    req.end();
  });
}

async function runTests() {
  for (const testCase of testCases) {
    await testEndpoint(testCase);
  }
}

runTests();