'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IMAGE_QUALITY } from '@/lib/config/images';

interface SquareThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function SquareThumbnail({
  src,
  alt,
  className = '',
  priority = false
}: SquareThumbnailProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Check if we need to use the square API
    if (src && src.includes('/thumbnails/')) {
      // For landscape images, use the square API
      const checkAndSetSquare = async () => {
        try {
          // First, try to load the image to check dimensions
          const img = new window.Image();
          img.onload = () => {
            if (img.width > img.height) {
              // Landscape image - use square API
              setImageSrc(`/api/thumbnail/square?image=${encodeURIComponent(src)}`);
            }
          };
          img.src = src;
        } catch (error) {
          console.error('Error checking image dimensions:', error);
        }
      };
      checkAndSetSquare();
    }
  }, [src]);

  if (!src || hasError) {
    return (
      <div className={`relative bg-stone-800 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-stone-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-stone-500">Preview coming soon</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-stone-800 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-800 animate-pulse" />
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={1024}
        height={1024}
        className="w-full h-full object-cover"
        quality={IMAGE_QUALITY.thumbnail}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        priority={priority}
      />
    </div>
  );
}