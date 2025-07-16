'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlayIcon } from '@radix-ui/react-icons';
import VideoModal from './VideoModal';
import { cn } from '@/lib/utils/cn';

interface IntroVideoPreviewProps {
  className?: string;
}

export default function IntroVideoPreview({ className }: IntroVideoPreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Video Preview Thumbnail */}
      <div 
        className={cn(
          "relative cursor-pointer group mx-auto",
          "w-64 h-36", // About 2/3 the size of regular video cards
          className
        )}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Thumbnail Image */}
        <div className="w-full h-full rounded-lg overflow-hidden relative">
          <Image
            src="/thumbnails/intro-website.jpg"
            alt="VideoPromptly Introduction Video"
            fill
            className="object-cover"
            sizes="256px"
            priority
          />
          
          {/* Dark overlay for better play button visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover:bg-black group-hover:bg-opacity-10 z-20">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-90 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-lg">
              <PlayIcon className="w-6 h-6 text-black ml-0.5" />
            </div>
          </div>
          
          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        videoSrc="/videos/Intro-website.mp4"
        videoAlt="VideoPromptly Introduction - How to use AI video prompts"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promptId="intro-video"
        promptTitle="VideoPromptly Introduction"
      />
    </>
  );
}