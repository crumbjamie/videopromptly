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

  const title = `${category} Video Prompts - Create ${category} Videos with AI`;
  const description = `Explore ${category.toLowerCase()} video prompts for Veo3 & AI video tools. ✨ Instant copy & paste ✨ Professional results ✨ All skill levels. Create stunning videos now!`;

  return {
    title,
    description,
    keywords: `${category}, VideoPromptly, Veo3 prompts, AI video generation`,
    alternates: {
      canonical: getCanonicalUrl(`/category/${slug}`),
    },
    openGraph: {
      title: `${category} Video Prompts | VideoPromptly`,
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