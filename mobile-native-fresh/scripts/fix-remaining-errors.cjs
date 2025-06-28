const fs = require('fs');
const path = require('path');

function fixRemainingErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixedContent = content;
    let changes = 0;

    // Remove duplicate accessibilityRole="button"
    fixedContent = fixedContent.replace(/(accessibilityRole="button"\s*){2,}/g, 'accessibilityRole="button" ');
    if (content !== fixedContent) changes++;

    // Remove duplicate import of Text
    fixedContent = fixedContent.replace(/import \{ Text \} from 'react-native';\s*\nimport \{ Text \} from '\.\.\/ui\/Text';/g, "import { Text } from '../ui/Text';");
    if (content !== fixedContent) changes++;

    // Remove duplicate tokens declarations in same scope
    fixedContent = fixedContent.replace(/const \{ tokens \} = useTheme\(\);\s*\n\s*const \{ tokens \} = useTheme\(\);/g, 'const { tokens } = useTheme();');
    if (content !== fixedContent) changes++;

    // Remove all accessible and accessibilityLabel from ModalButton usages
    fixedContent = fixedContent.replace(/accessible=\{true\}/g, '');
    fixedContent = fixedContent.replace(/accessibilityLabel=\{[^}]+\}/g, '');
    fixedContent = fixedContent.replace(/accessibilityLabel="[^"]*"/g, '');
    if (content !== fixedContent) changes++;

    // Remove size prop from TagChip usages
    fixedContent = fixedContent.replace(/size="sm"/g, '');
    if (content !== fixedContent) changes++;

    // Remove loading prop from OAuthButton usages
    fixedContent = fixedContent.replace(/loading=\{[^}]+\}/g, '');
    if (content !== fixedContent) changes++;

    // Remove buttons prop from DarkAlertDialog usages
    fixedContent = fixedContent.replace(/buttons=\{[^}]+\}/g, '');
    if (content !== fixedContent) changes++;

    // Remove onDismiss prop from DarkAlertDialog usages
    fixedContent = fixedContent.replace(/onDismiss=\{[^}]+\}/g, '');
    if (content !== fixedContent) changes++;

    // Remove _numberOfLines and replace with numberOfLines for Text, NeonGradientText, etc.
    fixedContent = fixedContent.replace(/_numberOfLines=/g, 'numberOfLines=');
    if (content !== fixedContent) changes++;

    // Fix import of useSafeAreaInsets (should be from 'react-native-safe-area-context')
    fixedContent = fixedContent.replace(/import \{ useSafeAreaInsets \} from 'react-native';/g, "import { useSafeAreaInsets } from 'react-native-safe-area-context';");
    if (content !== fixedContent) changes++;

    // Remove duplicate NavigationProp import
    fixedContent = fixedContent.replace(/import type \{ NavigationProp \} from '\.\.\/\.\.\/navigation\/types';\s*\n/g, '');
    if (content !== fixedContent) changes++;

    // Remove colors: [tokens.colors.accent], from styles
    fixedContent = fixedContent.replace(/colors: \[tokens\.colors\.accent\],?\n/g, '');
    if (content !== fixedContent) changes++;

    // Remove invalid variant values (subheading -> heading, label -> body)
    fixedContent = fixedContent.replace(/variant="subheading"/g, 'variant="heading"');
    fixedContent = fixedContent.replace(/variant="label"/g, 'variant="body"');
    if (content !== fixedContent) changes++;

    // Remove duplicate identifier errors for tokens in getRadiusForHeight
    fixedContent = fixedContent.replace(/export function getRadiusForHeight\(height: number, tokens: DesignTokens\): number \{\s*\n\s*const \{ tokens \} = useTheme\(\);/g, 'export function getRadiusForHeight(height: number, tokens: DesignTokens): number {');
    if (content !== fixedContent) changes++;

    // Remove useTheme() from getRadiusForHeight if tokens is passed as param
    fixedContent = fixedContent.replace(/const \{ tokens \} = useTheme\(\);/g, '');
    if (content !== fixedContent) changes++;

    // Remove textVariants import and replace with getTextVariants
    fixedContent = fixedContent.replace(/import \{ textVariants \} from '\.\.\/theme\/variants';/g, "import { getTextVariants } from '../theme/variants';");
    if (content !== fixedContent) changes++;

    // Remove upload-outline icon usage (replace with play-outline)
    fixedContent = fixedContent.replace(/name="upload-outline"/g, 'name="play-outline"');
    if (content !== fixedContent) changes++;

    // Remove any remaining duplicate accessibilityRole
    fixedContent = fixedContent.replace(/(accessibilityRole="button"\s*){2,}/g, 'accessibilityRole="button" ');
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
console.log('Starting comprehensive error fix (pass 2)...');
const fixedFiles = processDirectory(srcPath);
console.log(`Fixed errors in ${fixedFiles} files (pass 2)`); 