export const CATEGORIES = {
  'Viral Character Vlogs': {
    name: 'Viral Character Vlogs',
    description: 'Cryptid and mythical character vlogging content featuring Bigfoot, Yeti, and other creatures in relatable situations',
    icon: '🎬',
    color: 'bg-purple-500'
  },
  'Existential AI': {
    name: 'Existential AI',
    description: 'Meta-commentary content where AI characters become aware of their artificial nature',
    icon: '🤖',
    color: 'bg-blue-500'
  },
  'Comedy & Entertainment': {
    name: 'Comedy & Entertainment',
    description: 'Humorous content including stand-up, parodies, and viral comedy formats',
    icon: '😂',
    color: 'bg-yellow-500'
  },
  'Educational': {
    name: 'Educational',
    description: 'Tutorial and informational content about AI, technology, and creative processes',
    icon: '📚',
    color: 'bg-green-500'
  },
  'Cinematic Action': {
    name: 'Cinematic Action',
    description: 'High-production action sequences with dynamic camera work and effects',
    icon: '🎭',
    color: 'bg-red-500'
  },
  'ASMR & Sensory': {
    name: 'ASMR & Sensory',
    description: 'Satisfying visual and audio content designed for sensory engagement',
    icon: '🎧',
    color: 'bg-pink-500'
  },
  'Music & Performance': {
    name: 'Music & Performance',
    description: 'Musical performances, concerts, and entertainment show formats',
    icon: '🎵',
    color: 'bg-indigo-500'
  },
  'Fashion & Beauty': {
    name: 'Fashion & Beauty',
    description: 'Style, beauty, and fashion content with high production values',
    icon: '👗',
    color: 'bg-rose-500'
  },
  'TikTok Vertical': {
    name: 'TikTok Vertical',
    description: 'Content specifically optimized for vertical mobile viewing and TikTok format',
    icon: '📱',
    color: 'bg-cyan-500'
  },
  'Business & Marketing': {
    name: 'Business & Marketing',
    description: 'Entrepreneurial and business-focused content for professional audiences',
    icon: '💼',
    color: 'bg-gray-500'
  }
} as const;

export const TAG_CATEGORIES = {
  // Character Types
  characters: {
    name: 'Characters',
    tags: [
      'bigfoot', 'yeti', 'gorilla', 'alien', 'robot', 'viking', 'sea-captain', 
      'superhero', 'android', 'caveman', 'storm-trooper', 'biblical-character'
    ]
  },
  
  // Content Formats
  formats: {
    name: 'Formats',
    tags: [
      'vlog', 'selfie', 'pov', 'handheld', 'documentary', 'interview', 'podcast',
      'tutorial', 'behind-scenes', 'reaction', 'unboxing', 'review'
    ]
  },
  
  // Visual Styles
  styles: {
    name: 'Visual Styles',
    tags: [
      'cinematic', 'handheld', 'drone', 'macro', 'slow-motion', 'time-lapse',
      'vertical', '360-degree', 'tracking-shot', 'dolly', 'close-up', 'wide-angle'
    ]
  },
  
  // Moods & Emotions
  moods: {
    name: 'Moods & Emotions',
    tags: [
      'funny', 'emotional', 'dramatic', 'mysterious', 'peaceful', 'intense',
      'nostalgic', 'upbeat', 'melancholic', 'inspiring', 'shocking', 'calming'
    ]
  },
  
  // Technical Elements
  technical: {
    name: 'Technical',
    tags: [
      'dialogue', 'voice-over', 'asmr', 'no-subtitles', '4k', 'hd', 'physics',
      'lighting-effects', 'color-grading', 'audio-sync', 'realistic-movement'
    ]
  },
  
  // Environments
  environments: {
    name: 'Environments',
    tags: [
      'forest', 'mountain', 'urban', 'studio', 'kitchen', 'office', 'outdoor',
      'indoor', 'nature', 'cityscape', 'desert', 'ocean', 'space', 'underground'
    ]
  },
  
  // Themes
  themes: {
    name: 'Themes',
    tags: [
      'self-awareness', 'existential', 'meta-humor', 'viral-trend', 'social-media',
      'technology', 'ai-consciousness', 'reality-questioning', 'fourth-wall'
    ]
  },
  
  // Platform Optimization
  platforms: {
    name: 'Platforms',
    tags: [
      'tiktok', 'instagram-reels', 'youtube-shorts', 'twitter', 'mobile-first'
    ]
  }
} as const;

export const TRENDING_TAGS = [
  'bigfoot', 'yeti', 'ai-consciousness', 'existential', 'viral-trend',
  'dialogue', 'cinematic', 'asmr', 'pov', 'tiktok', 'meta-humor'
];

export const DIFFICULTY_COLORS = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800', 
  'Advanced': 'bg-red-100 text-red-800'
} as const;