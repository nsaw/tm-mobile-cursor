#!/usr/bin/env node

const fs = require('fs');

// Files that have syntax errors
const filesToFix = [
  'src/components/ui/FloatingActionButton.tsx',
  'src/components/ui/LoadingScreen.tsx',
  'src/components/ui/ModernHeader.tsx',
  'src/components/ui/TagChip.tsx',
  'src/components/ui/TagFilter.tsx',
  'src/components/ui/Text.tsx',
  'src/components/ui/VoiceRecorder.tsx'
];

function fixSyntaxErrors(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix the incorrect useTheme placement in destructuring
  content = content.replace(
    /export const (\w+): React\.FC<(\w+)> = \(\{\s*const \{ tokens \} = useTheme\(\);\s*([^}]+)\}\) => \{;/g,
    'export const $1: React.FC<$2> = ({$3}) => {\n  const { tokens } = useTheme();'
  );

  // Fix extra semicolons
  content = content.replace(/;\s*$/gm, '');

  // Fix extra semicolons after closing braces
  content = content.replace(/\);\s*;/g, ');');

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed syntax in ${filePath}`);
  } else {
    console.log(`⏭️  No syntax fixes needed for ${filePath}`);
  }
}

// Process all files
console.log('🔧 Fixing syntax errors...\n');

filesToFix.forEach(file => {
  fixSyntaxErrors(file);
});

console.log('\n✅ Syntax error fixes completed!'); 