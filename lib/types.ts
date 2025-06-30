export interface ImagePrompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  thumbnails?: string[];
}

export type Category = 
  | 'Toy Transformations'
  | 'Artistic Styles'
  | 'Photo Effects'
  | 'Character Styles';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';