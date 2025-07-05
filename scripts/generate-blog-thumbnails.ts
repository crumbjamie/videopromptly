import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const BLOG_IMAGES_DIR = path.join(process.cwd(), 'public', 'blog', 'images');
const THUMBNAILS_DIR = path.join(BLOG_IMAGES_DIR, 'thumbnails');

async function generateBlogThumbnails() {
  console.log('📸 Generating blog thumbnails...');
  
  // Ensure thumbnails directory exists
  await fs.mkdir(THUMBNAILS_DIR, { recursive: true });
  
  // Define images to process
  const images = [
    { src: 'complete-guide-hero.png', thumb: 'complete-guide-thumb.png' },
    { src: 'portrait-transformation-examples.png', thumb: 'portrait-prompts-thumb.png' },
    { src: 'chatgpt-vs-midjourney.png', thumb: 'comparison-thumb.png' },
    { src: 'troubleshooting-errors.png', thumb: 'troubleshooting-thumb.png' }
  ];
  
  for (const { src, thumb } of images) {
    const srcPath = path.join(BLOG_IMAGES_DIR, src);
    const thumbPath = path.join(THUMBNAILS_DIR, thumb);
    
    try {
      await sharp(srcPath)
        .resize(400, 300, {
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(thumbPath);
      
      console.log(`✅ Generated thumbnail: ${thumb}`);
    } catch (error) {
      console.error(`❌ Error generating thumbnail for ${src}:`, error);
    }
  }
  
  console.log('\n✨ Thumbnail generation complete!');
}

generateBlogThumbnails().catch(console.error);