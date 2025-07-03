'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setIsLoading(true); // Reset loading state when modal opens
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-7xl max-h-[90vh] overflow-hidden rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-stone-800 animate-pulse rounded-lg" />
            </div>
          )}
          <Image
            src={src}
            alt={alt}
            width={2048}
            height={2048}
            className={`max-w-full max-h-[90vh] w-auto h-auto object-contain transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            quality={90}
            priority
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}