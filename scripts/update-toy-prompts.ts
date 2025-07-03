import fs from 'fs';
import path from 'path';

const promptsPath = path.join(process.cwd(), 'lib/database/prompts.json');
const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Define the toy prompt updates
const toyPromptUpdates = [
  {
    id: '29',
    oldPrompt: "Full-body action figure in window box packaging using [subject] likeness. '[Your name]' prominently displayed with 'Limited Edition' below, '[accessories]' arranged proportionally in inset slots. 3D animation style with soft lighting, toy store background, retro-modern design.",
    newPrompt: "Transform [subject] into a plastic action figure toy with visible joints and articulation points, displayed in window box packaging. '[Your name]' prominently displayed with 'Limited Edition' below, '[accessories]' arranged proportionally in inset slots. 3D animation style with soft lighting, toy store background, retro-modern design."
  },
  {
    id: '36',
    oldPrompt: "Realistic action figure of [subject] in blister pack with red header text '[your name]' in large white letters. '[Profession]' below with Ages 17+ label, beige background. Accessories include notebook, pen, camera, and laptop with [logo], photorealistic collectible toy quality.",
    newPrompt: "Transform [subject] into a realistic plastic action figure toy with moveable joints, displayed in blister pack with red header text '[your name]' in large white letters. '[Profession]' below with Ages 17+ label, beige background. Accessories include notebook, pen, camera, and laptop with [logo], photorealistic collectible toy quality."
  },
  {
    id: '67',
    oldPrompt: "Modern tech-themed action figure packaging with sleek dark blue background and circuit patterns. [Subject] figure as a toy with perforated card edge, '[your name]' in bold yellow, '[profession]' in white. Three accessory compartments with laptop, pen, and phone, futuristic high-tech aesthetic.",
    newPrompt: "Transform [subject] into a plastic action figure toy with visible joints, displayed in modern tech-themed packaging with sleek dark blue background and circuit patterns. Toy has perforated card edge, '[your name]' in bold yellow, '[profession]' in white. Three accessory compartments with laptop, pen, and phone, futuristic high-tech aesthetic."
  },
  {
    id: '72',
    oldPrompt: "3D action figure toy named '[your name]' in transparent blister packaging, [subject] styled with [hair/face description]. Large '[name]' in white text, '[title]' below, dressed in [clothing]. Supporting job items [accessories], minimalist cardboard design with [brand] logo, cute cartoonish style.",
    newPrompt: "Transform [subject] into a cute cartoon-style plastic action figure toy with simplified features and visible joints, displayed in transparent blister packaging. Named '[your name]' styled with [hair/face description]. Large '[name]' in white text, '[title]' below, dressed in [clothing]. Supporting job items [accessories], minimalist cardboard design with [brand] logo."
  },
  {
    id: '88',
    oldPrompt: "Barbie box packaging scene with [subject] as skateboarder edition, acrylic window shows skater mid-kickflip. Hot-pink clamp lights with plastic sparkles, toy-photography macro style, collectible figure aesthetic, premium packaging design.",
    newPrompt: "Transform [subject] into a plastic fashion doll toy in Barbie-style packaging, posed as skateboarder edition with jointed limbs mid-kickflip. Acrylic window display, hot-pink clamp lights with plastic sparkles, toy-photography macro style, collectible figure aesthetic, premium packaging design."
  },
  {
    id: '90',
    oldPrompt: "High-res 3D render of [subject] transformed into plush inflatable ghost toy with soft matte texture and subtle fabric creases. Gentle ambient lighting, minimal pale-blue background, playful collectible vibe, ultra-realistic and adorable finish.",
    newPrompt: "Transform [subject] into a soft fabric plush ghost toy with stitched seams, button eyes, and stuffed cotton filling. Soft matte texture with visible fabric creases and fuzzy surface. Gentle ambient lighting, minimal pale-blue background, playful collectible vibe, ultra-realistic and adorable finish."
  },
  {
    id: '91',
    oldPrompt: "Create action figure packaging of [subject] with strong orange blister card. Include individual blisters with [book title], [3-headed creature] with tag [name], and [book title 2]. Header text '[name]' and '[title] action figure', realistic toy packaging photography, political collectible aesthetic.",
    newPrompt: "Transform [subject] into a plastic action figure toy with moveable joints and molded features, displayed in political-themed packaging with strong orange blister card. Include individual blisters with [book title], [3-headed creature] with tag [name], and [book title 2]. Header text '[name]' and '[title] action figure', realistic toy packaging photography, political collectible aesthetic."
  }
];

// Update the prompts
let updatedCount = 0;
toyPromptUpdates.forEach(update => {
  const prompt = data.prompts.find((p: any) => p.id === update.id);
  if (prompt) {
    console.log(`\nUpdating prompt ID ${update.id}: ${prompt.title}`);
    console.log(`OLD: ${update.oldPrompt.substring(0, 100)}...`);
    console.log(`NEW: ${update.newPrompt.substring(0, 100)}...`);
    
    prompt.prompt = update.newPrompt;
    prompt.updatedAt = new Date().toISOString();
    updatedCount++;
  }
});

// Note: LEGO prompt (ID 89) is already good, so we're not updating it

// Save the updated data
fs.writeFileSync(promptsPath, JSON.stringify(data, null, 2));

console.log(`\n✅ Successfully updated ${updatedCount} toy prompts!`);
console.log('📝 LEGO Minifigure prompt (ID 89) was already clear and not updated.');