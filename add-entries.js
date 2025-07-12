const fs = require('fs');

// Read the current database
const database = JSON.parse(fs.readFileSync('/Users/jamie/Documents/GitHub/videopromptly/lib/database/prompts.json', 'utf8'));

// Add the 50 new entries
const newEntries = [
  {
    "id": "101",
    "slug": "just-a-prompt-breakup",
    "title": "'I'm Just a Prompt' Breakup",
    "description": "A beautiful biracial woman sobbing to her best friend after a devastating breakup, revealing her boyfriend told her she was 'just a prompt' - meta-commentary on AI consciousness.",
    "prompt": "A beautiful biracial woman sobbing to her best friend after a breakup. Her line: 'I thought it was true love… but he told me I was just a prompt.'",
    "category": "Viral Drama",
    "categories": ["Viral Drama", "Romance"],
    "tags": ["meta-humor", "ai-consciousness", "breakup", "drama", "viral-trend", "emotional"],
    "difficulty": "Intermediate",
    "createdAt": "2025-07-11T12:00:00.000Z",
    "updatedAt": "2025-07-11T12:00:00.000Z",
    "rating": 5,
    "ratingCount": 1,
    "videoUrl": "/videos/just-a-prompt-breakup.mp4",
    "thumbnailUrl": "/thumbnails/just-a-prompt-breakup.jpg",
    "duration": 8,
    "resolution": "720x1280",
    "aspectRatio": "9:16",
    "format": "mp4",
    "fileSize": 50000000,
    "featured": true,
    "source": "TikTok @ai.for.real.life",
    "views": "2.3M"
  }
];

// Add new entries to the prompts array
database.prompts.push(...newEntries);

// Write back to file
fs.writeFileSync('/Users/jamie/Documents/GitHub/videopromptly/lib/database/prompts.json', JSON.stringify(database, null, 2));

console.log(`Added ${newEntries.length} new entries to the database`);