import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import Script from "next/script";
import { generateWebsiteSchema, generateOrganizationSchema } from "@/lib/schema";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://videopromptly.com'),
  title: {
    default: "VideoPromptly - AI Video Generation Prompts for Veo3, Kling & AI Video Tools",
    template: "%s | VideoPromptly"
  },
  description: "Discover 250+ curated AI video generation prompts for Veo3, Kling AI, and other video tools. Create viral TikTok videos, cinematic scenes, and AI animations with our proven prompt collection.",
  keywords: [
    "VideoPromptly", "Veo3 prompts", "AI video generation", "video prompts", "Kling AI", 
    "TikTok video creation", "AI animation prompts", "viral video prompts", "cinematic AI video",
    "video AI tools", "Sora prompts", "RunwayML prompts", "AI video templates", "video content creation",
    "8-second videos", "short form video", "AI filmmaking", "video prompt engineering"
  ],
  authors: [{ name: "VideoPromptly Team" }],
  creator: "VideoPromptly",
  publisher: "VideoPromptly",
  applicationName: "VideoPromptly",
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
    title: "VideoPromptly - 250+ AI Video Generation Prompts | Veo3, Kling AI & More",
    description: "Create viral videos with our curated collection of 250+ AI video prompts. Perfect for Veo3, Kling AI, TikTok content, and cinematic scenes.",
    url: "https://videopromptly.com",
    siteName: "VideoPromptly",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og-video-prompts.jpg",
        width: 1200,
        height: 630,
        alt: "VideoPromptly - 250+ curated AI video generation prompts for Veo3, Kling AI and video tools",
      }
    ],
    videos: [
      {
        url: "/videos/demo-reel.mp4",
        width: 1920,
        height: 1080,
        type: "video/mp4"
      }
    ]
  },
  twitter: {
    card: "player",
    title: "VideoPromptly - AI Video Generation Prompts",
    description: "250+ curated video prompts for Veo3, Kling AI & TikTok creation",
    images: ["/images/og-video-prompts.jpg"],
    creator: "@videopromptly",
    players: [
      {
        playerUrl: "/videos/demo-reel.mp4",
        streamUrl: "/videos/demo-reel.mp4",
        width: 1920,
        height: 1080
      }
    ]
  },
  alternates: {
    canonical: "https://videopromptly.com",
    types: {
      "application/rss+xml": "https://videopromptly.com/feed.xml"
    }
  },
  category: "Entertainment",
  classification: "Video Creation Tools",
  other: {
    "video:duration": "8",
    "video:release_date": "2025-07-11",
    "article:section": "Video Creation",
    "article:tag": "AI Video, Veo3, Video Prompts",
    "og:video:type": "video/mp4",
    "og:video:width": "1920",
    "og:video:height": "1080"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😱</text></svg>" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-stone-950 text-white`}>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-52GWBKBZ');
            `,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-52GWBKBZ"
            height="0" width="0" style={{display:'none',visibility:'hidden'}} />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>
        
        <div className="min-h-screen flex flex-col">
          {children}
          <FAQ />
          <Footer />
        </div>
      </body>
    </html>
  );
}