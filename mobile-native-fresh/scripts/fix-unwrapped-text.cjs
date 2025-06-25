#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Simple regex-based approach to find and fix unwrapped text
function fixUnwrappedText(content) {
  let modified = false;
  
  // Pattern to match JSX elements that contain string literals
  // This is a simplified approach - in production you'd want a proper JSX parser
  const jsxPattern = /<([A-Z][a-zA-Z]*)\s*[^>]*>([^<]*)<\/\1>/g;
  
  // For now, let's use a simpler approach to detect unwrapped text
  // This will catch basic cases like: <View>Hello</View>
  const unwrappedTextPattern = /<([A-Z][a-zA-Z]*)\s*[^>]*>\s*([^<>\s][^<>]*[^<>\s])\s*<\/\1>/g;
  
  let newContent = content.replace(unwrappedTextPattern, (match, tagName, textContent) => {
    // Skip if it's already a Text component
    if (tagName === 'Text') {
      return match;
    }
    
    // Skip if it contains JSX elements
    if (textContent.includes('<') || textContent.includes('>')) {
      return match;
    }
    
    // Skip if it's just whitespace
    if (textContent.trim() === '') {
      return match;
    }
    
    modified = true;
    console.log(`  Found unwrapped text: "${textContent}" in <${tagName}>`);
    
    // Replace with wrapped text
    return `<${tagName}><Text>${textContent}</Text></${tagName}>`;
  });
  
  return { content: newContent, modified };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: newContent, modified } = fixUnwrappedText(content);
    
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`✅ No issues found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  const pattern = path.join(srcDir, '**/*.tsx');
  
  console.log('🔍 Scanning for unwrapped text in JSX files...');
  console.log(`📁 Pattern: ${pattern}`);
  
  const files = glob.sync(pattern);
  
  if (files.length === 0) {
    console.log('No .tsx files found in src directory');
    return;
  }
  
  console.log(`📄 Found ${files.length} .tsx files`);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    console.log(`\n🔍 Processing: ${path.relative(process.cwd(), file)}`);
    if (processFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n🎉 Summary: Fixed ${fixedCount} files`);
  
  if (fixedCount > 0) {
    console.log('\n💡 Remember to:');
    console.log('  1. Add "import { Text } from \'react-native\';" if not already present');
    console.log('  2. Review the changes to ensure they look correct');
    console.log('  3. Test the app to make sure nothing broke');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixUnwrappedText, processFile }; 