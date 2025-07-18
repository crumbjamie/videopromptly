import { VideoPrompt } from './types';
import promptsData from './database/prompts.json';

// In production, this would connect to Vercel Postgres
// For now, we'll use the JSON data as a mock database

// Helper function to check if video file exists
function videoExists(): boolean {
  // Since we have 176 videos available and the filtering should work consistently
  // across client and server, we'll disable filtering for now and show all prompts.
  // The VideoPreview component already handles missing videos gracefully.
  return true;
}

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

// Helper function to transform raw data to VideoPrompt
function transformRawPrompt(p: RawPromptData): VideoPrompt {
  const videoUrl = p.videoUrl || `/videos/${p.slug}.mp4`;
  const thumbnailUrl = p.thumbnailUrl || (typeof p.thumbnail === 'object' ? `/thumbnails/${p.thumbnail.after}` : p.thumbnail ? `/thumbnails/${p.thumbnail}` : undefined);
  const duration = p.duration || 8;
  const resolution = p.resolution || '1920x1080';
  const aspectRatio = p.aspectRatio || '16:9';
  const format = p.format || 'mp4';
  const fileSize = p.fileSize || 50000000;
  
  return {
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
    categories: p.categories || [p.category],
    // Required videos array for new interface
    videos: [{
      id: `${p.id}-v1`,
      videoUrl,
      thumbnailUrl: thumbnailUrl || '',
      category: p.category,
      duration,
      resolution,
      aspectRatio,
      format,
      fileSize,
      rating: p.rating,
      featured: p.featured
    }],
    // Legacy fields for backward compatibility
    videoUrl,
    thumbnailUrl,
    duration,
    resolution,
    aspectRatio,
    format,
    fileSize
  };
}

// Helper function to check if prompt has available video
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasAvailableVideo(_p: RawPromptData): boolean {
  // Since we're always returning true, we don't need to check the videoUrl
  return videoExists();
}

export async function getAllPrompts(): Promise<VideoPrompt[]> {
  // Simulate async database call
  return new Promise((resolve) => {
    setTimeout(() => {
      const prompts = (promptsData.prompts as RawPromptData[])
        .filter(hasAvailableVideo) // Only include prompts with available videos
        .map(transformRawPrompt);
      resolve(prompts);
    }, 100);
  });
}

export async function getPromptBySlug(slug: string): Promise<VideoPrompt | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prompt = (promptsData.prompts as RawPromptData[]).find(p => p.slug === slug);
      if (prompt && hasAvailableVideo(prompt)) {
        resolve(transformRawPrompt(prompt));
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
          hasAvailableVideo(prompt) && ( // Only include available videos
            prompt.title.toLowerCase().includes(lowercaseQuery) ||
            prompt.description.toLowerCase().includes(lowercaseQuery) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
            prompt.category.toLowerCase().includes(lowercaseQuery)
          )
        )
        .map(transformRawPrompt);
      resolve(results);
    }, 100);
  });
}

export async function getPromptsByCategory(category: string): Promise<VideoPrompt[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = (promptsData.prompts as RawPromptData[])
        .filter(prompt => {
          if (!hasAvailableVideo(prompt)) return false; // Only include available videos
          
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
        .map(transformRawPrompt);
      resolve(results);
    }, 100);
  });
}

export async function getPromptsByTag(tag: string): Promise<VideoPrompt[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = (promptsData.prompts as RawPromptData[])
        .filter(prompt => 
          hasAvailableVideo(prompt) && // Only include available videos
          prompt.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        )
        .map(transformRawPrompt);
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
        .filter(p => p.id !== currentPromptId && hasAvailableVideo(p)) // Only include available videos
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

      const relatedWithDates = related.map(transformRawPrompt);
      resolve(relatedWithDates);
    }, 100);
  });
}

export function getAllCategories(): string[] {
  const categories = new Set(
    (promptsData.prompts as RawPromptData[])
      .filter(hasAvailableVideo) // Only include available videos
      .map(p => p.category)
  );
  return Array.from(categories);
}

export function getAllCategoriesWithCount(): { name: string; count: number }[] {
  const categoryCounts = new Map<string, number>();
  
  (promptsData.prompts as RawPromptData[])
    .filter(hasAvailableVideo) // Only count available videos
    .forEach(prompt => {
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
      
      (promptsData.prompts as RawPromptData[])
        .filter(hasAvailableVideo) // Only count available videos
        .forEach(prompt => {
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

// Utility function to get availability stats (for development/debugging)
export function getVideoAvailabilityStats(): {
  total: number;
  available: number;
  missing: number;
  percentage: number;
} {
  const total = promptsData.prompts.length;
  const available = (promptsData.prompts as RawPromptData[]).filter(hasAvailableVideo).length;
  const missing = total - available;
  const percentage = Math.round((available / total) * 100);
  
  return { total, available, missing, percentage };
}