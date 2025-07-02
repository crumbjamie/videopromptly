import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-stone-950 border-b border-stone-800 fixed top-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-white">
              ImagePromptly 😱
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/categories" className="text-stone-300 hover:text-white hover:underline focus:text-white focus:outline-none focus:underline transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-stone-300 hover:text-white hover:underline focus:text-white focus:outline-none focus:underline transition-colors">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}