import Link from 'next/link';
import { VideoPrompt } from '@/lib/types';
import VideoThumbnail from './VideoThumbnail';
import { cn } from '@/lib/utils/cn';

interface FeaturedPromptProps {
  prompt: VideoPrompt;
}

const difficultyColors = {
  Beginner: 'bg-green-900 text-green-300',
  Intermediate: 'bg-yellow-900 text-yellow-300',
  Advanced: 'bg-red-900 text-red-300'
};

export default function FeaturedPrompt({ prompt }: FeaturedPromptProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⭐</span>
        <h2 className="text-2xl font-bold text-white">Featured Prompt</h2>
      </div>
      
      <Link href={`/video-prompt/${prompt.slug}`} className="block">
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-lg border-2 border-yellow-600/20 hover:border-yellow-600/40 transition-all duration-200 overflow-hidden group">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Video */}
            <div className="aspect-video relative overflow-hidden bg-stone-800 rounded-lg">
              <VideoThumbnail
                src={prompt.videoUrl}
                poster={prompt.thumbnailUrl}
                alt={prompt.title}
                className="w-full h-full"
                size="xl"
                promptId={prompt.id}
                promptTitle={prompt.title}
                duration={prompt.duration}
                resolution={prompt.resolution}
              />
            </div>
            
            {/* Content */}
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                {prompt.title}
              </h3>
              
              <p className="text-lg text-stone-300 mb-6 leading-relaxed">
                {prompt.description}
              </p>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-stone-800 text-stone-200">
                  {prompt.category}
                </span>
                <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium",
                  difficultyColors[prompt.difficulty]
                )}>
                  {prompt.difficulty}
                </span>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {prompt.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs bg-stone-800 text-stone-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* CTA */}
              <div className="flex items-center gap-2 text-yellow-400 font-medium group-hover:gap-3 transition-all">
                <span>Try this prompt</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}