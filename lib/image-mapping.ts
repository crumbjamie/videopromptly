// Mapping of categories to suitable sample images
export const categoryImageMap: Record<string, string[]> = {
  // Portrait categories
  'Portrait Photography': ['portrait-man-beard.jpg', 'portrait-woman-casual.jpg', 'portrait-person-outdoor.jpg'],
  'Photography Styles': ['portrait-man-beard.jpg', 'landscape-mountain.jpg', 'architecture-building.jpg'],
  'Editorial Photography': ['portrait-woman-casual.jpg', 'product-cosmetics.jpg', 'workspace-laptop.jpg'],
  'Fashion Photography': ['portrait-woman-casual.jpg', 'portrait-person-outdoor.jpg'],
  'Underwater Photography': ['portrait-person-outdoor.jpg', 'landscape-nature.jpg'],
  
  // Art & Creative
  'Artistic Styles': ['portrait-man-beard.jpg', 'landscape-mountain.jpg', 'object-minimal.jpg'],
  'Artistic Transformations': ['portrait-woman-casual.jpg', 'object-minimal.jpg', 'architecture-building.jpg'],
  'Traditional Art': ['landscape-nature.jpg', 'portrait-person-outdoor.jpg', 'architecture-building.jpg'],
  'Creative Effects': ['object-minimal.jpg', 'portrait-man-beard.jpg', 'urban-street.jpg'],
  
  // Animation & 3D
  'Animation & 3D': ['portrait-man-beard.jpg', 'portrait-woman-casual.jpg', 'object-minimal.jpg'],
  'Anime & animation': ['portrait-woman-casual.jpg', 'portrait-man-beard.jpg'],
  'Studio Ghibli': ['landscape-mountain.jpg', 'landscape-nature.jpg', 'portrait-person-outdoor.jpg'],
  
  // Tech & Sci-Fi
  'Sci-Fi & Tech': ['workspace-laptop.jpg', 'urban-street.jpg', 'portrait-man-beard.jpg'],
  'Cyberpunk & sci-fi': ['urban-street.jpg', 'workspace-laptop.jpg', 'portrait-woman-casual.jpg'],
  'Futuristic Tech': ['workspace-laptop.jpg', 'architecture-building.jpg', 'object-minimal.jpg'],
  
  // Objects & Products
  'Toys & Collectibles': ['object-minimal.jpg', 'product-cosmetics.jpg'],
  'Toy Transformations': ['object-minimal.jpg', 'product-cosmetics.jpg'],
  
  // Cinematic
  'Cinematic Styles': ['portrait-man-beard.jpg', 'urban-street.jpg', 'landscape-mountain.jpg'],
  'Cinematic & Film': ['portrait-woman-casual.jpg', 'architecture-building.jpg', 'urban-street.jpg'],
  
  // Fantasy & Character
  'Character & Fantasy': ['portrait-man-beard.jpg', 'portrait-woman-casual.jpg', 'landscape-nature.jpg'],
  'Fantasy & magic': ['portrait-person-outdoor.jpg', 'landscape-nature.jpg', 'portrait-woman-casual.jpg'],
  
  // Retro & Vintage
  'Retro & Vintage': ['portrait-woman-casual.jpg', 'urban-street.jpg', 'product-cosmetics.jpg'],
  'Vintage & retro': ['portrait-person-outdoor.jpg', 'architecture-building.jpg', 'object-minimal.jpg'],
  'Synthwave & vaporwave': ['urban-street.jpg', 'architecture-building.jpg', 'workspace-laptop.jpg'],
  
  // Digital Art
  'Digital Art & Gaming': ['workspace-laptop.jpg', 'portrait-man-beard.jpg', 'urban-street.jpg'],
  'Digital Art': ['object-minimal.jpg', 'portrait-woman-casual.jpg', 'architecture-building.jpg'],
  'Gaming Culture': ['workspace-laptop.jpg', 'portrait-man-beard.jpg'],
  
  // Surreal & Conceptual
  'Surreal & Conceptual': ['object-minimal.jpg', 'landscape-mountain.jpg', 'architecture-building.jpg'],
  'Minimalist Design': ['object-minimal.jpg', 'architecture-building.jpg', 'product-cosmetics.jpg'],
  
  // Action & Sports
  'Action & Sports': ['portrait-person-outdoor.jpg', 'landscape-mountain.jpg'],
  
  // Social Media
  'Social Media & Marketing': ['portrait-woman-casual.jpg', 'product-cosmetics.jpg', 'workspace-laptop.jpg'],
  'Social Media': ['portrait-woman-casual.jpg', 'product-cosmetics.jpg'],
  
  // Default for any unmapped categories
  'default': ['portrait-man-beard.jpg', 'landscape-mountain.jpg', 'object-minimal.jpg', 'urban-street.jpg', 'workspace-laptop.jpg']
};

// Get suitable images for a category
export function getImagesForCategory(category: string): string[] {
  return categoryImageMap[category] || categoryImageMap['default'];
}

// Get the 5 best images for a prompt based on its category
export function getBestImagesForPrompt(category: string, limit: number = 5): string[] {
  const images = getImagesForCategory(category);
  const defaultImages = categoryImageMap['default'];
  
  // Combine category-specific images with defaults to ensure we have enough
  const combinedImages = [...new Set([...images, ...defaultImages])];
  
  // Return up to 'limit' images
  return combinedImages.slice(0, limit);
}

// Variable replacements for prompts
export const promptVariables: Record<string, string> = {
  '[subject]': 'person',
  '[Subject]': 'Person',
  '[brand name]': 'Acme',
  '[brand]': 'Acme',
  '[object]': 'object',
  '[location]': 'cityscape',
  '[style]': 'modern',
  '[color]': 'blue',
  '[theme]': 'futuristic'
};

// Replace variables in a prompt
export function replacePromptVariables(prompt: string): string {
  let processedPrompt = prompt;
  
  Object.entries(promptVariables).forEach(([variable, replacement]) => {
    processedPrompt = processedPrompt.replace(new RegExp(variable.replace(/[[\]]/g, '\\$&'), 'g'), replacement);
  });
  
  return processedPrompt;
}