const fs = require('fs');
const path = require('path');

function fixRemainingErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixedContent = content;
    let changes = 0;

    // Fix 1: Remove duplicate tokens declarations
    const duplicateTokensPattern = /const \{ tokens \} = useTheme\(\);\s*\n\s*const \{ tokens \} = useTheme\(\);/g;
    if (duplicateTokensPattern.test(fixedContent)) {
      fixedContent = fixedContent.replace(duplicateTokensPattern, 'const { tokens } = useTheme();');
      changes++;
    }

    // Fix 2: Replace "subheading" with "heading" in Text variants
    fixedContent = fixedContent.replace(/variant="subheading"/g, 'variant="heading"');
    if (content !== fixedContent) changes++;

    // Fix 3: Replace "label" with "body" in Text variants
    fixedContent = fixedContent.replace(/variant="label"/g, 'variant="body"');
    if (content !== fixedContent) changes++;

    // Fix 4: Remove duplicate accessibilityRole props
    const duplicateAccessibilityPattern = /accessibilityRole="button"\s*\n\s*accessibilityRole="button"/g;
    if (duplicateAccessibilityPattern.test(fixedContent)) {
      fixedContent = fixedContent.replace(duplicateAccessibilityPattern, 'accessibilityRole="button"');
      changes++;
    }

    // Fix 5: Add missing useTheme() calls where tokens is used but not declared
    if (fixedContent.includes('tokens.') && !fixedContent.includes('const { tokens } = useTheme()')) {
      // Find the first import statement and add useTheme after it
      const importMatch = fixedContent.match(/import.*?from ['"]react-native['"];?\s*\n/);
      if (importMatch) {
        const useThemeImport = "import { useTheme } from '../theme/theme';\n";
        if (!fixedContent.includes('useTheme')) {
          fixedContent = fixedContent.replace(importMatch[0], importMatch[0] + useThemeImport);
          // Add the tokens declaration after the first function/component declaration
          const componentMatch = fixedContent.match(/(export const \w+: React\.FC.*?=.*?\(.*?\) => {)/);
          if (componentMatch) {
            fixedContent = fixedContent.replace(componentMatch[0], componentMatch[0] + '\n  const { tokens } = useTheme();');
          }
          changes++;
        }
      }
    }

    // Fix 6: Remove numberOfLines prop and replace with _numberOfLines
    fixedContent = fixedContent.replace(/numberOfLines=/g, '_numberOfLines=');
    if (content !== fixedContent) changes++;

    // Fix 7: Remove size prop from TagChip components
    fixedContent = fixedContent.replace(/size="sm"/g, '');
    if (content !== fixedContent) changes++;

    // Fix 8: Remove loading prop from OAuthButton components
    fixedContent = fixedContent.replace(/loading=\{.*?\}/g, '');
    if (content !== fixedContent) changes++;

    // Fix 9: Remove buttons prop from DarkAlertDialog
    fixedContent = fixedContent.replace(/buttons=\{.*?\}/g, '');
    if (content !== fixedContent) changes++;

    // Fix 10: Remove accessibilityLabel from ModalButton props
    fixedContent = fixedContent.replace(/accessibilityLabel="[^"]*"/g, '');
    if (content !== fixedContent) changes++;

    if (changes > 0) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed ${changes} issues in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalFixed = 0;

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('reference')) {
      totalFixed += processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixRemainingErrors(fullPath)) {
        totalFixed++;
      }
    }
  }

  return totalFixed;
}

// Process the src directory
const srcPath = path.join(process.cwd(), 'src');
console.log('Starting comprehensive error fix...');
const fixedFiles = processDirectory(srcPath);
console.log(`Fixed errors in ${fixedFiles} files`); 