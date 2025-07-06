import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function getChatGPTUrl(prompt: string): string {
  // This creates a URL that will open ChatGPT with the prompt pre-filled
  const prefix = "Create an image using the prompt below and the image I will upload. The uploaded image is the [subject] referenced in the prompt. If you see any other [variables] in the prompt, ask me what to enter for each. Only proceed once I have uploaded the image.\n\n";
  const fullPrompt = prefix + prompt;
  const encodedPrompt = encodeURIComponent(fullPrompt);
  return `https://chat.openai.com/?model=gpt-4&q=${encodedPrompt}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Beginner':
      return 'green';
    case 'Intermediate':
      return 'amber';
    case 'Advanced':
      return 'orange';
    default:
      return 'gray';
  }
}

export function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    'Toy Transformations': 'amber',
    'Artistic Styles': 'green',
    'Photo Effects': 'teal',
    'Character Styles': 'orange',
  };
  return colors[category] || 'gray';
}