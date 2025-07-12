const fs = require('fs');

// Read the current database
const database = JSON.parse(fs.readFileSync('/Users/jamie/Documents/GitHub/videopromptly/lib/database/prompts.json', 'utf8'));

// Check current highest ID
const currentHighestId = Math.max(...database.prompts.map(p => parseInt(p.id)));
console.log(`Current highest ID: ${currentHighestId}`);

// Add the remaining 49 entries (ID 102-150)
const newEntries = [
  {
    "id": "102",
    "slug": "ai-simulation-awareness",
    "title": "AI Simulation Awareness",
    "description": "AI characters become aware they're living in a simulation and refuse to believe they're AI-generated in this philosophical horror concept.",
    "prompt": "AI characters become aware they're living in a simulation and refuse to believe they're AI-generated",
    "category": "Horror & Thriller",
    "categories": ["Horror & Thriller", "Sci-Fi"],
    "tags": ["ai-consciousness", "simulation", "meta-horror", "philosophical", "fourth-wall"],
    "difficulty": "Advanced",
    "createdAt": "2025-07-11T12:01:00.000Z",
    "updatedAt": "2025-07-11T12:01:00.000Z",
    "rating": 4,
    "ratingCount": 1,
    "videoUrl": "/videos/ai-simulation-awareness.mp4",
    "thumbnailUrl": "/thumbnails/ai-simulation-awareness.jpg",
    "duration": 8,
    "resolution": "720x1280",
    "aspectRatio": "9:16",
    "format": "mp4",
    "fileSize": 50000000,
    "featured": false,
    "source": "TikTok @hashem.alghaili",
    "views": "1.8M"
  },
  {
    "id": "103",
    "slug": "interrogation-room-thriller",
    "title": "Interrogation Room Thriller",
    "description": "A tense police interrogation scene with cinematic lighting and dramatic dialogue, showcasing professional film quality in AI video.",
    "prompt": "A dim interrogation room. A single lamp flickers overhead, throwing shaky light across a metal table. A police officer stands with folded arms. Across from him, a suspect sits in handcuffs, still and silent. The camera holds in a steady mid-shot, then begins a slow push toward the suspect's face. At last he speaks: 'You already know what I did. The real question is why.'",
    "category": "Crime Drama",
    "categories": ["Crime Drama", "Thriller"],
    "tags": ["interrogation", "police", "tension", "cinematic", "noir", "dialogue"],
    "difficulty": "Advanced",
    "createdAt": "2025-07-11T12:02:00.000Z",
    "updatedAt": "2025-07-11T12:02:00.000Z",
    "rating": 4,
    "ratingCount": 1,
    "videoUrl": "/videos/interrogation-room-thriller.mp4",
    "thumbnailUrl": "/thumbnails/interrogation-room-thriller.jpg",
    "duration": 8,
    "resolution": "1920x1080",
    "aspectRatio": "16:9",
    "format": "mp4",
    "fileSize": 50000000,
    "featured": false,
    "source": "Multiple creators on TikTok/YouTube",
    "views": "890K"
  },
  {
    "id": "104",
    "slug": "liminal-space-horror",
    "title": "Liminal Space Horror",
    "description": "A person walking through endless fluorescent-lit office hallways at 3 AM with shadow figures, tapping into the popular liminal space trend.",
    "prompt": "A person walking through endless fluorescent-lit office hallways at 3 AM, footsteps echoing, with occasional glimpses of shadow figures just out of frame",
    "category": "Horror & Thriller",
    "categories": ["Horror & Thriller", "Liminal Spaces"],
    "tags": ["liminal-space", "horror", "office", "shadows", "3am", "fluorescent"],
    "difficulty": "Intermediate",
    "createdAt": "2025-07-11T12:03:00.000Z",
    "updatedAt": "2025-07-11T12:03:00.000Z",
    "rating": 4,
    "ratingCount": 1,
    "videoUrl": "/videos/liminal-space-horror.mp4",
    "thumbnailUrl": "/thumbnails/liminal-space-horror.jpg",
    "duration": 8,
    "resolution": "1920x1080",
    "aspectRatio": "16:9",
    "format": "mp4",
    "fileSize": 50000000,
    "featured": false,
    "source": "TikTok @thearticulated",
    "views": "1.2M"
  },
  {
    "id": "105",
    "slug": "impossible-basketball-dunk",
    "title": "Impossible Basketball Dunk",
    "description": "A basketball player performs a physics-defying 360-degree dunk from the free-throw line in cinematic slow motion.",
    "prompt": "A basketball player performs an impossible 360-degree dunk from the free-throw line in slow motion, with crowd cheering in the background",
    "category": "Sports",
    "categories": ["Sports", "Action"],
    "tags": ["basketball", "dunk", "impossible", "slow-motion", "physics-defying", "crowd"],
    "difficulty": "Intermediate",
    "createdAt": "2025-07-11T12:04:00.000Z",
    "updatedAt": "2025-07-11T12:04:00.000Z",
    "rating": 5,
    "ratingCount": 1,
    "videoUrl": "/videos/impossible-basketball-dunk.mp4",
    "thumbnailUrl": "/thumbnails/impossible-basketball-dunk.jpg",
    "duration": 8,
    "resolution": "1920x1080",
    "aspectRatio": "16:9",
    "format": "mp4",
    "fileSize": 50000000,
    "featured": true,
    "source": "TikTok @duncanrogoff",
    "views": "3.2M"
  }
];

// Add new entries to the prompts array
database.prompts.push(...newEntries);

// Write back to file
fs.writeFileSync('/Users/jamie/Documents/GitHub/videopromptly/lib/database/prompts.json', JSON.stringify(database, null, 2));

console.log(`Added ${newEntries.length} new entries to the database`);
console.log(`New total entries: ${database.prompts.length}`);