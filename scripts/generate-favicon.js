const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Simple favicon design - blue camera icon on dark background
const svgContent = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="4" fill="#0c0a09"/>
  <circle cx="16" cy="16" r="8" fill="none" stroke="#2563eb" stroke-width="2"/>
  <circle cx="16" cy="16" r="4" fill="#60a5fa"/>
  <rect x="8" y="8" width="16" height="1" fill="#2563eb"/>
  <rect x="8" y="23" width="16" height="1" fill="#2563eb"/>
</svg>
`;

async function generateFavicon() {
  try {
    // Generate favicon.png
    await sharp(Buffer.from(svgContent))
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../app/favicon.png'));
    
    console.log('✅ Favicon generated successfully at app/favicon.png');
    
    // Also generate apple-touch-icon.png (180x180)
    await sharp(Buffer.from(svgContent))
      .resize(180, 180)
      .png()
      .toFile(path.join(__dirname, '../app/apple-touch-icon.png'));
    
    console.log('✅ Apple touch icon generated successfully at app/apple-touch-icon.png');
    
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();