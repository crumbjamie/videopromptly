'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from './Header';
import SearchBar from './SearchBar';
import CategoryTags from './CategoryTags';
import PromptGrid from './PromptGrid';
import PaginationWithCount from './PaginationWithCount';
import { ImagePrompt } from '@/lib/types';

const PROMPTS_PER_PAGE = 40;

interface HomePageClientProps {
  initialPrompts: ImagePrompt[];
  allCategories: string[];
  initialPage: number;
  initialCategory?: string;
  initialSearch?: string;
}

export default function HomePageClient({
  initialPrompts,
  allCategories,
  initialPage,
  initialCategory,
  initialSearch
}: HomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [prompts] = useState<ImagePrompt[]>(initialPrompts);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Update URL when page, search, or category changes
  const updateURL = useCallback((newPage: number, newSearch?: string, newCategories?: string[]) => {
    const params = new URLSearchParams();
    
    if (newPage > 1) {
      params.set('page', newPage.toString());
    }
    
    const search = newSearch !== undefined ? newSearch : searchQuery;
    if (search) {
      params.set('search', search);
    }
    
    const categories = newCategories !== undefined ? newCategories : selectedCategories;
    if (categories.length > 0) {
      params.set('category', categories[0]); // For simplicity, just use first category
    }
    
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url, { scroll: false });
  }, [pathname, router, searchQuery, selectedCategories]);

  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(prompt =>
        selectedCategories.includes(prompt.category)
      );
    }

    // Sort to put featured prompts first
    filtered = filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return filtered;
  }, [prompts, searchQuery, selectedCategories]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPrompts.length / PROMPTS_PER_PAGE);
  const paginatedPrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * PROMPTS_PER_PAGE;
    const endIndex = startIndex + PROMPTS_PER_PAGE;
    return filteredPrompts.slice(startIndex, endIndex);
  }, [filteredPrompts, currentPage]);

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateURL(1, value);
  };

  // Handle category change
  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    setCurrentPage(1);
    updateURL(1, undefined, newCategories);
  };

  // Handle clear all categories
  const handleClearAll = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
    updateURL(1, undefined, []);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page);
    // Scroll to top of content
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
      updateURL(1);
    }
  }, [currentPage, totalPages]);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-stone-950 pt-14">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 mt-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transform your photos with AI
            </h1>
            <p className="text-lg text-stone-300 max-w-3xl mx-auto">
              Discover and copy effective image prompts for ChatGPT. Transform your photos
              into toys, art styles, and creative effects with our curated collection.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <CategoryTags
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Prompt Grid */}
          <PromptGrid prompts={paginatedPrompts} loading={false} />
          
          {/* Pagination with Count */}
          {filteredPrompts.length > 0 && (
            <PaginationWithCount
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPrompts.length}
              itemsPerPage={PROMPTS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>
    </>
  );
}