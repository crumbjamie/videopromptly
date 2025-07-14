// SEO utility functions

export const SITE_URL = 'https://videopromptly.com';

// Breadcrumb schema generation
export function generateBreadcrumbSchema(items: Array<{ label: string; href?: string }>) {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.href && { item: `${SITE_URL}${item.href}` })
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };
}

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
      name: 'VideoPromptly',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'VideoPromptly',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/video-prompt/${prompt.slug}`,
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
      name: 'Open Veo3 or Video AI Tool',
      text: 'Navigate to Veo3 or your preferred AI video generation tool',
    },
    {
      '@type': 'HowToStep', 
      name: 'Copy the Prompt',
      text: `Copy this prompt: "${prompt.prompt}"`,
    },
    {
      '@type': 'HowToStep',
      name: 'Paste and Customize',
      text: 'Paste the prompt into the video generation tool and customize parameters like duration and resolution',
    },
    {
      '@type': 'HowToStep',
      name: 'Configure Settings',
      text: 'Set your desired video duration, aspect ratio, and quality settings',
    },
    {
      '@type': 'HowToStep',
      name: 'Generate Video',
      text: 'Wait for the AI tool to process and generate your video',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use the ${prompt.title} Video Prompt`,
    description: `Learn how to create videos using the ${prompt.title} prompt with Veo3 and AI video tools`,
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
        name: 'Access to Veo3 or AI video generation tool',
      },
      {
        '@type': 'HowToSupply',
        name: 'Video concept or idea',
      },
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Veo3 or compatible AI video tool',
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
    description: `Browse our collection of ${category} video generation prompts for Veo3 and AI video tools`,
    url: `${SITE_URL}/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
    numberOfItems: prompts.length,
    hasPart: prompts.map(prompt => ({
      '@type': 'CreativeWork',
      name: prompt.title,
      url: `${SITE_URL}/video-prompt/${prompt.slug}`,
    })),
  };
}