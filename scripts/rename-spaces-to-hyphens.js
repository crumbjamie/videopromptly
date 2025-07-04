const fs = require('fs');
const path = require('path');

// Directories to process
const directories = [
  path.join(process.cwd(), 'public', 'thumbnails'),
  path.join(process.cwd(), 'public', 'thumbnails', 'square')
];

function renameFilesWithSpaces(directory) {
  console.log(`\nProcessing directory: ${directory}`);
  
  const files = fs.readdirSync(directory);
  let renamedCount = 0;
  
  files.forEach(file => {
    if (file.includes(' ')) {
      const oldPath = path.join(directory, file);
      const newFileName = file.replace(/ /g, '-');
      const newPath = path.join(directory, newFileName);
      
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`✓ Renamed: "${file}" → "${newFileName}"`);
        renamedCount++;
      } catch (error) {
        console.error(`✗ Error renaming "${file}":`, error.message);
      }
    }
  });
  
  if (renamedCount === 0) {
    console.log('No files with spaces found.');
  } else {
    console.log(`Renamed ${renamedCount} files.`);
  }
}

// Process all directories
directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    renameFilesWithSpaces(dir);
  } else {
    console.log(`Directory not found: ${dir}`);
  }
});

console.log('\n✅ File renaming complete!');
console.log('\nNote: Remember to run the thumbnail matching script after renaming files.');