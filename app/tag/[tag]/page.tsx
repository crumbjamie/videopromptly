import { getAllTags, getPromptsByTag } from '@/lib/database';
import HomePageClient from '@/app/components/HomePageClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

function formatTagName(tag: string): string {
  return tag.replace(/-/g, ' ');
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const tagName = formatTagName(decodeURIComponent(tag));
  
  return {
    title: `${tagName} AI Video Prompts | VideoPromptly`,
    description: `Explore AI video generation prompts tagged with ${tagName}. Find creative prompts for ${tagName} video effects and styles.`,
    openGraph: {
      title: `${tagName} AI Video Prompts`,
      description: `Explore AI video generation prompts tagged with ${tagName}.`,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag.name.toLowerCase().replace(/\s+/g, '-')),
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const tagSlug = decodeURIComponent(tag);
  const tagName = formatTagName(tagSlug);
  
  // Get all tags to verify this one exists
  const allTags = await getAllTags();
  const tagExists = allTags.some(t => t.name.toLowerCase() === tagName.toLowerCase());
  
  if (!tagExists) {
    notFound();
  }
  
  const prompts = await getPromptsByTag(tagName);
  const allCategories = Array.from(new Set(prompts.map(p => p.category))).sort();
  
  return (
    <>
      <HomePageClient 
        initialPrompts={prompts}
        allCategories={allCategories}
        initialSearch=""
        initialTag={tagName}
      />
      
      {/* SEO Content */}
      <div className="bg-stone-950 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-stone-900 rounded-lg p-8 border border-stone-800">
              <h2 className="text-2xl font-semibold text-white mb-4">
                {tagName} Video Prompts
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-stone-300 mb-4">
                  Discover our collection of {prompts.length} AI video generation prompts tagged with &quot;{tagName}&quot;. 
                  These prompts are designed to help you create stunning {tagName} video effects and styles using AI video generation tools.
                </p>
                
                {prompts.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                      What You&apos;ll Find
                    </h3>
                    <p className="text-stone-300">
                      Our {tagName} video prompts cover a variety of categories including {allCategories.slice(0, 3).join(', ')}
                      {allCategories.length > 3 && ` and ${allCategories.length - 3} more`}. 
                      Each prompt is carefully crafted to produce consistent, high-quality video results.
                    </p>
                  </>
                )}
                
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                  How to Use These Prompts
                </h3>
                <ol className="text-stone-300 space-y-2 list-decimal list-inside">
                  <li>Browse through the {tagName} video prompts above</li>
                  <li>Click on any prompt to see the full details and example</li>
                  <li>Copy the prompt and customize it for your video concept</li>
                  <li>Use with Veo3, Kling AI, or other AI video generation tools</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}