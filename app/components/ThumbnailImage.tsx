'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IMAGE_QUALITY } from '@/lib/config/images';

interface ThumbnailImageProps {
  thumbnail?: string | { before: string; after: string };
  promptId: string;
  title: string;
  priority?: boolean;
  className?: string;
}

export default function ThumbnailImage({
  thumbnail,
  title,
  priority = false,
  className = ''
}: ThumbnailImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Get the thumbnail filename
  let thumbnailFileName: string;
  
  if (typeof thumbnail === 'object' && thumbnail?.after) {
    // New format with before/after - extract filename
    thumbnailFileName = thumbnail.after.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '');
  } else if (typeof thumbnail === 'string') {
    // Old format - extract filename from path
    thumbnailFileName = thumbnail.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '');
  } else {
    // Fallback - this might not have a square version
    return (
      <div className={`relative bg-stone-800 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-stone-500">Preview coming soon</p>
        </div>
      </div>
    );
  }
  
  // Use square WebP version
  const squareSrc = `/thumbnails/square/${thumbnailFileName}.webp`;

  if (hasError) {
    return (
      <div className={`relative bg-stone-800 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-stone-500">Preview unavailable</p>
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
        src={squareSrc}
        alt={`${title} thumbnail`}
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