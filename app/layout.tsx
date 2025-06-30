import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://chatgpt-image-prompts.com'),
  title: {
    default: "ChatGPT Image Prompts - Transform Your Photos with AI",
    template: "%s | ChatGPT Image Prompts"
  },
  description: "Discover and copy effective image prompts for ChatGPT. Transform photos into toys, art styles, and creative effects with our curated collection.",
  keywords: ["ChatGPT", "image prompts", "photo transformation", "AI art", "toy transformation", "artistic styles", "DALL-E", "AI image generation", "creative prompts"],
  authors: [{ name: "ChatGPT Image Prompts" }],
  creator: "ChatGPT Image Prompts",
  publisher: "ChatGPT Image Prompts",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "ChatGPT Image Prompts - Transform Your Photos with AI",
    description: "Discover and copy effective image prompts for ChatGPT. Transform photos into toys, art styles, and creative effects.",
    url: "https://chatgpt-image-prompts.com",
    siteName: "ChatGPT Image Prompts",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ChatGPT Image Prompts",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatGPT Image Prompts",
    description: "Transform photos with curated ChatGPT prompts",
    images: ["/twitter-image.jpg"],
    creator: "@chatgptprompts",
  },
  alternates: {
    canonical: "https://chatgpt-image-prompts.com",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-stone-950 text-white`}>
        {children}
      </body>
    </html>
  );
}