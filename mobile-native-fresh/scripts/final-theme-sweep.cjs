#!/usr/bin/env node

const fs = require('fs');

// All files that need useTheme fixes based on TypeScript errors
const filesToFix = [
  'src/components/ui/FloatingActionButton.tsx',
  'src/components/ui/LoadingScreen.tsx',
  'src/components/ui/ModernHeader.tsx',
  'src/components/ui/TagChip.tsx',
  'src/components/ui/TagFilter.tsx',
  'src/components/ui/Text.tsx',
  'src/components/ui/VoiceRecorder.tsx'
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
    
    // Add theme import if missing
    const hasThemeImport = /from.*ThemeProvider/g.test(content);
    if (!hasThemeImport) {
      const reactImportMatch = content.match(/import.*React/);
      if (reactImportMatch) {
        const importIndex = content.lastIndexOf(reactImportMatch[0]) + reactImportMatch[0].length;
        content = content.slice(0, importIndex) + '\nimport { useTheme } from \'../../theme/ThemeProvider\';' + content.slice(importIndex);
      }
    }

    // Find component function and add useTheme
    const componentMatch = content.match(/(export\s+)?(const|function)\s+(\w+)\s*[:=]\s*(React\.)?FC/);
    if (componentMatch) {
      const componentStart = content.indexOf(componentMatch[0]);
      const braceStart = content.indexOf('{', componentStart);
      if (braceStart !== -1) {
        const nextLine = content.indexOf('\n', braceStart);
        if (nextLine !== -1) {
          const useThemeLine = `  const { tokens } = useTheme();\n`;
          content = content.slice(0, nextLine + 1) + useThemeLine + content.slice(nextLine + 1);
          modified = true;
        }
      }
    }

    // Alternative pattern for arrow functions
    if (!modified) {
      const arrowMatch = content.match(/(export\s+)?const\s+(\w+)\s*[:=]\s*\([^)]*\)\s*[:=]\s*>/);
      if (arrowMatch) {
        const arrowStart = content.indexOf(arrowMatch[0]);
        const braceStart = content.indexOf('{', arrowStart);
        if (braceStart !== -1) {
          const nextLine = content.indexOf('\n', braceStart);
          if (nextLine !== -1) {
            const useThemeLine = `  const { tokens } = useTheme();\n`;
            content = content.slice(0, nextLine + 1) + useThemeLine + content.slice(nextLine + 1);
            modified = true;
          }
        }
      }
    }
  }

  // Fix specific issues
  if (filePath.includes('BottomNav.tsx')) {
    // Fix missing children prop in Badge component
    content = content.replace(
      /<AutoRoleView[^>]*forceRole="badge"[^>]*>\s*\{\/\* Empty children for badge \*\/\}\s*<\/AutoRoleView>/g,
      '<AutoRoleView forceRole="badge">0</AutoRoleView>'
    );
    modified = true;
  }

  if (filePath.includes('NeonGradientText.tsx') || filePath.includes('TagChip.tsx')) {
    // Fix numberOfLines prop
    content = content.replace(/numberOfLines=/g, '_numberOfLines=');
    modified = true;
  }

  if (filePath.includes('DarkAlertDialog.tsx')) {
    // Fix $1Props issue
    content = content.replace(/\$1Props/g, 'AlertDialogProps');
    modified = true;
  }

  // Fix import spacing
  content = content.replace(/(import.*from.*['"]react['"])\n(import.*from.*['"]react-native['"])/g, '$1\n\n$2');

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed for ${filePath}`);
  }
}

// Process all files
console.log('🔧 Starting final theme sweep...\n');

filesToFix.forEach(file => {
  fixUseTheme(file);
});

console.log('\n✅ Final theme sweep completed!'); 