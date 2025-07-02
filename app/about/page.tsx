import { Metadata } from 'next';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about ImagePromptly and how we help you transform images with ChatGPT prompts.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-950 pt-14">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mt-16 mb-12">
            <h1 className="text-4xl font-bold text-white mb-8">About ImagePromptly</h1>
            
            <div className="prose prose-invert max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">Welcome to ImagePromptly 😱</h2>
                <p className="text-stone-300 mb-6 leading-relaxed">
                  ImagePromptly is your ultimate resource for discovering and using effective image transformation prompts with ChatGPT. 
                  We've curated a comprehensive collection of prompts that help you transform ordinary photos into extraordinary 
                  artistic creations, from Pixar-style animations to vintage film aesthetics.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">What We Do</h2>
                <p className="text-stone-300 mb-4 leading-relaxed">
                  We provide carefully crafted prompts that work seamlessly with ChatGPT's image generation capabilities. 
                  Our prompts are:
                </p>
                <ul className="list-disc list-inside text-stone-300 space-y-2 mb-6">
                  <li>Tested and optimized for best results</li>
                  <li>Organized by category and difficulty level</li>
                  <li>Easy to copy and customize</li>
                  <li>Regularly updated with new creative styles</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
                <ol className="list-decimal list-inside text-stone-300 space-y-3">
                  <li>Browse our collection of image transformation prompts</li>
                  <li>Find a style that matches your creative vision</li>
                  <li>Copy the prompt or open it directly in ChatGPT</li>
                  <li>Upload your image to ChatGPT</li>
                  <li>Watch as your photo is transformed into amazing art!</li>
                </ol>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">Our Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-stone-300">
                  <div>
                    <h3 className="font-semibold text-white mb-2">🎨 Artistic Styles</h3>
                    <p>Transform photos into various art movements and techniques</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">🎬 Cinematic Effects</h3>
                    <p>Create movie-quality scenes and dramatic atmospheres</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">🧸 Toy Transformations</h3>
                    <p>Turn subjects into collectible figures and playful characters</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">✨ Creative Effects</h3>
                    <p>Apply unique and imaginative transformations</p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">Why ImagePromptly?</h2>
                <p className="text-stone-300 mb-4 leading-relaxed">
                  We understand that crafting the perfect prompt can be challenging. That's why we've done the hard work 
                  for you. Our prompts are:
                </p>
                <ul className="list-disc list-inside text-stone-300 space-y-2">
                  <li><strong className="text-white">Precise:</strong> Each prompt includes specific details for consistent results</li>
                  <li><strong className="text-white">Versatile:</strong> Works with any type of photo or subject</li>
                  <li><strong className="text-white">Creative:</strong> Explore styles you might never have imagined</li>
                  <li><strong className="text-white">Free:</strong> Access our entire collection at no cost</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">Get Started</h2>
                <p className="text-stone-300 mb-6 leading-relaxed">
                  Ready to transform your photos? Head back to our <a href="/" className="text-blue-400 hover:text-blue-300">homepage</a> and 
                  start exploring our collection. Each prompt includes example transformations to help you visualize the results.
                </p>
                <p className="text-stone-300 leading-relaxed">
                  Remember, the key to great results is experimenting with different prompts and finding the styles that 
                  resonate with your creative vision. Happy transforming! 🎨
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}