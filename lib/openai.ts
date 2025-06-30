import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
});

export const imageGenerationConfig = {
  model: process.env.OPENAI_MODEL || 'dall-e-3',
  size: process.env.OPENAI_IMAGE_SIZE || '1024x1024',
  quality: process.env.OPENAI_IMAGE_QUALITY || 'standard',
} as const;

// Type for image generation size
export type ImageSize = '1024x1024' | '1792x1024' | '1024x1792';

// Helper to validate and cast size
export function getImageSize(): ImageSize {
  const size = imageGenerationConfig.size;
  if (['1024x1024', '1792x1024', '1024x1792'].includes(size)) {
    return size as ImageSize;
  }
  return '1024x1024';
}