'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Folder, Tag } from 'lucide-react';

interface SearchBarWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  tags: string[];
  onCategorySelect: (category: string) => void;
  onTagSelect: (tag: string) => void;
  placeholder?: string;
}

export default function SearchBarWithSuggestions({ 
  value, 
  onChange, 
  categories,
  tags,
  onCategorySelect,
  onTagSelect,
  placeholder = "Search by keywords, categories and tags" 
}: SearchBarWithSuggestionsProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter categories and tags based on search
  const searchLower = localValue.toLowerCase().trim();
  const matchingCategories = searchLower 
    ? categories.filter(cat => cat.toLowerCase().includes(searchLower))
    : [];
  const matchingTags = searchLower 
    ? tags.filter(tag => tag.toLowerCase().includes(searchLower))
    : [];
  
  const totalSuggestions = matchingCategories.length + matchingTags.length;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || totalSuggestions === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalSuggestions - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : totalSuggestions - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < matchingCategories.length) {
            // It's a category
            handleCategoryClick(matchingCategories[selectedIndex]);
          } else {
            // It's a tag
            const tagIndex = selectedIndex - matchingCategories.length;
            handleTagClick(matchingTags[tagIndex]);
          }
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    setLocalValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleTagClick = (tag: string) => {
    onTagSelect(tag);
    setLocalValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    if (localValue.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setShowSuggestions(newValue.trim().length > 0);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative" ref={searchRef}>
      <label htmlFor="search-prompts" className="sr-only">
        Search prompts
      </label>
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-100 w-5 h-5" />
      <input
        ref={inputRef}
        id="search-prompts"
        type="search"
        value={localValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-stone-900 border border-stone-700 rounded-full text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-transparent transition-all"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            setShowSuggestions(false);
          }}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {/* Suggestions dropdown */}
      {showSuggestions && totalSuggestions > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-stone-900 border border-stone-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {matchingCategories.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-stone-500 px-3 py-1 font-medium">Categories</div>
              {matchingCategories.map((category, index) => (
                <button
                  key={`cat-${category}`}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedIndex === index
                      ? 'bg-stone-800 text-white'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  <span>{category}</span>
                </button>
              ))}
            </div>
          )}
          
          {matchingTags.length > 0 && (
            <div className={`p-2 ${matchingCategories.length > 0 ? 'border-t border-stone-800' : ''}`}>
              <div className="text-xs text-stone-500 px-3 py-1 font-medium">Tags</div>
              {matchingTags.map((tag, index) => {
                const actualIndex = matchingCategories.length + index;
                return (
                  <button
                    key={`tag-${tag}`}
                    onClick={() => handleTagClick(tag)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedIndex === actualIndex
                        ? 'bg-stone-800 text-white'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}