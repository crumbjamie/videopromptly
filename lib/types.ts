export interface VideoPrompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  categories?: string[];
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: Date;
  updatedAt: Date;
  
  // Video-specific fields
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  resolution: string; // e.g., "1920x1080"
  aspectRatio: string; // e.g., "16:9", "1:1", "9:16"
  format: string; // "mp4", "webm"
  fileSize: number; // in bytes
  
  // Legacy compatibility
  thumbnail?: string | { before: string; after: string };
  thumbnails?: string[];
  
  featured?: boolean;
  rating?: number;
  ratingCount?: number;
}

// Legacy support - alias for backwards compatibility during transition
export type ImagePrompt = VideoPrompt;

export type Category = 
  | 'Viral Character Vlogs'
  | 'Existential AI'
  | 'Comedy & Entertainment'
  | 'Educational'
  | 'Cinematic Action'
  | 'ASMR & Sensory'
  | 'Music & Performance'
  | 'Fashion & Beauty'
  | 'TikTok Vertical'
  | 'Business & Marketing';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9';

export type VideoFormat = 'mp4' | 'webm' | 'mov';

export type VideoResolution = 
  | '480p'
  | '720p'
  | '1080p'
  | '1440p'
  | '4K';