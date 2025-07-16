#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

// API Configuration
const KIE_API_KEY = "f8bb5df14a279ae55ba1f49cd3c78acb";
const API_BASE_URL = "api.kie.ai";

// Output directory
const OUTPUT_DIR = path.join(__dirname, '../public/viral-yeti-videos');

// 20 Gen Alpha/Gen Z Yeti Videos using viral strategies
const VIRAL_YETI_VIDEOS = [
  {
    id: 'yeti-ohio-rizz',
    title: 'Yeti Explains Ohio Rizz',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while sitting on a snow-covered rock in a mountain forest. Golden hour lighting. Natural camera shake. Documentary vibe. He speaks in an excited Gen Alpha accent: "Yo chat, let me tell you about this absolutely CURSED situation in Ohio. This kid walked up to his crush and said 'Are you from Ohio? Because you're the only ten-I-see!' BRO, that's not rizz, that's straight up NPC behavior! The secondhand embarrassment is giving me actual brain rot!" Audio: mountain wind, distant birds, authentic Yeti breathing, suppressed laughter. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-skibidi-explained',
    title: 'Yeti Reacts to Skibidi Toilet',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while standing in a snowy clearing with pine trees. Soft morning light. Natural camera shake. Documentary vibe. He speaks in a confused Gen Alpha accent: "Okay Gen Alpha, I need someone to explain this Skibidi Toilet situation to me. Like, I get that it's brainrot content, but why is it so fire? My little cousin is literally obsessed and keeps saying 'Skibidi bop bop yes yes' and I'm like... bro, what does that even MEAN? Are we all just NPCs in the Skibidi universe?" Audio: forest ambience, gentle wind, authentic Yeti chuckling, confused breathing. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-sigma-grindset',
    title: 'Yeti Sigma Male Grindset',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while doing pushups in the snow outside a mountain cave. Dawn lighting. Natural camera shake. Documentary vibe. He speaks in a confident Gen Alpha accent while exercising: "Day 47 of my sigma grindset, chat. While you betas are doom-scrolling TikTok, I'm out here touching grass and building character. No cap, the grind never stops. Cold plunge in the glacier? That's just Tuesday for me. Stay hard, stay sigma, stay mid- wait, that's not right. Stay NOT mid!" Audio: heavy breathing, snow crunching, wind through mountains, determined Yeti grunts. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-cap-no-cap',
    title: 'Yeti Explains Cap vs No Cap',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while sitting by a campfire in a snowy forest clearing. Warm firelight flickering on his fur. Natural camera shake. Documentary vibe. He speaks in a teacher-like Gen Z accent: "Okay boomers, let me break down the difference between cap and no cap. Cap means you're lying, like when my dad says he's 'hip with the kids' - that's straight cap. No cap means you're telling the truth, like when I say this fire is absolutely sending me to another dimension - no cap! It's giving cozy vibes, periodt." Audio: crackling fire, forest ambience, authentic Yeti breathing, wood popping. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-amongus-sussy',
    title: 'Yeti Sus Behavior Analysis',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while walking through a misty forest. Overcast lighting. Natural camera shake. Documentary vibe. He speaks in a suspicious Gen Alpha accent: "Chat, I'm gonna be honest with you... my neighbor Yeti has been acting mad sus lately. Like, I saw him venting through the trees yesterday, and when I asked him about it, he was like 'I was just taking a shortcut.' BRO, that's exactly what an imposter would say! Red is acting sus, vote him out!" Audio: misty forest sounds, twigs snapping, authentic Yeti breathing, paranoid whispers. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-gyatt-meaning',
    title: 'Yeti Discovers Gyatt',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while sitting in a sunny snow-covered meadow. Bright natural lighting. Natural camera shake. Documentary vibe. He speaks in a bewildered Gen Alpha accent: "Okay chat, I just learned what 'gyatt' means and I'm experiencing the five stages of grief right now. Like, I've been saying it thinking it was just another way to say 'got' but apparently it's... something else entirely? The children are NOT okay. We need to ban Gen Alpha from the internet, no cap. This is giving me existential crisis vibes." Audio: mountain breeze, distant birds, authentic Yeti sighing, confused breathing. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-fanum-tax',
    title: 'Yeti Explains Fanum Tax',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while eating berries in a forest clearing. Dappled sunlight. Natural camera shake. Documentary vibe. He speaks in an educational Gen Alpha accent: "Alright chat, let me explain Fanum Tax because y'all are clearly confused. So basically, if you're eating something and your homie just takes a bite without asking, that's Fanum Tax. Like, I'm out here enjoying my berries and this random squirrel just yeeted one from my hand. That's literally Fanum Tax in action! The audacity is unmatched, fr fr." Audio: forest ambience, berry squishing sounds, authentic Yeti chewing, annoyed breathing. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-mewing-tutorial',
    title: 'Yeti Mewing Tutorial',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while standing in front of an icy cave wall. Cool blue lighting. Natural camera shake. Documentary vibe. He speaks in a confident Gen Alpha accent: "Yo chat, it's time for your daily mewing tutorial with your boy. You gotta keep that tongue on the roof of your mouth, work that jawline, we're trying to get that sigma face structure. I've been mewing for three months and look at this glow-up! My jaw is absolutely sending everyone to the shadow realm. Stay consistent, stay sigma!" Audio: echoing cave sounds, ice dripping, authentic Yeti breathing, jaw clicking. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-npc-behavior',
    title: 'Yeti Calls Out NPC Behavior',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while walking through a snowy forest path. Overcast lighting. Natural camera shake. Documentary vibe. He speaks in a frustrated Gen Alpha accent: "Chat, I just witnessed the most NPC behavior of my entire life. This tourist came up to me and said 'OMG a real Yeti!' then immediately started taking selfies without asking. Like bro, that's not main character energy, that's straight up NPC dialogue tree behavior. Have some respect for the lore!" Audio: snow crunching underfoot, forest ambience, authentic Yeti sighing, frustrated breathing. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-based-cringe',
    title: 'Yeti Based vs Cringe Tier List',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while sitting cross-legged in a snow-covered forest clearing. Golden hour lighting. Natural camera shake. Documentary vibe. He speaks in an analytical Gen Alpha accent: "Okay chat, time for the ultimate based vs cringe tier list. Touching grass? That's S-tier based. Saying 'periodt' unironically? A-tier based. Using 'slay' in 2025? That's giving cringe energy, sorry not sorry. And don't even get me started on people who still say 'yeet' - that's D-tier cringe behavior, no cap." Audio: forest ambience, gentle wind, authentic Yeti breathing, contemplative sounds. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-alpha-beta-sigma',
    title: 'Yeti Explains Male Hierarchy',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while standing on a rocky mountain outcrop. Dramatic sunset lighting. Natural camera shake. Documentary vibe. He speaks in a philosophical Gen Alpha accent: "Let me break down the male hierarchy for you chat. Alphas think they're in charge but they're actually just loud. Betas are wholesome but lack confidence. Sigmas? We're the lone wolves who don't need the pack. And then there's whatever Ohio produces - we don't talk about that. I'm obviously sigma coded, periodt." Audio: mountain wind, distant eagles, authentic Yeti breathing, confident tone. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-drip-check',
    title: 'Yeti Drip Check',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while standing in a snowy clearing, showing off his natural fur patterns. Bright natural lighting. Natural camera shake. Documentary vibe. He speaks in a confident Gen Alpha accent: "Alright chat, time for the drip check. We got the natural frost highlights - that's giving ethereal vibes. The messy fur texture? That's intentional bedhead chic. These blue eyes? Absolutely sending everyone to the shadow realm. And the best part? This drip is 100% sustainable, no fast fashion here. Mother Nature said 'let me cook' and she did NOT miss!" Audio: mountain breeze, snow shifting, authentic Yeti breathing, proud sounds. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-gen-alpha-slang',
    title: 'Yeti Teaches Gen Alpha Slang',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while sitting in a cozy snow cave with soft lighting. Warm golden lighting. Natural camera shake. Documentary vibe. He speaks in a teacher-like Gen Alpha accent: "Welcome to Gen Alpha 101 with Professor Yeti. Today's lesson: 'It's giving' means something has a certain vibe. 'No cap' means no lie. 'Periodt' ends arguments. 'Slay' means you did amazing. 'Mid' means mediocre. And 'Ohio' means absolutely chaotic. Class dismissed, you're all ready to be chronically online!" Audio: cave echo, gentle wind, authentic Yeti breathing, teaching tone. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-main-character',
    title: 'Yeti Main Character Energy',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while dramatically posing on a snowy mountain peak. Epic golden hour lighting. Natural camera shake. Documentary vibe. He speaks in a motivational Gen Alpha accent: "Chat, it's time to stop being an NPC in your own story. You need that main character energy! Wake up, touch grass, hit your macros, start your sigma grindset. Stop doom-scrolling and start glow-up scrolling. The world is your oyster and you're the pearl, periodt. We're not settling for mid when we could be absolutely sending it!" Audio: mountain wind, inspirational music fade, authentic Yeti breathing, confident tone. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-bussin-food',
    title: 'Yeti Reviews Bussin Food',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while eating pine nuts and berries in a forest clearing. Natural daylight. Natural camera shake. Documentary vibe. He speaks in an excited Gen Alpha accent: "Okay chat, food review time! These pine nuts are absolutely bussin, no cap. The berries? They're giving main character energy, so fresh and vibrant. This bark? Mid at best, wouldn't recommend. Overall, this forest meal is chef's kiss, it's giving healthy living vibes. Nature really said 'let me cook' and delivered!" Audio: forest ambience, chewing sounds, authentic Yeti breathing, satisfied munching. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-ratio-explained',
    title: 'Yeti Explains Getting Ratioed',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while sitting by a frozen lake. Overcast lighting. Natural camera shake. Documentary vibe. He speaks in a sympathetic Gen Alpha accent: "Chat, let me tell you about the time I got absolutely ratioed on social media. I posted 'snow is mid' and the replies were NOT having it. 47 people quote-tweeted me with just 'L + ratio + you fell off + touch grass.' The secondhand embarrassment was giving me actual brain rot. Moral of the story: never disrespect the snow, it's literally my brand!" Audio: lake sounds, gentle wind, authentic Yeti sighing, embarrassed breathing. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-sheesh-moment',
    title: 'Yeti Sheesh Moment',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while discovering a beautiful ice formation in a cave. Magical blue lighting. Natural camera shake. Documentary vibe. He speaks in an amazed Gen Alpha accent: "Yo chat, SHEESH! Look at this ice formation! This is giving fantasy movie vibes, it's absolutely sending me to another dimension. The way the light hits it? That's not mid, that's straight up S-tier content. Nature really said 'let me show you what peak performance looks like' and delivered. This is why I stay in the mountains, periodt!" Audio: cave echo, ice creaking, authentic Yeti breathing, amazed gasps. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-lowkey-highkey',
    title: 'Yeti Lowkey Highkey Explanation',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while walking through a misty forest. Soft diffused lighting. Natural camera shake. Documentary vibe. He speaks in a casual Gen Alpha accent: "Okay chat, let me explain lowkey vs highkey because y'all are using it wrong. Lowkey means kinda or secretly - like 'I'm lowkey tired of explaining Gen Alpha slang.' Highkey means definitely or obviously - like 'This mist is highkey giving mysterious forest vibes.' It's not that deep, but please use it correctly, it's giving me secondhand embarrassment!" Audio: misty forest sounds, footsteps on leaves, authentic Yeti breathing, patient tone. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-slay-queen',
    title: 'Yeti Slay Queen Energy',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while dramatically flipping his fur in a snowy clearing. Golden hour lighting. Natural camera shake. Documentary vibe. He speaks in a confident Gen Alpha accent: "Chat, today we're channeling that slay queen energy! Hair flip? Executed flawlessly. Confidence level? Absolutely sending everyone to the shadow realm. We're not just surviving, we're thriving! This is what main character energy looks like, periodt. If you're not slaying, you're just existing, and that's giving NPC behavior!" Audio: wind through fur, snow settling, authentic Yeti breathing, confident sounds. No subtitles, no text overlay.`
  },
  {
    id: 'yeti-toxic-positivity',
    title: 'Yeti Calls Out Toxic Positivity',
    prompt: `A young, energetic white Yeti with messy, frost-covered fur and bright blue eyes holds a selfie stick (that's where the camera is) while sitting thoughtfully on a log in a forest clearing. Soft natural lighting. Natural camera shake. Documentary vibe. He speaks in a serious Gen Alpha accent: "Chat, we need to talk about toxic positivity. Someone told me 'just think positive thoughts' when I was having a bad day, and that's giving NPC energy. It's okay to not be okay! We don't need to be sigma grinding 24/7. Sometimes you need to touch grass, process your emotions, and that's perfectly valid. Real ones support real feelings, periodt." Audio: forest ambience, gentle breeze, authentic Yeti breathing, thoughtful tone. No subtitles, no text overlay.`
  }
];

// Helper functions from the original script
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

async function submitVideoGeneration(videoData) {
  return new Promise((resolve, reject) => {
    console.log(`🎬 Submitting: ${videoData.title}`);
    console.log(`   Preview: ${videoData.prompt.substring(0, 100)}...`);

    const postData = JSON.stringify({
      prompt: videoData.prompt,
      model: 'veo3_fast',
      aspectRatio: '9:16',
      watermark: 'ViralYeti'
    });

    const requestOptions = {
      method: 'POST',
      hostname: API_BASE_URL,
      path: '/api/v1/veo/generate',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      maxRedirects: 20
    };

    const req = https.request(requestOptions, function (res) {
      let chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const responseData = body.toString();
        
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 200 && response.code === 200) {
            console.log(`   ✅ Job submitted successfully!`);
            console.log(`   📋 Task ID: ${response.data.taskId}`);
            resolve({
              taskId: response.data.taskId,
              videoData: videoData,
              submittedAt: new Date().toISOString()
            });
          } else if (response.code === 402) {
            console.error(`   💳 Insufficient credits: ${response.msg}`);
            reject(new Error(`CREDIT_EXHAUSTED: ${response.msg}`));
          } else if (response.code === 429) {
            console.error(`   ⏱️  Rate limit exceeded: ${response.msg}`);
            reject(new Error(`RATE_LIMITED: ${response.msg}`));
          } else {
            console.error(`   ❌ API Error (code ${response.code}):`, response.msg);
            reject(new Error(`API_ERROR_${response.code}: ${response.msg}`));
          }
        } catch (error) {
          console.error(`   ❌ Parse error:`, error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`   ❌ Request error:`, error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function checkVideoStatus(taskId) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'GET',
      hostname: API_BASE_URL,
      path: `/api/v1/veo/record-info?taskId=${taskId}`,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`
      },
      maxRedirects: 20
    };

    const req = https.request(requestOptions, function (res) {
      let chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const responseData = body.toString();
        
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 200) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function waitForVideoCompletion(taskId, title, maxAttempts = 24, intervalSeconds = 30) {
  console.log(`\n⏳ Waiting for "${title}" to complete...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`   🔍 Attempt ${attempt}/${maxAttempts}: Checking status...`);
    
    try {
      const statusResponse = await checkVideoStatus(taskId);
      
      if (statusResponse.data) {
        const record = statusResponse.data;
        
        if (record.successFlag === 1) {
          console.log(`   ✅ Video generation completed!`);
          
          const videoUrl = record.response?.resultUrls?.[0] || 
                          record.videoUrl || 
                          record.url || 
                          record.downloadUrl || 
                          record.result?.videoUrl;
          
          if (videoUrl) {
            return {
              ready: true,
              videoUrl: videoUrl,
              record: record
            };
          }
        } else if (record.successFlag === -1 || record.errorCode) {
          throw new Error(`Video generation failed: ${record.errorMessage || 'Unknown error'}`);
        } else {
          console.log(`   ⏳ Status: processing...`);
        }
      } else {
        console.log(`   ⏳ Still generating...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error checking status: ${error.message}`);
    }

    if (attempt < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
    }
  }

  throw new Error(`Video generation timed out after ${maxAttempts} attempts`);
}

async function downloadVideo(videoUrl, filepath, title) {
  return new Promise((resolve, reject) => {
    console.log(`\n📥 Downloading "${title}"...`);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(videoUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`   ✅ Download completed!`);
          resolve(filepath);
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        file.close();
        fs.unlink(filepath, () => {});
        downloadVideo(redirectUrl, filepath, title).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generateSingleVideo(videoData) {
  console.log(`\n🎬 Starting generation for: ${videoData.title}`);
  console.log('=' + '='.repeat(60));

  try {
    const videoFilepath = path.join(OUTPUT_DIR, `${videoData.id}.mp4`);

    // Check if video already exists
    if (fs.existsSync(videoFilepath)) {
      const stats = fs.statSync(videoFilepath);
      if (stats.size > 100000) {
        console.log(`⚠️  Video already exists: ${videoData.id}.mp4`);
        return {
          success: true,
          alreadyExists: true,
          videoPath: videoFilepath,
          videoData: videoData
        };
      } else {
        fs.unlinkSync(videoFilepath);
      }
    }

    // Generate video
    const job = await submitVideoGeneration(videoData);
    const completionResult = await waitForVideoCompletion(job.taskId, videoData.title);
    await downloadVideo(completionResult.videoUrl, videoFilepath, videoData.title);

    const stats = fs.statSync(videoFilepath);
    if (stats.size < 100000) {
      throw new Error('Downloaded video file is too small');
    }

    console.log(`\n🎉 SUCCESS! "${videoData.title}" completed!`);
    console.log(`📁 File: ${videoData.id}.mp4`);
    console.log(`📊 Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

    return {
      success: true,
      videoPath: videoFilepath,
      videoData: videoData,
      taskId: job.taskId,
      size: stats.size
    };

  } catch (error) {
    console.error(`\n❌ FAILED: ${videoData.title}`);
    console.error(`Error: ${error.message}`);
    
    return {
      success: false,
      error: error.message,
      videoData: videoData
    };
  }
}

async function main() {
  console.log('🧊 VIRAL GEN ALPHA YETI VIDEO GENERATOR');
  console.log('=' + '='.repeat(60));
  console.log(`🎯 Using viral strategies from docs/viral-strategies.md`);
  console.log(`📐 Format: 9:16 (720x1280) vertical videos`);
  console.log(`🎬 Videos to generate: ${VIRAL_YETI_VIDEOS.length}`);
  console.log(`⏱️  Estimated time: ${(VIRAL_YETI_VIDEOS.length * 8)} minutes`);
  console.log('=' + '='.repeat(60));

  ensureOutputDir();

  const results = [];
  let successCount = 0;
  let startTime = Date.now();

  for (let i = 0; i < VIRAL_YETI_VIDEOS.length; i++) {
    const result = await generateSingleVideo(VIRAL_YETI_VIDEOS[i]);
    results.push(result);
    
    if (result.success && !result.alreadyExists) {
      successCount++;
    }
    
    // Progress update
    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    const remaining = VIRAL_YETI_VIDEOS.length - (i + 1);
    console.log(`\n📊 Progress: ${i + 1}/${VIRAL_YETI_VIDEOS.length} (${elapsed}m elapsed, ~${remaining * 8}m remaining)`);
    
    // Rate limiting delay
    if (i < VIRAL_YETI_VIDEOS.length - 1) {
      console.log(`⏱️  Waiting 45 seconds before next video...`);
      await new Promise(resolve => setTimeout(resolve, 45000));
    }
  }

  // Final summary
  console.log('\n🎉 VIRAL YETI GENERATION COMPLETE!');
  console.log('=' + '='.repeat(60));
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const existing = results.filter(r => r.alreadyExists);

  console.log(`✅ Successfully generated: ${successCount} new videos`);
  console.log(`⚠️  Already existed: ${existing.length} videos`);
  console.log(`❌ Failed: ${failed.length} videos`);
  console.log(`📁 Total videos available: ${successful.length}`);

  if (successful.length > 0) {
    const totalSize = successful.reduce((sum, r) => sum + (r.size || 0), 0);
    console.log(`💾 Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
  }

  console.log(`\n📍 All videos saved to: ${OUTPUT_DIR}`);
  console.log(`\n🚀 Ready to go viral with Gen Alpha Yeti content!`);
  console.log(`📱 Perfect for TikTok, Instagram Reels, and YouTube Shorts`);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

module.exports = { generateSingleVideo, VIRAL_YETI_VIDEOS };