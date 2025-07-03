'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils/cn';

interface PaginationWithCountProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

export default function PaginationWithCount({ 
  currentPage, 
  totalPages, 
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = 'prompts'
}: PaginationWithCountProps) {
  const pages = [];
  const maxVisible = 5;
  
  // Calculate the range of items being shown
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
      {/* Count Display */}
      <div className="text-sm text-stone-400">
        Showing {startItem}-{endItem} of {totalItems} {itemName}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
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
    </div>
  );
}