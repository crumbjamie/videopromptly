export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'VideoPromptly',
  alternateName: 'Video Promptly - AI Video Generation Prompts',
  url: 'https://videopromptly.com',
  description: 'Discover and copy effective video generation prompts for Veo3 and AI video tools. Create stunning videos with our curated AI prompts.',
  publisher: {
    '@type': 'Organization',
    name: 'VideoPromptly',
    logo: {
      '@type': 'ImageObject',
      url: 'https://videopromptly.com/images/logo.png',
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://videopromptly.com/?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VideoPromptly',
  url: 'https://videopromptly.com',
  logo: 'https://videopromptly.com/images/logo.png',
  description: 'Leading provider of curated AI video generation prompts for Veo3 and video AI tools',
  sameAs: [
    'https://twitter.com/videopromptly',
    'https://github.com/videopromptly',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@videopromptly.com',
  },
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const generateHowToSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Use VideoPromptly Prompts with Veo3',
  description: 'Step-by-step guide to create stunning videos using VideoPromptly prompts with Veo3 and AI video tools',
  image: 'https://videopromptly.com/images/how-to-guide.jpg',
  totalTime: 'PT10M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0',
  },
  supply: [
    {
      '@type': 'HowToSupply',
      name: 'Veo3 access or AI video tool',
    },
    {
      '@type': 'HowToSupply',
      name: 'Video concept or idea',
    },
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Veo3 or compatible AI video generation tool',
    },
  ],
  step: [
    {
      '@type': 'HowToStep',
      text: 'Browse VideoPromptly to find a prompt that matches your desired video style',
      name: 'Find a video prompt',
    },
    {
      '@type': 'HowToStep',
      text: 'Click the Copy button to copy the prompt to your clipboard',
      name: 'Copy the prompt',
    },
    {
      '@type': 'HowToStep',
      text: 'Open Veo3 or your preferred AI video generation tool',
      name: 'Open video tool',
    },
    {
      '@type': 'HowToStep',
      text: 'Paste the prompt into the video generation interface',
      name: 'Input the prompt',
    },
    {
      '@type': 'HowToStep',
      text: 'Adjust settings like duration, aspect ratio, and quality as needed',
      name: 'Configure settings',
    },
    {
      '@type': 'HowToStep',
      text: 'Generate your video and download the result',
      name: 'Generate and download video',
    },
  ],
});

export const generateVideoPromptSchema = (prompt: {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  resolution?: string;
  views?: string;
  rating?: number;
  slug: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: prompt.title,
  description: prompt.description,
  url: `https://videopromptly.com/video-prompt/${prompt.slug}`,
  contentUrl: prompt.videoUrl ? `https://videopromptly.com${prompt.videoUrl}` : undefined,
  thumbnailUrl: prompt.thumbnailUrl ? `https://videopromptly.com${prompt.thumbnailUrl}` : undefined,
  duration: prompt.duration ? `PT${prompt.duration}S` : 'PT8S',
  videoQuality: prompt.resolution || 'HD',
  genre: prompt.category,
  keywords: prompt.tags.join(', '),
  interactionStatistic: {
    '@type': 'InteractionCounter',
    interactionType: 'https://schema.org/WatchAction',
    userInteractionCount: prompt.views ? parseInt(prompt.views.replace(/[^\d]/g, '')) || 0 : 0,
  },
  aggregateRating: prompt.rating ? {
    '@type': 'AggregateRating',
    ratingValue: prompt.rating,
    bestRating: 5,
    worstRating: 1,
    ratingCount: 1,
  } : undefined,
  author: {
    '@type': 'Organization',
    name: 'VideoPromptly',
  },
  provider: {
    '@type': 'Organization',
    name: 'VideoPromptly',
  },
  educationalLevel: prompt.difficulty,
  learningResourceType: 'Video Prompt Template',
  isAccessibleForFree: true,
  uploadDate: new Date().toISOString(),
});

export const generateVideoCollectionSchema = (category: string, prompts: Array<{ title: string; description: string; slug: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `${category} Video Prompts`,
  description: `Browse our collection of ${category.toLowerCase()} video generation prompts for Veo3 and AI video tools`,
  url: `https://videopromptly.com/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
  numberOfItems: prompts.length,
  hasPart: prompts.map(prompt => ({
    '@type': 'VideoObject',
    name: prompt.title,
    url: `https://videopromptly.com/video-prompt/${prompt.slug}`,
  })),
});