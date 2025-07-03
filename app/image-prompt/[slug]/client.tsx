'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ExternalLinkIcon, HomeIcon } from '@radix-ui/react-icons';
import Header from '@/app/components/Header';
import CopyButton from '@/app/components/CopyButton';
import PromptCard from '@/app/components/PromptCard';
import BeforeAfterImage from '@/app/components/BeforeAfterImage';
import ImageModal from '@/app/components/ImageModal';
import ImageWithSkeleton from '@/app/components/ImageWithSkeleton';
import { ImagePrompt } from '@/lib/types';
import { getRelatedPrompts } from '@/lib/database';
import { getChatGPTUrl } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';

interface PromptDetailClientProps {
  prompt: ImagePrompt;
}

const difficultyColors = {
  Beginner: 'bg-green-900 text-green-300',
  Intermediate: 'bg-yellow-900 text-yellow-300',
  Advanced: 'bg-red-900 text-red-300'
};

export default function PromptDetailClient({ prompt }: PromptDetailClientProps) {
  const [relatedPrompts, setRelatedPrompts] = useState<ImagePrompt[]>([]);
  const [currentPrompt] = useState(prompt.prompt);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadRelated = async () => {
      const related = await getRelatedPrompts(prompt.id);
      setRelatedPrompts(related);
    };
    loadRelated();
  }, [prompt.id]);

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
            <p className="text-lg text-stone-300 mb-6">{prompt.description}</p>
            
            {/* Before/After Preview */}
            {prompt.thumbnail && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Example Transformation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before Image */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-stone-400">Before</h3>
                    <div className="rounded-lg overflow-hidden bg-stone-800">
                      <ImageWithSkeleton
                        src={`/thumbnails/${typeof prompt.thumbnail === 'object' ? prompt.thumbnail.before : 'woman-sample.jpg'}`}
                        alt="Before transformation"
                        width={512}
                        height={512}
                        className="w-full h-auto object-cover"
                        priority
                      />
                    </div>
                  </div>
                  
                  {/* After Image */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-stone-400">After (click to enlarge)</h3>
                    <div 
                      className="rounded-lg overflow-hidden bg-stone-800 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <ImageWithSkeleton
                        src={`/thumbnails/${typeof prompt.thumbnail === 'object' ? prompt.thumbnail.after : prompt.thumbnail}`}
                        alt="After transformation"
                        width={512}
                        height={512}
                        className="w-full h-auto object-cover"
                        priority
                        onClick={() => setIsModalOpen(true)}
                      />
                    </div>
                  </div>
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
              <CopyButton text={currentPrompt} />
              <a
                href={getChatGPTUrl(currentPrompt)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-stone-700 text-white hover:bg-stone-600 transition-colors"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                Open in ChatGPT
              </a>
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
                  Open ChatGPT and start a new conversation
                </li>
                <li className="flex">
                  <span className="font-medium mr-2">3.</span>
                  Upload your image to ChatGPT
                </li>
                <li className="flex">
                  <span className="font-medium mr-2">4.</span>
                  Paste the prompt and send
                </li>
                <li className="flex">
                  <span className="font-medium mr-2">5.</span>
                  ChatGPT will transform your image based on the prompt
                </li>
              </ol>
            </div>
          </div>

          {/* Example Transformations */}
          {prompt.thumbnails && prompt.thumbnails.length > 0 && (
            <div className="bg-stone-900 rounded-lg border border-stone-800 p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Example Transformations</h2>
              <div className="space-y-6">
                {prompt.thumbnails.map((thumbnail, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-sm font-medium text-stone-400">
                      Example {index + 1}
                    </h3>
                    <div className="rounded-lg overflow-hidden">
                      <BeforeAfterImage
                        src={thumbnail || `/thumbnails/${prompt.id}-${index}.webp`}
                        alt={`Example transformation ${index + 1} for ${prompt.title}`}
                        className="w-full"
                        size="full"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Prompts */}
          {relatedPrompts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Related Prompts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPrompts.map((relatedPrompt) => (
                  <PromptCard key={relatedPrompt.id} prompt={relatedPrompt} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Image Modal */}
      {prompt.thumbnail && (
        <ImageModal
          src={`/thumbnails/${typeof prompt.thumbnail === 'object' ? prompt.thumbnail.after : prompt.thumbnail}`}
          alt={`${prompt.title} - After transformation`}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}