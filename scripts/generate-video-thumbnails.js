#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const videosDir = path.join(process.cwd(), 'public', 'videos');
const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');

// Ensure thumbnails directory exists
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Function to get video resolution
function getVideoResolution(videoPath) {
  try {
    const command = `ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${videoPath}"`;
    const result = execSync(command, { encoding: 'utf8' }).trim();
    return result; // Returns format like "1280x720"
  } catch (error) {
    console.error(`Error getting resolution for ${videoPath}:`, error.message);
    return null;
  }
}

// Function to get video duration
function getVideoDuration(videoPath) {
  try {
    const command = `ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
    const result = execSync(command, { encoding: 'utf8' }).trim();
    return Math.round(parseFloat(result)); // Round to nearest second
  } catch (error) {
    console.error(`Error getting duration for ${videoPath}:`, error.message);
    return null;
  }
}

// Function to calculate aspect ratio
function calculateAspectRatio(resolution) {
  if (!resolution) return null;
  const [width, height] = resolution.split('x').map(Number);
  
  // Common aspect ratios
  const ratio = width / height;
  if (Math.abs(ratio - 16/9) < 0.01) return "16:9";
  if (Math.abs(ratio - 9/16) < 0.01) return "9:16";
  if (Math.abs(ratio - 4/3) < 0.01) return "4:3";
  if (Math.abs(ratio - 1) < 0.01) return "1:1";
  
  // Return calculated ratio
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width/divisor}:${height/divisor}`;
}

// Function to generate thumbnail from video
function generateThumbnail(videoPath, outputPath) {
  try {
    // Extract frame at 1 second (or 10% of video duration, whichever is smaller)
    const command = `ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" "${outputPath}" -y`;
    
    console.log(`Generating thumbnail: ${path.basename(outputPath)}`);
    execSync(command, { stdio: 'pipe' });
    
    return true;
  } catch (error) {
    console.error(`Error generating thumbnail for ${videoPath}:`, error.message);
    return false;
  }
}

// Function to update database with thumbnail URLs
function updateDatabase() {
  try {
    const data = fs.readFileSync(databasePath, 'utf8');
    const database = JSON.parse(data);
    
    let updated = false;
    
    // Update each prompt with thumbnail URL if video exists and thumbnail was generated
    database.prompts.forEach(prompt => {
      if (prompt.videoUrl) {
        // Extract filename from videoUrl (e.g., "/videos/bigfoot-morning-routine.mp4" -> "bigfoot-morning-routine")
        const videoFilename = path.basename(prompt.videoUrl, '.mp4');
        const videoPath = path.join(videosDir, `${videoFilename}.mp4`);
        const thumbnailPath = path.join(thumbnailsDir, `${videoFilename}.jpg`);
        
        // Check if video file exists
        if (fs.existsSync(videoPath)) {
          // Get actual video metadata
          const actualResolution = getVideoResolution(videoPath);
          const actualDuration = getVideoDuration(videoPath);
          const actualAspectRatio = calculateAspectRatio(actualResolution);
          
          // Update video metadata if different
          let metadataUpdated = false;
          if (actualResolution && prompt.resolution !== actualResolution) {
            prompt.resolution = actualResolution;
            metadataUpdated = true;
          }
          if (actualDuration && prompt.duration !== actualDuration) {
            prompt.duration = actualDuration;
            metadataUpdated = true;
          }
          if (actualAspectRatio && prompt.aspectRatio !== actualAspectRatio) {
            prompt.aspectRatio = actualAspectRatio;
            metadataUpdated = true;
          }
          
          if (metadataUpdated) {
            updated = true;
            console.log(`✓ Updated metadata for: ${prompt.title} (${actualResolution}, ${actualDuration}s, ${actualAspectRatio})`);
          }
          
          // Generate thumbnail if it doesn't exist
          if (!fs.existsSync(thumbnailPath)) {
            if (generateThumbnail(videoPath, thumbnailPath)) {
              prompt.thumbnailUrl = `/thumbnails/${videoFilename}.jpg`;
              updated = true;
              console.log(`✓ Added thumbnail for: ${prompt.title}`);
            }
          } else {
            // Thumbnail exists, just update the URL if missing
            if (!prompt.thumbnailUrl) {
              prompt.thumbnailUrl = `/thumbnails/${videoFilename}.jpg`;
              updated = true;
              console.log(`✓ Updated thumbnail URL for: ${prompt.title}`);
            }
          }
        } else {
          console.log(`⚠ Video file not found: ${videoPath}`);
        }
      }
    });
    
    // Save updated database
    if (updated) {
      fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
      console.log('✓ Database updated with thumbnail URLs');
    } else {
      console.log('No updates needed');
    }
    
  } catch (error) {
    console.error('Error updating database:', error.message);
  }
}

// Main function
function main() {
  console.log('Starting video thumbnail generation...');
  
  // Check if ffmpeg is available
  try {
    execSync('ffmpeg -version', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ ffmpeg not found. Please install ffmpeg to generate video thumbnails.');
    console.error('Install with: brew install ffmpeg (macOS) or apt install ffmpeg (Ubuntu)');
    process.exit(1);
  }
  
  console.log('✓ ffmpeg found');
  
  // Update database and generate missing thumbnails
  updateDatabase();
  
  console.log('✓ Video thumbnail generation complete!');
}

// Run the script
main();