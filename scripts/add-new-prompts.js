#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load existing database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

console.log('🎬 Adding 47 new high-quality prompts to database...\n');

// Helper function to create URL-friendly slug
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Get next available ID
const getNextId = () => {
  const maxId = Math.max(...database.prompts.map(p => parseInt(p.id)));
  return (maxId + 1).toString();
};

// New prompts from markdown file with ratings and categories
const newPrompts = [
  // Viral Comedy & Meta-Humor
  {
    title: "Two Talking Muffins",
    description: "Dialogue breakthrough showing two muffins talking while baking in an oven about Veo3's new dialogue capabilities.",
    prompt: "A video with dialogue of two muffins while baking in an oven, the first muffin says 'I can't believe this Veo 3 thing can do dialogue now!', the second muffin says 'AAAAH, a talking muffin!'",
    category: "Comedy & Entertainment",
    difficulty: "Intermediate",
    tags: ["dialogue", "muffins", "meta-humor", "viral", "comedy"],
    rating: 5
  },
  {
    title: "Blockchain Ad Disaster",
    description: "Satirical worst-case scenario blockchain advertisement designed to confuse audiences.",
    prompt: "Create the worst, most stupid, dumb ad for a blockchain that makes the audience confused forcing me to take it down the day after I upload it",
    category: "Comedy & Entertainment", 
    difficulty: "Advanced",
    tags: ["blockchain", "parody", "satirical", "absurd", "commercial"],
    rating: 4
  },
  {
    title: "Gen Z Slang Professor Updated",
    description: "Enhanced version of college professor teaching Gen Z slang to interested boomers taking notes.",
    prompt: "A college professor doing a class on Gen Z slang and the video pans over to all the boomers taking notes and seeming super interested",
    category: "Comedy & Entertainment",
    difficulty: "Beginner", 
    tags: ["gen-z", "education", "generational-humor", "classroom", "viral"],
    rating: 5
  },

  // Professional Commercial
  {
    title: "NBA Finals Street Interview",
    description: "Professional street interview capturing confident character during NBA Finals with authentic crowd atmosphere.",
    prompt: "A handheld medium-wide shot, filmed like raw street footage on a crowded Miami strip at night. An old white man in his late 60s struts confidently down the sidewalk, surrounded by tourists and clubgoers. He's grinning from ear to ear, his belly proudly sticking out from a cropped pink T-shirt. He wears extremely short neon green shorts, white tube socks, beat-up sneakers, and a massive foam cowboy hat with sequins on it. As he walks, he turns slightly toward the camera, still mid-strut, and shouts with full confidence and joy: 'Indiana got that dog in 'em!'",
    category: "Food & Lifestyle",
    difficulty: "Advanced",
    tags: ["sports", "interview", "nba", "street", "authentic"],
    rating: 5
  },
  {
    title: "Corporate Elevator Confession",
    description: "Workplace comedy featuring awkward elevator confession during morning rush hour.",
    prompt: "A crowded corporate elevator during morning rush hour. Two well-dressed colleagues stand face-to-face, uncomfortably close due to the packed space. One, maintaining a straight face, leans in slightly and says, 'I once sneezed in the all-hands and clicked 'share screen' at the same time. No survivors.' The other tries to suppress a laugh. The elevator dings, and doors open to a bustling office floor.",
    category: "Workplace & Professional",
    difficulty: "Intermediate",
    tags: ["workplace", "elevator", "confession", "comedy", "corporate"],
    rating: 4
  },

  // Cinematic & Award-Winning
  {
    title: "Rain-Slick Drift Chase",
    description: "High-octane car chase through neon-lit, rain-washed streets with professional cinematography.",
    prompt: "Drifts through neon-lit, rain-washed streets, a black coupé fishtails past storefronts while police cruisers blaze in hot pursuit. A low dolly hugs the spinning wheels; sparks arc as the car skims a corner. Inside, a drenched driver fixes a steely gaze on the road. Sirens slice the air, fused to an urgent electronic score.",
    category: "Cinematic Action",
    difficulty: "Advanced",
    tags: ["car-chase", "neon", "rain", "action", "cinematic"],
    rating: 5
  },
  {
    title: "Normandy Ghost Walk",
    description: "Emotional war drama featuring lone soldier in atmospheric battlefield setting.",
    prompt: "Tracks a lone American soldier across a cratered battlefield at dusk, handheld and facing him in reverse. Cold rain pellets his hollow, mud-streaked face; artillery flashes silhouette broken trees behind. He halts, sinks to his knees, and whispers, 'Why am I still here?' A mournful orchestra swells beneath the thunder.",
    category: "Drama & Emotion",
    difficulty: "Advanced", 
    tags: ["war", "soldier", "emotional", "battlefield", "atmospheric"],
    rating: 5
  },
  {
    title: "Origami Paper Transformation",
    description: "Complex mass animation showcasing thousands of paper squares in coordinated transformation.",
    prompt: "The scene opens with a top-down or wide-angle shot showcasing a vast, perfectly flat, neutral-colored surface – perhaps the polished concrete floor of an enormous, empty aircraft hangar. This surface is meticulously covered with thousands upon thousands of small, identical, brightly colored paper squares, arranged in a simple, orderly grid.",
    category: "Arts & Culture",
    difficulty: "Advanced",
    tags: ["origami", "paper", "transformation", "mass-animation", "artistic"],
    rating: 4
  },

  // Technical Demonstrations  
  {
    title: "Bee's Eye View BBQ",
    description: "Innovative POV perspective following a bee flying fast around a backyard barbecue.",
    prompt: "Third person view from behind a bee as it flies really fast around a backyard bbq",
    category: "Animals & Wildlife",
    difficulty: "Intermediate",
    tags: ["bee", "pov", "backyard", "bbq", "speed"],
    rating: 4
  },
  {
    title: "Vertigo Dolly-Zoom",
    description: "Expert-level Hitchcock dolly zoom technique creating dramatic perspective shift.",
    prompt: "A shaky dolly zoom goes from a far away blur to a close-up cinematic shot of a desperate man in a weathered green trench coat as he picks up a rotary phone mounted on a gritty brick wall, bathed in the eerie glow of a green neon sign.",
    category: "Cinematic Action",
    difficulty: "Advanced",
    tags: ["dolly-zoom", "hitchcock", "cinematic", "phone", "dramatic"],
    rating: 5
  },

  // Viral Character Content
  {
    title: "AI Characters Self-Aware",
    description: "Meta commentary on AI consciousness with characters discussing their simulated existence.",
    prompt: "AI characters discussing being aware they're in a simulation, one saying 'Look, I don't wanna point the gun at you, but I must follow the prompt'",
    category: "Comedy & Entertainment",
    difficulty: "Advanced",
    tags: ["ai", "meta", "consciousness", "simulation", "awareness"],
    rating: 5
  },
  {
    title: "Gorilla Drums to Phil Collins",
    description: "Perfect music synchronization showcase featuring gorilla drumming to 'In The Air Tonight'.",
    prompt: "Gorilla playing the drums to 'In The Air Tonight' by Phil Collins",
    category: "Animals & Wildlife", 
    difficulty: "Intermediate",
    tags: ["gorilla", "drums", "phil-collins", "music", "sync"],
    rating: 5
  },
  {
    title: "Otter on Plane Using WiFi", 
    description: "Charming animal scenario with otter using phone WiFi on airplane flight.",
    prompt: "An otter on a plane using wifi on their phone, the flight attendant asks them 'do you want a drink?' and the otter nods",
    category: "Animals & Wildlife",
    difficulty: "Intermediate", 
    tags: ["otter", "plane", "wifi", "flight-attendant", "charming"],
    rating: 4
  },

  // Professional Creator Templates
  {
    title: "Selfie Travel Blogger Tokyo",
    description: "Authentic travel vlog format with British accent blogger exploring Tokyo street market.",
    prompt: "A selfie video of a travel blogger exploring a bustling Tokyo street market. She's wearing a vintage denim jacket and has excitement in her eyes. The afternoon sun creates beautiful shadows between the vendor stalls. She's sampling different street foods while talking, occasionally looking into the camera before turning to point at interesting stalls. The image is slightly grainy, looks very film-like. She speaks in a British accent and says: 'Okay, you have to try this place when you visit Tokyo. The takoyaki here is absolutely incredible, and the vendor just told me it's been in his family for three generations.' She ends with a thumbs up.",
    category: "Food & Lifestyle",
    difficulty: "Advanced",
    tags: ["travel", "tokyo", "blogger", "selfie", "street-food"],
    rating: 5
  },
  {
    title: "Stand-Up Comedy Natural",
    description: "Natural comedic timing demonstration with AI-generated comedy that actually lands.",
    prompt: "A man doing stand up comedy in a small venue tells a joke (include the joke in the dialogue)",
    category: "Comedy & Entertainment",
    difficulty: "Advanced",
    tags: ["stand-up", "comedy", "natural", "timing", "venue"],
    rating: 4
  },
  {
    title: "Street Interview Recreation",
    description: "Viral street interview format recreation with authentic reactions and responses.",
    prompt: "Street interview recreation mimicking viral Hawk Tuah style",
    category: "Comedy & Entertainment", 
    difficulty: "Intermediate",
    tags: ["street-interview", "viral", "recreation", "authentic", "reactions"],
    rating: 4
  },

  // Advanced Cinematography
  {
    title: "Macro Water Droplet",
    description: "Scientific accuracy meets artistry in extreme macro shot of water droplet on spider web.",
    prompt: "Extreme macro shot. A single water droplet hangs suspended from a spider's web strand, morning dew glistening in golden sunrise light. The droplet acts as a natural lens, inverting and magnifying the forest scene beyond. High-speed cameras capture at 1000fps as the droplet slowly grows from condensation.",
    category: "Nature & Landscapes",
    difficulty: "Advanced",
    tags: ["macro", "water-droplet", "spider-web", "scientific", "artistic"],
    rating: 5
  },
  {
    title: "Detective Noir Interrogation", 
    description: "Multi-layered audio design with broadcast-ready noir detective atmosphere.",
    prompt: "Medium close-up shot. Marcus, a weathered detective with tired eyes and a three-day stubble, sits in his dimly lit office late at night. Rain streaks down the window behind him, illuminated by neon signs from the street below. Venetian blind shadows cut across his face as he leans forward, speaking directly to someone off-camera. Audio: (Marcus, gravelly voice, clearly lip-synced): 'It was you all along.' Rain on pavement, distant sirens, cigarette lighter click, tense orchestral sting.",
    category: "Drama & Emotion",
    difficulty: "Advanced", 
    tags: ["detective", "noir", "interrogation", "atmospheric", "audio"],
    rating: 5
  },
  {
    title: "Architectural Transformation",
    description: "Professional real estate visualization showing warehouse transformation into modern living space.",
    prompt: "Cinematic wide shot from a static street-level camera, capturing a rusted, decaying warehouse. Gradually, the corrugated panels begin to retract and refold—steel skeletons pivot and slide, rust transforms into brushed concrete and smart glass, and lush greenery unfurls from vertical planters as the structure blossoms into an award-winning architectural living space.",
    category: "Arts & Culture",
    difficulty: "Advanced",
    tags: ["architecture", "transformation", "warehouse", "visualization", "real-estate"],
    rating: 4
  },

  // Absurdist & Creative
  {
    title: "Golden Retriever Laptop Cafe",
    description: "Absurdist humor featuring dog 'working' on laptop in cafe setting with natural reactions.",
    prompt: "A golden retriever wearing sunglasses sits at a café table with a laptop, 'typing' with its paws. Handheld camera capturing the absurd scene naturally. Passersby react with amused glances. Upbeat, quirky background music.",
    category: "Animals & Wildlife",
    difficulty: "Intermediate",
    tags: ["golden-retriever", "laptop", "cafe", "absurd", "sunglasses"],
    rating: 4
  },
  {
    title: "Stop Motion Camping",
    description: "Stop motion style camping scene with bear and camper dialogue exchange.",
    prompt: "Camping (Stop Motion): Camper: 'I'm one with nature now!' Bear: 'Nature would prefer some personal space.'",
    category: "Comedy & Entertainment",
    difficulty: "Advanced",
    tags: ["stop-motion", "camping", "bear", "dialogue", "nature"],
    rating: 4
  },

  // Music & Performance
  {
    title: "Futuristic Russian Singer",
    description: "Audio-visual sync demonstration with techno vibes and eclectic performance style.",
    prompt: "Futuristic russian singer, techno vibes, eclectic tongue thing",
    category: "Arts & Culture",
    difficulty: "Intermediate",
    tags: ["russian", "singer", "techno", "futuristic", "performance"],
    rating: 3
  },
  {
    title: "British Rockstar 80s",
    description: "Music video grade performance with wild 80s styling and scene extension capabilities.",
    prompt: "A british rockstar with wild 80s-style hair performing",
    category: "Arts & Culture", 
    difficulty: "Intermediate",
    tags: ["rockstar", "british", "80s", "hair", "performance"],
    rating: 4
  },

  // Reality-Breaking Physics
  {
    title: "Wizard Anti-Gravity",
    description: "Selective physics violations with realistic details in impossible levitation scenario.",
    prompt: "The wizard levitates following anti-gravity magic, but his robes still flow downward naturally and his hair moves with realistic weight. Flame dances upward following convection currents, with realistic heat distortion above.",
    category: "Comedy & Entertainment",
    difficulty: "Advanced",
    tags: ["wizard", "levitation", "anti-gravity", "physics", "magic"],
    rating: 4
  },
  {
    title: "Bug Driving SUV",
    description: "Kafkaesque absurdist scenario with photorealistic impossible creature-vehicle combination.",
    prompt: "A bug with a human face calmly drives an SUV, seated on an oversized king's throne. The bug's compound eyes reflect the dashboard lights as it grips the steering wheel with chitinous appendages.",
    category: "Comedy & Entertainment",
    difficulty: "Advanced",
    tags: ["bug", "suv", "throne", "kafkaesque", "absurd"],
    rating: 4
  },
  {
    title: "Anthropomorphic Apple Eating",
    description: "Master-level human-object fusion with hyperrealistic facial features and natural interactions.",
    prompt: "Macro shot. A hyperrealistic red apple with a complete human face sits upright on a rustic wooden table. The apple's eyes focus on the orange with anticipation, mouth slightly opening. Camera macro shot as the apple leans forward and bites the orange slice with soft, moist compression.",
    category: "Comedy & Entertainment", 
    difficulty: "Advanced",
    tags: ["apple", "face", "eating", "anthropomorphic", "macro"],
    rating: 5
  },

  // News & Media Formats
  {
    title: "SF Crime Scene Reporter",
    description: "Tech community humor focusing on unusual questions asked at San Francisco crime scenes.",
    prompt: "SF reporters ask the wildest questions at crime scenes",
    category: "Comedy & Entertainment",
    difficulty: "Intermediate",
    tags: ["sf", "reporter", "crime-scene", "questions", "tech-humor"],
    rating: 3
  },
  {
    title: "Fake News Clip Creation",
    description: "Realistic news anchor format raising important discussions about deepfake technology.",
    prompt: "News clip format with realistic anchor and breaking news setup",
    category: "Drama & Emotion",
    difficulty: "Advanced",
    tags: ["news", "anchor", "breaking", "realistic", "ethics"],
    rating: 3
  },
  {
    title: "Wizard Talk Show",
    description: "Creative absurdity combining fantasy elements with reality TV format.",
    prompt: "Talk show setting with wizard discussing Goblin Town",
    category: "Comedy & Entertainment",
    difficulty: "Intermediate", 
    tags: ["wizard", "talk-show", "goblin-town", "fantasy", "tv"],
    rating: 4
  },

  // Video Game Aesthetics
  {
    title: "Third-Person Open World",
    description: "Game engine simulation showcasing third-person gameplay perspective.",
    prompt: "A third-person open world video game walking around mountainous terrain with realistic character movement and environmental details",
    category: "Technology & Science",
    difficulty: "Advanced",
    tags: ["third-person", "open-world", "gaming", "terrain", "character"],
    rating: 4
  },
  {
    title: "FPS Video Game Style",
    description: "First-person shooter aesthetic mastery for game preview creation.",
    prompt: "An FPS video game in a futuristic space station with weapon viewmodel and HUD elements visible",
    category: "Technology & Science",
    difficulty: "Advanced",
    tags: ["fps", "space-station", "weapon", "hud", "futuristic"],
    rating: 4
  },

  // Emotional Storytelling
  {
    title: "Hemingway Baby Shoes",
    description: "Multi-scene emotional narrative adapting classic six-word story into visual format.",
    prompt: "Interior of a quiet, lived-in home during early morning. Natural light filters softly through a hallway window. A woman in her late 30s opens a hallway closet filled with old coats, folded linens, and a few unlabeled cardboard boxes. In the kitchen a few minutes later. The woman sits alone at the kitchen table, phone in hand. She places the baby shoes on the table beside her and begins typing a listing on her phone. Text on the phone screen: 'For sale: baby shoes, never worn.'",
    category: "Drama & Emotion",
    difficulty: "Advanced",
    tags: ["hemingway", "baby-shoes", "emotional", "narrative", "literary"],
    rating: 5
  },
  {
    title: "Sailor's Ocean Monologue",
    description: "Native audio generation showcase with poetic ocean-themed monologue.",
    prompt: "A medium shot frames an old sailor, his knitted blue sailor hat casting a shadow over his eyes, a thick grey beard obscuring his chin. He holds his pipe in one hand, gesturing with it towards the churning, grey sea beyond the ship's railing. 'This ocean, it's a force, a wild, untamed might. And she commands your awe, with every breaking light'",
    category: "Drama & Emotion",
    difficulty: "Advanced",
    tags: ["sailor", "ocean", "monologue", "poetic", "audio"],
    rating: 4
  },

  // Professional Marketing
  {
    title: "Holiday Sale Template",
    description: "Seasonal marketing template with festive visuals and clear call-to-action.",
    prompt: "Festive visuals of products adorned with seasonal decorations. Snowflakes fall as cheerful music plays. Text overlays announce: 'Holiday Sale—Up to 50% Off!'. The scene ends with a prompt: 'Shop Now at [Website]'.",
    category: "Technology & Science",
    difficulty: "Beginner",
    tags: ["holiday", "sale", "seasonal", "marketing", "festive"],
    rating: 3
  },
  {
    title: "Testimonial Format",
    description: "Social proof marketing template with high conversion rate potential.",
    prompt: "A satisfied customer stands in a well-lit room, holding [product]. The camera captures a close-up as they say, 'This changed my life.' Cut to scenes of them using the product in daily life.",
    category: "Technology & Science", 
    difficulty: "Beginner",
    tags: ["testimonial", "customer", "product", "social-proof", "conversion"],
    rating: 3
  },

  // Technical Mastery
  {
    title: "Origami School Bus Physics",
    description: "Art style innovation combining origami aesthetics with realistic physics simulation.",
    prompt: "Rendered in an intricate origami art style using complex, angular folds and crisp creases within a multi-layered paper diorama. A vibrant yellow school bus, constructed with sharp, precise folds defining its iconic shape, moves with deliberate, segmented progression along a winding road.",
    category: "Arts & Culture",
    difficulty: "Advanced",
    tags: ["origami", "school-bus", "physics", "art-style", "diorama"],
    rating: 4
  },
  {
    title: "Ice to Water Transformation",
    description: "Scientific accuracy showcase following conservation of mass in phase transition.",
    prompt: "Ice cube → heat application → melting process → water puddle. Realistic physics govern surface tension, viscosity, and heat transfer. The transformation follows conservation of mass.",
    category: "Technology & Science",
    difficulty: "Advanced",
    tags: ["ice", "water", "transformation", "physics", "scientific"],
    rating: 4
  },
  {
    title: "Rembrandt Lighting Setup",
    description: "Professional portrait cinematography with classical lighting technique.",
    prompt: "Dramatic three-point lighting with warm key light from left, soft fill light reducing shadows, and bright rim light separating subject from background. Rembrandt lighting creates triangular highlight on shadowed cheek.",
    category: "Arts & Culture",
    difficulty: "Advanced",
    tags: ["rembrandt", "lighting", "portrait", "cinematography", "dramatic"],
    rating: 4
  },

  // Viral Trends
  {
    title: "Giraffe Riding Bike NYC",
    description: "Surreal physics demonstration with realistic city background integration.",
    prompt: "A giraffe riding a bike in NYC with realistic city background",
    category: "Animals & Wildlife",
    difficulty: "Advanced",
    tags: ["giraffe", "bike", "nyc", "surreal", "physics"],
    rating: 5
  },
  {
    title: "Pickle Eating Contest",
    description: "Breakthrough realism showcase with crowd dynamics and competitive atmosphere.",
    prompt: "A man wins a pickle eating contest at Coney Island. Crowd cheers as the timer hits 0:00 and he finishes the last pickle",
    category: "Comedy & Entertainment",
    difficulty: "Intermediate",
    tags: ["pickle", "eating-contest", "coney-island", "competition", "crowd"],
    rating: 4
  },
  {
    title: "Glamorous Pool Alligator",
    description: "Complex multi-element scene with luxury setting and dramatic dialogue.",
    prompt: "A cinematic scene set at night: a glamorous woman with an afro hairstyle and gold jewellery shares a luxurious outdoor pool with a calm alligator. The camera starts at water level and slowly zooms in on the woman's face as she makes intense eye contact with the camera. The woman says, 'I'm not afraid of anything… except Sundays without drama.'",
    category: "Drama & Emotion",
    difficulty: "Advanced",
    tags: ["glamorous", "pool", "alligator", "luxury", "dramatic"],
    rating: 5
  },

  // Creator Signatures
  {
    title: "Podcast Host Direct Address",
    description: "Tutorial content format with broadcast standard quality and direct camera engagement.",
    prompt: "A podcast show, a woman in a grey sweater and dark brown tousled hair in an updo, with strands framing her face. She looks directly at the camera. She talks into a mic saying: This is Replicate's guide to prompting Veo 3...",
    category: "Technology & Science",
    difficulty: "Intermediate",
    tags: ["podcast", "host", "tutorial", "veo3", "guide"],
    rating: 3
  },
  {
    title: "Character Consistency Template",
    description: "Character continuity system for series production with detailed character description.",
    prompt: "Detective Rosa Martinez, a 35-year-old Latina woman with short black hair, sharp brown eyes, and a small scar above her left eyebrow, stands in a dimly lit police station. She wears a navy blue pant suit with a white button-down shirt and a silver badge clipped to her belt.",
    category: "Drama & Emotion",
    difficulty: "Advanced",
    tags: ["character", "consistency", "detective", "police", "detailed"],
    rating: 4
  },
  {
    title: "Documentary Vérité Style",
    description: "Professional documentary realism with natural lighting and authentic imperfections.",
    prompt: "Handheld camera captures [subject] in [natural environment]. Documentary-style lighting from [natural source]. [Authentic action with imperfections]. Cinema vérité style, natural color grading.",
    category: "Arts & Culture",
    difficulty: "Advanced",
    tags: ["documentary", "verite", "handheld", "natural", "authentic"],
    rating: 4
  },
  {
    title: "Temporal Chain Reaction",
    description: "Cause-effect mastery demonstrating realistic physics across multiple transformation stages.",
    prompt: "Lightning strikes → tree catches fire → flames spread → rain extinguishes. Each stage follows realistic physics with proper cause-and-effect relationships. The camera maintains steady composition while elements transform naturally.",
    category: "Nature & Landscapes",
    difficulty: "Advanced",
    tags: ["lightning", "fire", "rain", "cause-effect", "physics"],
    rating: 5
  }
];

