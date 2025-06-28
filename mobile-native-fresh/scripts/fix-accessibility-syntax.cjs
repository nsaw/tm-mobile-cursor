#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Pattern to match the accessibility syntax error
const accessibilityErrorPattern = /onPress=\{\(\) => accessibilityRole="button" accessible=\{true\} accessibilityLabel="Button">\s*([^}]+)\}/g;

// Pattern to match the corrected format
const correctedPattern = (content) => {
  return content.replace(accessibilityErrorPattern, (match, innerContent) => {
    // Clean up the inner content
    const cleanContent = innerContent.trim();
    return `onPress={() => ${cleanContent}}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"`;
  });
};

// Get all TypeScript/TSX files
const files = glob.sync('src/**/*.{ts,tsx}', { ignore: ['node_modules/**', 'dist/**'] });

let fixedCount = 0;

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check if file contains the accessibility error pattern
    if (accessibilityErrorPattern.test(content)) {
      console.log(`Fixing accessibility syntax in: ${file}`);
      
      // Apply the fix
      const fixedContent = correctedPattern(content);
      
      // Write the fixed content back
      fs.writeFileSync(file, fixedContent, 'utf8');
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\n✅ Fixed accessibility syntax errors in ${fixedCount} files`); 