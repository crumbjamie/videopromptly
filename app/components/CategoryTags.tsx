'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface CategoryTagsProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
}

export default function CategoryTags({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearAll
}: CategoryTagsProps) {
  const [showingAll, setShowingAll] = useState(false);
  const displayCategories = showingAll ? categories : categories.slice(0, 12);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-stone-400">Filter by Category</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-stone-400 hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onClearAll}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            selectedCategories.length === 0
              ? "bg-stone-700 text-white"
              : "bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800"
          )}
        >
          All
        </button>
        
        {displayCategories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                isSelected
                  ? "bg-stone-700 text-white"
                  : "bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800"
              )}
            >
              {category}
            </button>
          );
        })}
        
        {categories.length > 12 && (
          <button
            onClick={() => setShowingAll(!showingAll)}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-stone-900 text-stone-400 hover:text-stone-200 transition-colors border border-stone-800"
          >
            {showingAll ? 'Show less' : `+${categories.length - 12} more`}
          </button>
        )}
      </div>
    </div>
  );
}