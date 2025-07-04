import { MetadataRoute } from 'next';
import { getAllPrompts, getAllCategories } from '@/lib/database';
import { slugify } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prompts = await getAllPrompts();
  const categories = await getAllCategories();
  const baseUrl = 'https://imagepromptly.com';
  
  // Calculate total pages for pagination
  const PROMPTS_PER_PAGE = 40;
  const totalPages = Math.ceil(prompts.length / PROMPTS_PER_PAGE);

  // Individual prompt pages
  const promptUrls = prompts.map((prompt) => ({
    url: `${baseUrl}/image-prompt/${prompt.slug}`,
    lastModified: new Date(prompt.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Category pages
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${slugify(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  // Paginated home pages
  const paginatedUrls = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(page => page > 1) // Skip page 1 as it's the home page
    .map(page => ({
      url: `${baseUrl}/?page=${page}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...paginatedUrls,
    ...categoryUrls,
    ...promptUrls,
  ];
}