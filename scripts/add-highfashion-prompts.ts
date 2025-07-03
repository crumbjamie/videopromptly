import fs from 'fs';
import path from 'path';

const promptsPath = path.join(process.cwd(), 'lib/database/prompts.json');
const highFashionPath = path.join(process.cwd(), 'highfashion-prompts.md');

// Read existing prompts
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens
}

// Parse markdown file
const markdownContent = fs.readFileSync(highFashionPath, 'utf-8');
const lines = markdownContent.split('\n');

interface ParsedPrompt {
  title: string;
  prompt: string;
  tags: string[];
  mainCategory: string;
  subCategory: string;
  categories: string[];
}

const parsedPrompts: ParsedPrompt[] = [];
let currentMainCategory = '';
let currentSubCategory = '';
let currentPrompt: Partial<ParsedPrompt> | null = null;
let inCodeBlock = false;
let promptText = '';

// Category mappings for multiple categories
const categoryMappings: { [key: string]: string[] } = {
  // Business Profile Photography
  'Professional Headshots': ['Portrait Photography', 'Professional Photography', 'Commercial Photography'],
  'Corporate Portraits': ['Portrait Photography', 'Professional Photography', 'Corporate Photography'],
  'LinkedIn Profile Photos': ['Portrait Photography', 'Professional Photography', 'Social Media'],
  'Business Card Portraits': ['Portrait Photography', 'Professional Photography', 'Commercial Photography'],
  'Company Website Team Photos': ['Portrait Photography', 'Professional Photography', 'Corporate Photography'],
  'Creative Professional Styles': ['Portrait Photography', 'Professional Photography', 'Creative Effects'],
  
  // Fashion Photography
  'Editorial Fashion Photography': ['Fashion Photography', 'Editorial Photography', 'Portrait Photography'],
  'Commercial Fashion Shoots': ['Fashion Photography', 'Commercial Photography', 'Studio Photography'],
  'Avant-Garde Fashion': ['Fashion Photography', 'Avant-Garde', 'Artistic Styles'],
  'Streetwear Photography': ['Fashion Photography', 'Street Photography', 'Urban Photography'],
  'Luxury Fashion Campaigns': ['Fashion Photography', 'Luxury Photography', 'Commercial Photography'],
  'Model Photography and Fashion Portraits': ['Fashion Photography', 'Portrait Photography', 'Studio Photography'],
  'Artistic Fashion Photography': ['Fashion Photography', 'Artistic Styles', 'Creative Effects'],
  
  // Portrait Photography
  'Professional Portraits (Non-Business)': ['Portrait Photography', 'Environmental Photography', 'Professional Photography'],
  'Artistic and Creative Portraits': ['Portrait Photography', 'Artistic Styles', 'Creative Effects'],
  'Studio Portrait Setups': ['Portrait Photography', 'Studio Photography', 'Professional Photography'],
  'Environmental Portraits': ['Portrait Photography', 'Environmental Photography', 'Lifestyle Photography'],
  'Lifestyle Portraits': ['Portrait Photography', 'Lifestyle Photography', 'Documentary Photography'],
  'Character and Personality Portraits': ['Portrait Photography', 'Documentary Photography', 'Artistic Styles']
};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Main category (single #)
  if (line.startsWith('## ') && !line.startsWith('### ')) {
    const match = line.match(/^##\s+(.+?)\s*\(\d+\s*Prompts?\)/);
    if (match) {
      currentMainCategory = match[1];
    } else if (!line.includes('Technical Guidelines')) {
      // It's a prompt title
      if (currentPrompt && promptText) {
        currentPrompt.prompt = promptText.trim();
        parsedPrompts.push(currentPrompt as ParsedPrompt);
      }
      
      currentPrompt = {
        title: line.replace('## ', '').trim(),
        mainCategory: currentMainCategory,
        subCategory: currentSubCategory,
        categories: []
      };
      promptText = '';
      inCodeBlock = false;
    }
  }
  
  // Subcategory
  else if (line.startsWith('### ')) {
    currentSubCategory = line.replace('### ', '').trim();
  }
  
  // Code block start
  else if (line === '```' && currentPrompt) {
    if (inCodeBlock) {
      // End of code block
      inCodeBlock = false;
    } else {
      // Start of code block
      inCodeBlock = true;
    }
  }
  
  // Inside code block
  else if (inCodeBlock && currentPrompt) {
    promptText += line + '\n';
  }
  
  // Tags line
  else if (line.startsWith('**Tags:**') && currentPrompt) {
    const tagsText = line.replace('**Tags:**', '').trim();
    currentPrompt.tags = tagsText.split(',').map(tag => tag.trim());
    
    // Determine categories based on subcategory
    if (currentSubCategory && categoryMappings[currentSubCategory]) {
      currentPrompt.categories = categoryMappings[currentSubCategory];
    } else {
      // Default categories based on main category
      switch (currentMainCategory) {
        case 'Business Profile Photography':
          currentPrompt.categories = ['Portrait Photography', 'Professional Photography'];
          break;
        case 'Fashion Photography':
          currentPrompt.categories = ['Fashion Photography'];
          break;
        case 'Portrait Photography':
          currentPrompt.categories = ['Portrait Photography'];
          break;
        default:
          currentPrompt.categories = ['Creative Effects'];
      }
    }
  }
}

// Don't forget the last prompt
if (currentPrompt && promptText) {
  currentPrompt.prompt = promptText.trim();
  parsedPrompts.push(currentPrompt as ParsedPrompt);
}

// Get the highest ID from existing prompts
const highestId = Math.max(...data.prompts.map((p: any) => parseInt(p.id)));
let nextId = highestId + 1;

// Add new prompts
const currentDate = new Date().toISOString();
const newPrompts = parsedPrompts.map(parsed => {
  const slug = generateSlug(parsed.title);
  
  return {
    id: nextId++.toString(),
    slug,
    title: parsed.title,
    description: `Transform your images with this ${slug.replace(/-/g, ' ')} prompt for stunning creative effects.`,
    prompt: parsed.prompt,
    category: parsed.categories[0], // Primary category
    categories: parsed.categories, // All categories
    tags: parsed.tags,
    difficulty: parsed.prompt.includes('Phase One') || parsed.prompt.includes('Hasselblad') ? 'Advanced' : 'Intermediate',
    createdAt: currentDate,
    updatedAt: currentDate,
    thumbnail: {
      before: "woman-sample.jpg",
      after: `${slug}.png`
    }
  };
});

// Add to existing prompts
data.prompts.push(...newPrompts);
data.lastUpdated = currentDate;

// Write back to file
fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));

console.log(`✅ Successfully added ${newPrompts.length} high fashion prompts!`);
console.log('\nCategories used:');
const allCategories = new Set(newPrompts.flatMap(p => p.categories));
allCategories.forEach(cat => console.log(`- ${cat}`));
console.log(`\n📊 Total prompts in database: ${data.prompts.length}`);