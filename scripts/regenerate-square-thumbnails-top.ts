import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// List of slugs that need top-center cropping
const TOP_CENTER_SLUGS = [
  'sculptural-fashion-editorial',
  'futuristic-avant-garde-portrait',
  'streetwear-commercial-photography',
  'metamorphic-fashion-portrait',
  'minimalist-luxury-portrait',
  'vintage-inspired-fashion',
  'surreal-fashion-fantasy',
  'senior-executive-portrait',
  'samurai-bridge',
  'desert-biker',
  'detective-noir-tunnel',
  'anime-boss-portrait',
  'high-fashion-editorial-portrait'
];

async function regenerateSquareThumbnails() {
  const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');
  const squareDir = path.join(thumbnailsDir, 'square');
  
  // Create square directory if it doesn't exist
  try {
    await fs.mkdir(squareDir, { recursive: true });
  } catch (error) {
    console.error('Error creating square directory:', error);
  }
  
  console.log(`Regenerating ${TOP_CENTER_SLUGS.length} square thumbnails with top-center cropping...`);
  
  let processedCount = 0;
  let skippedCount = 0;
  
  for (const slug of TOP_CENTER_SLUGS) {
    // Try to find the thumbnail file for this slug
    const files = await fs.readdir(thumbnailsDir);
    const matchingFile = files.find(file => {
      const fileName = path.parse(file).name.toLowerCase();
      return fileName === slug && /\.(jpg|jpeg|png|webp)$/i.test(file);
    });
    
    if (!matchingFile) {
      console.log(`⚠️  No thumbnail found for slug: ${slug}`);
      skippedCount++;
      continue;
    }
    
    const inputPath = path.join(thumbnailsDir, matchingFile);
    const outputPath = path.join(squareDir, `${slug}.webp`);
    
    try {
      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      const { width = 0, height = 0 } = metadata;
      
      console.log(`Processing ${matchingFile} (${width}x${height})`);
      
      // Create 1024x1024 square thumbnail with top-center cropping
      if (width > height) {
        // Landscape: crop width to match height, center horizontally
        const size = height;
        await sharp(inputPath)
          .extract({
            left: Math.floor((width - size) / 2),
            top: 0,
            width: size,
            height: size
          })
          .resize(1024, 1024, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 85 })
          .toFile(outputPath);
      } else if (height > width) {
        // Portrait: crop height to match width, but from TOP
        const size = width;
        await sharp(inputPath)
          .extract({
            left: 0,
            top: 0, // Start from top instead of center
            width: size,
            height: size
          })
          .resize(1024, 1024, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 85 })
          .toFile(outputPath);
      } else {
        // Already square: just resize
        await sharp(inputPath)
          .resize(1024, 1024, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 85 })
          .toFile(outputPath);
      }
      
      processedCount++;
      console.log(`✓ Created square thumbnail with top-center crop: square/${slug}.webp`);
    } catch (error) {
      console.error(`Error processing ${matchingFile}:`, error);
    }
  }
  
  console.log(`\nRegeneration complete!`);
  console.log(`Processed: ${processedCount} images`);
  console.log(`Skipped: ${skippedCount} images (not found)`);
}

// Run the script
regenerateSquareThumbnails().catch(console.error);