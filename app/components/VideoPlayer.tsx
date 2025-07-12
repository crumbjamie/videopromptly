'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { analytics } from '@/lib/analytics';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  promptId?: string;
  promptTitle?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onHover?: () => void;
  onError?: () => void;
}

export default function VideoPlayer({
  src,
  poster,
  alt,
  className,
  autoPlay = false,
  muted = true,
  loop = true,
  controls = true,
  preload = 'metadata',
  promptId,
  promptTitle,
  onPlay,
  onPause,
  onHover,
  onError
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    if (promptId && promptTitle) {
      analytics.trackVideoPlay(promptId, promptTitle);
    }
    onPlay?.();
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (promptId && promptTitle) {
      analytics.trackVideoPause(promptId, promptTitle);
    }
    onPause?.();
  };

  const handleMouseEnter = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play().catch(() => {
        // Handle play promise rejection
      });
    }
    if (promptId && promptTitle) {
      analytics.trackHoverPreview(promptId, promptTitle);
    }
    onHover?.();
  };

  const handleMouseLeave = () => {
    if (videoRef.current && autoPlay) {
      videoRef.current.pause();
    }
  };


  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = muted;
    }
  }, [muted]);

  // Handle autoPlay changes for hover functionality
  useEffect(() => {
    const video = videoRef.current;
    if (video && autoPlay) {
      video.play().catch(() => {
        // Handle play promise rejection
      });
    } else if (video && !autoPlay && isPlaying) {
      video.pause();
    }
  }, [autoPlay, isPlaying]);

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-stone-800 text-stone-400 rounded-lg",
          className
        )}
        role="img"
        aria-label={alt}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-sm">Video failed to load</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative group rounded-lg overflow-hidden bg-stone-900", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        preload={preload}
        playsInline
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleError}
        aria-label={alt}
      />
      
      {/* Custom controls removed - using native HTML video controls instead */}
    </div>
  );
}