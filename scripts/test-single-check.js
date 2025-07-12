const https = require('follow-redirects').https;

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// Function to get video records and find specific task
async function getVideoRecords() {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Getting video records...`);

    const requestOptions = {
      method: 'GET',
      hostname: 'api.kie.ai',
      path: '/api/v1/veo/record-info',
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
          console.log(`📊 Status Code: ${res.statusCode}`);
          console.log(`📋 Records response:`, JSON.stringify(response, null, 2));
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

    req.end();
  });
}

// Test it
getVideoRecords()
  .then(result => {
    console.log('✅ API call completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ API call failed:', error);
    process.exit(1);
  });