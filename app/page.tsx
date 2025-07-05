import { Metadata } from 'next';
import HomePageClient from './components/HomePageClient';
import { getAllPrompts, getAllCategories } from '@/lib/database';
import { getCanonicalUrl } from '@/lib/seo';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'ImagePromptly - AI Image Transformation Prompts for ChatGPT',
  description: 'Transform your photos with 160+ curated ChatGPT prompts. ✨ Instant copy & paste ✨ Works with DALL-E 3 ✨ Create anime, vintage, cyberpunk & more styles in seconds!',
  keywords: 'ChatGPT image prompts, DALL-E 3 prompts, AI photo transformation, image to art prompts, ChatGPT photo effects, AI image generator prompts',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    title: 'Transform Photos with ChatGPT - 160+ Image Prompts',
    description: 'Copy & paste prompts to transform your photos into amazing art styles. Works instantly with ChatGPT & DALL-E 3.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ImagePromptly - Transform photos with ChatGPT prompts',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transform Photos with ChatGPT - ImagePromptly',
    description: '160+ curated prompts to transform your photos into art. Copy & paste into ChatGPT!',
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