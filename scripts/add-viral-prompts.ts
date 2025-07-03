import fs from 'fs';
import path from 'path';

const promptsPath = path.join(process.cwd(), 'lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// New prompts to add
const newPrompts = [
  {
    title: "Ultra-Realistic Fisheye Selfie with Anime Characters",
    prompt: "Ultra-realistic 9:16 vertical format fisheye selfie of [subject] with [Shinchan, Doraemon, Naruto, Nobita, Satoru Gojo, Sung Jin-woo, Ash from Pokemon]. We're all making silly, exaggerated faces in a small, bright living room with white tones. High camera angle with extreme fisheye distortion, realistic cinematic lighting, anime characters integrated with stylized realism.",
    category: "Anime & animation",
    tags: ["fisheye", "anime", "selfie", "vertical"],
    difficulty: "Advanced"
  },
  {
    title: "Cinematic Boxer Portrait",
    prompt: "Ultra-realistic cinematic portrait of [subject] styled as a strong, focused boxer wearing a fitted dark athletic t-shirt with fists wrapped in tape. Bold red background with cinematic lighting featuring deep shadows and strong highlights to emphasize muscle tone and facial expression, professional sports photography style.",
    category: "Cinematic Styles",
    tags: ["boxer", "cinematic", "sports", "portrait"],
    difficulty: "Intermediate"
  },
  {
    title: "Post-Apocalyptic Double Exposure",
    prompt: "Cinematic double exposure of [subject] in profile with a post-apocalyptic cityscape inside their silhouette. Inner scene shows the person walking through a destroyed, burning urban street with buildings in ruins, glowing embers and fire, dramatic sunset backdrop. Moody lighting with warm tones, emotional and introspective mood, 8K resolution.",
    category: "Cinematic Styles",
    tags: ["double-exposure", "apocalyptic", "cinematic", "artistic"],
    difficulty: "Advanced"
  },
  {
    title: "Animated Character Fisheye Group Selfie",
    prompt: "Ultra-realistic vertical format fisheye selfie of [subject] and girlfriend with [Black Dragon]. All making silly, exaggerated faces in a small, bright living room with white tones. High camera angle with extreme fisheye distortion, realistic cinematic lighting, anime characters integrated with stylized realism.",
    category: "Anime & animation",
    tags: ["fisheye", "anime", "couple", "vertical"],
    difficulty: "Advanced"
  },
  {
    title: "Rainy Street Scene Portrait",
    prompt: "[Subject] wearing an oversized black t-shirt, black baggy pants, and sneakers, using an umbrella on the sidewalk about to cross the road at a red light. Many trees beside the sidewalk in heavy rain, moody urban atmosphere, 9:16 aspect ratio, cinematic street photography style.",
    category: "Portrait Photography",
    tags: ["rain", "street", "urban", "moody"],
    difficulty: "Intermediate"
  },
  {
    title: "Cyberpunk Crowd Motion Blur",
    prompt: "Cinematic shot of [subject] walking against a rushing cyber city crowd, all others blurred with motion trails using slow-shutter technique. Subject in focus with side profile, serious expression looking into the distance, soaked in rain wearing a long trench coat. Neon cyberpunk tones, 35mm film look, ambient lighting from neon signs, 4:3 ratio.",
    category: "Cyberpunk & sci-fi",
    tags: ["cyberpunk", "motion-blur", "rain", "cinematic"],
    difficulty: "Advanced"
  },
  {
    title: "Burning Newspaper Portrait",
    prompt: "[Subject] standing against a black background holding a newspaper labeled 'LATEST NEWS', partially on fire at one corner with blue flames and faint smoke trail. Stylized fire with moody cinematic lighting primarily from the blue fire, casting blue highlights and shadows across face and hands. Black shirt with layered silver chains, serious and contemplative expression looking down at burning newspaper, intense and mysterious atmosphere.",
    category: "Editorial Photography",
    tags: ["fire", "newspaper", "dramatic", "blue-flames"],
    difficulty: "Advanced"
  },
  {
    title: "Neo-Noir Car Interior",
    prompt: "[Subject] sitting inside a car at night, bathed in moody neon lighting. Intense and mysterious atmosphere with contrasting hues of deep blue and magenta illuminating the interior. Rain droplets streak the car window, adding noir suspenseful feel. Subject grips steering wheel with serious expression, face partially shadowed. Neo-noir thriller vibe, high contrast lighting, shallow depth of field, ultra-realistic, photographed through car window.",
    category: "Cyberpunk & sci-fi",
    tags: ["neo-noir", "car", "neon", "thriller"],
    difficulty: "Advanced"
  },
  {
    title: "Underwater Portrait with Neon Lighting",
    prompt: "Hyper-realistic close-up portrait of [subject] with only left half visible and partially submerged in water. Dramatic illumination with soft ambient blue and pink neon lighting, casting colorful reflections on wet skin and damp hair. Water droplets and small bubbles cling to face, cinematic mood with clear skin texture, slight beard stubble, and intense eye focus.",
    category: "Portrait Photography",
    tags: ["underwater", "neon", "portrait", "cinematic"],
    difficulty: "Advanced"
  },
  {
    title: "Gaming Character Fisheye Selfie",
    prompt: "Ultra-realistic 9:16 vertical format fisheye selfie of [subject] with [Sonic, Mario]. All making silly, exaggerated faces in a small, bright living room with white tones. High camera angle with extreme fisheye distortion, realistic cinematic lighting, gaming characters integrated with stylized realism.",
    category: "Anime & animation",
    tags: ["gaming", "fisheye", "selfie", "characters"],
    difficulty: "Advanced"
  },
  {
    title: "Lighter Flame Portrait",
    prompt: "[Subject] illuminated by glow from lighter flame, green soft light on one side of face, red rim light on hair and shoulder. Dramatic shadows with dark black background, slight sweat on skin for glossy texture, red and black checkered shirt, wearing metallic chain bracelets. Ultra-realistic details with sharp focus on eyes, moody low light photography style, shallow depth of field, 8K resolution.",
    category: "Portrait Photography",
    tags: ["lighter", "flame", "dramatic", "moody"],
    difficulty: "Advanced"
  },
  {
    title: "Melancholic Rain Portrait",
    prompt: "Close-up profile portrait of [subject] in the rain, looking into distance with melancholic expression. Wearing dark baseball cap with red detail and black over-ear headphones. Heavy dark hair tousled by wind, falling into face with full texture and movement. Raindrops clearly visible on skin, background heavily blurred dark rainy outdoor scene with visible rain streaks.",
    category: "Portrait Photography",
    tags: ["rain", "profile", "melancholic", "headphones"],
    difficulty: "Intermediate"
  },
  {
    title: "Luxury Studio Portrait",
    prompt: "[Subject] with well-groomed beard and mustache wearing dark velvet suit and sunglasses, posing confidently in moody studio setting. Background dramatically split with blue smoke on left and red smoke on right, creating high-contrast cinematic atmosphere. Multiple rings on fingers and luxury watch on wrist, sophisticated lighting highlighting facial contours.",
    category: "Portrait Photography",
    tags: ["luxury", "studio", "smoke", "sophisticated"],
    difficulty: "Intermediate"
  },
  {
    title: "Construction Spotlight Portrait",
    prompt: "[Subject] standing leaning against wall under dramatic spotlight in construction building. Wearing blue denim jacket with black jeans and classy sunglasses, hands in jeans pockets. Dramatic nighttime lighting creating shadows, emphasizing contours of face and body. Dark background with industrial atmosphere.",
    category: "Creative Effects",
    tags: ["construction", "spotlight", "industrial", "dramatic"],
    difficulty: "Intermediate"
  },
  {
    title: "Formal Suit Spotlight",
    prompt: "[Subject] under dramatic spotlight in dark room wearing patterned white shirt with black suit and sunglasses. Confident, intense expression with hands in pockets, lighting casts deep shadows emphasizing face and body contours. Black background creating striking contrast, 9:16 aspect ratio.",
    category: "Portrait Photography",
    tags: ["formal", "suit", "spotlight", "intense"],
    difficulty: "Intermediate"
  },
  {
    title: "Subway Station Vintage",
    prompt: "[Subject] in orange-yellow moody tones with soft glow and slightly vintage film-like filter. Tiled subway wall background with old advertisement and poster saying 'MAKE IT AT HOME FASTER THAN MY MOM'. 90s nostalgic vibe with modern editorial twist, maintaining realistic proportions and accurate facial features.",
    category: "Editorial Photography",
    tags: ["subway", "vintage", "90s", "editorial"],
    difficulty: "Intermediate"
  },
  {
    title: "Streetwear Mandala Portrait",
    prompt: "Ultra-realistic portrait of [subject] wearing dark navy oversized streetwear t-shirt with glowing blue mandala pattern and silver Trishul symbol at center. Black cargo pants, black sunglasses, and silver chain. Standing casually with hands in pockets against clean gradient background (deep navy to sky blue), looking straight at camera. Shot on Canon EOS R5 with RF 85mm f/1.2L lens, studio lighting, 12K resolution.",
    category: "Creative Effects",
    tags: ["streetwear", "mandala", "studio", "fashion"],
    difficulty: "Advanced"
  },
  {
    title: "Urban Crowd Overhead Shot",
    prompt: "Cinematic overhead shot of [subject] standing still on brick city sidewalk wearing dark oversized sweater. Motion-blurred crowd rushes past around subject. Moody lighting with 35mm film look, shallow depth of field with sharp focus on subject. Portrait 4:3 ratio.",
    category: "Cinematic Styles",
    tags: ["urban", "overhead", "crowd", "cinematic"],
    difficulty: "Advanced"
  },
  {
    title: "Metro Station Motion Blur",
    prompt: "Slow-motion cinematic side profile shot of [subject] walking against rushing metro station crowd, all others blurred with motion trails. Subject in focus with serious face wearing long trench coat. Cool blue tones with 35mm film look, ambient lighting from train signs. Portrait 4:3 ratio.",
    category: "Cinematic Styles",
    tags: ["metro", "motion-blur", "trench-coat", "cinematic"],
    difficulty: "Advanced"
  },
  {
    title: "BMW Street Racing Scene",
    prompt: "[Subject] wearing drop shoulder t-shirt and baggy jeans confidently leaning against customized BMW E46 M3. Car modified with blue and silver paintjob, modern street racing aesthetic. Middle of busy city road where people are rushing in motion. Style inspired by street racing game Need for Speed.",
    category: "Action & Sports",
    tags: ["bmw", "street-racing", "urban", "gaming"],
    difficulty: "Advanced"
  },
  {
    title: "Squid Game Transformation",
    prompt: "Transform [subject] into scene from Squid Game TV series, keeping face exactly the same. Add green tracksuit with white number tag, dim indoor lighting with dramatic tense atmosphere, background characters in similar outfits. Cinematic shot from survival game show, maintaining facial expression and identity unchanged.",
    category: "Anime & animation",
    tags: ["squid-game", "transformation", "tracksuit", "dramatic"],
    difficulty: "Intermediate"
  },
  {
    title: "Red Gradient Fashion Portrait",
    prompt: "[Subject] standing against bold red gradient background confidently. Dramatic and cinematic lighting emphasizing facial structure, luxury fashion magazine vibe. Ultra-realistic high-detail editorial photography style with 4K resolution, symmetrical composition, minimal background elements. 4:3 ratio.",
    category: "Fashion Photography",
    tags: ["fashion", "red-gradient", "editorial", "luxury"],
    difficulty: "Intermediate"
  },
  {
    title: "Golden Circle Studio Portrait",
    prompt: "Moody portrait with dramatic studio lighting. [Subject] standing slightly off-center in front of large, soft golden spotlight circle on deep navy background. Soft shadows with cinematic feel, wearing plain black t-shirt with slightly long wavy hair and flawless fair skin. Lighting falls from top-left casting clear shadow to right, 4:3 aspect ratio.",
    category: "Cinematic Styles",
    tags: ["studio", "golden-circle", "moody", "cinematic"],
    difficulty: "Intermediate"
  },
  {
    title: "Formal Street Portrait",
    prompt: "[Subject] in black suit with black tie, evening time with arms crossed. Standing on empty dramatic street with moody lighting and 35mm film look. Shallow depth of field with sharp focus, 9:16 aspect ratio.",
    category: "Portrait Photography",
    tags: ["formal", "street", "evening", "dramatic"],
    difficulty: "Intermediate"
  },
  {
    title: "Ocean Splash Portrait",
    prompt: "[Subject] styled but not overly revealing with light seawater splashes rising around chest and face for dramatic dynamic effect. Confident and calm expression with soft overcast sky meeting tranquil sea at horizon. Shot at chest level in wide-angle framing with shallow depth of field (f/2.8), stylized with muted teal-orange cinematic color grade.",
    category: "Action & Sports",
    tags: ["ocean", "splash", "cinematic", "dynamic"],
    difficulty: "Advanced"
  },
  {
    title: "Black and White Studio Portrait",
    prompt: "Dramatic black and white portrait of [subject] sitting on wooden stool against dark studio background. Wearing well-fitted all-black suit with black shirt and pants, small silver chain at neck and silver watch, slightly unbuttoned at top. Relaxed yet dominant posture with one arm resting on leg and other in pant pocket. Soft but directional lighting creating powerful aura.",
    category: "Portrait Photography",
    tags: ["black-white", "studio", "formal", "dramatic"],
    difficulty: "Intermediate"
  },
  {
    title: "Street Noir Portrait",
    prompt: "Cinematic night-time shot of [subject] standing in middle of dark, empty street under streetlight. Wearing long dark trench coat, looking serious and mysterious. Fog surrounds background with soft light illuminating parts of face. Pair of car headlights visible far behind in background. Moody blue color grading, film noir style, 35mm film grain, dramatic shadows and contrast. 9:16 ratio.",
    category: "Street Photography",
    tags: ["street-noir", "trench-coat", "mysterious", "cinematic"],
    difficulty: "Advanced"
  },
  {
    title: "Golden Hour Shadow Portrait",
    prompt: "Moody, mysterious portrait using warm golden-hour sunlight casting dramatic shadows on plain wall. [Subject] with medium-length slightly wavy hair, fair and flawless skin, maintaining calm introspective expression. Strong shadow of face visible on wall, 4:3 ratio with cinematic tone.",
    category: "Cinematic Styles",
    tags: ["golden-hour", "shadows", "mysterious", "cinematic"],
    difficulty: "Intermediate"
  },
  {
    title: "Luxury Fashion Portrait",
    prompt: "[Subject] wearing modern black watch on wrist with stylish bold pose, one fist gently raised near chin. Background features warm textured golden particles illuminated by side light, blending into deep shadows for moody studio atmosphere. Soft but directional lighting creating strong highlights and shadows on face. Ultra-realistic high-resolution with 85mm lens look, shallow depth of field.",
    category: "Fashion Photography",
    tags: ["luxury", "fashion", "golden-particles", "studio"],
    difficulty: "Advanced"
  },
  {
    title: "Hyper-Detailed Graphic Design Portrait",
    prompt: "Hyper-detailed graphic design featuring striking portrait of [subject] with confident demeanor. Head adorned with voluminous hair adding texture and depth. Portrait rendered in high-contrast black-and-white style against minimalist background. Calm yet determined expression with one eye partially obscured by bold red rectangular overlay adding modern artistic flair. Smooth textured grey canvas background with overlaid text elements, red accents, and design elements creating cohesive high-energy visual blending streetwear culture with graphic artistry. 8K ultra-realistic, hyper-detailed, 4:5 aspect ratio.",
    category: "Editorial Photography",
    tags: ["graphic-design", "streetwear", "artistic", "hyper-detailed"],
    difficulty: "Advanced"
  },
  {
    title: "Celebrity Street Portrait",
    prompt: "[Subject] with black tie, evening time with arms crossed. To my right, Virat Kohli resting shoulder to shoulder with me in black suit with white shirt. Empty and dramatic street setting with moody lighting and 35mm film look. Shallow depth of field with sharp focus on all three subjects. 9:16 aspect ratio.",
    category: "Portrait Photography",
    tags: ["celebrity", "street", "evening", "formal"],
    difficulty: "Advanced"
  },
  {
    title: "Alternative Burning Newspaper Portrait",
    prompt: "[Subject] looking down at burning newspaper with serious and contemplative expression. Intense and mysterious atmosphere with face replaced from uploaded photo, matching lighting, skin tone, and perspective realistically. High quality photorealistic finish maintaining facial features exactly the same.",
    category: "Creative Effects",
    tags: ["newspaper", "fire", "contemplative", "mysterious"],
    difficulty: "Advanced"
  },
  {
    title: "Alternative Neo-Noir Car Scene",
    prompt: "[Subject] gripping steering wheel with serious expression, face partially shadowed. Replace driver's face with uploaded image keeping facial features exactly the same. Neo-noir thriller vibe with high contrast lighting, shallow depth of field, ultra-realistic, photographed through car window. Text at bottom reads 'IN THE NIGHT' in subtle elegant font.",
    category: "Creative Effects",
    tags: ["neo-noir", "car", "thriller", "text-overlay"],
    difficulty: "Advanced"
  },
  {
    title: "BMW Street Racing Portrait",
    prompt: "[Subject] wearing drop shoulder t-shirt and baggy jeans confidently leaning against customized BMW E46 M3. Car modified with blue and silver paintjob, modern street racing aesthetic. Middle of busy city road where people are rushing in motion. Style inspired by street racing game Need for Speed.",
    category: "Action & Sports",
    tags: ["bmw", "street-racing", "gaming", "urban"],
    difficulty: "Advanced"
  },
  {
    title: "Construction Spotlight Alternative",
    prompt: "Convert [subject] into aesthetic 0.6 lens portrait standing leaning against wall under dramatic spotlight in construction building. Wearing blue denim jacket with black jeans and classy sunglasses. Hands in jeans pockets with nighttime lighting creating dramatic shadows.",
    category: "Creative Effects",
    tags: ["construction", "spotlight", "denim", "dramatic"],
    difficulty: "Intermediate"
  },
  {
    title: "Oversized Blazer Crowd Scene",
    prompt: "Cinematic overhead shot of [subject] standing still on brick city sidewalk wearing dark oversized blazer. Motion-blurred crowd rushes past around subject with moody lighting, 35mm film look, shallow depth of field with sharp focus on subject. Portrait 4:3 ratio.",
    category: "Cinematic Styles",
    tags: ["blazer", "overhead", "crowd", "cinematic"],
    difficulty: "Advanced"
  },
  {
    title: "Luxury Velvet Suit Portrait",
    prompt: "[Subject] with well-groomed beard and mustache wearing dark velvet suit and sunglasses, posing confidently in moody studio setting. Background dramatically split with blue smoke on left and red smoke on right, creating high-contrast cinematic atmosphere. Multiple rings on fingers and luxury watch on wrist adding sophistication, lighting highlights facial contours.",
    category: "Fashion Photography",
    tags: ["velvet", "luxury", "smoke", "sophisticated"],
    difficulty: "Advanced"
  },
  {
    title: "Golden Particles Fashion Portrait",
    prompt: "[Subject] with modern black watch on wrist, stylish and bold pose with one fist gently raised near chin. Background features warm textured golden particles illuminated by side light, blending into deep shadows for moody studio atmosphere. Soft but directional lighting creating strong highlights and shadows on face. Ultra-realistic high-resolution with 85mm lens look, shallow depth of field, professional fashion editorial lighting.",
    category: "Fashion Photography",
    tags: ["fashion", "golden-particles", "luxury", "editorial"],
    difficulty: "Advanced"
  }
];

// Start from ID 109 (after the last existing ID 108)
let nextId = 109;
const currentDate = new Date().toISOString();

// Add new prompts
newPrompts.forEach(prompt => {
  const slug = generateSlug(prompt.title);
  data.prompts.push({
    id: nextId.toString(),
    slug,
    title: prompt.title,
    description: `Transform your images with this ${slug.replace(/-/g, ' ')} prompt for stunning creative effects.`,
    prompt: prompt.prompt,
    category: prompt.category,
    tags: prompt.tags,
    difficulty: prompt.difficulty,
    createdAt: currentDate,
    updatedAt: currentDate,
    thumbnail: {
      before: "woman-sample.jpg",
      after: `${slug}.png`
    }
  });
  nextId++;
});

// Update existing prompts to have multiple categories
// First, we need to modify the structure to support multiple categories
// Convert existing single category to array if needed
data.prompts = data.prompts.map((prompt: any) => {
  if (typeof prompt.category === 'string') {
    prompt.categories = [prompt.category];
    delete prompt.category;
  }
  return prompt;
});

// Now add additional categories to specific prompts
const multiCategoryUpdates = [
  { slug: "fisheye-skater-action", additionalCategories: ["Street Photography", "Creative Effects"] },
  { slug: "double-exposure-ocean", additionalCategories: ["Creative Effects", "Portrait Photography"] },
  { slug: "cinematic-motion-blur-scene", additionalCategories: ["Street Photography", "Portrait Photography"] },
  { slug: "chessboard-pattern-portrait", additionalCategories: ["Fashion Photography", "Editorial Photography"] },
  { slug: "3d-pixar-style-cartoon", additionalCategories: ["Digital Art"] },
  { slug: "anime-boss-portrait", additionalCategories: ["Portrait Photography"] }
];

multiCategoryUpdates.forEach(update => {
  const prompt = data.prompts.find((p: any) => p.slug === update.slug);
  if (prompt) {
    update.additionalCategories.forEach(cat => {
      if (!prompt.categories.includes(cat)) {
        prompt.categories.push(cat);
      }
    });
    prompt.updatedAt = currentDate;
  }
});

// Also update new prompts to use categories array instead of category
data.prompts = data.prompts.map((prompt: any) => {
  if (prompt.category && !prompt.categories) {
    prompt.categories = [prompt.category];
    delete prompt.category;
  }
  return prompt;
});

// Write the updated data
fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));

console.log(`✅ Successfully added ${newPrompts.length} new prompts`);
console.log(`✅ Updated ${multiCategoryUpdates.length} existing prompts with multiple categories`);
console.log(`📊 Total prompts in database: ${data.prompts.length}`);