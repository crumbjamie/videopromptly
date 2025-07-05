'use client';

import { X } from 'lucide-react';

interface ActiveFiltersProps {
  selectedCategories: string[];
  selectedTags: string[];
  onRemoveCategory: (category: string) => void;
  onRemoveTag: (tag: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  selectedCategories,
  selectedTags,
  onRemoveCategory,
  onRemoveTag,
  onClearAll
}: ActiveFiltersProps) {
  const hasFilters = selectedCategories.length > 0 || selectedTags.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex flex-wrap gap-2">
        {/* Category filters */}
        {selectedCategories.map((category) => (
          <button
            key={`cat-${category}`}
            onClick={() => onRemoveCategory(category)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-stone-800 text-stone-200 rounded-full text-sm hover:bg-stone-700 transition-colors"
          >
            <span className="text-xs text-stone-400">Category:</span>
            <span>{category}</span>
            <X className="w-3 h-3 ml-1" />
          </button>
        ))}
        
        {/* Tag filters */}
        {selectedTags.map((tag) => (
          <button
            key={`tag-${tag}`}
            onClick={() => onRemoveTag(tag)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-stone-800 text-stone-200 rounded-full text-sm hover:bg-stone-700 transition-colors"
          >
            <span className="text-xs text-stone-400">Tag:</span>
            <span>{tag}</span>
            <X className="w-3 h-3 ml-1" />
          </button>
        ))}
      </div>
      
      {/* Clear all link */}
      <button
        onClick={onClearAll}
        className="text-sm text-stone-400 hover:text-white transition-colors underline"
      >
        Clear filters
      </button>
    </div>
  );
}