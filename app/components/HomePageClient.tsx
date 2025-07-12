'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Header from './Header';
import SearchBarWithSuggestions from './SearchBarWithSuggestions';
import CategoryTags from './CategoryTags';
import TagFilter from './TagFilter';
import ActiveFilters from './ActiveFilters';
import PromptGrid from './PromptGrid';
import PromptCardSkeleton from './PromptCardSkeleton';
import SortDropdown, { SortOption } from './SortDropdown';
import { VideoPrompt } from '@/lib/types';
import { analytics } from '@/lib/analytics';

const PROMPTS_PER_PAGE = 20;

interface HomePageClientProps {
  initialPrompts: VideoPrompt[];
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
  const [allPrompts] = useState<VideoPrompt[]>(initialPrompts);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTag ? [initialTag] : []
  );
  const [displayCount, setDisplayCount] = useState(PROMPTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

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
    switch (sortBy) {
      case 'featured':
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
        
      case 'recent':
        // Sort by created date (newest first)
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
        
      case 'stars':
        // Sort by rating (highest first)
        return (b.rating || 0) - (a.rating || 0);
        
      default:
        return 0;
    }
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

  // Reset display count when filters or sort change
  useEffect(() => {
    setDisplayCount(PROMPTS_PER_PAGE);
  }, [searchQuery, selectedCategories, selectedTags, sortBy]);

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Track search if user typed something
    if (value) {
      // Count results for analytics
      const results = allPrompts.filter(prompt => {
        const query = value.toLowerCase();
        return prompt.title.toLowerCase().includes(query) ||
               prompt.description.toLowerCase().includes(query) ||
               prompt.tags.some(tag => tag.toLowerCase().includes(query)) ||
               prompt.category.toLowerCase().includes(query);
      });
      
      analytics.trackSearch(value, results.length);
    }
  };

  // Handle category change
  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    
    // Track category browse when adding a category
    if (!selectedCategories.includes(category)) {
      analytics.trackCategoryBrowse(category);
    }
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
    
    // Track tag browse when adding a tag
    if (!selectedTags.includes(tag)) {
      analytics.trackTagBrowse(tag);
    }
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
          <div className="text-center mb-12 mt-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Create stunning videos with AI
            </h1>
            <p className="text-base text-white max-w-3xl mx-auto mb-8">
              Discover and copy AI video generation prompts for Veo3 and other AI tools. Create 
              stunning animations, VFX, transitions, and more. Click any prompt 
              to copy and paste into Veo3.
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

          {/* Filters and Sort */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-white">Filter by</span>
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
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-white">Sort by</span>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
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
    </>
  );
}