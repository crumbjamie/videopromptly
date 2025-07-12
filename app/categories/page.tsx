import { getAllCategoriesWithCount } from '@/lib/database';
import Link from 'next/link';
import Header from '../components/Header';
import { slugify } from '@/lib/utils';
import { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/seo';
import { CATEGORIES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Browse AI Video Prompts by Category | VideoPromptly',
  description: 'Explore our collection of AI video generation prompts organized by categories like character vlogs, cinematic action, ASMR, comedy, and more.',
  alternates: {
    canonical: getCanonicalUrl('/categories'),
  },
  openGraph: {
    title: 'Browse AI Video Prompts by Category',
    description: 'Explore our collection of AI video generation prompts organized by category.',
    type: 'website',
  },
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
              Explore our collection of AI video generation prompts organized by style and content type. 
              Find the perfect category for your Veo3 video creation.
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
                    <span className="text-2xl">{CATEGORIES[category.name as keyof typeof CATEGORIES]?.icon || '🎬'}</span>
                    <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h2>
                  </div>
                  <span className="text-sm text-stone-500 bg-stone-800 px-2 py-1 rounded">
                    {category.count}
                  </span>
                </div>
                <p className="text-stone-400 text-sm">
                  {CATEGORIES[category.name as keyof typeof CATEGORIES]?.description || 'Explore video prompts in this category'}
                </p>
              </Link>
            ))}
          </div>

          {/* SEO Content */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-stone-900 rounded-lg p-8 border border-stone-800">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Discover AI Video Prompts by Category
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-stone-300 mb-4">
                  Our categories organize video prompts by content type, style, and viral trends. 
                  Whether you&apos;re creating character vlogs with Bigfoot, cinematic action sequences, 
                  ASMR content, or comedy sketches, our category system makes it easy to find 
                  exactly what you need for your Veo3 video generation.
                </p>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                  Popular Categories
                </h3>
                <ul className="text-stone-300 space-y-2">
                  <li><strong>Viral Character Vlogs:</strong> Cryptid and mythical character content like Bigfoot and Yeti vlogs</li>
                  <li><strong>Cinematic Action:</strong> High-production action sequences with dynamic camera work</li>
                  <li><strong>ASMR & Sensory:</strong> Satisfying visual and audio content for sensory engagement</li>
                  <li><strong>Comedy & Entertainment:</strong> Humorous content including stand-up, parodies, and viral formats</li>
                </ul>
                <p className="text-stone-300 mt-4">
                  Each category contains carefully curated prompts that have been tested with Veo3 to ensure 
                  consistent, high-quality video generation results. Simply browse to your desired category 
                  and explore the collection of viral-tested prompts available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}