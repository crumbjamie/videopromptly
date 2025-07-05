import { getAllPrompts } from '@/lib/database';
import { SITE_URL } from '@/lib/seo';

export default async function generateImageSitemap() {
  const prompts = await getAllPrompts();
  
  const imageEntries = prompts
    .filter(prompt => prompt.thumbnail || (prompt.thumbnails && prompt.thumbnails.length > 0))
    .map(prompt => {
      const images = [];
      
      // Handle single thumbnail
      if (prompt.thumbnail) {
        const thumbnailPath = typeof prompt.thumbnail === 'string' 
          ? prompt.thumbnail 
          : prompt.thumbnail.after;
          
        images.push({
          loc: `${SITE_URL}/image-prompt/${prompt.slug}`,
          image: {
            loc: `${SITE_URL}/thumbnails/${thumbnailPath}`,
            title: `${prompt.title} - After transformation`,
            caption: prompt.description,
          }
        });
        
        // Add before image if available
        if (typeof prompt.thumbnail === 'object' && prompt.thumbnail.before) {
          images.push({
            loc: `${SITE_URL}/image-prompt/${prompt.slug}`,
            image: {
              loc: `${SITE_URL}/thumbnails/${prompt.thumbnail.before}`,
              title: `${prompt.title} - Before transformation`,
              caption: `Original image before ${prompt.title} transformation`,
            }
          });
        }
      }
      
      // Handle multiple thumbnails
      if (prompt.thumbnails && Array.isArray(prompt.thumbnails)) {
        prompt.thumbnails.forEach((thumb, index) => {
          images.push({
            loc: `${SITE_URL}/image-prompt/${prompt.slug}`,
            image: {
              loc: thumb.startsWith('http') ? thumb : `${SITE_URL}${thumb}`,
              title: `${prompt.title} - Example ${index + 1}`,
              caption: prompt.description,
            }
          });
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