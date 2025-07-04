# ImagePromptly - ChatGPT Image Prompts

A modern, responsive website for discovering and copying effective image prompts for ChatGPT. Transform your photos into amazing art styles and creative effects with our curated collection of 160+ prompts.

## Features

- 🎨 **160+ Curated Prompts** - High-quality prompts across 40 categories
- 🔍 **Real-time Search** - Find prompts instantly by title, description, or tags
- 🏷️ **Category & Tag Filtering** - Filter prompts by categories and tags
- 📱 **Responsive Design** - Works beautifully on all devices
- 🖼️ **Before/After Examples** - Visual examples of prompt transformations
- 📋 **One-Click Copy** - Copy prompts instantly to clipboard
- 🚀 **ChatGPT Integration** - Open prompts directly in ChatGPT
- 🔎 **SEO Optimized** - Individual pages for each prompt with proper meta tags
- ⚡ **Fast Performance** - Built with Next.js 15 and optimized for speed

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components**: Radix UI
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: JSON data store
- **Image Processing**: Sharp (development only)
- **Deployment**: Vercel

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/img-prompter.git
   cd img-prompter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   Create a `.env.local` file for OpenAI API key if you want to generate thumbnails:
   ```bash
   OPENAI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
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

## Image Generation Scripts

The project includes several scripts for managing thumbnails. These are development tools and are not part of the build process.

### Prerequisites
- Node.js with TypeScript support
- OpenAI API key (for thumbnail generation)
- Sharp dependency (automatically installed as devDependency)

### Available Scripts

1. **Generate thumbnails using OpenAI DALL-E**
   ```bash
   npm run generate:thumbnails
   ```
   Generates AI images for prompts that don't have thumbnails yet.

2. **Test thumbnail generation**
   ```bash
   npm run generate:test-thumbnail
   ```
   Tests the thumbnail generation with a single prompt.

3. **Generate square thumbnails**
   ```bash
   npx ts-node scripts/generate-square-thumbnails.ts
   ```
   Creates 400x400px square versions of existing thumbnails.

4. **Rename thumbnails (remove spaces)**
   ```bash
   cd public/thumbnails && bash ../../scripts/rename-thumbnails.sh
   ```
   Renames files to replace spaces with hyphens.

5. **Match thumbnails to prompts**
   ```bash
   node scripts/match-thumbnails.js
   ```
   Matches existing thumbnail files to prompts in the database.

6. **Find prompts without thumbnails**
   ```bash
   node scripts/find-prompts-without-thumbnails.js
   ```
   Lists all prompts that don't have thumbnail images.

7. **Find unmatched thumbnails**
   ```bash
   node scripts/find-unmatched-thumbnails.js
   ```
   Lists thumbnail files that aren't matched to any prompt.

### Image Processing Workflow

1. Place new images in `/public/thumbnails/`
2. Run the rename script to fix filenames
3. Run the square thumbnail generator
4. Run the match thumbnails script to update the database

## Deployment

The project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy with default settings

Note: The build process does not include image generation. All thumbnails should be pre-generated and committed to the repository.

## Adding New Prompts

1. **Edit the prompts database**
   ```bash
   lib/database/prompts.json
   ```

2. **Add a new prompt object**
   ```json
   {
     "id": "167",
     "slug": "your-prompt-slug",
     "title": "Your Prompt Title",
     "description": "Transform your images with this...",
     "prompt": "The actual prompt text with [subject] placeholder",
     "category": "Category Name",
     "categories": ["Category Name", "Additional Category"],
     "tags": ["tag1", "tag2"],
     "difficulty": "Intermediate",
     "createdAt": "2024-01-01T00:00:00.000Z",
     "updatedAt": "2024-01-01T00:00:00.000Z"
   }
   ```

3. **Add thumbnail images (optional)**
   - Add before/after images to `/public/thumbnails/`
   - Update the prompt with thumbnail references

## Future Enhancements

- User authentication and favorites
- User-submitted prompts
- Prompt ratings and reviews
- Advanced filtering options
- API endpoints for third-party integrations
- Social sharing features

## License

MIT License - feel free to use this project for your own purposes.