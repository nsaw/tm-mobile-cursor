#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');

function cleanupScrollViewProps(file) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Remove role and accessibilityRole from <ScrollView ...>
  // Handles both single and double quotes, and both with/without curly braces
  content = content.replace(/(<ScrollView[^>]*?)\s+role=\{[^}]+\}/g, '$1');
  content = content.replace(/(<ScrollView[^>]*?)\s+role="[^"]+"/g, '$1');
  content = content.replace(/(<ScrollView[^>]*?)\s+role='[^']+'/g, '$1');
  content = content.replace(/(<ScrollView[^>]*?)\s+accessibilityRole=\{[^}]+\}/g, '$1');
  content = content.replace(/(<ScrollView[^>]*?)\s+accessibilityRole="[^"]+"/g, '$1');
  content = content.replace(/(<ScrollView[^>]*?)\s+accessibilityRole='[^']+'/g, '$1');

  if (content !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, content, 'utf8');
    changed = true;
    console.log(`Cleaned ScrollView props in: ${file}`);
  }
  return changed;
}

function main() {
  const files = glob.sync('src/**/*.{tsx,ts}', { cwd: process.cwd() });
  let changedFiles = 0;
  files.forEach(file => {
    if (cleanupScrollViewProps(file)) changedFiles++;
  });
  console.log(`\nRemoved invalid props from ScrollView in ${changedFiles} files.`);
}

if (require.main === module) {
  main();
} 