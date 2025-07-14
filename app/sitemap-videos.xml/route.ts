import { getAllPrompts } from '@/lib/database';
import { SITE_URL } from '@/lib/seo';

// Generate video sitemap according to Google's video sitemap guidelines
// https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps

export async function GET() {
  const prompts = await getAllPrompts();
  const baseUrl = SITE_URL;
  
  const videoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${prompts.map(prompt => {
    const videoUrl = prompt.videoUrl?.startsWith('http') 
      ? prompt.videoUrl 
      : `${baseUrl}${prompt.videoUrl || `/videos/${prompt.slug}.mp4`}`;
    
    const thumbnailUrl = prompt.thumbnailUrl?.startsWith('http')
      ? prompt.thumbnailUrl
      : `${baseUrl}${prompt.thumbnailUrl || `/thumbnails/${prompt.slug}.jpg`}`;
    
    const pageUrl = `${baseUrl}/video-prompt/${prompt.slug}`;
    
    return `  <url>
    <loc>${pageUrl}</loc>
    <video:video>
      <video:thumbnail_loc>${thumbnailUrl}</video:thumbnail_loc>
      <video:title><![CDATA[${prompt.title}]]></video:title>
      <video:description><![CDATA[${prompt.description}]]></video:description>
      <video:content_loc>${videoUrl}</video:content_loc>
      <video:player_loc>${pageUrl}</video:player_loc>
      <video:duration>${prompt.duration || 8}</video:duration>
      <video:publication_date>${prompt.createdAt.toISOString()}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:restriction relationship="allow">US GB CA AU NZ IE</video:restriction>
      <video:platform relationship="allow">web mobile tv</video:platform>
      <video:requires_subscription>no</video:requires_subscription>
      <video:uploader info="${baseUrl}/about">VideoPromptly</video:uploader>
      <video:live>no</video:live>
      <video:tag>${prompt.category}</video:tag>
      ${prompt.tags.slice(0, 5).map(tag => `<video:tag>${tag}</video:tag>`).join('\n      ')}
      <video:category>${prompt.category}</video:category>
      <video:gallery_loc title="VideoPromptly AI Video Prompts">${baseUrl}</video:gallery_loc>
    </video:video>
  </url>`;
  }).join('\n')}
</urlset>`;

  return new Response(videoSitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}