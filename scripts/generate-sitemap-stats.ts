import { getAllPrompts, getAllCategories, getAllTags } from '@/lib/database';
import { getAllBlogPosts } from '@/lib/blog';
import fs from 'fs/promises';
import path from 'path';

async function generateSitemapStats() {
  console.log('📊 Generating sitemap statistics...\n');
  
  const prompts = await getAllPrompts();
  const categories = await getAllCategories();
  const tags = await getAllTags();
  const blogPosts = await getAllBlogPosts();
  
  const stats = {
    timestamp: new Date().toISOString(),
    counts: {
      prompts: prompts.length,
      categories: categories.length,
      tags: tags.length,
      blogPosts: blogPosts.length,
      total: prompts.length + categories.length + tags.length + blogPosts.length + 6 // +6 for static pages
    },
    lastUpdated: {
      prompts: prompts.length > 0 ? 
        new Date(Math.max(...prompts.map(p => new Date(p.updatedAt).getTime()))).toISOString() : 
        null,
      blog: blogPosts.length > 0 ? 
        new Date(Math.max(...blogPosts.map(p => new Date(p.date).getTime()))).toISOString() : 
        null
    }
  };
  
  // Save stats to file
  const statsPath = path.join(process.cwd(), '.next', 'sitemap-stats.json');
  await fs.mkdir(path.dirname(statsPath), { recursive: true });
  await fs.writeFile(statsPath, JSON.stringify(stats, null, 2));
  
  console.log('📋 Sitemap Statistics:');
  console.log(`   Total URLs: ${stats.counts.total}`);
  console.log(`   - Static pages: 6`);
  console.log(`   - Prompts: ${stats.counts.prompts}`);
  console.log(`   - Categories: ${stats.counts.categories}`);
  console.log(`   - Tags: ${stats.counts.tags}`);
  console.log(`   - Blog posts: ${stats.counts.blogPosts}`);
  console.log('\n✅ Sitemap stats generated successfully!\n');
  
  return stats;
}

// Run if called directly
if (require.main === module) {
  generateSitemapStats().catch(console.error);
}

export default generateSitemapStats;