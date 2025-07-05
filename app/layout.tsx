import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import Script from "next/script";
import { generateWebsiteSchema, generateOrganizationSchema } from "@/lib/schema";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ImagePromptly.com'),
  title: {
    default: "ImagePromptly - Effective ChatGPT Image Prompts to Transform Photos into Art & Effects",
    template: "%s | ImagePromptly"
  },
  description: "Discover and copy effective image prompts for ChatGPT with ImagePromptly. Transform photos into toys, art styles, and creative effects with our curated collection.",
  keywords: ["ImagePromptly", "ChatGPT", "image prompts", "photo transformation", "AI art", "toy transformation", "artistic styles", "DALL-E", "AI image generation", "creative prompts"],
  authors: [{ name: "ImagePromptly" }],
  creator: "ImagePromptly",
  publisher: "ImagePromptly",
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
    title: "ImagePromptly - Effective ChatGPT Image Prompts",
    description: "Discover and copy effective image prompts for ChatGPT with ImagePromptly. Transform photos into toys, art styles, and creative effects.",
    url: "https://ImagePromptly.com",
    siteName: "ImagePromptly",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ImagePromptly - Discover and copy effective image prompts for ChatGPT",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ImagePromptly - Effective ChatGPT Image Prompts",
    description: "Transform photos with curated ChatGPT prompts on ImagePromptly",
    images: ["/images/og-image.jpg"],
    creator: "@imagepromptly",
  },
  alternates: {
    canonical: "https://ImagePromptly.com",
  },
  category: "technology",
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
        
        {/* SEO Verification Tags */}
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
        <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
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