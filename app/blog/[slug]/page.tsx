import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/app/components/Header';
import { getCanonicalUrl, generateArticleSchema } from '@/lib/seo';
import Script from 'next/script';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - ImagePromptly`,
    description: post.description,
    keywords: post.keywords?.join(', '),
    alternates: {
      canonical: getCanonicalUrl(`/blog/${slug}`),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description,
    createdAt: new Date(post.date),
    updatedAt: new Date(post.date),
    slug: post.slug,
    tags: post.keywords,
    category: post.category,
  });

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Link */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-800 text-stone-300">
                {post.category}
              </span>
            </div>
            <p className="text-xl text-white mb-8">
              {post.description}
            </p>
            
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    // Hide image if it fails to load
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-3 prose-p:text-stone-300 prose-p:mb-4 prose-a:text-blue-400 prose-a:hover:text-blue-300 prose-strong:text-white prose-ul:text-stone-300 prose-ol:text-stone-300 prose-li:mb-2 prose-blockquote:text-stone-400 prose-blockquote:border-l-4 prose-blockquote:border-stone-600 prose-blockquote:pl-4 prose-blockquote:italic prose-code:text-blue-300 prose-code:bg-stone-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-stone-900 prose-pre:border prose-pre:border-stone-800"
            dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }}
          />

          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-8 border border-blue-800/50">
            <h3 className="text-2xl font-semibold text-white mb-4">Ready to Start Transforming?</h3>
            <p className="text-stone-300 mb-4">
              Explore our collection of proven prompts and start creating amazing AI art today.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Browse Image Prompts
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}