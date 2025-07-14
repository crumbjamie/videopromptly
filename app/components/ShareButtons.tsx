'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2, Twitter, Facebook, Link2, MessageCircle, Check } from 'lucide-react';
import { VideoPrompt } from '@/lib/types';

interface ShareButtonsProps {
  prompt: VideoPrompt;
  url: string;
}

export default function ShareButtons({ prompt, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShowShare(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareText = `Check out this amazing AI video prompt: "${prompt.title}" 🎬`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  };

  return (
    <div className="relative" ref={shareRef}>
      <button
        onClick={() => setShowShare(!showShare)}
        className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>

      {showShare && (
        <div className="absolute top-full mt-2 right-0 bg-stone-900 border border-stone-700 rounded-lg shadow-xl p-2 min-w-[200px] z-50">
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 hover:bg-stone-800 rounded-md transition-colors text-white"
          >
            <Twitter className="w-4 h-4" />
            <span>Twitter</span>
          </a>

          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 hover:bg-stone-800 rounded-md transition-colors text-white"
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </a>

          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 hover:bg-stone-800 rounded-md transition-colors text-white"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3 px-3 py-2 hover:bg-stone-800 rounded-md transition-colors text-white w-full text-left"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}