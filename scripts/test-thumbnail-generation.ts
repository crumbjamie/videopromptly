import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

import { openai } from '../lib/openai';
import { getBestImagesForPrompt, replacePromptVariables } from '../lib/image-mapping';
import { getPromptBySlug } from '../lib/database';

// Ensure thumbnails directory exists
const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

async function testSingleThumbnail() {
  console.log('Testing thumbnail generation with a single prompt...');
  
  // Get a test prompt
  const testPrompt = await getPromptBySlug('ultra-realistic-portrait-photography');
  if (!testPrompt) {
    console.error('Test prompt not found');
    return;
  }

  console.log(`Using prompt: ${testPrompt.title}`);
  console.log(`Category: ${testPrompt.category}`);
  console.log(`Prompt text: ${testPrompt.prompt}`);

  // Get sample image
  const sampleImages = getBestImagesForPrompt(testPrompt.category);
  const selectedImage = sampleImages[0];
  const imagePath = path.join(process.cwd(), 'sample-images', selectedImage);

  console.log(`Using sample image: ${selectedImage}`);

  // Check if image exists
  if (!fs.existsSync(imagePath)) {
    console.error(`Sample image not found: ${imagePath}`);
    return;
  }

  // Replace variables in prompt
  const processedPrompt = replacePromptVariables(testPrompt.prompt);
  console.log(`Processed prompt: ${processedPrompt}`);

  try {
    // First, analyze the original image with GPT-4 Vision
    console.log('Analyzing original image with GPT-4 Vision...');
    
    const imageBase64 = fs.readFileSync(imagePath).toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
    
    const visionResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Describe this person in detail for image generation. Include their appearance, facial features, hair, and any distinguishing characteristics. Be specific about age, ethnicity, gender, and physical features.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });
    
    const personDescription = visionResponse.choices[0].message.content;
    console.log('Person description:', personDescription);
    
    // Now use this description with the prompt
    console.log('Generating image with DALL-E 3...');
    
    const enhancedPrompt = processedPrompt.replace('[subject]', personDescription || 'person');
    console.log('Enhanced prompt:', enhancedPrompt);
    
    const response = await openai.images.generate({
      model: process.env.OPENAI_MODEL || 'gpt-image-1',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: process.env.OPENAI_IMAGE_QUALITY as any || 'medium',
    });

    console.log('Image generated successfully!');
    
    // Handle base64 response from gpt-image-1
    const imageData = response.data?.[0];
    let generatedBuffer: Buffer;
    
    if (imageData?.b64_json) {
      console.log('Processing base64 image data...');
      generatedBuffer = Buffer.from(imageData.b64_json, 'base64');
    } else if (imageData?.url) {
      console.log('Downloading image from URL...');
      const imageResponse = await fetch(imageData.url);
      const arrayBuffer = await imageResponse.arrayBuffer();
      generatedBuffer = Buffer.from(arrayBuffer);
    } else {
      throw new Error('No image data returned from OpenAI');
    }

    // Read the original image
    const originalBuffer = await fs.promises.readFile(imagePath);

    // Create side-by-side thumbnail
    console.log('Creating before/after thumbnail...');
    
    // Resize both images to 512x512
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
      .toFile(path.join(thumbnailsDir, 'test-thumbnail.webp'));

    console.log('✓ Test thumbnail created successfully!');
    console.log(`View it at: /thumbnails/test-thumbnail.webp`);

  } catch (error) {
    console.error('Error during thumbnail generation:', error);
  }
}

// Run the test
testSingleThumbnail().catch(console.error);