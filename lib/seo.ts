// SEO utility functions

export const SITE_URL = 'https://ImagePromptly.com';

export function getCanonicalUrl(path: string = ''): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Remove any double slashes
  const normalizedPath = cleanPath.replace(/\/+/g, '/');
  // Remove trailing slash except for root
  const finalPath = normalizedPath === '/' ? normalizedPath : normalizedPath.replace(/\/$/, '');
  
  return `${SITE_URL}${finalPath}`;
}

export function generateArticleSchema(prompt: {
  title: string;
  description: string;
  thumbnails?: string[];
  thumbnail?: string | { before: string; after: string };
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  tags: string[];
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: prompt.title,
    description: prompt.description,
    image: prompt.thumbnails?.[0] ? `${SITE_URL}${prompt.thumbnails[0]}` : undefined,
    datePublished: prompt.createdAt.toISOString(),
    dateModified: prompt.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'ImagePromptly',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ImagePromptly',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/image-prompt/${prompt.slug}`,
    },
    keywords: prompt.tags.join(', '),
    articleSection: prompt.category,
  };
}

export function generateImageObjectSchema(imageUrl: string, alt: string, width: number = 1024, height: number = 1024) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`,
    width,
    height,
    caption: alt,
    contentUrl: imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`,
  };
}

export function generateAggregateRatingSchema(rating: number, ratingCount: number = 1) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: rating.toFixed(1),
    bestRating: '5',
    worstRating: '1',
    ratingCount: ratingCount,
  };
}

export function generateHowToSchema(prompt: {
  title: string;
  description: string;
  thumbnails?: string[];
  thumbnail?: string | { before: string; after: string };
  prompt: string;
}) {
  const steps = [
    {
      '@type': 'HowToStep',
      name: 'Open ChatGPT',
      text: 'Navigate to ChatGPT and ensure you have access to DALL-E 3 image generation',
    },
    {
      '@type': 'HowToStep', 
      name: 'Copy the Prompt',
      text: `Copy this prompt: "${prompt.prompt}"`,
    },
    {
      '@type': 'HowToStep',
      name: 'Paste and Customize',
      text: 'Paste the prompt into ChatGPT and customize any parameters as needed',
    },
    {
      '@type': 'HowToStep',
      name: 'Upload Your Image',
      text: 'Upload the image you want to transform when prompted',
    },
    {
      '@type': 'HowToStep',
      name: 'Generate Results',
      text: 'Wait for ChatGPT to process and generate your transformed image',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use the ${prompt.title} Prompt`,
    description: `Learn how to transform your images using the ${prompt.title} prompt with ChatGPT and DALL-E 3`,
    image: prompt.thumbnails?.[0] ? `${SITE_URL}${prompt.thumbnails[0]}` : undefined,
    totalTime: 'PT2M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'ChatGPT Plus or Team subscription',
      },
      {
        '@type': 'HowToSupply',
        name: 'An image to transform',
      },
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'ChatGPT with DALL-E 3',
      },
    ],
    step: steps,
  };
}

export function generateCollectionPageSchema(category: string, prompts: Array<{
  title: string;
  slug: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category} Prompts`,
    description: `Browse our collection of ${category} image transformation prompts for ChatGPT`,
    url: `${SITE_URL}/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
    numberOfItems: prompts.length,
    hasPart: prompts.map(prompt => ({
      '@type': 'CreativeWork',
      name: prompt.title,
      url: `${SITE_URL}/image-prompt/${prompt.slug}`,
    })),
  };
}