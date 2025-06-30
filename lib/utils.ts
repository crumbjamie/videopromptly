export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function getChatGPTUrl(prompt: string): string {
  // This creates a URL that will open ChatGPT with the prompt pre-filled but not sent
  const encodedPrompt = encodeURIComponent(prompt);
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