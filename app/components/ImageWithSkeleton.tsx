'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

export default function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  className,
  priority,
  onClick
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={cn(
          "bg-stone-800 rounded-lg flex items-center justify-center",
          className
        )}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <p className="text-stone-500 text-sm">Image unavailable</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 bg-stone-800 animate-pulse rounded-lg",
            className
          )}
          style={{ aspectRatio: `${width}/${height}` }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        onClick={onClick}
      />
    </div>
  );
}