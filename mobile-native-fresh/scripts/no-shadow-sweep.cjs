const fs = require('fs');
const path = require('path');

function fixShadowingIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixedContent = content;
    let changes = 0;

    // Fix 1: Remove duplicate tokens declarations in the same scope
    const duplicateTokensPattern = /const \{ tokens \} = useTheme\(\);\s*\n\s*const \{ tokens \} = useTheme\(\);/g;
    if (duplicateTokensPattern.test(fixedContent)) {
      fixedContent = fixedContent.replace(duplicateTokensPattern, 'const { tokens } = useTheme();');
      changes++;
    }

    // Fix 2: Fix tokens parameter shadowing in function definitions
    // Pattern: function someFunction(tokens: DesignTokens) { ... }
    // Should be: function someFunction(designTokens: DesignTokens) { ... }
    fixedContent = fixedContent.replace(/function (\w+)\(tokens: DesignTokens\)/g, 'function $1(designTokens: DesignTokens)');
    fixedContent = fixedContent.replace(/const (\w+) = \(tokens: DesignTokens\) =>/g, 'const $1 = (designTokens: DesignTokens) =>');
    if (content !== fixedContent) changes++;

    // Fix 3: Fix tokens parameter shadowing in arrow functions
    fixedContent = fixedContent.replace(/\(tokens\) => \{/g, '(designTokens) => {');
    if (content !== fixedContent) changes++;

    // Fix 4: Fix styles redeclaration in the same component
    const duplicateStylesPattern = /const styles = StyleSheet\.create\(\{[\s\S]*?\}\);\s*\n\s*const styles = StyleSheet\.create\(\{/g;
    if (duplicateStylesPattern.test(fixedContent)) {
      // Keep only the first styles declaration
      const matches = fixedContent.match(/const styles = StyleSheet\.create\(\{[\s\S]*?\}\);/g);
      if (matches && matches.length > 1) {
        fixedContent = fixedContent.replace(duplicateStylesPattern, matches[0]);
        changes++;
      }
    }

    // Fix 5: Fix props shadowing in component definitions
    // Pattern: const Component = ({ props }: ComponentProps) => { ... }
    // Should be: const Component = ({ ...props }: ComponentProps) => { ... }
    fixedContent = fixedContent.replace(/const (\w+) = \(\{ props \}: (\w+Props)\) =>/g, 'const $1 = ({ ...props }: $2) =>');
    if (content !== fixedContent) changes++;

    // Fix 6: Fix theme shadowing in function parameters
    fixedContent = fixedContent.replace(/function (\w+)\(theme: Theme\)/g, 'function $1(appTheme: Theme)');
    fixedContent = fixedContent.replace(/const (\w+) = \(theme: Theme\) =>/g, 'const $1 = (appTheme: Theme) =>');
    if (content !== fixedContent) changes++;

    // Fix 7: Fix variants shadowing in function parameters
    fixedContent = fixedContent.replace(/function (\w+)\(variants: Variants\)/g, 'function $1(variantConfig: Variants)');
    fixedContent = fixedContent.replace(/const (\w+) = \(variants: Variants\) =>/g, 'const $1 = (variantConfig: Variants) =>');
    if (content !== fixedContent) changes++;

    // Fix 8: Fix multiple useTheme destructuring in the same scope
    const multipleUseThemePattern = /const \{ tokens \} = useTheme\(\);\s*\n\s*const \{ (\w+) \} = useTheme\(\);/g;
    if (multipleUseThemePattern.test(fixedContent)) {
      fixedContent = fixedContent.replace(multipleUseThemePattern, 'const { tokens, $1 } = useTheme();');
      changes++;
    }

    // Fix 9: Fix duplicate useState declarations
    const duplicateStatePattern = /const \[(\w+), set\1\] = useState\([^)]*\);\s*\n\s*const \[\1, set\1\] = useState\(/g;
    if (duplicateStatePattern.test(fixedContent)) {
      // Keep only the first declaration
      const matches = fixedContent.match(/const \[(\w+), set\1\] = useState\([^)]*\);/g);
      if (matches && matches.length > 1) {
        const firstMatch = matches[0];
        const stateName = firstMatch.match(/const \[(\w+),/)[1];
        const duplicatePattern = new RegExp(`const \\[${stateName}, set${stateName}\\] = useState\\([^)]*\\);\\s*\\n\\s*const \\[${stateName}, set${stateName}\\] = useState\\(`, 'g');
        fixedContent = fixedContent.replace(duplicatePattern, firstMatch);
        changes++;
      }
    }

    // Fix 10: Fix duplicate import statements
    const duplicateImportPattern = /import \{ ([^}]+) \} from ['"]([^'"]+)['"];\s*\n\s*import \{ \1 \} from ['"]\2['"];/g;
    if (duplicateImportPattern.test(fixedContent)) {
      // Keep only the first import
      const matches = fixedContent.match(/import \{ ([^}]+) \} from ['"]([^'"]+)['"];/g);
      if (matches && matches.length > 1) {
        const firstMatch = matches[0];
        const importName = firstMatch.match(/import \{ ([^}]+) \}/)[1];
        const importPath = firstMatch.match(/from ['"]([^'"]+)['"]/)[1];
        const duplicatePattern = new RegExp(`import \\{ ${importName} \\} from ['"]${importPath}['"];\\s*\\n\\s*import \\{ ${importName} \\} from ['"]${importPath}['"];`, 'g');
        fixedContent = fixedContent.replace(duplicatePattern, firstMatch);
        changes++;
      }
    }

    // Fix 11: Fix tokens usage after parameter shadowing
    // Replace tokens. with designTokens. in function bodies where tokens was shadowed
    if (fixedContent.includes('designTokens: DesignTokens') || fixedContent.includes('(designTokens) =>')) {
      // Only replace tokens. with designTokens. in the function scope where it was shadowed
      const functionPattern = /(?:function \w+\(designTokens: DesignTokens\)|const \w+ = \(designTokens: DesignTokens\) =>|\(designTokens\) => \{)([\s\S]*?)(?=\n\s*[^}]|$)/g;
      fixedContent = fixedContent.replace(functionPattern, (match, functionBody) => {
        return match.replace(/tokens\./g, 'designTokens.');
      });
      if (content !== fixedContent) changes++;
    }

    // Fix 12: Fix theme usage after parameter shadowing
    if (fixedContent.includes('appTheme: Theme')) {
      const functionPattern = /(?:function \w+\(appTheme: Theme\)|const \w+ = \(appTheme: Theme\) =>)([\s\S]*?)(?=\n\s*[^}]|$)/g;
      fixedContent = fixedContent.replace(functionPattern, (match, functionBody) => {
        return match.replace(/theme\./g, 'appTheme.');
      });
      if (content !== fixedContent) changes++;
    }

    // Fix 13: Fix variants usage after parameter shadowing
    if (fixedContent.includes('variantConfig: Variants')) {
      const functionPattern = /(?:function \w+\(variantConfig: Variants\)|const \w+ = \(variantConfig: Variants\) =>)([\s\S]*?)(?=\n\s*[^}]|$)/g;
      fixedContent = fixedContent.replace(functionPattern, (match, functionBody) => {
        return match.replace(/variants\./g, 'variantConfig.');
      });
      if (content !== fixedContent) changes++;
    }

    // Fix 14: Remove empty lines that might have been created
    fixedContent = fixedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    if (content !== fixedContent) changes++;

    if (changes > 0) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed ${changes} shadowing issues in ${filePath}`);
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

    if (stat.isDirectory() && 
        !file.includes('node_modules') && 
        !file.includes('reference') && 
        !file.includes('webapp') && 
        !file.includes('docs/snippets')) {
      totalFixed += processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixShadowingIssues(fullPath)) {
        totalFixed++;
      }
    }
  }

  return totalFixed;
}

// Process the src directory
const srcPath = path.join(process.cwd(), 'src');
console.log('Starting no-shadow-sweep...');
console.log('Targeting: tokens, styles, props, theme, variants');
console.log('Excluding: /reference/, /webapp/, /docs/snippets/');

const fixedFiles = processDirectory(srcPath);
console.log(`Fixed shadowing issues in ${fixedFiles} files`); 