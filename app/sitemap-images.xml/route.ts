import generateImageSitemap from '../sitemap-images';

export async function GET() {
  return generateImageSitemap();
}