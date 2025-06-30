# Build Image Prompt Website - Complete Development Prompt

## Project Overview
You are tasked with building a modern, responsive image prompt website for ChatGPT users. This is a fun discovery platform where users can find and copy effective image prompts for photo manipulation and transformation.

## Tech Stack
- **Frontend**: React.js with Next.js 14+ (App Router)
- **Styling**: Chakra UI design system
- **Database**: Vercel Postgres (or Vercel KV for simplicity)
- **Hosting**: Vercel
- **Version Control**: GitHub

## Design System & Inspiration
- **Primary inspiration**: Use https://mcpservers.org/ layout and color scheme
- **Design system**: Chakra UI (chosen for lightweight, excellent TypeScript support, intuitive API, and rapid prototyping)
- **Responsive design**: Mobile-first approach with clean card layouts

## Core Features (MVP)

### 1. Homepage Layout
- **Hero section** with site description and search functionality
- **Search bar** for keyword searching through prompt titles and descriptions
- **Filter tags** below search (horizontal scrollable on mobile)
- **Responsive card grid** showing all prompts (3-4 columns desktop, 1-2 mobile)
- **Clean navigation** with logo and simple menu

### 2. Prompt Card Design
Each card should display:
- **Prompt title** (clear, descriptive)
- **Brief description** (2-3 lines)
- **Category tags** (small, colored badges)
- **Difficulty indicator** (Beginner/Intermediate/Advanced)
- **"View Prompt" button** (not modal - links to dedicated page)

### 3. Individual Prompt Pages (SEO-Optimized)
**URL Structure**: `/image-prompt/[prompt-slug]`
**Page inspiration**: https://cursor.directory/mcp/shortcut-1

Each prompt page must include:
- **Clean header** with breadcrumb navigation
- **Prompt title** as H1
- **Prompt description** explaining what it does
- **Category tags** and difficulty level
- **The complete prompt** in a code block with syntax highlighting
- **One-click copy button** with success feedback
- **"Open in ChatGPT" button** that opens ChatGPT with prompt pre-filled
- **Related prompts** section at bottom
- **Proper meta tags** for SEO (title, description, keywords)
- **Structured data** for rich snippets

### 4. Search & Filter Functionality
- **Real-time search** through prompt titles, descriptions, and tags
- **Tag filtering** with active state indicators
- **Combined search + filter** capability
- **Clear filters** option
- **Search results count**

## Data Structure

### Prompt Schema
```typescript
interface ImagePrompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: Date;
  updatedAt: Date;
}
```

### Initial Categories (with 3-5 prompts each)
1. **Toy Transformations**
   - Action Figure Conversion
   - Funko Pop Style
   - LEGO Minifigure
   - Bobblehead
   - Plush Doll

2. **Artistic Styles**
   - Studio Ghibli Animation
   - Pixar 3D Style
   - Watercolor Painting
   - Oil Portrait
   - Digital Art

3. **Photo Effects**
   - Cyberpunk Aesthetic
   - Vintage Film Look
   - HDR Enhancement
   - Black & White Classic
   - Fantasy Composite

4. **Character Styles**
   - Cartoon Avatar
   - Comic Book Hero
   - Renaissance Portrait
   - Manga Style
   - Caricature

## Sample Prompts (Following Best Practices)

### Action Figure Conversion
**Title**: "Action Figure Transformation"
**Description**: "Transform any photo into a realistic action figure with professional packaging"
**Category**: "Toy Transforms"
**Tags**: ["action-figure", "toy", "packaging", "collectible"]
**Difficulty**: "Beginner"
**Prompt**: 
```
Create a high-quality action figure based on the person in this photo. The figure should be positioned upright in realistic blister packaging with a cardboard backing. Style it like a premium collectible toy with:

- Detailed sculpting that captures the person's key features and clothing
- Accessories relevant to their style or profession in separate plastic bubbles
- Professional packaging design with the person's name prominently displayed
- Clean, modern package layout with product information
- Realistic plastic and cardboard textures
- Studio lighting that highlights the figure and packaging

The overall aesthetic should feel like a high-end collectible you'd find in a specialty toy store.
```

