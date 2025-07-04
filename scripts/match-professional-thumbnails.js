const fs = require('fs');
const path = require('path');

// Read the prompts database
const promptsPath = path.join(__dirname, '../lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Manual matches for professional thumbnails
const manualMatches = [
  { slug: "classic-corporate-executive", thumbnail: "Classic-Corporate-Executive.png" },
  { slug: "modern-tech-professional", thumbnail: "Modern-Tech-Professional.png" },
  { slug: "creative-business-professional", thumbnail: "Creative-Business-Professional.png" },
  { slug: "financial-services-professional", thumbnail: "Financial-Services-Professional.png" },
  { slug: "healthcare-professional", thumbnail: "Healthcare-Professional.png" },
  { slug: "senior-executive-portrait", thumbnail: "Senior-Executive-Portrait.png" },
  { slug: "female-business-leader", thumbnail: "Female-Business-Leader.png" },
  { slug: "startup-founder", thumbnail: "Startup-Founder.png" },
  { slug: "consultant-professional", thumbnail: "Consultant-Professional.png" },
  { slug: "real-estate-professional", thumbnail: "Real-Estate-Professional.png" },
  { slug: "hr-manager", thumbnail: "HR-Manager.png" },
  { slug: "attorney-portrait", thumbnail: "Attorney-Portrait.png" },
  { slug: "financial-advisor", thumbnail: "Financial-Advisor.png" },
  { slug: "insurance-agent", thumbnail: "Insurance-Agent.png" },
  { slug: "medical-practice-team", thumbnail: "Medical-Practice-Team.png" },
  { slug: "tech-startup-team", thumbnail: "Tech-Startup-Team.png" },
  { slug: "advertising-executive", thumbnail: "Advertising-Executive.png" },
  { slug: "architecture-firm-principal", thumbnail: "Architecture-Firm-Principal.png" },
  { slug: "pet-to-human-portrait", thumbnail: "pet-to-human.png" }
];

// Update prompts with thumbnail references
let updatedCount = 0;
manualMatches.forEach(match => {
  const prompt = data.prompts.find(p => p.slug === match.slug);
  if (prompt) {
    prompt.thumbnail = {
      before: prompt.slug === "pet-to-human-portrait" ? "animal.jpg" : "woman-sample.jpg",
      after: match.thumbnail
    };
    updatedCount++;
    console.log(`✓ Updated "${prompt.title}" with thumbnail ${match.thumbnail}`);
  } else {
    console.log(`✗ Could not find prompt with slug: ${match.slug}`);
  }
});

// Write the updated data back
fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));
console.log(`\n✅ Updated ${updatedCount} prompts with thumbnails`);