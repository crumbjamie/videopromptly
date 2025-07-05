import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPromptBySlug, getAllPrompts } from '@/lib/database';
import PromptDetailClient from './client';
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

  const title = `${prompt.title} - ChatGPT Image Prompt | Copy & Use`;
  const description = `${prompt.description} ✨ ${prompt.difficulty} level prompt ✨ Copy & paste into ChatGPT ✨ Transform photos to ${prompt.category.toLowerCase()} style instantly!`;

  return {
    title,
    description,
    keywords: `${prompt.tags.join(', ')}, ${prompt.title} prompt, ChatGPT ${prompt.category}, DALL-E 3 ${prompt.category}, AI image transformation, ${prompt.difficulty} prompts`,
    authors: [{ name: 'ImagePromptly' }],
    creator: 'ImagePromptly',
    publisher: 'ImagePromptly',
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
      canonical: getCanonicalUrl(`/image-prompt/${slug}`),
    },
    other: {
      'article:author': 'ImagePromptly',
      'article:tag': prompt.tags.join(', '),
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: prompt.createdAt.toISOString(),
      modifiedTime: prompt.updatedAt.toISOString(),
      authors: ['ImagePromptly'],
      tags: prompt.tags,
      images: prompt.thumbnails?.[0] ? [
        {
          url: prompt.thumbnails[0],
          width: 1200,
          height: 630,
          alt: `${prompt.title} example transformation`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: prompt.thumbnails?.[0] ? [prompt.thumbnails[0]] : [],
    },
  };
}

export default async function PromptPage({ params }: PageProps) {
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
      <PromptDetailClient prompt={prompt} />
    </>
  );
}