import { MetadataRoute } from 'next';
import { getAllPrompts, getAllCategories, getAllTags } from '@/lib/database';
import { slugify } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prompts = await getAllPrompts();
  const categories = await getAllCategories();
  const tags = await getAllTags();
  const baseUrl = 'https://imagepromptly.com';
  

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
  
  // Tag pages
  const tagUrls = tags.map((tag) => ({
    url: `${baseUrl}/tag/${encodeURIComponent(tag.name.toLowerCase().replace(/\s+/g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
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
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...categoryUrls,
    ...tagUrls,
    ...promptUrls,
  ];
}