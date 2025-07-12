import { VideoPrompt } from './types';
import promptsData from './database/prompts.json';

// In production, this would connect to Vercel Postgres
// For now, we'll use the JSON data as a mock database

// Type for the raw JSON data (image prompt structure)
interface RawPromptData {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  categories?: string[];
  tags: string[];
  difficulty: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  ratingCount?: number;
  thumbnail?: string | { before: string; after: string };
  thumbnails?: string[];
  featured?: boolean;
  // Optional video fields that might exist in future data
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  resolution?: string;
  aspectRatio?: string;
  format?: string;
  fileSize?: number;
}

export async function getAllPrompts(): Promise<VideoPrompt[]> {
  // Simulate async database call
  return new Promise((resolve) => {
    setTimeout(() => {
      const prompts = (promptsData.prompts as RawPromptData[]).map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        // Add required video fields with defaults for compatibility
        videoUrl: p.videoUrl || `/videos/${p.slug}.mp4`,
        thumbnailUrl: p.thumbnailUrl || (typeof p.thumbnail === 'object' ? `/thumbnails/${p.thumbnail.after}` : p.thumbnail ? `/thumbnails/${p.thumbnail}` : undefined),
        duration: p.duration || 8,
        resolution: p.resolution || '1920x1080',
        aspectRatio: p.aspectRatio || '16:9',
        format: p.format || 'mp4',
        fileSize: p.fileSize || 50000000 // 50MB default
      }));
      resolve(prompts);
    }, 100);
  });
}

export async function getPromptBySlug(slug: string): Promise<VideoPrompt | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prompt = (promptsData.prompts as RawPromptData[]).find(p => p.slug === slug);
      if (prompt) {
        resolve({
          ...prompt,
          createdAt: new Date(prompt.createdAt),
          updatedAt: new Date(prompt.updatedAt),
          difficulty: prompt.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
          // Add required video fields with defaults for compatibility
          videoUrl: prompt.videoUrl || `/videos/${prompt.slug}.mp4`,
          thumbnailUrl: prompt.thumbnailUrl || (typeof prompt.thumbnail === 'object' ? `/thumbnails/${prompt.thumbnail.after}` : prompt.thumbnail ? `/thumbnails/${prompt.thumbnail}` : undefined),
          duration: prompt.duration || 8,
          resolution: prompt.resolution || '1920x1080',
          aspectRatio: prompt.aspectRatio || '16:9',
          format: prompt.format || 'mp4',
          fileSize: prompt.fileSize || 50000000 // 50MB default
        });
      } else {
        resolve(null);
      }
    }, 100);
  });
}

export async function searchPrompts(query: string): Promise<VideoPrompt[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      const results = (promptsData.prompts as RawPromptData[])
        .filter(prompt => 
          prompt.title.toLowerCase().includes(lowercaseQuery) ||
          prompt.description.toLowerCase().includes(lowercaseQuery) ||
          prompt.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
          prompt.category.toLowerCase().includes(lowercaseQuery)
        )
        .map(p => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
          // Add required video fields with defaults for compatibility
          videoUrl: p.videoUrl || `/videos/${p.slug}.mp4`,
          thumbnailUrl: p.thumbnailUrl || (typeof p.thumbnail === 'object' ? `/thumbnails/${p.thumbnail.after}` : p.thumbnail ? `/thumbnails/${p.thumbnail}` : undefined),
          duration: p.duration || 8,
          resolution: p.resolution || '1920x1080',
          aspectRatio: p.aspectRatio || '16:9',
          format: p.format || 'mp4',
          fileSize: p.fileSize || 50000000 // 50MB default
        }));
      resolve(results);
    }, 100);
  });
}

