// Unified GHOST live patch status
const fs = require('fs');
const PATCH_DIR = require('./constants/paths').PATCH_INPUT_DIR;
const SUMMARY_DIR = require('./constants/paths').PATCH_SUMMARY_DIR;

const getPatchQueue = () => {
  return fs.readdirSync(PATCH_DIR).filter(f => f.endsWith('.json'));
};

const getSummaries = () => {
  return fs.readdirSync(SUMMARY_DIR).filter(f => f.endsWith('.md')).slice(-10).reverse();
};

console.log('\n🔍 **LIVE PATCH EXECUTION STATUS**');
console.log('============================================================');
console.log(`📅 ${new Date().toLocaleString()} | Status Check`);

const patchQueue = getPatchQueue();
const recentSummaries = getSummaries();

console.log(`\n📦 **Patch Status:**`);
console.log(`   • Pending: ${patchQueue.length} | Executing: 0 | Completed: ${recentSummaries.length}`);

if (patchQueue.length > 0) console.log(`   ⚠️  PENDING PATCHES DETECTED!`);

console.log(`\n🔄 **Execution Queue:**`);
patchQueue.forEach(p => console.log(`   ⏳ ${p}`));

console.log(`\n📋 **Recent Activity (Last 10):**`);
recentSummaries.forEach(s => console.log(`   📄 ${s}`));

console.log(`\n🕐 **Last Update:** ${new Date().toLocaleTimeString()}`);
