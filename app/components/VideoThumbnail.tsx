'use client';

import { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import PlayButton from './PlayButton';
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
        <PlayButton size="sm" />
      </div>
    </div>
  );
}