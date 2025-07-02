import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-stone-950 border-t border-stone-800 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-white font-semibold mb-3">ImagePromptly 😱</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Discover and copy effective image prompts for ChatGPT. Transform your photos 
                into amazing art styles and creative effects.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-stone-400 hover:text-white hover:underline text-sm transition-colors">
                    Browse Prompts
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
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="border-t border-stone-800 pt-8 mb-6">
            <h4 className="text-white font-semibold mb-3">Disclaimer</h4>
            <p className="text-stone-500 text-xs leading-relaxed mb-4">
              ImagePromptly provides prompt suggestions for use with ChatGPT and other AI image generation tools. 
              We do not store, process, or have access to any images you upload to ChatGPT or other services. 
              All image processing occurs directly between you and the AI service you choose to use.
            </p>
            <p className="text-stone-500 text-xs leading-relaxed mb-4">
              <strong className="text-stone-400">Privacy & Image Usage:</strong> We never collect, store, or have access to your images. 
              When you use our prompts with ChatGPT, your images are processed according to OpenAI&apos;s privacy policy 
              and terms of service. We recommend reviewing their policies before uploading any images.
            </p>
            <p className="text-stone-500 text-xs leading-relaxed">
              <strong className="text-stone-400">Limitation of Liability:</strong> ImagePromptly is not responsible for the results generated 
              by AI services, any misuse of the prompts, or any issues arising from the use of third-party AI platforms. 
              Users are responsible for ensuring they have the right to use and modify any images they upload, and for 
              complying with all applicable laws and the terms of service of the AI platforms they use.
            </p>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-stone-800 pt-6 text-center">
            <p className="text-stone-500 text-sm">
              © {currentYear} ImagePromptly. All rights reserved. | Transform your photos with AI-powered creativity.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}