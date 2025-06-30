import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getAllPrompts } from '../lib/database';
import { getBestImagesForPrompt, replacePromptVariables } from '../lib/image-mapping';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
if (!STABILITY_API_KEY) {
  throw new Error('Missing STABILITY_API_KEY environment variable');
}

// Test different styles to see which preserve identity best
const TEST_STYLES = [
  'ultra-realistic-portrait-photography',
  'dramatic-spotlight-portrait',
  'neon-sign-portrait',
  'minimalist-tech-portrait',
  'anime-boss-portrait'
];

async function generateWithStableDiffusion(
  imagePath: string,
  prompt: string,
  imageStrength: number = 0.35
): Promise<Buffer> {
  const imageBuffer = await fs.promises.readFile(imagePath);
  
  // Resize to recommended dimensions
  const resizedBuffer = await sharp(imageBuffer)
    .resize(1024, 1024, { fit: 'cover' })
    .toBuffer();

  const formData = new FormData();
  formData.append('init_image', new Blob([resizedBuffer], { type: 'image/jpeg' }));
  formData.append('init_image_mode', 'IMAGE_STRENGTH');
  formData.append('image_strength', imageStrength.toString());
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

  const responseData = await response.json() as { artifacts: Array<{ base64: string }> };
  return Buffer.from(responseData.artifacts[0].base64, 'base64');
}

async function testMultipleStyles() {
  console.log('Testing multiple styles with Stable Diffusion...\n');
  
  const allPrompts = await getAllPrompts();
  const selectedPrompts = allPrompts.filter(p => TEST_STYLES.includes(p.slug));
  
  if (selectedPrompts.length === 0) {
    console.error('No matching prompts found in database');
    return;
  }

  const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');
  
  for (const promptData of selectedPrompts) {
    try {
      console.log(`\nTesting: ${promptData.title}`);
      console.log(`Category: ${promptData.category}`);
      
      // Get appropriate sample image
      const sampleImages = getBestImagesForPrompt(promptData.category);
      const selectedImage = sampleImages[0];
      const imagePath = path.join(process.cwd(), 'sample-images', selectedImage);
      
      // Replace variables in prompt
      const processedPrompt = replacePromptVariables(promptData.prompt);
      console.log(`Prompt: ${processedPrompt.substring(0, 100)}...`);
      
      // Try different image strengths to find best identity preservation
      const strengths = [0.35]; // Just test one strength for now
      
      for (const strength of strengths) {
        console.log(`  Testing with image strength: ${strength}`);
        
        const generatedBuffer = await generateWithStableDiffusion(
          imagePath,
          processedPrompt,
          strength
        );
        
        // Create before/after thumbnail
        const originalBuffer = await fs.promises.readFile(imagePath);
        
        const beforeResized = await sharp(originalBuffer)
          .resize(512, 512, { fit: 'cover' })
          .toBuffer();

        const afterResized = await sharp(generatedBuffer)
          .resize(512, 512, { fit: 'cover' })
          .toBuffer();

        // Create composite image
        const filename = `${promptData.slug}-strength-${strength}.webp`;
        
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
          .toFile(path.join(thumbnailsDir, filename));
        
        console.log(`  ✓ Created: /thumbnails/${filename}`);
      }
      
      // Wait a bit between prompts to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error processing ${promptData.title}:`, error);
    }
  }
  
  console.log('\n✅ All style tests completed!');
  console.log('Check the /thumbnails/ directory to compare results.');
}

// Run the test
testMultipleStyles().catch(console.error);