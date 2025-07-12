'use client';

import { useEffect, useRef } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import VideoPlayer from './VideoPlayer';

interface VideoModalProps {
  videoSrc: string;
  videoPoster?: string;
  videoAlt: string;
  isOpen: boolean;
  onClose: () => void;
  promptId?: string;
  promptTitle?: string;
  duration?: number;
  resolution?: string;
}

export default function VideoModal({
  videoSrc,
  videoPoster,
  videoAlt,
  isOpen,
  onClose,
  promptId,
  promptTitle,
  duration,
  resolution
}: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-80" />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative max-w-4xl max-h-[90vh] w-full mx-4 bg-stone-900 rounded-lg overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-800">
          <div className="flex items-center space-x-4">
            <h2 id="video-modal-title" className="text-lg font-semibold text-white">
              {videoAlt}
            </h2>
            {(duration || resolution) && (
              <div className="flex items-center space-x-2 text-sm text-stone-400">
                {duration && (
                  <span className="px-2 py-1 bg-stone-800 rounded">
                    {formatDuration(duration)}
                  </span>
                )}
                {resolution && (
                  <span className="px-2 py-1 bg-stone-800 rounded">
                    {resolution}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close video modal"
          >
            <Cross2Icon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Video Content */}
        <div className="aspect-video bg-black">
          <VideoPlayer
            src={videoSrc}
            poster={videoPoster}
            alt={videoAlt}
            className="w-full h-full"
            autoPlay={true}
            muted={false}
            loop={true}
            controls={true}
            preload="auto"
            promptId={promptId}
            promptTitle={promptTitle}
          />
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-stone-800">
          <p className="text-sm text-stone-400">
            Click outside or press Escape to close
          </p>
        </div>
      </div>
    </div>
  );
}