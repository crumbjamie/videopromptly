import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-stone-950 border-t border-stone-800 mt-16" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* About Section */}
            <section aria-labelledby="footer-about">
              <h3 id="footer-about" className="text-white font-semibold mb-3">VideoPromptly™ 🎬</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Discover and copy effective video prompts for Veo3 and AI video tools. Create 
                stunning videos with our curated prompt collection.
              </p>
            </section>
            
            {/* Quick Links */}
            <nav aria-labelledby="footer-nav">
              <h3 id="footer-nav" className="text-white font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2" role="list">
                <li>
                  <Link href="/" className="text-stone-400 hover:text-white hover:underline text-sm transition-colors">
                    Browse Video Prompts
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-stone-400 hover:text-white hover:underline text-sm transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-stone-400 hover:text-white hover:underline text-sm transition-colors">
                    Categories
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Disclaimer */}
          <section className="border-t border-stone-800 pt-8 mb-6" aria-labelledby="footer-disclaimer">
            <h4 id="footer-disclaimer" className="text-white font-semibold mb-3">Disclaimer</h4>
            <p className="text-stone-500 text-xs leading-relaxed mb-4">
              VideoPromptly provides prompt suggestions for use with Veo3 and other AI video generation tools. 
              We do not store, process, or have access to any videos you create or content you generate. 
              All video processing occurs directly between you and the AI service you choose to use.
            </p>
            <p className="text-stone-500 text-xs leading-relaxed mb-4">
              <strong className="text-stone-400">Privacy & Video Usage:</strong> We never collect, store, or have access to your videos. 
              When you use our prompts with Veo3 or other AI tools, your content is processed according to the respective service&apos;s privacy policy 
              and terms of service. We recommend reviewing their policies before creating any content.
            </p>
            <p className="text-stone-500 text-xs leading-relaxed">
              <strong className="text-stone-400">Limitation of Liability:</strong> VideoPromptly is not responsible for the results generated 
              by AI services, any misuse of the prompts, or any issues arising from the use of third-party AI platforms. 
              Users are responsible for ensuring they have the right to create and use any content they generate, and for 
              complying with all applicable laws and the terms of service of the AI platforms they use.
            </p>
          </section>
          
          {/* Copyright */}
          <div className="border-t border-stone-800 pt-6 text-center">
            <p className="text-stone-500 text-sm">
              © <time dateTime={`${currentYear}`}>{currentYear}</time> VideoPromptly™. All rights reserved. | Create stunning videos with AI-powered prompts.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}