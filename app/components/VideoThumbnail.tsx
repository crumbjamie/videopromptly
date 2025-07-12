'use client';

import { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { cn } from '@/lib/utils/cn';

interface VideoThumbnailProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  promptId?: string;
  promptTitle?: string;
  duration?: number;
  resolution?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48', 
  lg: 'w-64 h-64',
  xl: 'w-80 h-80'
};

export default function VideoThumbnail({
  src,
  poster,
  alt,
  className,
  size = 'md',
  promptId,
  promptTitle,
  duration,
  resolution,
  onClick
}: VideoThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <div 
      className={cn(
        "relative cursor-pointer group",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <VideoPlayer
        src={src}
        poster={poster}
        alt={alt}
        className="w-full h-full"
        autoPlay={isHovered}
        muted={true}
        loop={true}
        controls={false}
        preload="metadata"
        promptId={promptId}
        promptTitle={promptTitle}
      />
      
      {/* Play Overlay */}
      <div className={cn(
        "absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-200",
        isHovered ? "opacity-0" : "opacity-100"
      )}>
        <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-white" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}