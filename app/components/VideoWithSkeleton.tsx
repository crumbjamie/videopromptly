'use client';

import { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { cn } from '@/lib/utils/cn';

interface VideoWithSkeletonProps {
  src: string;
  poster?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  promptId?: string;
  promptTitle?: string;
  onClick?: () => void;
}

export default function VideoWithSkeleton({
  src,
  poster,
  alt,
  width,
  height,
  className,
  priority = false,
  autoPlay = false,
  muted = true,
  loop = true,
  controls = true,
  promptId,
  promptTitle,
  onClick
}: VideoWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div 
      className={cn("relative", className)}
      style={{ width, height }}
      onClick={onClick}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-stone-800 animate-pulse rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 border-2 border-stone-600 border-t-stone-400 rounded-full animate-spin" />
            <span className="text-xs text-stone-500">Loading video...</span>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-stone-800 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-sm text-stone-400">Failed to load video</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 text-xs bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Video Player */}
      <VideoPlayer
        src={src}
        poster={poster}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading || hasError ? "opacity-0" : "opacity-100"
        )}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        preload={priority ? "auto" : "metadata"}
        promptId={promptId}
        promptTitle={promptTitle}
        onPlay={handleCanPlay}
        onHover={handleLoadStart}
        onError={handleError}
      />
    </div>
  );
}