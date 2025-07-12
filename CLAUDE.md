# VideoPromptly - Claude Code Project Instructions

## Project Overview

VideoPromptly is a video prompt discovery platform, forked from ImagePromptly on July 11, 2025. It helps users find and use AI video generation prompts for Veo3 and other AI video generation tools.

## Decision Log & Architecture

### Repository Strategy Decision
**Date**: July 11, 2025  
**Decision**: Fork ImagePromptly repository instead of creating a monorepo  
**Reasoning**:
- 1-week MVP timeline requirement
- No monorepo experience on team
- Different content models (no before/after for videos)
- Separate databases required
- MVP/speed preferred over clean architecture initially

### Content Model Specifications

**Video Format Support**: MP4 and WebM  
**Video Duration**: 8-second videos primarily  
**Video Source**: Created with Veo3 and other AI tools  
**Hosting**: Self-hosted initially  
**Preview**: Hover to auto-play preview (muted)  
**Display Requirements**: Duration, resolution, file size information

### Key Differences from ImagePromptly

1. **No Before/After Concept**: Videos don't use transformation preview model
2. **Different Prompt Structure**: Prompts target Veo3 and other AI video tools instead of ChatGPT
3. **Video-Specific Categories**: Animation, VFX, Transitions, etc.
4. **Additional Filters**: Video duration, aspect ratio, style/technique
5. **Video Player Components**: Replace image display with video playback
6. **Hover Previews**: Auto-play on hover for engagement

### Data Model Changes Required

```typescript
interface VideoPrompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  categories?: string[];
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: Date;
  updatedAt: Date;
  
  // Video-specific fields
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  resolution: string; // e.g., "1920x1080"
  aspectRatio: string; // e.g., "16:9", "1:1", "9:16"
  format: string; // "mp4", "webm"
  fileSize: number; // in bytes
  
  featured?: boolean;
  rating?: number;
  ratingCount?: number;
}
```

### Business Requirements

- **Timeline**: 1-week MVP launch
- **Cross-promotion**: Banner links between ImagePromptly and VideoPromptly
- **Authentication**: Separate for now, possible shared future
- **Databases**: Completely separate
- **Maintenance**: Same team for both sites
- **Long-term**: Uncertain if both will be maintained

## Development Checklist

### High Priority (Week 1)
- [x] Fork ImagePromptly repository
- [x] Update package.json for video project
- [x] Update branding: "ImagePromptly" → "VideoPromptly" throughout
- [x] Replace image components with video player components
- [x] Modify data model for video-specific fields
- [x] Set up video hosting with Next.js/Vercel
- [ ] Update categories for video content

### Medium Priority (Week 2-3)
- [ ] Add video duration/resolution filters
- [ ] Integrate Leonardo AI API for video generation
- [ ] Add hover preview functionality
- [ ] Update SEO/schema for video content

### Low Priority (Future)
- [ ] Cross-promotion banners
- [ ] Advanced video streaming
- [ ] User authentication system
- [ ] Performance optimizations

## Component Replacement Map

### Critical Replacements
- `BeforeAfterImage.tsx` → `VideoPlayer.tsx`
- `ImageModal.tsx` → `VideoModal.tsx` 
- `ThumbnailImage.tsx` → `VideoThumbnail.tsx`
- `SchemaImage.tsx` → `SchemaVideo.tsx`

### Reusable Components
- Search/filter system (minor text changes)
- Rating system (unchanged)
- Analytics tracking (update event names)
- Blog system (completely reusable)
- UI framework (Radix UI + Tailwind)

## Technical Specifications

### Video Requirements
- **Max Duration**: 8 seconds
- **Formats**: MP4 (primary), WebM (fallback)
- **Resolution Display**: Show resolution badges
- **File Size**: Display for user awareness
- **Auto-play**: Muted hover previews
- **Controls**: Basic play/pause/volume

### API Integration
- **Veo3**: Primary video generation tool
- **Other AI Tools**: Secondary options
- **Video Hosting**: Next.js + Vercel (public/videos/)
- **CDN**: Vercel Edge Network (global caching)
- **Video Processing**: Built-in scripts for thumbnails and metadata

### SEO Considerations
- Update schema.org markup for VideoObject
- Video sitemap generation
- Duration/resolution in meta tags
- Video-specific Open Graph tags

## Scripts to Update

### Video Processing (Replace Image Scripts)
- `generate-thumbnails.ts` → Extract video thumbnails
- `generate-square-thumbnails.ts` → Square video previews
- `process-new-thumbnails.js` → Process video uploads
- `update-thumbnails.js` → Update video database

### Reusable Scripts
- Analytics tracking scripts
- SEO/sitemap generation
- Database utilities
- Build/deploy scripts

## Environment Variables

### New Variables Needed
```bash
VEO3_API_KEY=your_veo3_api_key
VIDEO_CDN_URL=your_video_cdn_url
VIDEO_UPLOAD_PATH=/videos/
```

### Reusable Variables
- GTM_ID (same tracking)
- Database credentials (separate DB)
- Vercel/hosting config

## Analytics Tracking Updates

### Event Name Changes
- `image_view` → `video_view`
- `chatgpt_click` → `veo3_click`
- `copy_prompt` → `copy_video_prompt`
- `category_browse` → `video_category_browse`

### New Events
- `video_play`
- `video_pause`
- `hover_preview`
- `duration_filter`
- `resolution_filter`

## Running Development

### Linting and Type Checking
When code changes are made:
- Run: `npm run lint`
- Run: `npx tsc --noEmit` (for type checking)

### Video Processing Workflow
1. Place new video files in `/public/videos/`
2. Run video processing scripts to extract thumbnails
3. Update database with video metadata
4. Generate square thumbnails for card view

## Future Consolidation Strategy

After 3-6 months when both platforms are stable:
1. Extract shared UI components to npm packages
2. Create common analytics/SEO utilities
3. Shared authentication system (if needed)
4. Consider workspace/monorepo migration

## Launch Strategy

### Week 1 MVP
- Basic video display
- Copy prompt functionality
- Simple categories/tags
- Veo3 integration

### Week 2-3 Enhancement
- Advanced filtering
- Hover previews
- SEO optimization
- Cross-promotion setup

### Month 2+ Features
- User accounts
- Rating system
- Advanced video features
- Performance optimization

## Repository Information

**Original**: https://github.com/crumbjamie/img-prompter  
**Fork**: https://github.com/jamieesterman/videopromptly  
**Local Path**: `/Users/jamie/Documents/GitHub/videopromptly/`

## Current Status

- Repository forked and dependencies installed
- Package.json updated for video project
- GitHub Desktop setup in progress
- Ready to begin core transformations

## Next Steps

1. Resolve GitHub repository access issues
2. Start branding updates (ImagePromptly → VideoPromptly)
3. Create video data model and types
4. Build video player components
5. Update categories for video content

## Notes

- Keep this file updated as development progresses
- Document any architectural decisions
- Track performance considerations
- Note any blockers or technical debt