import { getAllTags } from '@/lib/database';
import Link from 'next/link';
import Header from '@/app/components/Header';
import { Tag } from 'lucide-react';
import { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Browse AI Image Prompts by Tag | Image Promptly',
  description: 'Explore our collection of AI image transformation prompts organized by tags. Find prompts for specific styles, effects, and themes.',
  alternates: {
    canonical: getCanonicalUrl('/tags'),
  },
  openGraph: {
    title: 'Browse AI Image Prompts by Tag',
    description: 'Explore our collection of AI image transformation prompts organized by tags.',
    type: 'website',
  },
};

export default async function TagsPage() {
  const tags = await getAllTags();
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 mt-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Browse by Tag
            </h1>
            <p className="text-lg text-white max-w-3xl mx-auto">
              Explore our AI image prompts organized by specific styles, effects, and themes. 
              Click any tag to see all related prompts.
            </p>
          </div>

          {/* Tags Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name.toLowerCase().replace(/\s+/g, '-'))}`}
                className="group bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded-lg p-4 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="w-5 h-5 text-stone-500 group-hover:text-stone-300" />
                  <h2 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                    {tag.name}
                  </h2>
                </div>
                <p className="text-sm text-stone-400">
                  {tag.count} {tag.count === 1 ? 'prompt' : 'prompts'}
                </p>
              </Link>
            ))}
          </div>

          {/* SEO Content */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-stone-900 rounded-lg p-8 border border-stone-800">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Discover AI Image Prompts by Tag
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-stone-300 mb-4">
                  Tags help you find specific styles and effects for your AI image transformations. 
                  Whether you&apos;re looking for cyberpunk aesthetics, vintage filters, or artistic styles, 
                  our tag system makes it easy to discover the perfect prompt for your creative vision.
                </p>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                  Popular Tag Categories
                </h3>
                <ul className="text-stone-300 space-y-2">
                  <li><strong>Style Tags:</strong> anime, retro, futuristic, minimalist, vintage</li>
                  <li><strong>Effect Tags:</strong> holographic, neon, glitch, pixelated, watercolor</li>
                  <li><strong>Theme Tags:</strong> cyberpunk, fantasy, sci-fi, nature, urban</li>
                  <li><strong>Technique Tags:</strong> portrait, action, editorial, commercial</li>
                </ul>
                <p className="text-stone-300 mt-4">
                  Each tag represents a collection of carefully curated prompts that share similar 
                  characteristics. Use tags to quickly find prompts that match your desired aesthetic 
                  or to explore new creative possibilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}