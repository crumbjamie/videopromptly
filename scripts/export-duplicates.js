#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

// Group prompts by title to find duplicates
const promptsByTitle = {};
database.prompts.forEach((prompt) => {
  if (!promptsByTitle[prompt.title]) {
    promptsByTitle[prompt.title] = [];
  }
  promptsByTitle[prompt.title].push(prompt);
});

// Create output for duplicates
const duplicateReport = {
  summary: {
    totalPrompts: database.prompts.length,
    duplicateGroups: 0,
    totalDuplicates: 0,
    uniquePrompts: 0
  },
  duplicateGroups: [],
  idsToRemove: []
};

// Process each group
Object.entries(promptsByTitle).forEach(([title, prompts]) => {
  if (prompts.length > 1) {
    duplicateReport.summary.duplicateGroups++;
    duplicateReport.summary.totalDuplicates += prompts.length - 1;
    
    // Sort by ID to keep the first one
    prompts.sort((a, b) => a.id - b.id);
    
    const group = {
      title: title,
      count: prompts.length,
      keepId: prompts[0].id,
      removeIds: prompts.slice(1).map(p => p.id),
      instances: prompts.map(p => ({
        id: p.id,
        slug: p.slug,
        category: p.category,
        hasVideo: !!p.videoUrl && fs.existsSync(path.join(process.cwd(), 'public', p.videoUrl.substring(1))),
        videoUrl: p.videoUrl || null
      }))
    };
    
    duplicateReport.duplicateGroups.push(group);
    duplicateReport.idsToRemove.push(...group.removeIds);
  } else {
    duplicateReport.summary.uniquePrompts++;
  }
});

// Sort groups by title for easier reading
duplicateReport.duplicateGroups.sort((a, b) => a.title.localeCompare(b.title));
duplicateReport.idsToRemove.sort((a, b) => a - b);

// Write detailed report
const reportPath = path.join(process.cwd(), 'duplicate-report.json');
fs.writeFileSync(reportPath, JSON.stringify(duplicateReport, null, 2));

// Write CSV for easy viewing
const csvPath = path.join(process.cwd(), 'duplicate-report.csv');
const csvLines = ['Title,Count,Keep ID,Remove IDs,Has Videos'];

duplicateReport.duplicateGroups.forEach(group => {
  const hasVideos = group.instances.filter(i => i.hasVideo).length;
  csvLines.push(`"${group.title}",${group.count},${group.keepId},"${group.removeIds.join(', ')}",${hasVideos}/${group.count}`);
});

fs.writeFileSync(csvPath, csvLines.join('\n'));

// Write script to remove duplicates
const removeScriptPath = path.join(process.cwd(), 'scripts', 'remove-duplicates-auto.js');
const removeScript = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// IDs to remove (generated from duplicate analysis)
const idsToRemove = ${JSON.stringify(duplicateReport.idsToRemove, null, 2)};

// Load database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

// Create backup
const backupPath = path.join(process.cwd(), 'lib', 'database', 'prompts-before-dedup.json');
fs.writeFileSync(backupPath, JSON.stringify(database, null, 2));
console.log(\`Backup created at: \${backupPath}\`);

// Remove duplicates
const originalCount = database.prompts.length;
database.prompts = database.prompts.filter(prompt => !idsToRemove.includes(prompt.id));
const newCount = database.prompts.length;

// Save updated database
fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

console.log(\`\\nDuplicates removed successfully!\`);
console.log(\`Original prompts: \${originalCount}\`);
console.log(\`Removed: \${originalCount - newCount}\`);
console.log(\`Remaining prompts: \${newCount}\`);
`;

fs.writeFileSync(removeScriptPath, removeScript);
fs.chmodSync(removeScriptPath, '755');

// Print summary
console.log('DUPLICATE ANALYSIS COMPLETE\n');
console.log(`Total prompts: ${duplicateReport.summary.totalPrompts}`);
console.log(`Unique prompts: ${duplicateReport.summary.uniquePrompts}`);
console.log(`Duplicate groups: ${duplicateReport.summary.duplicateGroups}`);
console.log(`Total duplicates to remove: ${duplicateReport.summary.totalDuplicates}`);
console.log(`\nFiles created:`);
console.log(`- Detailed report: ${reportPath}`);
console.log(`- CSV summary: ${csvPath}`);
console.log(`- Removal script: ${removeScriptPath}`);
console.log(`\nTo remove duplicates, run: node scripts/remove-duplicates-auto.js`);

// Also create a simple text summary
const textSummaryPath = path.join(process.cwd(), 'duplicate-summary.txt');
let textSummary = 'DUPLICATE PROMPTS SUMMARY\n';
textSummary += '========================\n\n';

duplicateReport.duplicateGroups.forEach(group => {
  textSummary += `"${group.title}" (${group.count} copies)\n`;
  textSummary += `  Keep: ID ${group.keepId}\n`;
  textSummary += `  Remove: IDs ${group.removeIds.join(', ')}\n`;
  textSummary += `  Videos: ${group.instances.filter(i => i.hasVideo).length}/${group.count} have videos\n\n`;
});

textSummary += `\nTOTAL: ${duplicateReport.summary.totalDuplicates} duplicates to remove\n`;
textSummary += `After cleanup: ${duplicateReport.summary.uniquePrompts + duplicateReport.summary.duplicateGroups} unique prompts\n`;

fs.writeFileSync(textSummaryPath, textSummary);
console.log(`- Text summary: ${textSummaryPath}`);