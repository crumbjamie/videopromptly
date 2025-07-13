'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { VideoPrompt } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import VideoThumbnail from './VideoThumbnail';
import StarRating from './StarRating';
import DevRating from './DevRating';

interface VideoCardProps {
  prompt: VideoPrompt;
}

const difficultyColors = {
  Beginner: 'bg-green-900 text-green-300',
  Intermediate: 'bg-yellow-900 text-yellow-300',
  Advanced: 'bg-red-900 text-red-300'
};

export default function VideoCard({ prompt }: VideoCardProps) {
  const [isLocalhost, setIsLocalhost] = useState(false);
  
  useEffect(() => {
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  }, []);

  return (
    <article className="h-full flex flex-col">
      <Link 
        href={`/video-prompt/${prompt.slug}`} 
        className="block flex-grow"
        aria-label={`View ${prompt.title} video prompt details`}
      >
        <div className="h-full flex flex-col bg-stone-950 rounded-lg transition-all duration-200 cursor-pointer group overflow-hidden border border-stone-800 hover:border-stone-700">
          {/* Video Thumbnail */}
          <figure className="aspect-video relative overflow-hidden bg-stone-800 flex items-center justify-center">
            <VideoThumbnail
              src={(prompt.videos && prompt.videos.length > 0) ? prompt.videos[0].videoUrl : prompt.videoUrl || ''}
              poster={(prompt.videos && prompt.videos.length > 0) ? prompt.videos[0].thumbnailUrl : prompt.thumbnailUrl}
              alt={prompt.title}
              className="w-full h-full"
              size="lg"
              promptId={prompt.id}
              promptTitle={prompt.title}
              duration={(prompt.videos && prompt.videos.length > 0) ? prompt.videos[0].duration : prompt.duration}
              resolution={(prompt.videos && prompt.videos.length > 0) ? prompt.videos[0].resolution : prompt.resolution}
            />
            
            {/* Multi-video badge */}
            {prompt.videos && prompt.videos.length > 1 && (
              <div className="absolute top-2 right-2 bg-blue-900 text-blue-300 text-xs font-medium px-2 py-1 rounded-md">
                {prompt.videos.length} variants
              </div>
            )}
          </figure>
          
          <div className="flex flex-col flex-grow p-6">
            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {prompt.title}
            </h3>
            
            {/* Description */}
            <p className="text-stone-400 text-sm mb-4 line-clamp-3 flex-grow">
              {prompt.description}
            </p>
            
            {/* Rating */}
            <div className="mb-3">
              <StarRating rating={prompt.rating || 0} size="sm" />
            </div>
            
            {/* Category and Difficulty */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-stone-800 text-stone-300">
                {prompt.category}
              </span>
              
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
                difficultyColors[prompt.difficulty]
              )}>
                {prompt.difficulty}
              </span>
            </div>
            
            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1">
              {prompt.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-stone-900 text-stone-400"
                >
                  #{tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-stone-900 text-stone-400">
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Dev Rating - Outside of Link and Card - Only on localhost */}
      {isLocalhost && (
        <DevRating 
          promptId={prompt.id} 
          currentRating={prompt.rating || 0}
          isFeatured={prompt.featured || false}
        />
      )}
    </article>
  );
}