### Studio Ghibli Style
**Title**: "Studio Ghibli Animation Style"
**Description**: "Transform photos into magical Studio Ghibli-style illustrations"
**Category**: "Artistic Styles"
**Tags**: ["ghibli", "animation", "watercolor", "fantasy"]
**Difficulty**: "Intermediate"
**Prompt**:
```
Transform this photo into a Studio Ghibli-style illustration with these characteristics:

- Soft watercolor painting technique with visible brush textures
- Warm, dreamy color palette with gentle gradients
- Delicate linework that's expressive but not overly detailed
- Cozy, peaceful atmosphere with a touch of magic
- Add subtle fantasy elements like floating lights, magical plants, or ethereal particles
- Background should feel like a serene, otherworldly setting
- Maintain the essence of the original subject while enhancing with Ghibli's signature whimsical charm
- Soft, diffused lighting that creates a sense of wonder and tranquility

The final result should evoke the heartwarming, magical feeling characteristic of Studio Ghibli films.
```

## Technical Implementation Requirements

### 1. Next.js App Router Structure
```
app/
├── page.tsx (Homepage)
├── image-prompt/
│   └── [slug]/
│       └── page.tsx (Individual prompt page)
├── api/
│   ├── prompts/
│   │   └── route.ts
│   └── search/
│       └── route.ts
├── components/
│   ├── PromptCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterTags.tsx
│   └── CopyButton.tsx
└── lib/
    ├── database.ts
    └── utils.ts
```

### 2. SEO Optimization
- **Dynamic meta tags** for each prompt page
- **Structured data** (JSON-LD) for rich snippets
- **Sitemap generation** for all prompt pages
- **Proper heading hierarchy** (H1, H2, H3)
- **Alt text** for any images
- **Open Graph** and Twitter Card tags

### 3. Performance Requirements
- **Static generation** for prompt pages (ISR)
- **Optimized images** with Next.js Image component
- **Code splitting** for better loading
- **Lazy loading** for prompt cards
- **Search debouncing** (300ms delay)

### 4. User Experience
- **Responsive design** across all devices
- **Fast search** with instant results
- **Smooth animations** using Chakra UI
- **Copy feedback** with toast notifications
- **Loading states** for all async operations
- **Error boundaries** for graceful error handling

## ChatGPT Integration
- **Copy button** copies the exact prompt text
- **"Open in ChatGPT"** button uses ChatGPT's URL scheme to pre-fill the prompt
- **Clear instructions** on how to use prompts with uploaded photos

## Content Strategy
- **20-30 initial prompts** covering the main categories
- **Clear, descriptive titles** for SEO
- **Actionable descriptions** that explain the transformation
- **Consistent prompt structure** following the research-backed best practices
- **Varied difficulty levels** to cater to all users

## Development Approach
1. **Set up Next.js project** with Chakra UI
2. **Create database schema** and seed initial data
3. **Build homepage** with search and filter functionality
4. **Implement prompt cards** with responsive grid
5. **Create individual prompt pages** with SEO optimization
6. **Add search functionality** with real-time results
7. **Implement copy/ChatGPT integration**
8. **Add responsive design** and polish
9. **Test thoroughly** across devices and browsers
10. **Deploy to Vercel** with proper environment variables

## Success Metrics
- **Fast load times** (<3s for homepage)
- **Mobile-responsive** design
- **SEO-friendly** URLs and meta tags
- **Functional search** and filtering
- **Copy functionality** works reliably
- **Clean, modern design** matching inspiration site

## Future Considerations (V2-V4)
- Preview images/thumbnails for each prompt
- User-generated content submission system
- Advanced image generation integration
- User accounts and favorites
- Social sharing features

Your task is to build this complete, production-ready website that provides genuine value to users looking for effective ChatGPT image prompts. Focus on clean code, excellent user experience, and SEO optimization for organic discovery.