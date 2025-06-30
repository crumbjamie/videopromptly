const fs = require('fs');
const path = require('path');

const renameMap = {
  // Portraits/People
  'hassan-khan-EGVccebWodM-unsplash.jpg': 'portrait-man-beard.jpg',
  'christina-matviikiv-V92xhN7KSeU-unsplash.jpg': 'portrait-woman-casual.jpg',
  'alexander-london-mJaD10XeD7w-unsplash.jpg': 'portrait-person-outdoor.jpg',
  
  // Objects/Products
  'pexels-karolina-grabowska-6333512.jpg': 'product-cosmetics.jpg',
  'max-letek-L1mM2Z3UsoM-unsplash.jpg': 'object-minimal.jpg',
  
  // Nature/Landscape
  'jake-nackos-IF9TK5Uy-KI-unsplash.jpg': 'landscape-mountain.jpg',
  'pexels-brett-sayles-1073097.jpg': 'landscape-nature.jpg',
  
  // Urban/Architecture
  'pius-martin-TQSFD1cFgMk-unsplash.jpg': 'architecture-building.jpg',
  'andrey-k-syZ0QywCzac-unsplash.jpg': 'urban-street.jpg',
  
  // Tech/Workspace
  'pexels-divinetechygirl-1181477.jpg': 'workspace-laptop.jpg'
};

const sampleImagesDir = path.join(__dirname, '../sample-images');

// Rename files
Object.entries(renameMap).forEach(([oldName, newName]) => {
  const oldPath = path.join(sampleImagesDir, oldName);
  const newPath = path.join(sampleImagesDir, newName);
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`✓ Renamed: ${oldName} → ${newName}`);
  } else {
    console.log(`✗ Not found: ${oldName}`);
  }
});

console.log('\nRenaming complete!');

// List final files
console.log('\nFinal files in sample-images:');
const files = fs.readdirSync(sampleImagesDir);
files.forEach(file => console.log(`  - ${file}`));