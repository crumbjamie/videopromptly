'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type SortOption = 'featured' | 'recent' | 'stars';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'recent', label: 'Recent' },
  { value: 'stars', label: 'Stars (High to Low)' },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = sortOptions.find(option => option.value === value) || sortOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          "bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white",
          "border border-stone-800 hover:border-stone-700",
          isOpen && "bg-stone-800 text-white border-stone-700"
        )}
        aria-label="Sort options"
      >
        <ArrowUpDown className="w-4 h-4" />
        <span>{currentOption.label}</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-stone-900 border border-stone-800 rounded-lg shadow-xl z-50">
          <div className="p-2">
            {sortOptions.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                    isSelected
                      ? "bg-stone-800 text-white"
                      : "text-stone-300 hover:bg-stone-800 hover:text-white"
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}