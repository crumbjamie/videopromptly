'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search prompts by title, description, or tags..." }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className="relative">
      <label htmlFor="search-prompts" className="sr-only">
        Search prompts
      </label>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 w-5 h-5" />
      <input
        id="search-prompts"
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-md text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      {localValue && (
        <button
          onClick={() => setLocalValue('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}