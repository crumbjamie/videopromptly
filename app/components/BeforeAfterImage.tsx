'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BeforeAfterImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function BeforeAfterImage({ 
  src, 
  alt, 
  width = 1024, 
  height = 512,
  className = ''
}: BeforeAfterImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fallback placeholder if no thumbnail
  if (!src || hasError) {
    return (
      <div className={`relative bg-stone-800 rounded-t-lg overflow-hidden ${className}`}>
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
        {/* Before/After labels */}
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Before
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          After
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-stone-800 rounded-t-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-800 animate-pulse" />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        priority
      />

      {/* Before/After labels */}
      {!isLoading && !hasError && (
        <>
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            Before
          </div>
          <div className="absolute top-2 left-[516px] bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            After
          </div>
        </>
      )}
    </div>
  );
}