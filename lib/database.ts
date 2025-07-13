import { VideoPrompt } from './types';
import promptsData from './database/prompts.json';

// In production, this would connect to Vercel Postgres
// For now, we'll use the JSON data as a mock database

// Helper function to check if video file exists
// For simplicity during build, we'll create a pre-filtered list of available videos
const AVAILABLE_VIDEOS = new Set([
  '/videos/prompt-310.mp4',
  '/videos/prompt-312.mp4',
  '/videos/prompt-314.mp4',
  '/videos/prompt-316.mp4',
  '/videos/prompt-319.mp4',
  '/videos/prompt-321.mp4',
  '/videos/prompt-323.mp4',
  '/videos/prompt-331.mp4',
  '/videos/prompt-332.mp4',
  '/videos/prompt-336.mp4',
  '/videos/prompt-337.mp4',
  '/videos/prompt-340.mp4',
  '/videos/prompt-342.mp4',
  '/videos/prompt-351.mp4',
  '/videos/prompt-356.mp4',
  '/videos/prompt-357.mp4',
  '/videos/prompt-360.mp4',
  '/videos/prompt-365.mp4',
  '/videos/prompt-367.mp4',
  '/videos/prompt-370.mp4',
  '/videos/prompt-371.mp4',
  '/videos/prompt-372.mp4',
  '/videos/prompt-373.mp4',
  '/videos/prompt-379.mp4',
  '/videos/prompt-380.mp4',
  '/videos/prompt-381.mp4',
  '/videos/prompt-382.mp4',
  '/videos/prompt-387.mp4',
  '/videos/prompt-391.mp4',
  '/videos/prompt-395.mp4',
  '/videos/prompt-396.mp4',
  '/videos/prompt-398.mp4',
  '/videos/prompt-399.mp4',
  '/videos/prompt-405.mp4',
  '/videos/prompt-406.mp4',
  '/videos/prompt-417.mp4',
  '/videos/prompt-420.mp4',
  '/videos/prompt-421.mp4',
  '/videos/prompt-423.mp4',
  '/videos/prompt-424.mp4',
  '/videos/prompt-425.mp4',
  '/videos/prompt-437.mp4',
  '/videos/prompt-438.mp4',
  '/videos/prompt-439.mp4',
  '/videos/prompt-440.mp4',
  '/videos/prompt-449.mp4',
  '/videos/prompt-452.mp4',
  '/videos/prompt-453.mp4',
  '/videos/prompt-459.mp4'
]);

function videoExists(videoUrl: string): boolean {
  return AVAILABLE_VIDEOS.has(videoUrl);
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
function hasAvailableVideo(p: RawPromptData): boolean {
  const videoUrl = p.videoUrl || `/videos/${p.slug}.mp4`;
  return videoExists(videoUrl);
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