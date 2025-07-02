'use client';

interface ProtectedEmailProps {
  className?: string;
}

export default function ProtectedEmail({ className = '' }: ProtectedEmailProps) {
  // Email parts to prevent scraping
  const user = 'imagepromptly';
  const domain = 'gmail';
  const tld = 'com';
  
  const handleClick = () => {
    // Construct email and open mail client
    const email = `${user}@${domain}.${tld}`;
    window.location.href = `mailto:${email}`;
  };
  
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-100 text-stone-900 font-semibold rounded-lg transition-colors ${className}`}
      aria-label="Send us an email"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Email us
    </button>
  );
}