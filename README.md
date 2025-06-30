# ChatGPT Image Prompts

A modern, responsive website for discovering and copying effective image prompts for ChatGPT. Transform your photos into toys, art styles, and creative effects with our curated collection.

## Features

- 🎨 **20+ Curated Prompts** - High-quality prompts across multiple categories
- 🔍 **Real-time Search** - Find prompts instantly by title, description, or tags
- 🏷️ **Tag Filtering** - Filter prompts by specific tags
- 📱 **Responsive Design** - Works beautifully on all devices
- 🌗 **Dark Mode** - Toggle between light and dark themes
- 📋 **One-Click Copy** - Copy prompts instantly to clipboard
- 🚀 **ChatGPT Integration** - Open prompts directly in ChatGPT
- 🔎 **SEO Optimized** - Individual pages for each prompt with proper meta tags
- ⚡ **Fast Performance** - Built with Next.js 14 and optimized for speed

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Chakra UI
- **Language**: TypeScript
- **Styling**: Chakra UI design system
- **Database**: JSON data store (ready for Vercel Postgres)
- **Deployment**: Vercel

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chatgpt-image-prompts.git
   cd chatgpt-image-prompts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── api/              # API routes
├── components/       # Reusable components
├── image-prompt/     # Dynamic prompt pages
├── layout.tsx        # Root layout
├── page.tsx         # Homepage
├── providers.tsx    # Chakra UI provider
├── robots.ts        # Robots.txt
└── sitemap.ts       # Dynamic sitemap

lib/
├── database/        # Database schema and data
├── database.ts      # Database utilities
├── types.ts         # TypeScript types
└── utils.ts         # Helper functions
```

## Deployment

The project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy with default settings

## Future Enhancements

- User authentication and favorites
- User-submitted prompts
- Prompt ratings and reviews
- Advanced filtering options
- Preview images for prompts
- Social sharing features

## License

MIT License - feel free to use this project for your own purposes.