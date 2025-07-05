'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Header from './Header';
import SearchBarWithSuggestions from './SearchBarWithSuggestions';
import CategoryTags from './CategoryTags';
import TagFilter from './TagFilter';
import ActiveFilters from './ActiveFilters';
import PromptGrid from './PromptGrid';
import PromptCardSkeleton from './PromptCardSkeleton';
import ImageModal from './ImageModal';
import { ImagePrompt } from '@/lib/types';

const PROMPTS_PER_PAGE = 20;

interface HomePageClientProps {
  initialPrompts: ImagePrompt[];
  allCategories: string[];
  initialCategory?: string;
  initialTag?: string;
  initialSearch?: string;
}

export default function HomePageClient({
  initialPrompts,
  allCategories,
  initialCategory,
  initialTag,
  initialSearch
}: HomePageClientProps) {
  // Store all prompts and filter them client-side
  const [allPrompts] = useState<ImagePrompt[]>(initialPrompts);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTag ? [initialTag] : []
  );
  const [displayCount, setDisplayCount] = useState(PROMPTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get all unique tags from prompts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPrompts.forEach(prompt => {
      prompt.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allPrompts]);
  
  // Filter prompts
  const filteredPrompts = allPrompts.filter(prompt => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query)) ||
        prompt.category.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }
    
    // If no filters selected, show all (that match search)
    if (selectedCategories.length === 0 && selectedTags.length === 0) {
      return true;
    }
    
    // Apply OR logic for filters - show if matches ANY category OR ANY tag
    let matchesFilter = false;
    
    // Check category match
    if (selectedCategories.length > 0 && selectedCategories.includes(prompt.category)) {
      matchesFilter = true;
    }
    
    // Check tag match
    if (selectedTags.length > 0 && prompt.tags.some(tag => selectedTags.includes(tag))) {
      matchesFilter = true;
    }
    
    return matchesFilter;
  }).sort((a, b) => {
    // First, sort by featured status
    const aFeatured = a.tags.includes('featured');
    const bFeatured = b.tags.includes('featured');
    
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    
    // Then sort by rating (highest first)
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    if (ratingA !== ratingB) {
      return ratingB - ratingA;
    }
    // If ratings are equal, randomize order using a stable hash of the ID
    // This ensures consistent ordering across page loads
    const hashA = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hashB = b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hashA - hashB;
  });

  // Get prompts to display
  const displayedPrompts = filteredPrompts.slice(0, displayCount);
  const hasMore = displayCount < filteredPrompts.length;

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      // Use setTimeout to simulate loading and prevent rapid updates
      setTimeout(() => {
        setDisplayCount(prev => Math.min(prev + PROMPTS_PER_PAGE, filteredPrompts.length));
        setIsLoadingMore(false);
      }, 300);
    }
  }, [hasMore, isLoadingMore, filteredPrompts.length]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    };
    
    observerRef.current = new IntersectionObserver(handleObserver, option);
    
    if (loadMoreRef.current && hasMore) {
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, hasMore]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(PROMPTS_PER_PAGE);
  }, [searchQuery, selectedCategories, selectedTags]);

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Handle category change
  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
  };

  // Handle clear all categories
  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  // Handle tag change
  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
  };

  // Handle clear all tags
  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
  };

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
            <p className="text-lg text-white max-w-3xl mx-auto">
              Discover and copy AI image prompts for ChatGPT. Transform your photos into 
              anime characters, vintage styles, action figures, and more. Click any prompt 
              to copy and open directly in ChatGPT.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBarWithSuggestions 
              value={searchQuery} 
              onChange={handleSearchChange}
              categories={allCategories}
              tags={allTags}
              onCategorySelect={handleCategoryToggle}
              onTagSelect={handleTagToggle}
            />
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-stone-400">Filters:</span>
              <CategoryTags
                categories={allCategories}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                onClearAll={handleClearAll}
              />
              <TagFilter
                tags={allTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                onClearAll={handleClearAllTags}
              />
            </div>
            
            {/* Reference Image - Hidden on mobile */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 hover:bg-stone-800 hover:border-stone-700 transition-colors cursor-pointer"
            >
              <p className="text-xs text-stone-400">Reference image</p>
              <div className="relative w-12 h-12">
                <Image 
                  src="/thumbnails/woman-sample.jpg" 
                  alt="Reference image for prompts" 
                  fill
                  className="rounded object-cover"
                  sizes="48px"
                />
              </div>
            </button>
          </div>

          {/* Active Filters */}
          <div className="mb-16">
            <ActiveFilters
              selectedCategories={selectedCategories}
              selectedTags={selectedTags}
              onRemoveCategory={handleCategoryToggle}
              onRemoveTag={handleTagToggle}
              onClearAll={handleClearAllFilters}
            />
          </div>

          {/* Prompt Grid */}
          <PromptGrid prompts={displayedPrompts} loading={false} />
          
          {/* Loading skeletons */}
          {isLoadingMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <PromptCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          )}
          
          {/* Load more trigger */}
          {hasMore && (
            <div 
              ref={loadMoreRef}
              className="w-full h-10 mt-6"
              aria-hidden="true"
            />
          )}
          
          {/* Results count */}
          {!hasMore && filteredPrompts.length > 0 && (
            <div className="text-center mt-16 mb-16 text-gray-400">
              Showing all {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </main>
      
      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc="/thumbnails/woman-sample.jpg"
        imageAlt="Reference image for AI prompts - Portrait of a woman used as the base image for transformations"
      />
    </>
  );
}