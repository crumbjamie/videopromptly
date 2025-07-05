import { MetadataRoute } from 'next';
import { getAllPrompts, getAllCategories, getAllTags } from '@/lib/database';
import { slugify } from '@/lib/utils';
import { getAllBlogPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prompts = await getAllPrompts();
  const categories = await getAllCategories();
  const tags = await getAllTags();
  const blogPosts = await getAllBlogPosts();
  

  // Individual prompt pages
  const promptUrls = prompts.map((prompt) => ({
    url: `${SITE_URL}/image-prompt/${prompt.slug}`,
    lastModified: new Date(prompt.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Category pages
  const categoryUrls = categories.map((category) => ({
    url: `${SITE_URL}/category/${slugify(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  // Tag pages
  const tagUrls = tags.map((tag) => ({
    url: `${SITE_URL}/tag/${encodeURIComponent(tag.name.toLowerCase().replace(/\s+/g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Blog pages
  const blogUrls = [
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Combine all URLs and sort by priority
  return [
    ...staticPages,
    ...blogUrls,
    ...promptUrls,
    ...categoryUrls,
    ...tagUrls,
  ].sort((a, b) => (b.priority || 0) - (a.priority || 0));
}