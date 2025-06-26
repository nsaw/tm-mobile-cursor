#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Rule 1: Fix unwrapped text in JSX
function fixUnwrappedText(content) {
  let modified = false;
  
  // Pattern to match unwrapped text in JSX elements
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
    console.log(`  📝 Found unwrapped text: "${textContent}" in <${tagName}>`);
    
    // Replace with wrapped text
    return `<${tagName}><Text>${textContent}</Text></${tagName}>`;
  });
  
  return { content: newContent, modified };
}

// Rule 2: Fix inline static colors
function fixInlineColors(content) {
  let modified = false;
  
  // Pattern to match inline color styles
  const colorPattern = /style=\{\s*\{\s*([^}]*color[^}]*)\s*\}\s*\}/g;
  const colorValuePattern = /(color|backgroundColor|borderColor|tintColor)\s*:\s*['"`](#[0-9A-Fa-f]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|red|green|blue|yellow|orange|purple|pink|brown|gray|grey|black|white)['"`]/g;
  
  let newContent = content.replace(colorPattern, (match, styleContent) => {
    const hasColor = colorValuePattern.test(styleContent);
    if (hasColor) {
      modified = true;
      console.log(`  🎨 Found inline color: ${styleContent}`);
      
      // Replace with tokens.colors reference
      const fixedStyle = styleContent.replace(colorValuePattern, (colorMatch, prop, value) => {
        let suggestedToken = 'text';
        if (prop === 'backgroundColor') suggestedToken = 'background';
        if (prop === 'borderColor') suggestedToken = 'border';
        if (prop === 'tintColor') suggestedToken = 'accent';
        
        return `${prop}: tokens.colors.${suggestedToken}`;
      });
      
      return `style={{ ${fixedStyle} }}`;
    }
    return match;
  });
  
  return { content: newContent, modified };
}

// Rule 3: Ensure useTheme hook is called when tokens.colors is used
function ensureUseThemeHook(content) {
  let modified = false;
  
  const hasTokensColors = /tokens\.colors\./g.test(content);
  const hasUseThemeCall = /const\s*\{\s*tokens\s*\}\s*=\s*useTheme\(\)/g.test(content);
  const hasUseThemeImport = /import.*useTheme.*from.*ThemeProvider/g.test(content);
  
  if (hasTokensColors && !hasUseThemeCall) {
    modified = true;
    console.log(`  🎯 File uses tokens.colors but missing useTheme() call`);
    
    let newContent = content;
    
    // Add useTheme import if not present
    if (!hasUseThemeImport) {
      const importStatement = "import { useTheme } from '../theme/ThemeProvider';\n";
      newContent = importStatement + newContent;
    }
    
    // Add useTheme call in the first component function
    const componentPattern = /(export\s+)?(default\s+)?(function|const)\s+(\w+)\s*[=\(]/g;
    const match = componentPattern.exec(newContent);
    
    if (match) {
      const functionStart = match.index + match[0].length;
      const useThemeStatement = '\n  const { tokens } = useTheme();\n';
      newContent = newContent.slice(0, functionStart) + useThemeStatement + newContent.slice(functionStart);
    }
    
    return { content: newContent, modified };
  }
  
  return { content, modified: false };
}

// Add missing imports
function addMissingImports(content) {
  let modified = false;
  let newContent = content;
  
  // Check if Text is used but not imported
  const hasTextUsage = /<Text[^>]*>/g.test(content);
  const hasTextImport = /import.*Text.*from.*react-native/g.test(content);
  
  if (hasTextUsage && !hasTextImport) {
    modified = true;
    console.log(`  📦 Adding missing Text import`);
    
    // Find the first import statement
    const importMatch = /import.*from.*['"`]/g.exec(newContent);
    if (importMatch) {
      const importIndex = importMatch.index;
      const lineEnd = newContent.indexOf('\n', importIndex);
      const importLine = newContent.substring(importIndex, lineEnd);
      
      // Check if it's a react-native import
      if (importLine.includes("from 'react-native'")) {
        // Add Text to existing import
        const updatedImport = importLine.replace(
          /import\s*\{([^}]*)\}\s*from\s*['"`]react-native['"`]/,
          (match, imports) => {
            const importList = imports.split(',').map(i => i.trim());
            if (!importList.includes('Text')) {
              importList.push('Text');
            }
            return `import { ${importList.join(', ')} } from 'react-native'`;
          }
        );
        newContent = newContent.replace(importLine, updatedImport);
      } else {
        // Add new import
        const newImport = "import { Text } from 'react-native';\n";
        newContent = newImport + newContent;
      }
    } else {
      // No imports found, add at the top
      const newImport = "import { Text } from 'react-native';\n";
      newContent = newImport + newContent;
    }
  }
  
  return { content: newContent, modified };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let totalModified = false;
    
    console.log(`\n🔍 Processing: ${path.relative(process.cwd(), filePath)}`);
    
    // Apply all rules
    const textResult = fixUnwrappedText(newContent);
    if (textResult.modified) {
      newContent = textResult.content;
      totalModified = true;
    }
    
    const colorResult = fixInlineColors(newContent);
    if (colorResult.modified) {
      newContent = colorResult.content;
      totalModified = true;
    }
    
    const themeResult = ensureUseThemeHook(newContent);
    if (themeResult.modified) {
      newContent = themeResult.content;
      totalModified = true;
    }
    
    const importResult = addMissingImports(newContent);
    if (importResult.modified) {
      newContent = importResult.content;
      totalModified = true;
    }
    
    if (totalModified) {
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
  
  console.log('🔍 Scanning for JSX rule violations...');
  console.log(`📁 Pattern: ${pattern}`);
  console.log('\n📋 Rules being enforced:');
  console.log('  1. 📝 All string literals must be wrapped in <Text>');
  console.log('  2. 🎨 No inline static colors - use tokens.colors.*');
  console.log('  3. 🎯 useTheme() hook required when using tokens.colors');
  console.log('  4. 📦 Auto-add missing imports (Text, useTheme)');
  
  const files = glob.sync(pattern);
  
  if (files.length === 0) {
    console.log('No .tsx files found in src directory');
    return;
  }
  
  console.log(`\n📄 Found ${files.length} .tsx files`);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    if (processFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n🎉 Summary: Fixed ${fixedCount} files`);
  
  if (fixedCount > 0) {
    console.log('\n💡 Next steps:');
    console.log('  1. Review the changes to ensure they look correct');
    console.log('  2. Test the app to make sure nothing broke');
    console.log('  3. Run "npm run lint" to check for any remaining issues');
  }
}

if (require.main === module) {
  main();
}

module.exports = { 
  fixUnwrappedText, 
  fixInlineColors, 
  ensureUseThemeHook, 
  addMissingImports, 
  processFile 
}; 