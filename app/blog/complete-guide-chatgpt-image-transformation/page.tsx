import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/app/components/Header';
import { getCanonicalUrl, generateArticleSchema } from '@/lib/seo';
import Script from 'next/script';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import CopyButton from '@/app/components/CopyButton';

export const metadata: Metadata = {
  title: 'The Complete Guide to ChatGPT Image Transformation - ImagePromptly',
  description: 'Learn everything about transforming images with ChatGPT and DALL-E 3. Step-by-step guide with examples, tips, and best practices for AI image generation.',
  keywords: 'ChatGPT image transformation, DALL-E 3 guide, AI image generation tutorial, ChatGPT photo editing, image prompt guide',
  alternates: {
    canonical: getCanonicalUrl('/blog/complete-guide-chatgpt-image-transformation'),
  },
  openGraph: {
    title: 'Complete Guide to ChatGPT Image Transformation',
    description: 'Master AI image transformation with ChatGPT and DALL-E 3. Comprehensive guide with examples.',
    type: 'article',
    publishedTime: '2024-01-15T00:00:00Z',
    authors: ['ImagePromptly Team'],
  },
};

const articleData = {
  title: 'The Complete Guide to ChatGPT Image Transformation',
  description: 'Everything you need to know about transforming images with ChatGPT and DALL-E 3',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  slug: 'complete-guide-chatgpt-image-transformation',
};

