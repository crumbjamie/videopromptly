var https = require('follow-redirects').https;
var fs = require('fs');

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

var options = {
  'method': 'GET',
  'hostname': 'api.kie.ai',
  'path': '/api/v1/veo/record-info',
  'headers': {
    'Accept': 'application/json',
    'Authorization': `Bearer ${KIE_API_KEY}`
  },
  'maxRedirects': 20
};

console.log('🧪 Testing exact format from documentation...');
console.log('Headers:', options.headers);

var req = https.request(options, function (res) {
  var chunks = [];

  console.log('📊 Status Code:', res.statusCode);
  console.log('📋 Response Headers:', res.headers);

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    const responseText = body.toString();
    console.log('📄 Raw Response:', responseText);
    
    try {
      const parsed = JSON.parse(responseText);
      console.log('✅ Parsed JSON:', JSON.stringify(parsed, null, 2));
      
      if (parsed.code === 200 && parsed.data && Array.isArray(parsed.data)) {
        console.log(`🎬 Found ${parsed.data.length} video records`);
        parsed.data.forEach((record, index) => {
          console.log(`  ${index + 1}. ${record.id || record.taskId} - Status: ${record.status}`);
          if (record.videoUrl || record.url) {
            console.log(`     Video URL: ${record.videoUrl || record.url}`);
          }
        });
      }
    } catch (error) {
      console.log('❌ JSON Parse Error:', error.message);
    }
  });

  res.on("error", function (error) {
    console.error('❌ Request Error:', error);
  });
});

req.end();