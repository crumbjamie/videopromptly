import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import Header from '../components/Header';
import { getCanonicalUrl } from '@/lib/seo';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog & Guides - Master AI Video Creation | VideoPromptly',
  description: 'Expert guides on using Veo3 and AI tools for video creation. Learn techniques, viral strategies, and best practices for AI-powered video generation.',
  keywords: 'Veo3 video guide, AI video creation tutorial, viral video tips, video prompt techniques',
  alternates: {
    canonical: getCanonicalUrl('/blog'),
  },
  openGraph: {
    title: 'AI Video Creation Guides & Tutorials',
    description: 'Master the art of AI video creation with our expert guides and tutorials.',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  // Schema.org markup for Blog
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'VideoPromptly Blog',
    description: 'Expert guides on using Veo3 and AI tools for video creation',
    url: getCanonicalUrl('/blog'),
    publisher: {
      '@type': 'Organization',
      name: 'VideoPromptly',
      url: getCanonicalUrl('/'),
    },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      url: getCanonicalUrl(`/blog/${post.slug}`),
      image: post.featuredImage ? getCanonicalUrl(post.featuredImage) : undefined,
    })),
  };

  // Map blog slugs to thumbnail images
  const thumbnailMap: Record<string, string> = {
    'complete-guide-veo3-video-creation': '/blog/images/thumbnails/veo3-guide-thumb.jpg',
    'viral-yeti-bigfoot-videos-social-media': '/blog/images/thumbnails/viral-cryptid-thumb.jpg',
    'veo3-vs-competitors-2025': '/blog/images/thumbnails/ai-comparison-thumb.jpg',
    'asmr-glass-fruit-viral-strategy': '/blog/images/thumbnails/asmr-glass-thumb.jpg'
  };

  return (
    <>
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <header className="text-center mb-16 mt-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog & Guides
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Master AI video creation with our expert guides, tutorials, and viral strategies for Veo3 and video AI tools.
            </p>
          </header>

          {/* Blog Posts Grid */}
          <section aria-label="Blog posts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => {
                const thumbnailSrc = thumbnailMap[post.slug];
                
                return (
                  <article key={post.slug} className="h-full flex flex-col">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="block flex-grow"
                      aria-label={`Read ${post.title}`}
                    >
                      <div className="h-full flex flex-col bg-stone-950 rounded-lg transition-all duration-200 cursor-pointer group overflow-hidden border border-stone-800 hover:border-stone-700">
                        {/* Thumbnail */}
                        {thumbnailSrc && (
                          <figure className="aspect-video relative overflow-hidden bg-stone-800">
                            <Image
                              src={thumbnailSrc}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </figure>
                        )}
                        
                        <div className="flex flex-col flex-grow p-6">
                          {/* Title */}
                          <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h2>
                          
                          {/* Description */}
                          <p className="text-stone-400 text-sm mb-4 line-clamp-3 flex-grow">
                            {post.description}
                          </p>
                          
                          {/* Meta Information */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-4">
                            <time dateTime={post.date} className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </time>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {post.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {post.author}
                            </span>
                          </div>
                          
                          {/* Category Badge */}
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-stone-800 text-stone-400">
                              {post.category}
                            </span>
                            <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-blue-400 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          {/* SEO Content */}
          <section className="mt-16 grid md:grid-cols-2 gap-8" aria-label="Additional information">
            <aside className="bg-stone-900 rounded-lg p-8 border border-stone-800">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Learn AI Video Creation
              </h2>
              <p className="text-stone-300 mb-4">
                Our guides cover everything from basic Veo3 video prompts to advanced viral video strategies. 
                Whether you&apos;re a beginner or experienced creator, you&apos;ll find valuable insights to improve your AI video generation.
              </p>
              <ul className="space-y-2 text-stone-300">
                <li>• Step-by-step Veo3 tutorials for beginners</li>
                <li>• Advanced video prompt engineering techniques</li>
                <li>• Viral video creation strategies</li>
                <li>• Comparison with other AI video tools</li>
              </ul>
            </aside>
            
            <aside className="bg-stone-900 rounded-lg p-8 border border-stone-800">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-stone-300 mb-4">
                AI video generation is rapidly evolving. Our blog keeps you updated with the latest features, 
                techniques, and best practices for Veo3 and video AI tools.
              </p>
              <nav className="space-y-3" aria-label="Blog links">
                <Link 
                  href="/blog/rss.xml" 
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Subscribe to RSS Feed
                </Link>
                <Link 
                  href="/" 
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Browse Video Prompts
                </Link>
              </nav>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}