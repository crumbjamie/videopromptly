'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { getAllPrompts, getAllCategories } from '@/lib/database';
import { slugify } from '@/lib/utils';

const categoryDescriptions: { [key: string]: string } = {
  'Action & Sports': 'Dynamic prompts for action-packed and sports photography transformations',
  'Anime & animation': 'Transform photos into anime, cartoon, and animated styles',
  'Artistic Styles': 'Classic and contemporary art movement transformations',
  'Cinematic Styles': 'Movie-quality effects and dramatic cinematography',
  'Classical Art': 'Traditional art techniques and historical styles',
  'Creative Effects': 'Unique and imaginative photo transformations',
  'Cyberpunk & sci-fi': 'Futuristic and science fiction themed effects',
  'Digital Art': 'Modern digital art styles and techniques',
  'Editorial Photography': 'Professional editorial and magazine-style effects',
  'Fantasy & magic': 'Magical and fantastical transformations',
  'Fashion Photography': 'High-fashion and runway-inspired styles',
  'Futuristic Tech': 'Technology and future-themed transformations',
  'Gaming Culture': 'Video game inspired styles and effects',
  'Historical Epic': 'Historical and period-specific transformations',
  'Horror & gothic': 'Dark, gothic, and horror-themed styles',
  'Minimalist Design': 'Clean and minimal artistic approaches',
  'Paper Art': 'Paper-based art styles and origami effects',
  'Portrait Photography': 'Professional portrait enhancements',
  'Puppet & felt art': 'Puppet and textile-based transformations',
  'Sculpture Art': 'Three-dimensional and sculptural effects',
  'Social Media': 'Optimized for social media platforms',
  'Steampunk': 'Victorian-era mechanical aesthetics',
  'Studio Ghibli': 'Inspired by Studio Ghibli animation style',
  'Synthwave & vaporwave': 'Retro-futuristic neon aesthetics',
  'Toy Transformations': 'Transform subjects into toys and collectibles',
  'Traditional Art': 'Classic artistic techniques and mediums',
  'Transformations': 'General transformation effects',
  'Underwater Photography': 'Aquatic and underwater effects',
  'Vintage & retro': 'Nostalgic and retro-styled transformations'
};

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [promptsData, categoriesData] = await Promise.all([
          getAllPrompts(),
          getAllCategories()
        ]);
        
        // Count prompts per category
        const counts: { [key: string]: number } = {};
        categoriesData.forEach(category => {
          counts[category] = promptsData.filter(p => p.category === category).length;
        });
        
        setCategories(categoriesData);
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mt-16 mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Browse by category</h1>
            <p className="text-lg text-stone-300">
              Explore our collection of prompts organized by style and theme
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-800 rounded-lg h-40"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${slugify(category)}`}
                  className="group"
                >
                  <div className="bg-stone-900 rounded-lg border border-stone-800 p-6 hover:border-stone-700 transition-all duration-200 h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{categoryEmojis[category] || '🎨'}</span>
                        <h2 className="text-xl font-semibold text-white group-hover:text-stone-200">
                          {category}
                        </h2>
                      </div>
                      <span className="text-sm text-stone-500 bg-stone-800 px-2 py-1 rounded">
                        {categoryCounts[category] || 0}
                      </span>
                    </div>
                    <p className="text-stone-400 text-sm">
                      {categoryDescriptions[category] || 'Explore prompts in this category'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}