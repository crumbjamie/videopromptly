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
  
  // Generate a random seed that changes daily to ensure consistent ordering per day
  const dailySeed = useMemo(() => {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  }, []);

  // Get all unique tags from prompts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPrompts.forEach(prompt => {
      prompt.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allPrompts]);
  
  // Helper function to distribute prompts by category within rating groups
  const distributeByCategory = useCallback((prompts: VideoPrompt[]) => {
    // Group prompts by rating
    const ratingGroups = new Map<number, VideoPrompt[]>();
    prompts.forEach(prompt => {
      const rating = prompt.rating || 0;
      if (!ratingGroups.has(rating)) {
        ratingGroups.set(rating, []);
      }
      ratingGroups.get(rating)!.push(prompt);
    });
    
    // For each rating group, distribute by category
    const distributedPrompts: VideoPrompt[] = [];
    const sortedRatings = Array.from(ratingGroups.keys()).sort((a, b) => b - a);
    
    sortedRatings.forEach(rating => {
      const group = ratingGroups.get(rating)!;
      
      // Group by category within this rating
      const categoryGroups = new Map<string, VideoPrompt[]>();
      group.forEach(prompt => {
        const category = prompt.category;
        if (!categoryGroups.has(category)) {
          categoryGroups.set(category, []);
        }
        categoryGroups.get(category)!.push(prompt);
      });
      
      // Shuffle each category group using daily seed
      categoryGroups.forEach((prompts, category) => {
        const shuffled = [...prompts].sort((a, b) => {
          const hashA = (a.id + dailySeed + category).split('').reduce((acc, char) => {
            return ((acc * 31) + char.charCodeAt(0)) % 1000000;
          }, 1);
          const hashB = (b.id + dailySeed + category).split('').reduce((acc, char) => {
            return ((acc * 31) + char.charCodeAt(0)) % 1000000;
          }, 1);
          return hashA - hashB;
        });
        categoryGroups.set(category, shuffled);
      });
      
      // Round-robin distribution from each category
      const categoryArrays = Array.from(categoryGroups.values());
      let addedCount = 0;
      let index = 0;
      
      while (addedCount < group.length) {
        // Find next non-empty category array
        let attempts = 0;
        while (categoryArrays[index % categoryArrays.length].length === 0 && attempts < categoryArrays.length) {
          index++;
          attempts++;
        }
        
        if (attempts >= categoryArrays.length) break;
        
        const categoryArray = categoryArrays[index % categoryArrays.length];
        if (categoryArray.length > 0) {
          distributedPrompts.push(categoryArray.shift()!);
          addedCount++;
        }
        index++;
      }
    });
    
    return distributedPrompts;
  }, [dailySeed]);
  
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
  });
  
  // Sort and distribute prompts
  const sortedPrompts = useMemo(() => {
    let sorted = [...filteredPrompts];
    
    switch (sortBy) {
      case 'featured':
        // Separate featured and non-featured
        const featured = sorted.filter(p => p.tags.includes('featured'));
        const nonFeatured = sorted.filter(p => !p.tags.includes('featured'));
        
        // Distribute each group by category
        const distributedFeatured = distributeByCategory(featured);
        const distributedNonFeatured = distributeByCategory(nonFeatured);
        
        // Combine with featured first
        sorted = [...distributedFeatured, ...distributedNonFeatured];
        break;
        
      case 'recent':
        // Sort by created date (newest first)
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
        
      case 'stars':
        // Use category distribution for star sorting
        sorted = distributeByCategory(sorted);
        break;
        
      default:
        break;
    }
    
    return sorted;
  }, [filteredPrompts, sortBy, distributeByCategory]);

  // Get prompts to display
  const displayedPrompts = sortedPrompts.slice(0, displayCount);
  const hasMore = displayCount < sortedPrompts.length;

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      // Use setTimeout to simulate loading and prevent rapid updates
      setTimeout(() => {
        setDisplayCount(prev => Math.min(prev + PROMPTS_PER_PAGE, sortedPrompts.length));
        setIsLoadingMore(false);
      }, 300);
    }
  }, [hasMore, isLoadingMore, sortedPrompts.length]);

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