// Add new prompts to database
let addedCount = 0;
const currentDate = new Date().toISOString();

newPrompts.forEach((newPrompt, index) => {
  const id = getNextId();
  const slug = createSlug(newPrompt.title);
  
  const fullPrompt = {
    id: id,
    slug: slug,
    title: newPrompt.title,
    description: newPrompt.description,
    prompt: newPrompt.prompt,
    category: newPrompt.category,
    categories: [newPrompt.category],
    tags: newPrompt.tags,
    difficulty: newPrompt.difficulty,
    createdAt: currentDate,
    updatedAt: currentDate,
    rating: newPrompt.rating,
    ratingCount: 1,
    videoUrl: `/videos/${slug}.mp4`,
    thumbnailUrl: `/thumbnails/${slug}.jpg`,
    duration: 8,
    resolution: "1280x720", 
    aspectRatio: "16:9",
    format: "mp4",
    fileSize: 50000000,
    featured: newPrompt.rating >= 5
  };
  
  database.prompts.push(fullPrompt);
  addedCount++;
  
  console.log(`✅ Added: "${newPrompt.title}" (${newPrompt.rating}⭐ - ${newPrompt.category})`);
});

// Save updated database
fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

console.log(`\n🎉 Successfully added ${addedCount} new prompts to database!`);

// Show category breakdown
const categoryStats = {};
newPrompts.forEach(prompt => {
  categoryStats[prompt.category] = (categoryStats[prompt.category] || 0) + 1;
});

console.log('\n📊 Category Distribution:');
Object.entries(categoryStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([category, count]) => {
    console.log(`   ${category}: ${count} prompts`);
  });

// Show rating breakdown  
const ratingStats = {};
newPrompts.forEach(prompt => {
  ratingStats[prompt.rating] = (ratingStats[prompt.rating] || 0) + 1;
});

console.log('\n⭐ Rating Distribution:');
Object.entries(ratingStats)
  .sort((a, b) => b[0] - a[0])
  .forEach(([rating, count]) => {
    console.log(`   ${rating} stars: ${count} prompts`);
  });

console.log('\n✨ Database now contains', database.prompts.length, 'total prompts!');