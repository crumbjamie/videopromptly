import { Metadata } from 'next';
import Link from 'next/link';
import Header from '../components/Header';
import UseCases from '../components/UseCases';
import Script from 'next/script';
import { generateHowToSchema, generateBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About ImagePromptly - Transform Your Photos with AI',
  description: 'Learn how ImagePromptly helps you transform photos with AI using curated ChatGPT prompts. Discover use cases, benefits, and how to get started.',
  alternates: {
    canonical: 'https://imagepromptly.com/about',
  },
};

export default function AboutPage() {
  const howToSchema = generateHowToSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://imagepromptly.com' },
    { name: 'About', url: 'https://imagepromptly.com/about' },
  ]);

  return (
    <>
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Header />
      <main id="main-content" className="min-h-screen bg-stone-950 pt-14">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Transform Your Photos with AI-Powered Creativity
            </h1>
            <p className="text-xl text-white leading-relaxed">
              ImagePromptly is your gateway to endless creative possibilities with ChatGPT and DALL-E
            </p>
          </header>

          {/* Introduction */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">What is ImagePromptly?</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white mb-4">
                ImagePromptly is a carefully curated collection of over 160+ image transformation prompts designed specifically for ChatGPT and DALL-E. We&apos;ve taken the guesswork out of AI image generation by providing tested, effective prompts that deliver stunning results every time.
              </p>
              <p className="text-lg text-white mb-4">
                Whether you&apos;re a professional looking to enhance your online presence, a content creator seeking unique visuals, or someone who simply loves experimenting with AI art, ImagePromptly provides the tools you need to transform ordinary photos into extraordinary creations.
              </p>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose ImagePromptly?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">🚀 Save Time & Effort</h3>
                <p className="text-white">
                  No more trial and error with prompts. Our tested formulas work consistently, saving you hours of experimentation.
                </p>
              </div>
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">🎨 Professional Quality</h3>
                <p className="text-white">
                  Each prompt is crafted to produce high-quality, professional-looking results suitable for any purpose.
                </p>
              </div>
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">📚 Organized Collection</h3>
                <p className="text-white">
                  Browse by category, difficulty, or style to find exactly what you need quickly and efficiently.
                </p>
              </div>
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">💡 Learn & Improve</h3>
                <p className="text-white">
                  Understand prompt engineering by studying our examples and modifying them for your needs.
                </p>
              </div>
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">🆓 Completely Free</h3>
                <p className="text-white">
                  Access our entire collection without any subscriptions, sign-ups, or hidden fees.
                </p>
              </div>
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">🔄 Regular Updates</h3>
                <p className="text-white">
                  We continuously add new prompts based on trends, user feedback, and AI advancements.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">1</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Browse Our Collection</h3>
                  <p className="text-white">Explore prompts by category or search for specific styles and effects.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">2</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Copy Your Chosen Prompt</h3>
                  <p className="text-white">Click the copy button to instantly copy any prompt to your clipboard.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">3</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Open ChatGPT</h3>
                  <p className="text-white">Start a new conversation in ChatGPT (Plus subscription required for image generation).</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">4</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Upload Your Image</h3>
                  <p className="text-white">Attach the photo you want to transform using ChatGPT&apos;s image upload feature.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">5</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Paste & Transform</h3>
                  <p className="text-white">Paste the prompt and watch as ChatGPT transforms your image into something amazing!</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Use Cases Section */}
          <UseCases />

          {/* CTA Section */}
          <section className="text-center py-12 bg-stone-900 rounded-lg border border-stone-800">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Photos?</h2>
            <p className="text-xl text-white mb-8">
              Start exploring our collection of 160+ prompts and unleash your creativity
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-8 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Browse Prompts
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </section>
        </article>
      </main>
    </>
  );
}