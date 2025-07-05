'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-stone-300 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-8 h-8" />
        </button>
        
        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={800}
            height={800}
            className="object-contain max-h-[90vh] w-auto h-auto rounded-lg"
            priority
          />
        </div>
        
        {/* Caption */}
        <p className="text-center text-white mt-4 text-sm">
          {imageAlt}
        </p>
      </div>
    </div>
  );
}