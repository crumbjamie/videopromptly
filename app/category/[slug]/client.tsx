'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@radix-ui/react-icons';
import Header from '@/app/components/Header';
import SearchBar from '@/app/components/SearchBar';
import PromptGrid from '@/app/components/PromptGrid';
import { getAllPrompts } from '@/lib/database';
import { ImagePrompt } from '@/lib/types';

const categoryEmojis: { [key: string]: string } = {
  'Action & Sports': '🏃‍♂️',
  'Anime & animation': '🎌',
  'Artistic Styles': '🎨',
  'Cinematic Styles': '🎬',
  'Classical Art': '🖼️',
  'Creative Effects': '✨',
  'Cyberpunk & sci-fi': '🤖',
  'Digital Art': '💻',
  'Editorial Photography': '📸',
  'Fantasy & magic': '🧙‍♂️',
  'Fashion Photography': '👗',
  'Futuristic Tech': '🚀',
  'Gaming Culture': '🎮',
  'Historical Epic': '⚔️',
  'Horror & gothic': '🦇',
  'Minimalist Design': '⬜',
  'Paper Art': '📄',
  'Portrait Photography': '👤',
  'Puppet & felt art': '🧸',
  'Sculpture Art': '🗿',
  'Social Media': '📱',
  'Steampunk': '⚙️',
  'Studio Ghibli': '🌸',
  'Synthwave & vaporwave': '🌆',
  'Toy Transformations': '🎯',
  'Traditional Art': '🖌️',
  'Transformations': '🔄',
  'Underwater Photography': '🌊',
  'Vintage & retro': '📻'
};

interface CategoryPageClientProps {
  category: string;
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  const [prompts, setPrompts] = useState<ImagePrompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<ImagePrompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const allPrompts = await getAllPrompts();
        const categoryPrompts = allPrompts.filter(p => p.category === category);
        setPrompts(categoryPrompts);
        setFilteredPrompts(categoryPrompts);
      } catch (error) {
        console.error('Error loading prompts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPrompts();
  }, [category]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = prompts.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredPrompts(filtered);
    } else {
      setFilteredPrompts(prompts);
    }
  }, [searchQuery, prompts]);


  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-stone-400 mb-8">
            <Link href="/" className="hover:text-white flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <Link href="/categories" className="hover:text-white">
              Categories
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-white">{category}</span>
          </nav>

          {/* Category Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-4xl">{categoryEmojis[category] || '🎨'}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {category}
              </h1>
            </div>
            <p className="text-lg text-white">
              Browse {prompts.length} prompts in this category
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder={`Search ${category} prompts...`}
            />
          </div>


          {/* Prompt Grid */}
          <PromptGrid prompts={filteredPrompts} loading={loading} />
          
          {/* Results count */}
          {!loading && filteredPrompts.length > 0 && (
            <div className="text-center mt-8 text-gray-400">
              Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </main>
    </>
  );
}