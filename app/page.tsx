import { Metadata } from 'next';
import HomePageClient from './components/HomePageClient';
import { getAllPrompts, getAllCategories } from '@/lib/database';
import { getCanonicalUrl } from '@/lib/seo';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'VideoPromptly - AI Video Generation Prompts for Veo3 & AI Tools',
  description: 'Create stunning videos with 160+ curated AI prompts. ✨ Instant copy & paste ✨ Works with Veo3 & other AI tools ✨ Generate animations, VFX, transitions & more in seconds!',
  keywords: 'Veo3 video prompts, AI video generation, video creation prompts, AI animation prompts, video effects prompts',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    title: 'Create Videos with AI - 160+ Video Generation Prompts',
    description: 'Copy & paste prompts to create stunning videos with AI. Works instantly with Veo3 & other AI tools.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VideoPromptly - Create videos with AI prompts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Videos with AI - VideoPromptly',
    description: '160+ curated prompts to create stunning videos with AI. Copy & paste into Veo3!',
  },
};

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;
  
  // Fetch all data on the server
  const [prompts, categories] = await Promise.all([
    getAllPrompts(),
    getAllCategories()
  ]);

  return (
    <HomePageClient 
      initialPrompts={prompts}
      allCategories={categories}
      initialCategory={category}
      initialSearch={search}
    />
  );
}