export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ImagePromptly',
  alternateName: 'Image Promptly - ChatGPT Image Prompts',
  url: 'https://imagepromptly.com',
  description: 'Discover and copy effective image prompts for ChatGPT. Transform photos into amazing art styles and creative effects.',
  publisher: {
    '@type': 'Organization',
    name: 'ImagePromptly',
    logo: {
      '@type': 'ImageObject',
      url: 'https://imagepromptly.com/images/logo.png',
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://imagepromptly.com/?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ImagePromptly',
  url: 'https://imagepromptly.com',
  logo: 'https://imagepromptly.com/images/logo.png',
  description: 'Leading provider of curated AI image transformation prompts for ChatGPT and DALL-E',
  sameAs: [
    'https://twitter.com/imagepromptly',
    'https://github.com/imagepromptly',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@imagepromptly.com',
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
  name: 'How to Use ImagePromptly Prompts with ChatGPT',
  description: 'Step-by-step guide to transform your images using ImagePromptly prompts with ChatGPT',
  image: 'https://imagepromptly.com/images/how-to-guide.jpg',
  totalTime: 'PT5M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0',
  },
  supply: [
    {
      '@type': 'HowToSupply',
      name: 'ChatGPT Plus subscription',
    },
    {
      '@type': 'HowToSupply',
      name: 'Your image to transform',
    },
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'ChatGPT with DALL-E integration',
    },
  ],
  step: [
    {
      '@type': 'HowToStep',
      text: 'Browse ImagePromptly to find a prompt that matches your desired transformation',
      name: 'Find a prompt',
    },
    {
      '@type': 'HowToStep',
      text: 'Click the Copy button to copy the prompt to your clipboard',
      name: 'Copy the prompt',
    },
    {
      '@type': 'HowToStep',
      text: 'Open ChatGPT and start a new conversation',
      name: 'Open ChatGPT',
    },
    {
      '@type': 'HowToStep',
      text: 'Upload your image to ChatGPT using the attachment button',
      name: 'Upload your image',
    },
    {
      '@type': 'HowToStep',
      text: 'Paste the prompt and send it to ChatGPT',
      name: 'Send the prompt',
    },
    {
      '@type': 'HowToStep',
      text: 'ChatGPT will transform your image based on the prompt',
      name: 'Get your transformed image',
    },
  ],
});

export const generatePromptSchema = (prompt: {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  thumbnail?: string | { before: string; after: string };
  slug: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: prompt.title,
  description: prompt.description,
  url: `https://imagepromptly.com/image-prompt/${prompt.slug}`,
  genre: prompt.category,
  keywords: prompt.tags.join(', '),
  difficulty: prompt.difficulty,
  thumbnailUrl: prompt.thumbnail && typeof prompt.thumbnail === 'object' && 'after' in prompt.thumbnail
    ? `https://imagepromptly.com/thumbnails/${prompt.thumbnail.after}`
    : typeof prompt.thumbnail === 'string'
    ? `https://imagepromptly.com/thumbnails/${prompt.thumbnail}`
    : undefined,
  author: {
    '@type': 'Organization',
    name: 'ImagePromptly',
  },
  provider: {
    '@type': 'Organization',
    name: 'ImagePromptly',
  },
  educationalLevel: prompt.difficulty,
  learningResourceType: 'Prompt Template',
  isAccessibleForFree: true,
});

export const generateCollectionSchema = (category: string, prompts: Array<{ title: string; description: string; slug: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `${category} Prompts`,
  description: `Browse our collection of ${category.toLowerCase()} image transformation prompts for ChatGPT`,
  url: `https://imagepromptly.com/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
  numberOfItems: prompts.length,
  hasPart: prompts.map(prompt => ({
    '@type': 'CreativeWork',
    name: prompt.title,
    url: `https://imagepromptly.com/image-prompt/${prompt.slug}`,
  })),
});