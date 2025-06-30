import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
if (!STABILITY_API_KEY) {
  throw new Error('Missing STABILITY_API_KEY environment variable');
}

interface TestPrompt {
  slug: string;
  title: string;
  prompt: string;
}

const TEST_PROMPTS: TestPrompt[] = [
  {
    slug: 'limited-edition-toy-store-display',
    title: 'Limited Edition Toy Store Display',
    prompt: "Full-body action figure in window box packaging using subject likeness. 'Limited Edition' prominently displayed, arranged proportionally in inset slots. 3D animation style with soft lighting, toy store background, retro-modern design."
  },
  {
    slug: '3d-pixar-style-cartoon',
    title: '3D Pixar-Style Cartoon',
    prompt: "Convert this image into 3D Pixar-style cartoon with clean geometric forms, soft three-point lighting, and exaggerated expressive features. Vibrant saturated colors, smooth subsurface scattering, cinematic composition, award-winning animation studio quality, 4K rendering."
  },
  {
    slug: 'cinematic-neo-noir-style',
    title: 'Cinematic Neo-Noir Style',
    prompt: "Transform this image into neo-noir cinematography with moody neon lighting in deep blue and magenta tones. Rain-streaked atmosphere, dramatic shadows, high contrast lighting, shot with 35mm film aesthetic, professional thriller movie still quality, ultra-realistic rendering."
  }
];

const TEST_IMAGES = ['animal.jpg', 'guy-glasses.jpg', 'woman.jpg'];

async function generateImage(imageBuffer: Buffer, prompt: string): Promise<Buffer> {
  // Resize to recommended dimensions (must be multiple of 64)
  const resizedBuffer = await sharp(imageBuffer)
    .resize(1024, 1024, { fit: 'cover' })
    .toBuffer();

  // Create form data
  const formData = new FormData();
  formData.append('init_image', new Blob([resizedBuffer], { type: 'image/jpeg' }));
  formData.append('init_image_mode', 'IMAGE_STRENGTH');
  formData.append('image_strength', '0.35'); // Lower = more similar to original
  formData.append('text_prompts[0][text]', prompt);
  formData.append('text_prompts[0][weight]', '1');
  formData.append('cfg_scale', '7');
  formData.append('samples', '1');
  formData.append('steps', '30');
  formData.append('style_preset', 'photographic');

  const response = await fetch(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'application/json',
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const responseData = await response.json() as { artifacts: Array<{ base64: string; finishReason: string }> };
  const generatedImage = responseData.artifacts[0];
  return Buffer.from(generatedImage.base64, 'base64');
}

async function createComparisonThumbnail(
  originalBuffer: Buffer,
  generatedBuffer: Buffer,
  outputPath: string
): Promise<void> {
  // Resize both images to 512x512 for the thumbnail
  const beforeResized = await sharp(originalBuffer)
    .resize(512, 512, { fit: 'cover' })
    .toBuffer();

  const afterResized = await sharp(generatedBuffer)
    .resize(512, 512, { fit: 'cover' })
    .toBuffer();

  // Create composite image
  await sharp({
    create: {
      width: 1024,
      height: 512,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
    .composite([
      { input: beforeResized, left: 0, top: 0 },
      { input: afterResized, left: 512, top: 0 }
    ])
    .webp({ quality: 85 })
    .toFile(outputPath);
}

async function testMultiplePrompts() {
  console.log('Testing multiple Stable Diffusion prompts...\n');
  
  const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');
  
  // Ensure thumbnails directory exists
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }

  for (const imageName of TEST_IMAGES) {
    const imagePath = path.join(process.cwd(), 'sample-images', imageName);
    
    if (!fs.existsSync(imagePath)) {
      console.error(`Sample image not found: ${imagePath}`);
      continue;
    }

    console.log(`\nProcessing ${imageName}...`);
    const imageBuffer = await fs.promises.readFile(imagePath);
    
    for (const testPrompt of TEST_PROMPTS) {
      try {
        console.log(`  - Applying "${testPrompt.title}"...`);
        
        const generatedBuffer = await generateImage(imageBuffer, testPrompt.prompt);
        
        // Create output filename
        const imageBaseName = path.basename(imageName, path.extname(imageName));
        const outputFileName = `${imageBaseName}-${testPrompt.slug}.webp`;
        const outputPath = path.join(thumbnailsDir, outputFileName);
        
        await createComparisonThumbnail(imageBuffer, generatedBuffer, outputPath);
        
        console.log(`    ✓ Created: ${outputFileName}`);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`    ✗ Error with "${testPrompt.title}":`, error);
      }
    }
  }
  
  console.log('\n✓ All tests completed!');
  console.log('View thumbnails in: /public/thumbnails/');
}

// Run the test
testMultiplePrompts().catch(console.error);