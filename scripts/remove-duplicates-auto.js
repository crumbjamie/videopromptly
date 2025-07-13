#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// IDs to remove (generated from duplicate analysis)
const idsToRemove = [
  "340",
  "341",
  "342",
  "343",
  "344",
  "345",
  "346",
  "347",
  "348",
  "349",
  "350",
  "351",
  "352",
  "353",
  "354",
  "355",
  "356",
  "357",
  "358",
  "359",
  "360",
  "361",
  "362",
  "363",
  "364",
  "365",
  "366",
  "367",
  "368",
  "369",
  "370",
  "371",
  "372",
  "373",
  "374",
  "375",
  "376",
  "377",
  "378",
  "379",
  "380",
  "381",
  "382",
  "383",
  "384",
  "385",
  "386",
  "387",
  "388",
  "389",
  "390",
  "391",
  "392",
  "393",
  "394",
  "395",
  "396",
  "397",
  "398",
  "399",
  "400",
  "401",
  "402",
  "403",
  "404",
  "405",
  "406",
  "407",
  "408",
  "409",
  "410",
  "411",
  "412",
  "413",
  "414",
  "415",
  "416",
  "417",
  "418",
  "419",
  "420",
  "421",
  "422",
  "423",
  "424",
  "425",
  "426",
  "427",
  "428",
  "429",
  "430",
  "431",
  "432",
  "433",
  "434",
  "435",
  "436",
  "437",
  "438",
  "439",
  "440",
  "441",
  "442",
  "443",
  "444",
  "445",
  "446",
  "447",
  "448",
  "449",
  "450",
  "451",
  "452",
  "453",
  "454",
  "455",
  "456",
  "457",
  "458",
  "459"
];

// Load database
const databasePath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

// Create backup
const backupPath = path.join(process.cwd(), 'lib', 'database', 'prompts-before-dedup.json');
fs.writeFileSync(backupPath, JSON.stringify(database, null, 2));
console.log(`Backup created at: ${backupPath}`);

// Remove duplicates
const originalCount = database.prompts.length;
database.prompts = database.prompts.filter(prompt => !idsToRemove.includes(prompt.id));
const newCount = database.prompts.length;

// Save updated database
fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

console.log(`\nDuplicates removed successfully!`);
console.log(`Original prompts: ${originalCount}`);
console.log(`Removed: ${originalCount - newCount}`);
console.log(`Remaining prompts: ${newCount}`);
