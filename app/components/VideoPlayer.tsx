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
    // Only auto-play on hover if controls are disabled (for hover previews)
    if (videoRef.current && !isPlaying && !controls) {
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
    // Only auto-pause on mouse leave if controls are disabled (for hover previews)
    if (videoRef.current && autoPlay && !controls) {
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
    if (video) {
      if (autoPlay && !controls) {
        // For hover previews (no controls), play when autoPlay becomes true
        video.play().catch(() => {
          // Handle play promise rejection
        });
      } else if (!autoPlay && !controls) {
        // For hover previews (no controls), pause when autoPlay becomes false
        video.pause();
      } else if (autoPlay && controls) {
        // For modal videos (with controls), only auto-play on first load
        if (video.readyState >= 2) { // If metadata is loaded
          video.play().catch(() => {
            // Handle play promise rejection
          });
        } else {
          video.addEventListener('loadedmetadata', () => {
            video.play().catch(() => {
              // Handle play promise rejection
            });
          }, { once: true });
        }
      }
    }
  }, [autoPlay, controls]);

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
      onMouseEnter={controls ? undefined : handleMouseEnter}
      onMouseLeave={controls ? undefined : handleMouseLeave}
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