'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { ChevronRightIcon, ExternalLinkIcon, HomeIcon } from '@radix-ui/react-icons';
import Header from '@/app/components/Header';
import CopyButton from '@/app/components/CopyButton';
import VideoCard from '@/app/components/VideoCard';
import VideoModal from '@/app/components/VideoModal';
import VideoPreview from '@/app/components/VideoPreview';
import { VideoPrompt } from '@/lib/types';
import { getRelatedPrompts } from '@/lib/database';
import { cn } from '@/lib/utils/cn';
import { generateVideoPromptSchema, generateBreadcrumbSchema } from '@/lib/schema';
import StarRating from '@/app/components/StarRating';
import { analytics } from '@/lib/analytics';

interface VideoDetailClientProps {
  prompt: VideoPrompt;
}

const difficultyColors = {
  Beginner: 'bg-green-900 text-green-300',
  Intermediate: 'bg-yellow-900 text-yellow-300',
  Advanced: 'bg-red-900 text-red-300'
};

export default function VideoDetailClient({ prompt }: VideoDetailClientProps) {
  const [relatedPrompts, setRelatedPrompts] = useState<VideoPrompt[]>([]); 
  const [currentPrompt] = useState(prompt.prompt);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentRating = prompt.rating || 0;
  
  // Generate structured data
  const promptSchema = generateVideoPromptSchema(prompt);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://videopromptly.com' },
    { name: prompt.category, url: `https://videopromptly.com/category/${prompt.category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: prompt.title, url: `https://videopromptly.com/video-prompt/${prompt.slug}` },
  ]);

  useEffect(() => {
    const loadRelated = async () => {
      const related = await getRelatedPrompts(prompt.id);
      setRelatedPrompts(related);
    };
    loadRelated();
    
    // Track video view
    analytics.trackVideoView(prompt.id, prompt.title, prompt.category, prompt.duration);
  }, [prompt.id, prompt.title, prompt.category, prompt.duration]);

  // Add structured data for SEO
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": prompt.title,
      "description": prompt.description,
      "keywords": prompt.tags.join(', '),
      "articleSection": prompt.category,
      "datePublished": prompt.createdAt,
      "dateModified": prompt.updatedAt,
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [prompt]);

  return (
    <>
      <Script
        id="prompt-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(promptSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-stone-400 mb-8">
            <Link href="/" className="hover:text-white flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <Link href={`/?category=${prompt.category}`} className="hover:text-white">
              {prompt.category}
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-white">{prompt.title}</span>
          </nav>

          {/* Main Content */}
          <div className="bg-stone-900 rounded-lg border border-stone-800 p-8 mb-8">
            {/* Title and Description */}
            <h1 className="text-3xl font-bold text-white mb-4">{prompt.title}</h1>
            <p className="text-lg text-white mb-4">{prompt.description}</p>
            
            {/* Rating */}
            <div className="mb-6">
              <StarRating 
                rating={currentRating} 
                size="sm"
              />
            </div>
            
            {/* Video Preview */}
            {prompt.videoUrl && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Video Preview</h2>
                <div className="aspect-video bg-stone-800 rounded-lg">
                  <VideoPreview
                    src={prompt.videoUrl}
                    poster={prompt.thumbnailUrl}
                    alt={prompt.title}
                    className="w-full h-full"
                    promptId={prompt.id}
                    promptTitle={prompt.title}
                    duration={prompt.duration}
                    resolution={prompt.resolution}
                  />
                </div>
                
                {/* Open in Modal Button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-stone-800 text-white hover:bg-stone-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    View Fullscreen
                  </button>
                </div>
              </div>
            )}
            
            {/* Category and Difficulty */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-stone-400 text-sm">Category:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-stone-800 text-stone-200">
                  {prompt.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-400 text-sm">Difficulty:</span>
                <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium",
                  difficultyColors[prompt.difficulty]
                )}>
                  {prompt.difficulty}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-stone-400 text-sm">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-stone-800 text-stone-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* The Prompt */}
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">The Prompt</h2>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-sm text-stone-300 font-mono">
                  {currentPrompt}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <CopyButton 
                text={currentPrompt} 
                promptId={prompt.id} 
                promptTitle={prompt.title} 
              />
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => {
                  const geminiUrl = `https://gemini.google.com/?q=${encodeURIComponent(currentPrompt)}`;
                  window.open(geminiUrl, '_blank');
                  analytics.trackVeo3Click(prompt.id, prompt.title);
                }}
                data-gtm-event="veo3_click"
                data-gtm-prompt-id={prompt.id}
                data-gtm-prompt-title={prompt.title}
              >
                <ExternalLinkIcon className="w-4 h-4" />
                Open in Gemini
              </button>
            </div>

            {/* How to Use */}
            <div className="border-t border-stone-700 pt-8">
              <h2 className="text-xl font-semibold text-white mb-4">How to Use</h2>
              <ol className="space-y-2 text-stone-400">
                <li className="flex">
                  <span className="font-medium mr-2">1.</span>
                  Copy the prompt using the button above
                </li>
                <li className="flex">
                  <span className="font-medium mr-2">2.</span>
                  Click &quot;Open in Gemini&quot; to launch Google&apos;s AI with the prompt pre-filled
                </li>
                <li className="flex">
                  <span className="font-medium mr-2">3.</span>
                  Review and modify the prompt if needed in Gemini
                </li>
                <li className="flex">
                  <span className="font-medium mr-2">4.</span>
                  Adjust settings (duration, resolution, style)
                </li>
                <li className="flex">
                  <span className="font-medium mr-2">5.</span>
                  Generate your video and enjoy the results!
                </li>
              </ol>
            </div>
          </div>

          {/* Additional Video Examples */}
          {/* Note: This section can be populated with multiple video examples if available */}

          {/* Related Prompts */}
          {relatedPrompts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Related Prompts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPrompts.map((relatedPrompt) => (
                  <VideoCard key={relatedPrompt.id} prompt={relatedPrompt} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Video Modal */}
      {prompt.videoUrl && (
        <VideoModal
          videoSrc={prompt.videoUrl}
          videoPoster={prompt.thumbnailUrl}
          videoAlt={prompt.title}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          promptId={prompt.id}
          promptTitle={prompt.title}
          duration={prompt.duration}
          resolution={prompt.resolution}
        />
      )}
    </>
  );
}