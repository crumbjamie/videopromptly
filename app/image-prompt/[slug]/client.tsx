'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ExternalLinkIcon, HomeIcon, Pencil1Icon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import Header from '@/app/components/Header';
import CopyButton from '@/app/components/CopyButton';
import PromptCard from '@/app/components/PromptCard';
import BeforeAfterImage from '@/app/components/BeforeAfterImage';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(prompt.prompt);
  const [currentPrompt, setCurrentPrompt] = useState(prompt.prompt);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPrompt(currentPrompt);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPrompt(currentPrompt);
    setSaveMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: editedPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to update prompt');
      }

      setCurrentPrompt(editedPrompt);
      setIsEditing(false);
      setSaveMessage({ type: 'success', text: 'Prompt updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
      setSaveMessage({ type: 'error', text: 'Failed to save prompt. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">The Prompt</h2>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
                  >
                    <Pencil1Icon className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
              
              {/* Save message */}
              {saveMessage && (
                <div className={cn(
                  "mb-4 px-4 py-2 rounded-lg text-sm",
                  saveMessage.type === 'success' 
                    ? 'bg-green-900/50 text-green-300 border border-green-800' 
                    : 'bg-red-900/50 text-red-300 border border-red-800'
                )}>
                  {saveMessage.text}
                </div>
              )}

              <div className="bg-stone-950 border border-stone-800 rounded-lg p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={editedPrompt}
                      onChange={(e) => setEditedPrompt(e.target.value)}
                      className="w-full min-h-[200px] p-4 bg-stone-900 border border-stone-700 rounded-lg text-sm text-stone-300 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-stone-600"
                      placeholder="Enter your custom prompt..."
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={isSaving || editedPrompt === currentPrompt}
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                          isSaving || editedPrompt === currentPrompt
                            ? "bg-stone-800 text-stone-500 cursor-not-allowed"
                            : "bg-green-700 text-white hover:bg-green-600"
                        )}
                      >
                        <CheckIcon className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-stone-700 text-white hover:bg-stone-600 transition-colors"
                      >
                        <Cross2Icon className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm text-stone-300 font-mono">
                    {currentPrompt}
                  </pre>
                )}
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
    </>
  );
}