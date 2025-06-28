#!/usr/bin/env node

const fs = require('fs');

// Files that definitely need useTheme fixes based on TypeScript errors
const criticalFiles = [
  'src/components/ui/ActionSheet.tsx',
  'src/components/ui/BottomNav.tsx',
  'src/components/ui/Card.tsx'
];

function fixUseTheme(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if file uses tokens but doesn't have useTheme
  const usesTokens = /tokens\./g.test(content);
  const hasUseTheme = /const \{.*tokens.*\} = useTheme\(\)/g.test(content);

  if (usesTokens && !hasUseTheme) {
    console.log(`🔧 Fixing ${filePath} - missing useTheme`);
    
    // Find the component function start
    const componentMatch = content.match(/(export\s+)?(const|function)\s+(\w+)\s*[:=]\s*(React\.)?FC/);
    if (componentMatch) {
      const componentStart = content.indexOf(componentMatch[0]);
      const braceStart = content.indexOf('{', componentStart);
      if (braceStart !== -1) {
        const nextLine = content.indexOf('\n', braceStart);
        if (nextLine !== -1) {
          // Check if there's already a useTheme import
          const hasThemeImport = /from.*ThemeProvider/g.test(content);
          if (!hasThemeImport) {
            // Add theme import
            const reactImportMatch = content.match(/import.*React/);
            if (reactImportMatch) {
              const importIndex = content.lastIndexOf(reactImportMatch[0]) + reactImportMatch[0].length;
              content = content.slice(0, importIndex) + '\nimport { useTheme } from \'../../theme/ThemeProvider\';' + content.slice(importIndex);
            }
          }
          
          // Add useTheme call
          const useThemeLine = `  const { tokens } = useTheme();\n`;
          content = content.slice(0, nextLine + 1) + useThemeLine + content.slice(nextLine + 1);
          modified = true;
        }
      }
    }

    // Alternative pattern for arrow functions without FC
    if (!modified) {
      const arrowMatch = content.match(/(export\s+)?const\s+(\w+)\s*[:=]\s*\([^)]*\)\s*[:=]\s*>/);
      if (arrowMatch) {
        const arrowStart = content.indexOf(arrowMatch[0]);
        const braceStart = content.indexOf('{', arrowStart);
        if (braceStart !== -1) {
          const nextLine = content.indexOf('\n', braceStart);
          if (nextLine !== -1) {
            // Check if there's already a useTheme import
            const hasThemeImport = /from.*ThemeProvider/g.test(content);
            if (!hasThemeImport) {
              // Add theme import
              const reactImportMatch = content.match(/import.*React/);
              if (reactImportMatch) {
                const importIndex = content.lastIndexOf(reactImportMatch[0]) + reactImportMatch[0].length;
                content = content.slice(0, importIndex) + '\nimport { useTheme } from \'../../theme/ThemeProvider\';' + content.slice(importIndex);
              }
            }
            
            // Add useTheme call
            const useThemeLine = `  const { tokens } = useTheme();\n`;
            content = content.slice(0, nextLine + 1) + useThemeLine + content.slice(nextLine + 1);
            modified = true;
          }
        }
      }
    }
  }

  // Fix specific syntax issues
  content = content.replace(/\) => \{;/g, ') => {');
  content = content.replace(/;\s*$/gm, '');

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed for ${filePath}`);
  }
}

// Process critical files
console.log('🔧 Fixing missing useTheme calls...\n');

criticalFiles.forEach(file => {
  fixUseTheme(file);
});

console.log('\n✅ useTheme fixes completed!'); 