'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ImagePrompt } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import ThumbnailImage from './ThumbnailImage';
import StarRating from './StarRating';
import DevRating from './DevRating';
import { Folder } from 'lucide-react';

interface PromptCardProps {
  prompt: ImagePrompt;
}

const difficultyColors = {
  Beginner: 'bg-stone-800 text-stone-400',
  Intermediate: 'bg-stone-800 text-stone-400',
  Advanced: 'bg-stone-800 text-stone-400'
};

export default function PromptCard({ prompt }: PromptCardProps) {
  const [isLocalhost, setIsLocalhost] = useState(false);
  
  useEffect(() => {
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  }, []);
  
  return (
    <article className="h-full flex flex-col">
      <Link 
        href={`/image-prompt/${prompt.slug}`} 
        className="block flex-grow"
        aria-label={`View ${prompt.title} prompt details`}
      >
        <div className="h-full flex flex-col bg-stone-950 rounded-lg transition-all duration-200 cursor-pointer group overflow-hidden border border-stone-800 hover:border-stone-700">
          {/* Thumbnail */}
          <figure className="aspect-square relative overflow-hidden bg-stone-800 flex items-center justify-center">
            <ThumbnailImage
              thumbnail={prompt.thumbnail}
              promptId={prompt.id}
              title={prompt.title}
              className="w-full h-full object-contain"
              priority={false}
            />
          </figure>
          
          <div className="flex flex-col flex-grow p-6">
            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {prompt.title}
            </h3>
          
          {/* Rating */}
          <div className="mb-3">
            <StarRating 
              rating={prompt.rating || 0} 
              size="sm"
            />
          </div>
          
          {/* Description */}
          <p className="text-stone-400 text-sm mb-4 line-clamp-3 flex-grow">
            {prompt.description}
          </p>
          
          {/* Category and Difficulty */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-stone-800 text-stone-400">
              <Folder className="w-3 h-3" />
              {prompt.category}
            </span>
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
              difficultyColors[prompt.difficulty]
            )}>
              {prompt.difficulty}
            </span>
          </div>
          
          {/* View Prompt Button */}
          <div className="mt-4">
            <span className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-stone-300 bg-stone-950 border border-stone-800 rounded-md group-hover:bg-stone-900 group-hover:border-stone-600 group-hover:text-white transition-colors" aria-hidden="true">
              View Prompt →
            </span>
          </div>
        </div>
      </div>
    </Link>
    
    {/* Dev Rating - Outside of Link and Card - Only on localhost */}
    {isLocalhost && (
      <DevRating 
        promptId={prompt.id} 
        currentRating={prompt.rating || 0}
        isFeatured={prompt.tags.includes('featured')}
      />
    )}
    </article>
  );
}