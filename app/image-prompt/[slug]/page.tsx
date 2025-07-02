import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPromptBySlug, getAllPrompts } from '@/lib/database';
import PromptDetailClient from './client';

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

  const title = `${prompt.title} - ChatGPT Image Prompt`;
  const description = `${prompt.description} Transform your images with this ${prompt.difficulty.toLowerCase()} level ${prompt.category.toLowerCase()} prompt on ImagePromptly.`;

  return {
    title,
    description,
    keywords: `${prompt.tags.join(', ')}, ImagePromptly, ChatGPT prompts, AI image transformation, ${prompt.category}, ${prompt.difficulty}`,
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
      canonical: `/image-prompt/${slug}`,
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

  return <PromptDetailClient prompt={prompt} />;
}