'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-stone-950 border-b border-stone-800 fixed top-0 w-full z-50" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center space-x-2" aria-label="VideoPromptly Home">
            <span className="text-lg font-semibold text-white">
              VideoPromptly™ 🎬
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            <Link href="/" className="text-stone-300 hover:text-white hover:underline focus:text-white focus:outline-none focus:underline transition-colors">
              All Video Prompts
            </Link>
            <Link href="/categories" className="text-stone-300 hover:text-white hover:underline focus:text-white focus:outline-none focus:underline transition-colors">
              Categories
            </Link>
            <Link href="/tags" className="text-stone-300 hover:text-white hover:underline focus:text-white focus:outline-none focus:underline transition-colors">
              Tags
            </Link>
            <Link href="/blog" className="text-stone-300 hover:text-white hover:underline focus:text-white focus:outline-none focus:underline transition-colors">
              Guides
            </Link>
            <Link href="/about" className="text-stone-300 hover:text-white hover:underline focus:text-white focus:outline-none focus:underline transition-colors">
              About
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-stone-300 hover:text-white p-2"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile menu */}
        <nav 
          id="mobile-menu"
          className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} border-t border-stone-800`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="py-4 space-y-1">
            <Link 
              href="/" 
              className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Video Prompts
            </Link>
            <Link 
              href="/categories" 
              className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/tags" 
              className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tags
            </Link>
            <Link 
              href="/blog" 
              className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Guides
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}