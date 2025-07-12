'use client';

import { useRef, useState, useEffect } from 'react';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';
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
  const [isMuted, setIsMuted] = useState(muted);
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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          setHasError(true);
        });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

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
  }, [autoPlay]);

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
        muted={isMuted}
        loop={loop}
        preload={preload}
        playsInline
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleError}
        aria-label={alt}
      />
      
      {controls && (
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>
            
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}