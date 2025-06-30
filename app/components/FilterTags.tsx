'use client';

import { cn } from '@/lib/utils/cn';

interface FilterTagsProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export default function FilterTags({
  tags,
  selectedTags,
  onTagToggle,
  onClearAll
}: FilterTagsProps) {
  const isAllSelected = selectedTags.length === 0;
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* All Button */}
      <button
        onClick={onClearAll}
        className={cn(
          "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all",
          isAllSelected
            ? "bg-white text-stone-900"
            : "bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-300"
        )}
      >
        All
      </button>
      
      {/* Tag Buttons */}
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={cn(
              "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              isSelected
                ? "bg-white text-stone-900"
                : "bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-300"
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}