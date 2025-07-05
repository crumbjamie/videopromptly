import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from './client';
import { getAllCategories } from '@/lib/database';
import { slugify } from '@/lib/utils';
import { getCanonicalUrl } from '@/lib/seo';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    slug: slugify(category),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  
  // Find the category that matches this slug
  const category = categories.find(cat => slugify(cat) === slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const title = `${category} ChatGPT Prompts - Transform Photos to ${category} Style`;
  const description = `Explore ${category.toLowerCase()} image prompts for ChatGPT & DALL-E 3. ✨ Instant copy & paste ✨ Professional results ✨ All skill levels. Transform your photos now!`;

  return {
    title,
    description,
    keywords: `${category}, ImagePromptly, ChatGPT prompts, AI image transformation`,
    alternates: {
      canonical: getCanonicalUrl(`/category/${slug}`),
    },
    openGraph: {
      title: `${category} Prompts | ImagePromptly`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getAllCategories();
  
  // Find the category that matches this slug
  const category = categories.find(cat => slugify(cat) === slug);
  
  if (!category) {
    notFound();
  }

  return <CategoryPageClient category={category} />;
}