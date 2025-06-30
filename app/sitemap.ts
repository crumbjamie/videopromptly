import { MetadataRoute } from 'next';
import { getAllPrompts } from '@/lib/database';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prompts = await getAllPrompts();
  const baseUrl = 'https://chatgpt-image-prompts.vercel.app'; // Update with your actual domain

  const promptUrls = prompts.map((prompt) => ({
    url: `${baseUrl}/image-prompt/${prompt.slug}`,
    lastModified: new Date(prompt.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...promptUrls,
  ];
}