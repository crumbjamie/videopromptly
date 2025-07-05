import { Metadata } from 'next';
import Link from 'next/link';
import Header from '../components/Header';
import { getCanonicalUrl } from '@/lib/seo';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog & Guides - Learn AI Image Transformation | ImagePromptly',
  description: 'Expert guides on using ChatGPT for image transformation. Learn techniques, tips, and best practices for AI-powered photo editing with DALL-E 3.',
  keywords: 'ChatGPT image guide, DALL-E 3 tutorial, AI photo transformation tips, image prompt techniques',
  alternates: {
    canonical: getCanonicalUrl('/blog'),
  },
  openGraph: {
    title: 'AI Image Transformation Guides & Tutorials',
    description: 'Master the art of AI image transformation with our expert guides and tutorials.',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16 mt-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog & Guides
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Master AI image transformation with our expert guides, tutorials, and tips for using ChatGPT and DALL-E 3.
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-white mb-6">Featured Guide</h2>
              <Link 
                href={`/blog/${featuredPost.slug}`}
                className="block bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/50 rounded-lg p-8 hover:border-blue-700 transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                    {featuredPost.category}
                  </span>
                </div>
                <p className="text-white mb-4">{featuredPost.description}</p>
                <div className="flex items-center gap-4 text-sm text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* All Posts */}
          {regularPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">All Guides & Articles</h2>
              <div className="grid gap-6">
                {regularPosts.map(post => (
                  <Link 
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block bg-stone-900 border border-stone-800 rounded-lg p-6 hover:bg-stone-800 hover:border-stone-700 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                        </div>
                        <p className="text-stone-300 mb-3">{post.description}</p>
                        <div className="flex items-center gap-4 text-sm text-stone-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-800 text-stone-300">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-stone-900 rounded-lg p-8 border border-stone-800">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Learn AI Image Transformation
              </h2>
              <p className="text-stone-300 mb-4">
                Our guides cover everything from basic ChatGPT image prompts to advanced transformation techniques. 
                Whether you&apos;re a beginner or experienced user, you&apos;ll find valuable insights to improve your AI art creation.
              </p>
              <ul className="space-y-2 text-stone-300">
                <li>• Step-by-step tutorials for beginners</li>
                <li>• Advanced prompt engineering techniques</li>
                <li>• Troubleshooting common issues</li>
                <li>• Comparison with other AI tools</li>
              </ul>
            </div>
            
            <div className="bg-stone-900 rounded-lg p-8 border border-stone-800">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-stone-300 mb-4">
                AI image generation is rapidly evolving. Our blog keeps you updated with the latest features, 
                techniques, and best practices for ChatGPT and DALL-E 3.
              </p>
              <div className="space-y-3">
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
                  Browse Image Prompts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}