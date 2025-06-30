'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-md transition-colors",
          currentPage === 1
            ? "text-stone-600 cursor-not-allowed"
            : "text-stone-300 hover:text-white hover:bg-stone-800"
        )}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 text-stone-300 hover:text-white hover:bg-stone-800 rounded-md transition-colors"
          >
            1
          </button>
          {startPage > 2 && <span className="text-stone-600">...</span>}
        </>
      )}
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "px-3 py-1 rounded-md transition-colors",
            currentPage === page
              ? "bg-stone-700 text-white"
              : "text-stone-300 hover:text-white hover:bg-stone-800"
          )}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-stone-600">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 text-stone-300 hover:text-white hover:bg-stone-800 rounded-md transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-md transition-colors",
          currentPage === totalPages
            ? "text-stone-600 cursor-not-allowed"
            : "text-stone-300 hover:text-white hover:bg-stone-800"
        )}
        aria-label="Next page"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}