'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Tag, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export default function TagFilter({
  tags,
  selectedTags,
  onTagToggle,
  onClearAll
}: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedCount = selectedTags.length;
  const buttonText = selectedCount === 0 
    ? 'All Tags' 
    : selectedCount === 1 
    ? selectedTags[0]
    : `${selectedCount} Tags`;

  // Filter tags based on search query
  const filteredTags = tags.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      >
        <Tag className="w-4 h-4" />
        <span>{buttonText}</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-stone-900 border border-stone-800 rounded-lg shadow-xl z-50">
          {/* Search input */}
          <div className="p-3 border-b border-stone-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tags..."
                className="w-full pl-10 pr-3 py-2 bg-stone-800 border border-stone-700 rounded-md text-sm text-white placeholder-stone-500 focus:outline-none focus:border-stone-600"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            <div className="p-2">
              <button
                onClick={() => {
                  onClearAll();
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                  selectedTags.length === 0
                    ? "bg-stone-800 text-white"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                )}
              >
                <span>All Tags</span>
                {selectedTags.length === 0 && <Check className="w-4 h-4" />}
              </button>
            </div>

            <div className="border-t border-stone-800 p-2">
              {filteredTags.length === 0 ? (
                <p className="text-center text-stone-500 py-4 text-sm">No tags found</p>
              ) : (
                filteredTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => onTagToggle(tag)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                        isSelected
                          ? "bg-stone-800 text-white"
                          : "text-stone-300 hover:bg-stone-800 hover:text-white"
                      )}
                    >
                      <span>{tag}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="border-t border-stone-800 p-2">
              <button
                onClick={onClearAll}
                className="w-full px-3 py-2 text-sm text-stone-400 hover:text-white transition-colors text-center"
              >
                Clear all tag filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}