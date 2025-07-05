const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'app/blog/complete-guide-chatgpt-image-transformation/page.tsx',
  'app/blog/page.tsx',
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace unescaped quotes in JSX text content
  // This is a simplified approach - in production you'd use a proper JSX parser
  
  // Replace apostrophes
  content = content.replace(/([>}][\s\n]*)([\w\s]*)'([\w\s]*)([\s\n]*[<{])/g, '$1$2&apos;$3$4');
  content = content.replace(/don't/g, 'don&apos;t');
  content = content.replace(/doesn't/g, 'doesn&apos;t');
  content = content.replace(/you're/g, 'you&apos;re');
  content = content.replace(/they're/g, 'they&apos;re');
  content = content.replace(/it's/g, 'it&apos;s');
  content = content.replace(/what's/g, 'what&apos;s');
  content = content.replace(/that's/g, 'that&apos;s');
  content = content.replace(/subject's/g, 'subject&apos;s');
  
  // Replace double quotes in text content (not in JSX attributes)
  content = content.replace(/"Transform this photo/g, '&quot;Transform this photo');
  content = content.replace(/colorful hair"/g, 'colorful hair&quot;');
  content = content.replace(/"Apply a Van Gogh/g, '&quot;Apply a Van Gogh');
  content = content.replace(/vibrant colors"/g, 'vibrant colors&quot;');
  content = content.replace(/"Turn the subject/g, '&quot;Turn the subject');
  content = content.replace(/distinctive features"/g, 'distinctive features&quot;');
  content = content.replace(/"Blend cyberpunk/g, '&quot;Blend cyberpunk');
  content = content.replace(/geometric patterns"/g, 'geometric patterns&quot;');
  content = content.replace(/"while maintaining/g, '&quot;while maintaining');
  content = content.replace(/facial features"/g, 'facial features&quot;');
  content = content.replace(/"keep the same/g, '&quot;keep the same');
  content = content.replace(/and expression"/g, 'and expression&quot;');
  content = content.replace(/"preserve the original/g, '&quot;preserve the original');
  content = content.replace(/original composition"/g, 'original composition&quot;');
  content = content.replace(/"Place the subject/g, '&quot;Place the subject');
  content = content.replace(/red landscape"/g, 'red landscape&quot;');
  content = content.replace(/"maintain the original subject/g, '&quot;maintain the original subject');
  content = content.replace(/"keep the same person/g, '&quot;keep the same person');
  content = content.replace(/object" to your prompt/g, 'object&quot; to your prompt');
  content = content.replace(/"anime style,"/g, '&quot;anime style,&quot;');
  content = content.replace(/"Studio Ghibli/g, '&quot;Studio Ghibli');
  content = content.replace(/detailed backgrounds."/g, 'detailed backgrounds.&quot;');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed quotes in ${file}`);
});

console.log('Done!');