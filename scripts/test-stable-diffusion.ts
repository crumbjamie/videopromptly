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

async function testStableDiffusionImg2Img() {
  console.log('Testing Stable Diffusion img2img for identity preservation...');
  
  // Use the same test image
  const imagePath = path.join(process.cwd(), 'sample-images', 'portrait-man-beard.jpg');
  
  if (!fs.existsSync(imagePath)) {
    console.error(`Sample image not found: ${imagePath}`);
    return;
  }

  // Read and prepare the image
  const imageBuffer = await fs.promises.readFile(imagePath);
  
  // Resize to recommended dimensions (must be multiple of 64)
  const resizedBuffer = await sharp(imageBuffer)
    .resize(1024, 1024, { fit: 'cover' })
    .toBuffer();

  try {
    console.log('Sending image to Stable Diffusion img2img...');
    
    // Create form data
    const formData = new FormData();
    formData.append('init_image', new Blob([resizedBuffer], { type: 'image/jpeg' }));
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', '0.35'); // Lower = more similar to original
    formData.append('text_prompts[0][text]', 'professional corporate portrait of the same person in business attire, modern office background, soft studio lighting, high quality professional headshot');
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
    console.log('Image generated successfully!');
    
    // Process the generated image
    const generatedImage = responseData.artifacts[0];
    const generatedBuffer = Buffer.from(generatedImage.base64, 'base64');

    // Create before/after thumbnail
    console.log('Creating before/after thumbnail...');
    
    // Resize both images to 512x512 for the thumbnail
    const beforeResized = await sharp(imageBuffer)
      .resize(512, 512, { fit: 'cover' })
      .toBuffer();

    const afterResized = await sharp(generatedBuffer)
      .resize(512, 512, { fit: 'cover' })
      .toBuffer();

    // Create composite image
    const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');
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
      .toFile(path.join(thumbnailsDir, 'stable-diffusion-test.webp'));

    console.log('✓ Stable Diffusion test thumbnail created successfully!');
    console.log(`View it at: /thumbnails/stable-diffusion-test.webp`);
    console.log(`Image strength used: 0.35 (lower values preserve more of the original)`);

  } catch (error) {
    console.error('Error during Stable Diffusion generation:', error);
  }
}

// Run the test
testStableDiffusionImg2Img().catch(console.error);