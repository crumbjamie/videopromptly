'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils/cn';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearAll
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-300 rounded-md hover:bg-stone-800 transition-colors"
      >
        <span>
          Categories 
          {selectedCategories.length > 0 && (
            <span className="ml-1 text-stone-400">({selectedCategories.length})</span>
          )}
        </span>
        <ChevronDownIcon className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 w-80 max-h-96 overflow-y-auto bg-stone-900 border border-stone-800 rounded-lg shadow-xl z-20">
            <div className="p-2 border-b border-stone-800">
              <button
                onClick={onClearAll}
                className="w-full px-3 py-1.5 text-sm text-left text-stone-400 hover:text-stone-200 transition-colors"
              >
                Clear all categories
              </button>
            </div>
            <div className="p-2 space-y-1">
              {categories.map(category => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => onCategoryToggle(category)}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left rounded-md transition-colors",
                      isSelected
                        ? "bg-stone-800 text-white"
                        : "text-stone-300 hover:bg-stone-800 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className={cn(
                        "w-4 h-4 rounded border transition-colors",
                        isSelected
                          ? "bg-white border-white"
                          : "border-stone-600"
                      )}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-stone-900" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      {category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}