export default function BlogPost() {
  const articleSchema = generateArticleSchema(articleData);

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Link */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Complete Guide to ChatGPT Image Transformation
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                January 15, 2024
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                10 min read
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                ImagePromptly Team
              </span>
            </div>
            <p className="text-xl text-white">
              Master the art of transforming images with ChatGPT and DALL-E 3. This comprehensive guide covers everything from basic concepts to advanced techniques.
            </p>
          </header>

          {/* Table of Contents */}
          <nav className="bg-stone-900 rounded-lg p-6 mb-12 border border-stone-800">
            <h2 className="text-xl font-semibold text-white mb-4">Table of Contents</h2>
            <ol className="space-y-2 text-stone-300">
              <li><a href="#introduction" className="hover:text-blue-400 transition-colors">1. Introduction to AI Image Transformation</a></li>
              <li><a href="#getting-started" className="hover:text-blue-400 transition-colors">2. Getting Started with ChatGPT</a></li>
              <li><a href="#basic-prompts" className="hover:text-blue-400 transition-colors">3. Basic Image Prompts</a></li>
              <li><a href="#advanced-techniques" className="hover:text-blue-400 transition-colors">4. Advanced Techniques</a></li>
              <li><a href="#best-practices" className="hover:text-blue-400 transition-colors">5. Best Practices</a></li>
              <li><a href="#troubleshooting" className="hover:text-blue-400 transition-colors">6. Troubleshooting Common Issues</a></li>
              <li><a href="#conclusion" className="hover:text-blue-400 transition-colors">7. Conclusion</a></li>
            </ol>
          </nav>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            <section id="introduction" className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">1. Introduction to AI Image Transformation</h2>
              <p className="text-stone-300 mb-4">
                AI image transformation has revolutionized how we edit and create visual content. With ChatGPT&apos;s integration of DALL-E 3, 
                anyone can transform ordinary photos into extraordinary works of art using simple text prompts.
              </p>
              <p className="text-stone-300 mb-4">
                Unlike traditional photo editing that requires technical skills and expensive software, AI transformation is accessible to everyone. 
                You simply describe what you want, and the AI handles the complex work of reimagining your image.
              </p>
            </section>

            <section id="getting-started" className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">2. Getting Started with ChatGPT</h2>
              <h3 className="text-2xl font-semibold text-white mb-3">Requirements</h3>
              <ul className="list-disc list-inside text-stone-300 mb-4 space-y-2">
                <li>ChatGPT Plus or Team subscription (for DALL-E 3 access)</li>
                <li>An image you want to transform</li>
                <li>A clear idea of your desired outcome</li>
              </ul>

              <h3 className="text-2xl font-semibold text-white mb-3">Step-by-Step Process</h3>
              <ol className="list-decimal list-inside text-stone-300 space-y-3 mb-6">
                <li><strong>Open ChatGPT:</strong> Navigate to chat.openai.com and start a new conversation</li>
                <li><strong>Upload Your Image:</strong> Click the image icon and select your photo</li>
                <li><strong>Enter Your Prompt:</strong> Describe the transformation you want</li>
                <li><strong>Review and Refine:</strong> Examine the results and adjust your prompt if needed</li>
              </ol>
            </section>

            <section id="basic-prompts" className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">3. Basic Image Prompts</h2>
              <p className="text-stone-300 mb-4">
                The key to successful image transformation is crafting effective prompts. Here are some proven examples:
              </p>

              <div className="bg-stone-900 rounded-lg p-6 mb-6 border border-stone-800">
                <h4 className="text-lg font-semibold text-white mb-2">Style Transformation</h4>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-stone-300 italic flex-1">
                    &quot;Transform this photo into a vibrant anime style with big expressive eyes and colorful hair&quot;
                  </p>
                  <CopyButton 
                    text="Transform this photo into a vibrant anime style with big expressive eyes and colorful hair"
                    className="flex-shrink-0"
                  />
                </div>
              </div>

              <div className="bg-stone-900 rounded-lg p-6 mb-6 border border-stone-800">
                <h4 className="text-lg font-semibold text-white mb-2">Artistic Effects</h4>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-stone-300 italic flex-1">
                    &quot;Apply a Van Gogh painting style with swirling brushstrokes and vibrant colors&quot;
                  </p>
                  <CopyButton 
                    text="Apply a Van Gogh painting style with swirling brushstrokes and vibrant colors"
                    className="flex-shrink-0"
                  />
                </div>
              </div>

              <div className="bg-stone-900 rounded-lg p-6 mb-6 border border-stone-800">
                <h4 className="text-lg font-semibold text-white mb-2">Object Transformation</h4>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-stone-300 italic flex-1">
                    &quot;Turn the subject into a LEGO minifigure while maintaining their distinctive features&quot;
                  </p>
                  <CopyButton 
                    text="Turn the subject into a LEGO minifigure while maintaining their distinctive features"
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            </section>

            <section id="advanced-techniques" className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">4. Advanced Techniques</h2>
              
              <h3 className="text-2xl font-semibold text-white mb-3">Combining Multiple Styles</h3>
              <p className="text-stone-300 mb-4">
                You can create unique effects by combining different artistic styles:
              </p>
              <div className="bg-stone-900 rounded-lg p-6 mb-6 border border-stone-800">
                <p className="text-stone-300 italic">
                  &quot;Blend cyberpunk aesthetics with traditional Japanese art, featuring neon colors and geometric patterns&quot;
                </p>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">Maintaining Subject Identity</h3>
              <p className="text-stone-300 mb-4">
                To keep the subject recognizable while applying dramatic transformations:
              </p>
              <ul className="list-disc list-inside text-stone-300 mb-4 space-y-2">
                <li>Use phrases like &quot;while maintaining facial features&quot;</li>
                <li>Specify &quot;keep the same pose and expression&quot;</li>
                <li>Add &quot;preserve the original composition&quot;</li>
              </ul>

              <h3 className="text-2xl font-semibold text-white mb-3">Environmental Changes</h3>
              <p className="text-stone-300 mb-4">
                Transform not just the subject but their entire environment:
              </p>
              <div className="bg-stone-900 rounded-lg p-6 mb-6 border border-stone-800">
                <p className="text-stone-300 italic">
                  &quot;Place the subject in a futuristic Mars colony with dome structures and red landscape&quot;
                </p>
              </div>
            </section>

            <section id="best-practices" className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">5. Best Practices</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                  <h4 className="text-lg font-semibold text-white mb-3">✅ Do&apos;s</h4>
                  <ul className="space-y-2 text-stone-300">
                    <li>• Be specific about desired outcomes</li>
                    <li>• Use descriptive adjectives</li>
                    <li>• Reference known art styles</li>
                    <li>• Iterate and refine prompts</li>
                    <li>• Save successful prompts</li>
                  </ul>
                </div>
                
                <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                  <h4 className="text-lg font-semibold text-white mb-3">❌ Don&apos;ts</h4>
                  <ul className="space-y-2 text-stone-300">
                    <li>• Avoid vague descriptions</li>
                    <li>• Don&apos;t use copyrighted characters</li>
                    <li>• Avoid inappropriate content</li>
                    <li>• Don&apos;t expect perfect first results</li>
                    <li>• Avoid overly complex prompts</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="troubleshooting" className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">6. Troubleshooting Common Issues</h2>
              
              <div className="space-y-4">
                <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                  <h4 className="text-lg font-semibold text-white mb-2">Issue: Image looks nothing like the original</h4>
                  <p className="text-stone-300">
                    <strong>Solution:</strong> Add &quot;maintain the original subject&apos;s features&quot; or &quot;keep the same person/object&quot; to your prompt.
                  </p>
                </div>
                
                <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                  <h4 className="text-lg font-semibold text-white mb-2">Issue: Style not applying correctly</h4>
                  <p className="text-stone-300">
                    <strong>Solution:</strong> Be more specific about the style. Instead of &quot;anime style,&quot; try &quot;Studio Ghibli anime style with soft colors and detailed backgrounds.&quot;
                  </p>
                </div>
                
                <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                  <h4 className="text-lg font-semibold text-white mb-2">Issue: ChatGPT refuses to process image</h4>
                  <p className="text-stone-300">
                    <strong>Solution:</strong> Ensure your image doesn&apos;t contain sensitive content. Try rephrasing your prompt to be more appropriate.
                  </p>
                </div>
              </div>
            </section>

            <section id="conclusion" className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">7. Conclusion</h2>
              <p className="text-stone-300 mb-4">
                AI image transformation with ChatGPT opens up endless creative possibilities. By understanding the basics and applying 
                the techniques in this guide, you can transform any photo into stunning artwork.
              </p>
              <p className="text-stone-300 mb-6">
                Remember that mastering AI image transformation is an iterative process. Each prompt you try teaches you something new 
                about how to communicate your vision to the AI.
              </p>
              
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-8 border border-blue-800/50">
                <h3 className="text-2xl font-semibold text-white mb-4">Ready to Start Transforming?</h3>
                <p className="text-stone-300 mb-4">
                  Explore our collection of proven prompts and start creating amazing AI art today.
                </p>
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Browse Image Prompts
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}