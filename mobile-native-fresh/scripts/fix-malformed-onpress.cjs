#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing malformed onPress handlers...\n');

// Pattern to find malformed onPress handlers (single-line and block bodies)
const malformedOnPressPattern = /onPress=\{\(\)\s*=\s*accessibilityRole="button"\s+accessible=\{true\}\s+accessibilityLabel="Button">\s*([^}};]+?)}\}/gs;
const malformedOnPressBlockPattern = /onPress=\{\(\)\s*=\s*accessibilityRole="button"\s+accessible=\{true\}\s+accessibilityLabel="Button">\s*\{([\s\S]*?)}}\}/gs;

function fixMalformedOnPress(content) {
  let fixed = false;
  let fixedContent = content;

  // Fix block body malformed onPress
  fixedContent = fixedContent.replace(malformedOnPressBlockPattern, (match, blockBody) => {
    fixed = true;
    console.log(`  🔧 Fixed malformed onPress (block): { ... }`);
    return `onPress={() => {${blockBody}}}`;
  });

  // Fix single-line malformed onPress
  fixedContent = fixedContent.replace(malformedOnPressPattern, (match, functionBody) => {
    fixed = true;
    console.log(`  🔧 Fixed malformed onPress: ${functionBody.trim()}`);
    return `onPress={() => ${functionBody.trim()}}`;
  });

  return { content: fixedContent, fixed };
}

const pattern = path.join(process.cwd(), 'src', '**', '*.tsx');
const files = glob.sync(pattern);

let totalFixed = 0;

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const { content: fixedContent, fixed } = fixMalformedOnPress(content);
    if (fixed) {
      fs.writeFileSync(file, fixedContent, 'utf8');
      console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
      totalFixed++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n🎉 Summary: Fixed ${totalFixed} files`);
console.log('\n💡 Next steps:');
console.log('  1. Run "npx tsc --noEmit" to check for remaining errors');
console.log('  2. Test the app to ensure it works correctly'); 