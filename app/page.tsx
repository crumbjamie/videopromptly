'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryTags from './components/CategoryTags';
import PromptGrid from './components/PromptGrid';
import Pagination from './components/Pagination';
import { getAllPrompts, getAllCategories } from '@/lib/database';
import { ImagePrompt } from '@/lib/types';

const PROMPTS_PER_PAGE = 40;

export default function Home() {
  const [prompts, setPrompts] = useState<ImagePrompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [promptsData, categoriesData] = await Promise.all([
          getAllPrompts(),
          getAllCategories()
        ]);
        setPrompts(promptsData);
        setAllCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
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
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <CategoryTags
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryToggle={(category) => {
                setSelectedCategories(prev =>
                  prev.includes(category)
                    ? prev.filter(c => c !== category)
                    : [...prev, category]
                );
              }}
              onClearAll={() => setSelectedCategories([])}
            />
          </div>

          {/* Featured prompts are now shown in the regular grid */}

          {/* Results Count */}
          {!loading && (
            <div className="mb-6 text-sm text-stone-400">
              {filteredPrompts.length === prompts.length ? (
                <span>Showing all {prompts.length} prompts</span>
              ) : (
                <span>
                  Found {filteredPrompts.length} of {prompts.length} prompts
                </span>
              )}
              {totalPages > 1 && (
                <span className="ml-2">
                  • Page {currentPage} of {totalPages}
                </span>
              )}
            </div>
          )}

          {/* Prompt Grid */}
          <PromptGrid prompts={paginatedPrompts} loading={loading} />
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>
    </>
  );
}