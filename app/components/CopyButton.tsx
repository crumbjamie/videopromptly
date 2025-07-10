'use client';

import { useState } from 'react';
import { CheckIcon, ClipboardCopyIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils/cn';
import { copyToClipboard } from '@/lib/utils';
import { analytics } from '@/lib/analytics';

interface CopyButtonProps {
  text: string;
  className?: string;
  promptId?: string;
  promptTitle?: string;
}

export default function CopyButton({ text, className, promptId, promptTitle }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      
      // Track copy event if prompt info is provided
      if (promptId && promptTitle) {
        analytics.trackCopyPrompt(promptId, promptTitle);
      }
      
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
      data-gtm-event="copy_prompt"
      data-gtm-prompt-id={promptId}
      data-gtm-prompt-title={promptTitle}
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