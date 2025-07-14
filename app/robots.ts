import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/*.json$',
          '/scripts/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/thumbnails/', '/images/'],
      },
    ],
    sitemap: [
      'https://videopromptly.com/sitemap-index.xml',
      'https://videopromptly.com/sitemap.xml',
      'https://videopromptly.com/sitemap-images.xml',
      'https://videopromptly.com/sitemap-videos.xml'
    ],
    host: 'https://videopromptly.com',
  };
}