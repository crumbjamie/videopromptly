'use client';

import { useState, useMemo } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import CategoryTags from './CategoryTags';
import PromptGrid from './PromptGrid';
import { ImagePrompt } from '@/lib/types';

interface HomePageClientProps {
  initialPrompts: ImagePrompt[];
  allCategories: string[];
  initialCategory?: string;
  initialSearch?: string;
}

export default function HomePageClient({
  initialPrompts,
  allCategories,
  initialCategory,
  initialSearch
}: HomePageClientProps) {
  const [prompts] = useState<ImagePrompt[]>(initialPrompts);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );


  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query)) ||
        prompt.category.toLowerCase().includes(query)
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
          <PromptGrid prompts={filteredPrompts} loading={false} />
          
          {/* Results count */}
          {filteredPrompts.length > 0 && (
            <div className="text-center mt-8 text-gray-400">
              Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </main>
    </>
  );
}