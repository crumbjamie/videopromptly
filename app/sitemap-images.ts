import { getAllPrompts } from '@/lib/database';
import { SITE_URL } from '@/lib/seo';

export default async function generateImageSitemap() {
  const prompts = await getAllPrompts();
  
  const imageEntries = prompts
    .filter(prompt => prompt.thumbnailUrl || prompt.thumbnail)
    .map(prompt => {
      const images = [];
      
      // Handle video thumbnail
      if (prompt.thumbnailUrl) {
        images.push({
          loc: `${SITE_URL}/video-prompt/${prompt.slug}`,
          image: {
            loc: `${SITE_URL}${prompt.thumbnailUrl}`,
            title: `${prompt.title} - Video Thumbnail`,
            caption: prompt.description,
          }
        });
      }
      // Fallback to old thumbnail format if exists
      else if (prompt.thumbnail) {
        const thumbnailPath = typeof prompt.thumbnail === 'string' 
          ? prompt.thumbnail 
          : prompt.thumbnail.after;
          
        images.push({
          loc: `${SITE_URL}/video-prompt/${prompt.slug}`,
          image: {
            loc: `${SITE_URL}/thumbnails/${thumbnailPath}`,
            title: `${prompt.title} - Video Thumbnail`,
            caption: prompt.description,
          }
        });
      }
      
      return images;
    })
    .flat();

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <image:image>
      <image:loc>${entry.image.loc}</image:loc>
      <image:title>${escapeXml(entry.image.title)}</image:title>
      <image:caption>${escapeXml(entry.image.caption)}</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}