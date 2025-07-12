// Video hosting utilities for Next.js/Vercel setup

export interface VideoConfig {
  baseUrl: string;
  videoPath: string;
  thumbnailPath: string;
  supportedFormats: string[];
  maxFileSize: number; // in MB
}

// Default configuration for Vercel hosting
export const videoConfig: VideoConfig = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://videopromptly.com' 
    : 'http://localhost:3000',
  videoPath: '/videos',
  thumbnailPath: '/videos/thumbnails',
  supportedFormats: ['mp4', 'webm'],
  maxFileSize: 10 // 10MB max for 8-second videos
};

/**
 * Get the full URL for a video file
 */
export function getVideoUrl(filename: string): string {
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${videoConfig.baseUrl}${videoConfig.videoPath}/${cleanFilename}`;
}

/**
 * Get the full URL for a video thumbnail
 */
export function getVideoThumbnailUrl(filename: string): string {
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${videoConfig.baseUrl}${videoConfig.thumbnailPath}/${cleanFilename}`;
}

/**
 * Get optimized video URL with format fallback
 */
export function getOptimizedVideoUrl(baseFilename: string, preferredFormat = 'mp4'): {
  primary: string;
  fallback?: string;
} {
  const nameWithoutExt = baseFilename.replace(/\.[^/.]+$/, '');
  
  const primary = getVideoUrl(`${nameWithoutExt}.${preferredFormat}`);
  const fallback = preferredFormat === 'mp4' 
    ? getVideoUrl(`${nameWithoutExt}.webm`)
    : getVideoUrl(`${nameWithoutExt}.mp4`);
    
  return { primary, fallback };
}

/**
 * Extract video metadata from filename
 */
export function parseVideoFilename(filename: string): {
  id: string;
  resolution?: string;
  duration?: number;
  format: string;
} {
  // Expected format: prompt-id_1920x1080_8s.mp4
  const match = filename.match(/(.+?)(?:_(\d+x\d+))?(?:_(\d+)s)?\.(\w+)$/);
  
  if (!match) {
    return {
      id: filename.replace(/\.[^/.]+$/, ''),
      format: filename.split('.').pop() || 'mp4'
    };
  }
  
  const [, id, resolution, durationStr, format] = match;
  
  return {
    id,
    resolution,
    duration: durationStr ? parseInt(durationStr) : undefined,
    format
  };
}

/**
 * Generate video filename with metadata
 */
export function generateVideoFilename(
  promptId: string, 
  resolution: string, 
  duration: number, 
  format = 'mp4'
): string {
  return `${promptId}_${resolution}_${duration}s.${format}`;
}

/**
 * Validate video file
 */
export function validateVideoFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > videoConfig.maxFileSize) {
    return {
      valid: false,
      error: `File size ${fileSizeMB.toFixed(1)}MB exceeds maximum ${videoConfig.maxFileSize}MB`
    };
  }
  
  // Check format
  const format = file.name.split('.').pop()?.toLowerCase();
  if (!format || !videoConfig.supportedFormats.includes(format)) {
    return {
      valid: false,
      error: `Format .${format} not supported. Use: ${videoConfig.supportedFormats.join(', ')}`
    };
  }
  
  return { valid: true };
}

/**
 * Get video file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(1)}MB`;
  }
  const kb = bytes / 1024;
  return `${kb.toFixed(0)}KB`;
}

/**
 * Format duration in MM:SS format
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get video poster/thumbnail URL
 */
export function getVideoPosterUrl(videoFilename: string): string {
  const nameWithoutExt = videoFilename.replace(/\.[^/.]+$/, '');
  return getVideoThumbnailUrl(`${nameWithoutExt}.jpg`);
}