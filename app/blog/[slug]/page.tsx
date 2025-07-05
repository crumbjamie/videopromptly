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

  const ogImage = post.featuredImage 
    ? getCanonicalUrl(post.featuredImage)
    : getCanonicalUrl('/og-image.png');

  return {
    title: `${post.title} | ImagePromptly Blog`,
    description: post.description,
    keywords: post.keywords?.join(', '),
    authors: [{ name: post.author }],
    alternates: {
      canonical: getCanonicalUrl(`/blog/${slug}`),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || post.title,
        },
      ],
      siteName: 'ImagePromptly',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
      creator: '@imagepromptly',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (exclude current post)
  const allPosts = await getAllBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug)
    .slice(0, 2);

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
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-invert prose-xl max-w-none prose-headings:text-white prose-headings:font-bold prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-16 prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-16 prose-h2:pb-4 prose-h2:border-b prose-h2:border-stone-800 prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:text-stone-200 prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-8 prose-h4:text-stone-300 prose-p:text-stone-300 prose-p:mb-6 prose-p:leading-relaxed prose-p:text-lg prose-a:text-stone-400 prose-a:hover:text-white prose-a:no-underline prose-a:border-b prose-a:border-stone-700 prose-a:hover:border-stone-400 prose-a:transition-colors prose-strong:text-white prose-strong:font-semibold prose-em:text-stone-300 prose-ul:text-stone-300 prose-ul:mb-8 prose-ul:text-lg prose-ol:text-stone-300 prose-ol:mb-8 prose-ol:text-lg prose-li:mb-3 prose-li:leading-relaxed prose-blockquote:text-stone-400 prose-blockquote:border-l-4 prose-blockquote:border-stone-700 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-10 prose-blockquote:text-xl prose-code:text-stone-300 prose-code:bg-stone-800/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-stone-900 prose-pre:border prose-pre:border-stone-800 prose-pre:my-10 prose-pre:text-base prose-hr:border-stone-800 prose-hr:my-16"
            dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }}
          />

          {/* Call to Action */}
          <div className="mt-16 bg-stone-900 rounded-lg p-8 border border-stone-800">
            <h3 className="text-2xl font-semibold text-white mb-4">Ready to start transforming?</h3>
            <p className="text-stone-300 mb-6">
              Explore our collection of proven prompts and start creating amazing AI art today.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white font-medium py-3 px-6 rounded-lg transition-colors border border-stone-700 hover:border-stone-600"
            >
              Browse image prompts
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-semibold text-white mb-8">Related articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="block bg-stone-900 rounded-lg p-6 border border-stone-800 hover:border-stone-700 transition-all"
                  >
                    <h4 className="text-lg font-semibold text-white mb-2 hover:text-stone-300 transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-stone-400 text-sm mb-4 line-clamp-2">
                      {relatedPost.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {relatedPost.readTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </>
  );
}