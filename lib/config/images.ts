export const IMAGE_SIZES = {
  // Thumbnail sizes for grid display (square images)
  thumbnail: {
    // Square thumbnails at 1024x1024
    // Container ~450x450px on desktop
    width: 1024,
    height: 1024,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
  },
  
  // Full size for detail pages
  full: {
    // Display size: up to ~1024x512px on detail page
    width: 2048,
    height: 1024,
    sizes: '(max-width: 1280px) 100vw, 1024px'
  },
  
  // Mobile optimized
  mobile: {
    width: 640,
    height: 320,
    sizes: '100vw'
  }
};

// Quality settings for different contexts
export const IMAGE_QUALITY = {
  thumbnail: 85,  // Good quality for thumbnails
  full: 90,       // Higher quality for detail view
  mobile: 80      // Slightly lower for mobile data saving
};

// Supported formats in order of preference
export const IMAGE_FORMATS = ['avif', 'webp', 'jpeg'] as const;

// Helper to get srcSet for responsive images
export function getImageSrcSet(src: string, size: keyof typeof IMAGE_SIZES) {
  const config = IMAGE_SIZES[size];
  return {
    src,
    width: config.width,
    height: config.height,
    sizes: config.sizes
  };
}