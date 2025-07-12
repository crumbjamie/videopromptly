# VideoPromptly Videos Directory

This directory contains all video files for the VideoPromptly platform.

## File Structure

```
/public/videos/
├── README.md (this file)
├── thumbnails/          # Video thumbnail images (.jpg)
├── video-id_1920x1080_8s.mp4   # Main video files
├── video-id_1920x1080_8s.webm  # WebM fallbacks
└── ...
```

## File Naming Convention

Videos should follow this naming pattern:
`{prompt-id}_{resolution}_{duration}s.{format}`

Examples:
- `cyberpunk-street_1920x1080_8s.mp4`
- `nature-scene_1280x720_5s.webm`
- `abstract-art_1080x1080_10s.mp4`

## Supported Formats

- **MP4** (primary) - Best compatibility
- **WebM** (fallback) - Smaller file sizes
- **MOV** (development) - For processing

## File Size Limits

- **Maximum**: 10MB per video
- **Recommended**: 2-5MB for 8-second videos
- **Optimization**: Use H.264 codec for MP4

## Vercel Deployment

Videos are automatically served by Vercel with:
- ✅ Global CDN caching
- ✅ Optimized headers for streaming
- ✅ Automatic compression
- ✅ Fast loading worldwide

## Processing Videos

1. **Add videos** to this directory
2. **Run processing**: \`npm run process:videos\`
3. **Generate thumbnails**: \`npm run generate:video-thumbnails\`
4. **Deploy**: Videos are included in Vercel build

## Video Requirements

- **Duration**: 5-10 seconds (8s recommended)
- **Resolution**: 1080p or higher
- **Codec**: H.264 for MP4, VP9 for WebM
- **Quality**: High enough for preview, optimized for web

## Thumbnail Generation

Thumbnails are automatically generated as:
- **Format**: JPG
- **Size**: 1920x1080 (preserves aspect ratio)
- **Location**: `/videos/thumbnails/`
- **Naming**: `{prompt-id}.jpg`

## Example Usage

```typescript
import { getVideoUrl, getVideoPosterUrl } from '@/lib/video';

const videoUrl = getVideoUrl('cyberpunk-street_1920x1080_8s.mp4');
const posterUrl = getVideoPosterUrl('cyberpunk-street_1920x1080_8s.mp4');
```

## Bandwidth Considerations

Vercel Free Tier includes:
- **100GB** monthly bandwidth
- **1000** video views ≈ 2-5GB (depending on video size)
- **Upgrade** to Pro if needed for higher traffic