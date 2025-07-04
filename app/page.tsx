import { Metadata } from 'next';
import HomePageClient from './components/HomePageClient';
import { getAllPrompts, getAllCategories } from '@/lib/database';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'ImagePromptly - AI Image Transformation Prompts for ChatGPT',
  description: 'Discover and copy effective image prompts for ChatGPT. Transform your photos into amazing art styles and creative effects with our curated collection of 160+ prompts.',
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