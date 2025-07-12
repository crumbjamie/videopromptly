var https = require('follow-redirects').https;

const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";

// Test with one of our recent task IDs
const taskId = "d06de7d60b12abf563f2b863cb3a715a"; // Yeti's Ice Soup Recipe

console.log(`🧪 Testing record-info with taskId parameter`);
console.log(`📡 Task ID: ${taskId}`);

var options = {
  'method': 'GET',
  'hostname': 'api.kie.ai',
  'path': `/api/v1/veo/record-info?taskId=${taskId}`,
  'headers': {
    'Accept': 'application/json',
    'Authorization': `Bearer ${KIE_API_KEY}`
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  console.log(`📊 Status Code: ${res.statusCode}`);

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    const responseText = body.toString();
    
    console.log(`📄 Raw Response: ${responseText}`);
    
    try {
      const parsed = JSON.parse(responseText);
      console.log(`✅ Parsed JSON:`, JSON.stringify(parsed, null, 2));
      
      if (parsed.code === 200 && parsed.data) {
        console.log(`🎬 Video record found!`);
        const record = parsed.data;
        console.log(`   Status: ${record.status || 'unknown'}`);
        console.log(`   Video URL: ${record.videoUrl || record.url || 'not ready'}`);
        
        if (record.videoUrl || record.url) {
          console.log(`🎉 VIDEO IS READY FOR DOWNLOAD!`);
        } else {
          console.log(`⏳ Video is still processing...`);
        }
      } else {
        console.log(`❌ Error: Code ${parsed.code}, Message: ${parsed.msg}`);
      }
    } catch (error) {
      console.log(`❌ Parse error: ${error.message}`);
    }
  });

  res.on("error", function (error) {
    console.error(`❌ Request error: ${error}`);
  });
});

req.end();