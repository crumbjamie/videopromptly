/**
 * Add cache-busting query parameter to video URLs
 * This helps bypass CDN cache when videos are updated
 */
export function getVideoCacheBustUrl(videoUrl: string): string {
  if (!videoUrl) return '';
  
  // Add timestamp to force cache refresh
  const separator = videoUrl.includes('?') ? '&' : '?';
  return `${videoUrl}${separator}v=${Date.now()}`;
}

/**
 * Get video URL with deployment version for cache busting
 * Use a fixed version that changes with each deployment
 */
export function getVideoUrlWithVersion(videoUrl: string): string {
  if (!videoUrl) return '';
  
  // Use build time or deployment ID for consistent cache busting
  const version = process.env.NEXT_PUBLIC_BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || '1';
  const separator = videoUrl.includes('?') ? '&' : '?';
  return `${videoUrl}${separator}v=${version}`;
}