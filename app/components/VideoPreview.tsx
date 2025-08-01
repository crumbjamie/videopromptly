'use client';

import { useState } from 'react';
import { PlayIcon } from '@radix-ui/react-icons';
import VideoPlayer from './VideoPlayer';
import { cn } from '@/lib/utils/cn';

interface VideoPreviewProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  promptId?: string;
  promptTitle?: string;
  duration?: number;
  resolution?: string;
}

export default function VideoPreview({
  src,
  poster,
  alt,
  className,
  promptId,
  promptTitle,
}: VideoPreviewProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Remove HEAD request check - let the video element handle loading/errors directly

  if (hasStarted && !videoError) {
    return (
      <VideoPlayer
        src={src}
        poster={poster}
        alt={alt}
        className={className}
        autoPlay={true}
        muted={false}
        loop={true}
        controls={true}
        preload="auto"
        promptId={promptId}
        promptTitle={promptTitle}
        onError={() => setVideoError(true)}
      />
    );
  }

  return (
    <div 
      className={cn("relative cursor-pointer group", className)}
      onClick={() => !videoError && setHasStarted(true)}
    >
      {/* Thumbnail Image or Error State */}
      {videoError ? (
        <div className="w-full h-full bg-stone-800 rounded-lg flex items-center justify-center">
          <div className="text-stone-400 text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-sm font-medium">Video failed to load</div>
          </div>
        </div>
      ) : poster ? (
        <img
          src={poster}
          alt={alt}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-full bg-stone-800 rounded-lg flex items-center justify-center">
          <div className="text-stone-400 text-center">
            <div className="text-2xl mb-2">🎬</div>
            <div className="text-sm">Loading preview...</div>
          </div>
        </div>
      )}
      
      {/* Play Button Overlay - Only show if no error */}
      {!videoError && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-200 group-hover:bg-opacity-40">
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center transition-transform duration-200 hover:scale-110">
            <PlayIcon className="w-8 h-8 text-black ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}