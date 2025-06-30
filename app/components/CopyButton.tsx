'use client';

import { useState } from 'react';
import { CheckIcon, ClipboardCopyIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils/cn';
import { copyToClipboard } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
        copied
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-white text-stone-900 hover:bg-stone-100",
        className
      )}
    >
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <ClipboardCopyIcon className="w-4 h-4" />
          Copy Prompt
        </>
      )}
    </button>
  );
}