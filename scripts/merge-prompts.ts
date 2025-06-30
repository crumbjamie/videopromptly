import fs from 'fs/promises';
import path from 'path';
// Using a local type definition since the JSON stores dates as strings
interface ImagePromptJSON {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  featured?: boolean;
  thumbnails?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ParsedPrompt {
  title: string;
  prompt: string;
  tags: string[];
}

// Category mapping based on prompt content and tags
function determineCategory(title: string, tags: string[]): string {
  const lowerTitle = title.toLowerCase();
  const lowerTags = tags.map(t => t.toLowerCase());
  
  // Check tags first
  if (lowerTags.some(tag => ['portrait', 'professional', 'photorealistic'].includes(tag))) {
    return 'Portrait Styles';
  }
  if (lowerTags.some(tag => ['anime', 'cartoon', 'pixar', 'ghibli', 'disney'].includes(tag))) {
    return 'Anime & animation';
  }
  if (lowerTags.some(tag => ['cyberpunk', 'sci-fi', 'futuristic', 'holographic'].includes(tag))) {
    return 'Sci-Fi & Cyberpunk';
  }
  if (lowerTags.some(tag => ['fantasy', 'magical', 'wizard', 'mythic'].includes(tag))) {
    return 'Fantasy & Mythology';
  }
  if (lowerTags.some(tag => ['artistic', 'watercolor', 'oil', 'sculpture', 'mosaic'].includes(tag))) {
    return 'Art Styles';
  }
  if (lowerTags.some(tag => ['action-figure', 'toy', 'lego', 'collectible', 'packaging'].includes(tag))) {
    return 'Product & Packaging';
  }
  if (lowerTags.some(tag => ['cinematic', 'noir', 'thriller', 'dramatic'].includes(tag))) {
    return 'Cinematic Styles';
  }
  if (lowerTags.some(tag => ['retro', 'vintage', '80s', '90s', 'nostalgia'].includes(tag))) {
    return 'Retro & Vintage';
  }
  if (lowerTags.some(tag => ['fashion', 'editorial', 'luxury'].includes(tag))) {
    return 'Fashion & Editorial';
  }
  if (lowerTags.some(tag => ['underwater', 'ocean', 'beach'].includes(tag))) {
    return 'Nature & Landscapes';
  }
  if (lowerTags.some(tag => ['urban', 'street', 'city'].includes(tag))) {
    return 'Urban & Street';
  }
  if (lowerTags.some(tag => ['tech', 'digital', 'glitch', 'hologram'].includes(tag))) {
    return 'Digital & Tech';
  }
  if (lowerTags.some(tag => ['surreal', 'dreamlike', 'psychedelic', 'abstract'].includes(tag))) {
    return 'Surreal & Abstract';
  }
  if (lowerTags.some(tag => ['gothic', 'horror', 'dark'].includes(tag))) {
    return 'Dark & Horror';
  }
  if (lowerTags.some(tag => ['gaming', 'pixel', 'arcade'].includes(tag))) {
    return 'Gaming & Pixel Art';
  }
  
  // Default category
  return 'Creative Effects';
}

function determineDifficulty(prompt: string): 'Beginner' | 'Intermediate' | 'Advanced' {
  const wordCount = prompt.split(' ').length;
  const hasComplexTerms = /ultra-realistic|hyper-detailed|8K|photorealistic|cinematography|subsurface scattering/i.test(prompt);
  const hasTechnicalTerms = /volumetric|bokeh|depth of field|rim lighting|three-point lighting/i.test(prompt);
  
  if (wordCount < 30 && !hasComplexTerms) return 'Beginner';
  if (wordCount > 50 || (hasComplexTerms && hasTechnicalTerms)) return 'Advanced';
  return 'Intermediate';
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

async function parseMarkdownFile(filePath: string): Promise<ParsedPrompt[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  const prompts: ParsedPrompt[] = [];
  
  const lines = content.split('\n');
  let currentTitle = '';
  let currentPrompt = '';
  let currentTags: string[] = [];
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Title detection
    if (line.startsWith('## ') && !inCodeBlock) {
      // Save previous prompt if exists
      if (currentTitle && currentPrompt) {
        prompts.push({
          title: currentTitle,
          prompt: currentPrompt.trim(),
          tags: currentTags
        });
      }
      
      currentTitle = line.substring(3).trim();
      currentPrompt = '';
      currentTags = [];
    }
    // Code block start
    else if (line === '```' && !inCodeBlock) {
      inCodeBlock = true;
    }
    // Code block end
    else if (line === '```' && inCodeBlock) {
      inCodeBlock = false;
    }
    // Prompt content
    else if (inCodeBlock && currentTitle) {
      currentPrompt += line + '\n';
    }
    // Tags line
    else if (line.startsWith('**Tags:**') && currentTitle) {
      const tagsLine = line.substring(9).trim();
      currentTags = tagsLine.split(',').map(tag => tag.trim());
    }
  }
  
  // Save last prompt
  if (currentTitle && currentPrompt) {
    prompts.push({
      title: currentTitle,
      prompt: currentPrompt.trim(),
      tags: currentTags
    });
  }
  
  return prompts;
}

async function mergePrompts() {
  console.log('Starting prompt merge process...\n');
  
  // Read existing prompts
  const existingPromptsPath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
  const existingData = JSON.parse(await fs.readFile(existingPromptsPath, 'utf-8'));
  const existingPrompts = existingData.prompts as ImagePromptJSON[];
  
  // Create a map of existing prompts by slug for duplicate detection
  const existingBySlug = new Map<string, ImagePromptJSON>();
  const existingByTitle = new Map<string, ImagePromptJSON>();
  
  existingPrompts.forEach(prompt => {
    existingBySlug.set(prompt.slug, prompt);
    existingByTitle.set(prompt.title.toLowerCase(), prompt);
  });
  
  // Parse new prompts from markdown
  const markdownPath = path.join(process.cwd(), 'chatgpt-prompts-collection.md');
  const newPrompts = await parseMarkdownFile(markdownPath);
  
  console.log(`Found ${newPrompts.length} prompts in markdown file`);
  console.log(`Existing database has ${existingPrompts.length} prompts\n`);
  
  // Process new prompts
  let added = 0;
  let skipped = 0;
  let updated = 0;
  
  for (const newPrompt of newPrompts) {
    const slug = createSlug(newPrompt.title);
    const existingByCurrentSlug = existingBySlug.get(slug);
    const existingByCurrentTitle = existingByTitle.get(newPrompt.title.toLowerCase());
    
    // Check if prompt already exists
    if (existingByCurrentSlug || existingByCurrentTitle) {
      // Update if the prompt text is different
      const existing = existingByCurrentSlug || existingByCurrentTitle!;
      if (existing.prompt !== newPrompt.prompt) {
        existing.prompt = newPrompt.prompt;
        existing.updatedAt = new Date().toISOString();
        updated++;
        console.log(`Updated: ${newPrompt.title}`);
      } else {
        skipped++;
      }
      continue;
    }
    
    // Create new prompt
    const category = determineCategory(newPrompt.title, newPrompt.tags);
    const difficulty = determineDifficulty(newPrompt.prompt);
    const description = `Transform your images with this ${newPrompt.title.toLowerCase()} prompt for stunning creative effects.`;
    
    const imagePrompt: ImagePromptJSON = {
      id: (existingPrompts.length + added + 1).toString(),
      slug,
      title: newPrompt.title,
      description,
      prompt: newPrompt.prompt,
      category,
      tags: newPrompt.tags,
      difficulty,
      featured: false,
      thumbnails: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    existingPrompts.push(imagePrompt);
    added++;
    console.log(`Added: ${newPrompt.title} (${category})`);
  }
  
  // Sort prompts by category and title
  existingPrompts.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
  
  // Update IDs to be sequential
  existingPrompts.forEach((prompt, index) => {
    prompt.id = (index + 1).toString();
  });
  
  // Save updated prompts
  const outputData = {
    prompts: existingPrompts,
    lastUpdated: new Date().toISOString()
  };
  
  await fs.writeFile(
    existingPromptsPath,
    JSON.stringify(outputData, null, 2),
    'utf-8'
  );
  
  console.log('\n✅ Merge complete!');
  console.log(`- Added: ${added} new prompts`);
  console.log(`- Updated: ${updated} existing prompts`);
  console.log(`- Skipped: ${skipped} duplicates`);
  console.log(`- Total prompts: ${existingPrompts.length}`);
}

// Run the merge
mergePrompts().catch(console.error);