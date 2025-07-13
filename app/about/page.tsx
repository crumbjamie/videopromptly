import { Metadata } from 'next';
import Link from 'next/link';
import Header from '../components/Header';
import UseCases from '../components/UseCases';
import Script from 'next/script';
import { generateHowToSchema, generateBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About VideoPromptly - Create Videos with AI',
  description: 'Learn how VideoPromptly helps you create stunning videos with AI using curated Veo3 prompts. Discover use cases, benefits, and how to get started.',
  alternates: {
    canonical: 'https://videopromptly.com/about',
  },
};

export default function AboutPage() {
  const howToSchema = generateHowToSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://videopromptly.com' },
    { name: 'About', url: 'https://videopromptly.com/about' },
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
              Create Stunning Videos with AI-Powered Prompts
            </h1>
            <p className="text-xl text-white leading-relaxed">
              VideoPromptly is your gateway to endless creative possibilities with Veo3 and AI video generation
            </p>
          </header>

          {/* Introduction */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">What is VideoPromptly?</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white mb-4">
                VideoPromptly is a carefully curated collection of over 400+ video generation prompts designed specifically for Veo3 and other cutting-edge AI video tools. We&apos;ve taken the guesswork out of AI video creation by providing tested, effective prompts that deliver stunning 8-second videos every time.
              </p>
              <p className="text-lg text-white mb-4">
                Whether you&apos;re a content creator looking for viral video ideas, a marketer needing product demonstrations, or someone who loves experimenting with AI video generation, VideoPromptly provides the tools you need to bring your creative visions to life.
              </p>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose VideoPromptly?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">🎬 Save Time & Effort</h3>
                <p className="text-white">
                  No more trial and error with video prompts. Our tested formulas work consistently with Veo3, saving you hours of experimentation.
                </p>
              </div>
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">🎥 Professional Quality</h3>
                <p className="text-white">
                  Each prompt is crafted to produce cinematic, high-quality videos suitable for social media, marketing, and creative projects.
                </p>
              </div>
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">📚 Organized Collection</h3>
                <p className="text-white">
                  Browse by category, difficulty, or video style to find exactly what you need for your next viral video.
                </p>
              </div>
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">💡 Learn & Improve</h3>
                <p className="text-white">
                  Master video prompt engineering by studying our examples and adapting them for your creative vision.
                </p>
              </div>
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">🆓 Completely Free</h3>
                <p className="text-white">
                  Access our entire collection of 400+ video prompts without any subscriptions, sign-ups, or hidden fees.
                </p>
              </div>
              <div className="bg-stone-900 rounded-lg p-6 border border-stone-800">
                <h3 className="text-xl font-semibold text-white mb-3">🔄 Regular Updates</h3>
                <p className="text-white">
                  We continuously add new video prompts based on trending formats, platform updates, and AI video advancements.
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
                  <h3 className="font-semibold text-white mb-1">Browse Our Video Collection</h3>
                  <p className="text-white">Explore video prompts by category, style, or search for specific effects and scenes.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">2</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Copy Your Chosen Prompt</h3>
                  <p className="text-white">Click the copy button to instantly copy any video prompt to your clipboard.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">3</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Open Veo3 or Your AI Video Tool</h3>
                  <p className="text-white">Access Veo3 through Google AI Studio, or use your preferred AI video generation platform.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">4</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Paste & Configure</h3>
                  <p className="text-white">Paste the prompt and adjust settings like duration, aspect ratio, and quality as needed.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">5</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Generate & Download</h3>
                  <p className="text-white">Watch as AI creates your video and download the stunning result to share or use in your projects!</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Use Cases Section */}
          <UseCases />

          {/* CTA Section */}
          <section className="text-center py-12 bg-stone-900 rounded-lg border border-stone-800">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Amazing Videos?</h2>
            <p className="text-xl text-white mb-8">
              Start exploring our collection of 400+ video prompts and bring your ideas to life
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-8 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Browse Video Prompts
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