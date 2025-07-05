import { ImagePrompt } from './types';
import promptsData from './database/prompts.json';

// In production, this would connect to Vercel Postgres
// For now, we'll use the JSON data as a mock database

export async function getAllPrompts(): Promise<ImagePrompt[]> {
  // Simulate async database call
  return new Promise((resolve) => {
    setTimeout(() => {
      const prompts = promptsData.prompts.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'
      }));
      resolve(prompts);
    }, 100);
  });
}

export async function getPromptBySlug(slug: string): Promise<ImagePrompt | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prompt = promptsData.prompts.find(p => p.slug === slug);
      if (prompt) {
        resolve({
          ...prompt,
          createdAt: new Date(prompt.createdAt),
          updatedAt: new Date(prompt.updatedAt),
          difficulty: prompt.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'
        });
      } else {
        resolve(null);
      }
    }, 100);
  });
}

export async function searchPrompts(query: string): Promise<ImagePrompt[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      const results = promptsData.prompts
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
          difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'
        }));
      resolve(results);
    }, 100);
  });
}

export async function getPromptsByCategory(category: string): Promise<ImagePrompt[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = promptsData.prompts
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
          difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'
        }));
      resolve(results);
    }, 100);
  });
}

export async function getPromptsByTag(tag: string): Promise<ImagePrompt[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = promptsData.prompts
        .filter(prompt => 
          prompt.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        )
        .map(p => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'
        }));
      resolve(results);
    }, 100);
  });
}

export async function getRelatedPrompts(currentPromptId: string, limit: number = 4): Promise<ImagePrompt[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentPrompt = promptsData.prompts.find(p => p.id === currentPromptId);
      if (!currentPrompt) {
        resolve([]);
        return;
      }

      // Find prompts with similar category or tags
      const related = promptsData.prompts
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
        difficulty: p.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'
      }));
      resolve(relatedWithDates);
    }, 100);
  });
}

export function getAllCategories(): string[] {
  const categories = new Set(promptsData.prompts.map(p => p.category));
  return Array.from(categories);
}

export function getAllCategoriesWithCount(): { name: string; count: number }[] {
  const categoryCounts = new Map<string, number>();
  
  promptsData.prompts.forEach(prompt => {
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
      
      promptsData.prompts.forEach(prompt => {
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