export async function getPromptsByCategory(category: string): Promise<VideoPrompt[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = (promptsData.prompts as RawPromptData[])
        .filter(prompt => {
          // Check primary category
          if (prompt.category.toLowerCase() === category.toLowerCase()) {
            return true;
          }
          // Check categories array if it exists
          if (prompt.categories && Array.isArray(prompt.categories)) {
            return prompt.categories.some(cat => cat.toLowerCase() === category.toLowerCase());
          }
          return false;
        })
        .map(p => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
          // Add required video fields with defaults for compatibility
          videoUrl: p.videoUrl || `/videos/${p.slug}.mp4`,
          thumbnailUrl: p.thumbnailUrl || (typeof p.thumbnail === 'object' ? `/thumbnails/${p.thumbnail.after}` : p.thumbnail ? `/thumbnails/${p.thumbnail}` : undefined),
          duration: p.duration || 8,
          resolution: p.resolution || '1920x1080',
          aspectRatio: p.aspectRatio || '16:9',
          format: p.format || 'mp4',
          fileSize: p.fileSize || 50000000 // 50MB default
        }));
      resolve(results);
    }, 100);
  });
}

export async function getPromptsByTag(tag: string): Promise<VideoPrompt[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = (promptsData.prompts as RawPromptData[])
        .filter(prompt => 
          prompt.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        )
        .map(p => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
          // Add required video fields with defaults for compatibility
          videoUrl: p.videoUrl || `/videos/${p.slug}.mp4`,
          thumbnailUrl: p.thumbnailUrl || (typeof p.thumbnail === 'object' ? `/thumbnails/${p.thumbnail.after}` : p.thumbnail ? `/thumbnails/${p.thumbnail}` : undefined),
          duration: p.duration || 8,
          resolution: p.resolution || '1920x1080',
          aspectRatio: p.aspectRatio || '16:9',
          format: p.format || 'mp4',
          fileSize: p.fileSize || 50000000 // 50MB default
        }));
      resolve(results);
    }, 100);
  });
}

export async function getRelatedPrompts(currentPromptId: string, limit: number = 4): Promise<VideoPrompt[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentPrompt = (promptsData.prompts as RawPromptData[]).find(p => p.id === currentPromptId);
      if (!currentPrompt) {
        resolve([]);
        return;
      }

      // Find prompts with similar category or tags
      const related = (promptsData.prompts as RawPromptData[])
        .filter(p => p.id !== currentPromptId)
        .map(prompt => {
          let score = 0;
          if (prompt.category === currentPrompt.category) score += 2;
          const commonTags = prompt.tags.filter(tag => currentPrompt.tags.includes(tag));
          score += commonTags.length;
          return { prompt, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.prompt);

      const relatedWithDates = related.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        // Add required video fields with defaults for compatibility
        videoUrl: p.videoUrl || `/videos/${p.slug}.mp4`,
        thumbnailUrl: p.thumbnailUrl || (typeof p.thumbnail === 'object' ? `/thumbnails/${p.thumbnail.after}` : p.thumbnail ? `/thumbnails/${p.thumbnail}` : undefined),
        duration: p.duration || 8,
        resolution: p.resolution || '1920x1080',
        aspectRatio: p.aspectRatio || '16:9',
        format: p.format || 'mp4',
        fileSize: p.fileSize || 50000000 // 50MB default
      }));
      resolve(relatedWithDates);
    }, 100);
  });
}

export function getAllCategories(): string[] {
  const categories = new Set((promptsData.prompts as RawPromptData[]).map(p => p.category));
  return Array.from(categories);
}

export function getAllCategoriesWithCount(): { name: string; count: number }[] {
  const categoryCounts = new Map<string, number>();
  
  (promptsData.prompts as RawPromptData[]).forEach(prompt => {
    categoryCounts.set(prompt.category, (categoryCounts.get(prompt.category) || 0) + 1);
  });
  
  return Array.from(categoryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tagCounts = new Map<string, number>();
      
      (promptsData.prompts as RawPromptData[]).forEach(prompt => {
        prompt.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });
      
      const tags = Array.from(tagCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      resolve(tags);
    }, 50);
  });
}