import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Load environment variables
dotenv.config({ path: '.env.local' });

import { openai, getImageSize } from '../lib/openai';
import { getBestImagesForPrompt, replacePromptVariables } from '../lib/image-mapping';
import { getAllPrompts } from '../lib/database';

// Ensure thumbnails directory exists
const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Create a before/after composite image from buffer
async function createBeforeAfterImageFromBuffer(
  beforePath: string,
  afterBuffer: Buffer,
  outputPath: string
): Promise<void> {
  try {
    // Read the before image
    const beforeBuffer = await fs.promises.readFile(beforePath);

    // Resize both images to 512x512 for the thumbnail
    const beforeResized = await sharp(beforeBuffer)
      .resize(512, 512, { fit: 'cover' })
      .toBuffer();

    const afterResized = await sharp(afterBuffer)
      .resize(512, 512, { fit: 'cover' })
      .toBuffer();

    // Create composite image (1024x512)
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

    console.log(`✓ Created thumbnail: ${outputPath}`);
  } catch (error) {
    console.error(`✗ Error creating thumbnail: ${error}`);
    throw error;
  }
}

// Create a before/after composite image from URL
async function createBeforeAfterImage(
  beforePath: string,
  afterUrl: string,
  outputPath: string
): Promise<void> {
  try {
    // Download the generated image
    const response = await fetch(afterUrl);
    const arrayBuffer = await response.arrayBuffer();
    const afterBuffer = Buffer.from(arrayBuffer);

    await createBeforeAfterImageFromBuffer(beforePath, afterBuffer, outputPath);
  } catch (error) {
    console.error(`✗ Error creating thumbnail: ${error}`);
    throw error;
  }
}

// Generate thumbnail for a single prompt
async function generatePromptThumbnail(
  promptId: string,
  promptText: string,
  category: string,
  imageIndex: number = 0
): Promise<string | null> {
  try {
    // Get the best image for this category
    const sampleImages = getBestImagesForPrompt(category, 5);
    const selectedImage = sampleImages[imageIndex % sampleImages.length];
    const imagePath = path.join(process.cwd(), 'sample-images', selectedImage);

    // Replace variables in the prompt
    const processedPrompt = replacePromptVariables(promptText);

    console.log(`Generating thumbnail for prompt ${promptId} using ${selectedImage}...`);

    // Generate the image using DALL-E 3
    const response = await openai.images.generate({
      model: process.env.OPENAI_MODEL || 'dall-e-3',
      prompt: processedPrompt,
      n: 1,
      size: getImageSize(),
      quality: process.env.OPENAI_IMAGE_QUALITY as any || 'standard',
    });

    // Handle both URL and base64 responses
    const imageData = response.data?.[0];
    if (!imageData) {
      throw new Error('No image data returned from OpenAI');
    }

    // Create before/after thumbnail
    const thumbnailPath = path.join(thumbnailsDir, `${promptId}-${imageIndex}.webp`);
    
    if (imageData.b64_json) {
      // Handle base64 response
      const generatedBuffer = Buffer.from(imageData.b64_json, 'base64');
      await createBeforeAfterImageFromBuffer(imagePath, generatedBuffer, thumbnailPath);
    } else if (imageData.url) {
      // Handle URL response
      await createBeforeAfterImage(imagePath, imageData.url, thumbnailPath);
    } else {
      throw new Error('Unknown image response format');
    }

    return `/thumbnails/${promptId}-${imageIndex}.webp`;
  } catch (error) {
    console.error(`Error generating thumbnail for prompt ${promptId}:`, error);
    return null;
  }
}

// Main function to generate thumbnails
async function generateAllThumbnails() {
  console.log('Starting thumbnail generation...');
  
  const prompts = await getAllPrompts();
  const results: Record<string, { main: string | null; all: (string | null)[] }> = {};

  // For testing, let's just do the first 5 prompts
  const testPrompts = prompts.slice(0, 5);

  for (const prompt of testPrompts) {
    console.log(`\nProcessing: ${prompt.title}`);
    
    const thumbnails: (string | null)[] = [];
    
    // Generate 5 variations using different sample images
    for (let i = 0; i < 5; i++) {
      const thumbnail = await generatePromptThumbnail(
        prompt.id,
        prompt.prompt,
        prompt.category,
        i
      );
      thumbnails.push(thumbnail);
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // The first successful thumbnail becomes the main one
    const mainThumbnail = thumbnails.find(t => t !== null) || null;
    
    results[prompt.id] = {
      main: mainThumbnail,
      all: thumbnails
    };

    // Save results incrementally
    await fs.promises.writeFile(
      path.join(thumbnailsDir, 'thumbnails-map.json'),
      JSON.stringify(results, null, 2)
    );
  }

  console.log('\nThumbnail generation complete!');
  console.log(`Generated thumbnails for ${Object.keys(results).length} prompts`);
}

// Run the script
generateAllThumbnails().catch(console.error);