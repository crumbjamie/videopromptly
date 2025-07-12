import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPromptBySlug, getAllPrompts } from '@/lib/database';
import VideoDetailClient from './client';
import { getCanonicalUrl, generateArticleSchema, generateHowToSchema, generateAggregateRatingSchema } from '@/lib/seo';
import Script from 'next/script';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const prompts = await getAllPrompts();
  return prompts.map((prompt) => ({
    slug: prompt.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  
  if (!prompt) {
    return {
      title: 'Prompt Not Found',
    };
  }

  const title = `${prompt.title} - Veo3 Video Prompt | Copy & Use`;
  const description = `${prompt.description} ✨ ${prompt.difficulty} level prompt ✨ Copy & paste into Veo3 ✨ Create ${prompt.category.toLowerCase()} videos instantly!`;

  return {
    title,
    description,
    keywords: `${prompt.tags.join(', ')}, ${prompt.title} prompt, Veo3 ${prompt.category}, AI video generation, ${prompt.difficulty} prompts`,
    authors: [{ name: 'VideoPromptly' }],
    creator: 'VideoPromptly',
    publisher: 'VideoPromptly',
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
    alternates: {
      canonical: getCanonicalUrl(`/video-prompt/${slug}`),
    },
    other: {
      'article:author': 'VideoPromptly',
      'article:tag': prompt.tags.join(', '),
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: prompt.createdAt.toISOString(),
      modifiedTime: prompt.updatedAt.toISOString(),
      authors: ['VideoPromptly'],
      tags: prompt.tags,
      images: prompt.thumbnailUrl ? [
        {
          url: prompt.thumbnailUrl,
          width: 1200,
          height: 630,
          alt: `${prompt.title} video example`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: prompt.thumbnailUrl ? [prompt.thumbnailUrl] : [],
    },
  };
}

export default async function VideoPage({ params }: PageProps) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  // Generate schemas
  const articleSchema = generateArticleSchema(prompt);
  const howToSchema = generateHowToSchema(prompt);
  const ratingSchema = prompt.rating ? generateAggregateRatingSchema(prompt.rating) : null;

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {ratingSchema && (
        <Script
          id="rating-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ratingSchema) }}
        />
      )}
      <VideoDetailClient prompt={prompt} />
    </>
  );
}