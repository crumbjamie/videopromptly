import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

async function generateSquareThumbnails() {
  const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');
  const squareDir = path.join(thumbnailsDir, 'square');
  
  // Create square directory if it doesn't exist
  try {
    await fs.mkdir(squareDir, { recursive: true });
  } catch (error) {
    console.error('Error creating square directory:', error);
  }
  
  // Get all image files
  const files = await fs.readdir(thumbnailsDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file) && !file.includes('-square')
  );
  
  console.log(`Found ${imageFiles.length} images to process`);
  
  let processedCount = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(thumbnailsDir, file);
    const fileNameWithoutExt = path.parse(file).name;
    const outputPath = path.join(squareDir, `${fileNameWithoutExt}.webp`);
    
    try {
      // Skip if already exists
      try {
        await fs.access(outputPath);
        console.log(`Skipping ${file} - square version already exists`);
        continue;
      } catch {
        // File doesn't exist, proceed
      }
      
      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      const { width = 0, height = 0 } = metadata;
      
      console.log(`Processing ${file} (${width}x${height})`);
      
      // Create 1024x1024 square thumbnail
      if (width > height) {
        // Landscape: crop width to match height
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
        // Portrait: crop height to match width
        const size = width;
        await sharp(inputPath)
          .extract({
            left: 0,
            top: Math.floor((height - size) / 2),
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
      console.log(`✓ Created square thumbnail: square/${fileNameWithoutExt}.webp`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  console.log(`\nSquare thumbnail generation complete! Processed ${processedCount} images.`);
}

// Run the script
generateSquareThumbnails().catch(console.error);