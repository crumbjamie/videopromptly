'use client';

import { useEffect, useRef, useState } from 'react';
import { Cross2Icon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import VideoPlayer from './VideoPlayer';
import { VideoVariant } from '@/lib/types';

interface VideoModalProps {
  // Legacy single video support
  videoSrc?: string;
  videoPoster?: string;
  videoAlt: string;
  // New multi-video support
  videos?: VideoVariant[];
  initialVideoIndex?: number;
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
  videos,
  initialVideoIndex = 0,
  isOpen,
  onClose,
  promptId,
  promptTitle,
  duration,
  resolution
}: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(initialVideoIndex);
  
  // Determine if we're using multi-video mode
  const isMultiVideo = videos && videos.length > 0;
  const currentVideo = isMultiVideo ? videos[currentVideoIndex] : null;
  const totalVideos = isMultiVideo ? videos.length : 1;
  
  // Get current video properties
  const currentVideoSrc = isMultiVideo ? currentVideo?.videoUrl : videoSrc;
  const currentVideoPoster = isMultiVideo ? currentVideo?.thumbnailUrl : videoPoster;
  const currentVideoTitle = isMultiVideo ? `${videoAlt} - ${currentVideo?.category}` : videoAlt;
  const currentVideoDuration = isMultiVideo ? currentVideo?.duration : duration;
  const currentVideoResolution = isMultiVideo ? currentVideo?.resolution : resolution;
  
  // Reset to initial video when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentVideoIndex(initialVideoIndex);
    }
  }, [isOpen, initialVideoIndex]);
  
  const goToNextVideo = () => {
    if (isMultiVideo && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };
  
  const goToPreviousVideo = () => {
    if (isMultiVideo && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousVideo();
      } else if (e.key === 'ArrowRight') {
        goToNextVideo();
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
  }, [isOpen, onClose, currentVideoIndex, isMultiVideo]);

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
              {currentVideoTitle}
            </h2>
            {(currentVideoDuration || currentVideoResolution) && (
              <div className="flex items-center space-x-2 text-sm text-stone-400">
                {currentVideoDuration && (
                  <span className="px-2 py-1 bg-stone-800 rounded">
                    {formatDuration(currentVideoDuration)}
                  </span>
                )}
                {currentVideoResolution && (
                  <span className="px-2 py-1 bg-stone-800 rounded">
                    {currentVideoResolution}
                  </span>
                )}
              </div>
            )}
            {isMultiVideo && (
              <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-sm">
                {currentVideoIndex + 1} of {totalVideos}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isMultiVideo && (
              <>
                <button
                  onClick={goToPreviousVideo}
                  disabled={currentVideoIndex === 0}
                  className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous video"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextVideo}
                  disabled={currentVideoIndex === videos.length - 1}
                  className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next video"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close video modal"
            >
              <Cross2Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Video Content */}
        <div className="aspect-video bg-black">
          <VideoPlayer
            src={currentVideoSrc || ''}
            poster={currentVideoPoster}
            alt={currentVideoTitle}
            className="w-full h-full"
            autoPlay={true}
            muted={false}
            loop={true}
            controls={true}
            preload="auto"
            promptId={promptId}
            promptTitle={promptTitle}
            key={currentVideoSrc} // Force re-render when video changes
          />
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-400">
              {isMultiVideo 
                ? 'Use arrow keys or buttons to navigate • Press Escape to close'
                : 'Click outside or press Escape to close'
              }
            </p>
            {isMultiVideo && (
              <div className="flex items-center space-x-1">
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentVideoIndex 
                        ? 'bg-blue-500' 
                        : 'bg-stone-600 hover:bg-stone-500'
                    }`}
                    aria-label={`Go to video ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}