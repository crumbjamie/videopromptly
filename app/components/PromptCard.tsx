'use client';

import Link from 'next/link';
import { ImagePrompt } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import ThumbnailImage from './ThumbnailImage';

interface PromptCardProps {
  prompt: ImagePrompt;
}

const difficultyColors = {
  Beginner: 'bg-stone-800 text-stone-400',
  Intermediate: 'bg-stone-800 text-stone-400',
  Advanced: 'bg-stone-800 text-stone-400'
};

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link href={`/image-prompt/${prompt.slug}`} className="block h-full">
      <div className="h-full flex flex-col bg-stone-900 rounded-lg border border-stone-800 hover:border-stone-700 transition-all duration-200 cursor-pointer group overflow-hidden">
        {/* Thumbnail */}
        <div className="aspect-square relative overflow-hidden bg-stone-800 flex items-center justify-center">
          <ThumbnailImage
            thumbnail={prompt.thumbnail}
            promptId={prompt.id}
            title={prompt.title}
            className="w-full h-full object-contain"
            size="thumbnail"
            priority={false}
          />
        </div>
        
        <div className="flex flex-col flex-grow p-6">
          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {prompt.title}
          </h3>
          
          {/* Description */}
          <p className="text-stone-400 text-sm mb-4 line-clamp-3 flex-grow">
            {prompt.description}
          </p>
          
          {/* Category and Difficulty */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-stone-800 text-stone-400">
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
          <div className="mt-4 pt-4 border-t border-stone-800">
            <button className="w-full px-4 py-2 text-sm font-medium text-stone-300 bg-stone-800 rounded-md hover:bg-stone-700 hover:text-white transition-colors">
              View Prompt →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}