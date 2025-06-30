import fs from 'fs/promises';
import path from 'path';

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

async function removeDuplicates() {
  console.log('Starting duplicate removal process...\n');
  
  // Read existing prompts
  const promptsPath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
  const data = JSON.parse(await fs.readFile(promptsPath, 'utf-8'));
  const prompts = data.prompts as ImagePromptJSON[];
  
  console.log(`Found ${prompts.length} total prompts`);
  
  // Find duplicates
  const uniquePrompts = new Map<string, ImagePromptJSON>();
  const duplicates: ImagePromptJSON[] = [];
  
  for (const prompt of prompts) {
    const key = prompt.slug;
    
    if (uniquePrompts.has(key)) {
      // Keep the one with the longer/newer prompt text
      const existing = uniquePrompts.get(key)!;
      if (prompt.prompt.length > existing.prompt.length) {
        duplicates.push(existing);
        uniquePrompts.set(key, prompt);
      } else {
        duplicates.push(prompt);
      }
    } else {
      uniquePrompts.set(key, prompt);
    }
  }
  
  console.log(`Found ${duplicates.length} duplicate prompts`);
  
  if (duplicates.length > 0) {
    console.log('\nDuplicates found:');
    duplicates.forEach(d => {
      console.log(`- ${d.title} (ID: ${d.id}, Slug: ${d.slug})`);
    });
  }
  
  // Convert back to array and sort
  const uniquePromptsArray = Array.from(uniquePrompts.values());
  uniquePromptsArray.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
  
  // Update IDs to be sequential
  uniquePromptsArray.forEach((prompt, index) => {
    prompt.id = (index + 1).toString();
  });
  
  // Save cleaned data
  const outputData = {
    prompts: uniquePromptsArray,
    lastUpdated: new Date().toISOString()
  };
  
  await fs.writeFile(
    promptsPath,
    JSON.stringify(outputData, null, 2),
    'utf-8'
  );
  
  console.log('\n✅ Cleanup complete!');
  console.log(`- Removed: ${duplicates.length} duplicates`);
  console.log(`- Remaining prompts: ${uniquePromptsArray.length}`);
}

// Run the cleanup
removeDuplicates().catch(console.error);