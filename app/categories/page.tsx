import { getAllCategoriesWithCount } from '@/lib/database';
import Link from 'next/link';
import Header from '../components/Header';
import { slugify } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse AI Image Prompts by Category | Image Promptly',
  description: 'Explore our collection of AI image transformation prompts organized by categories like anime, cyberpunk, vintage, fashion, and more.',
  openGraph: {
    title: 'Browse AI Image Prompts by Category',
    description: 'Explore our collection of AI image transformation prompts organized by category.',
    type: 'website',
  },
};

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
  'Vintage & retro': 'Nostalgic and retro-styled transformations',
  'Headshots': 'Professional headshots and executive portraits'
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
  'Vintage & retro': '📻',
  'Headshots': '👔'
};

export default async function CategoriesPage() {
  const categories = getAllCategoriesWithCount();
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 mt-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Browse by Category
            </h1>
            <p className="text-lg text-white max-w-3xl mx-auto">
              Explore our collection of AI image transformation prompts organized by style and theme. 
              Find the perfect category for your creative vision.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${slugify(category.name)}`}
                className="group bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded-lg p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryEmojis[category.name] || '🎨'}</span>
                    <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h2>
                  </div>
                  <span className="text-sm text-stone-500 bg-stone-800 px-2 py-1 rounded">
                    {category.count}
                  </span>
                </div>
                <p className="text-stone-400 text-sm">
                  {categoryDescriptions[category.name] || 'Explore prompts in this category'}
                </p>
              </Link>
            ))}
          </div>

          {/* SEO Content */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-stone-900 rounded-lg p-8 border border-stone-800">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Discover AI Image Prompts by Category
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-stone-300 mb-4">
                  Our categories organize prompts by artistic style, theme, and application. 
                  Whether you're looking to transform your photos into anime characters, 
                  create cyberpunk atmospheres, or apply vintage filters, our category system 
                  makes it easy to find exactly what you need.
                </p>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                  Popular Categories
                </h3>
                <ul className="text-stone-300 space-y-2">
                  <li><strong>Anime & Animation:</strong> Transform photos into various animation styles</li>
                  <li><strong>Fashion Photography:</strong> Professional fashion and editorial effects</li>
                  <li><strong>Cyberpunk & Sci-fi:</strong> Futuristic and technology-inspired transformations</li>
                  <li><strong>Vintage & Retro:</strong> Nostalgic filters and historical styles</li>
                </ul>
                <p className="text-stone-300 mt-4">
                  Each category contains carefully curated prompts that have been tested to ensure 
                  consistent, high-quality results. Simply browse to your desired category and explore 
                  the collection of prompts available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}