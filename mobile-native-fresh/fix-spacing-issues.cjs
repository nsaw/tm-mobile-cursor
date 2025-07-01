const fs = require('fs');
const path = require('path');

// Mapping from old spacingTokens properties to new designTokens.spacing values
const spacingMapping = {
  'pagePaddingHorizontal': 'page',
  'pagePaddingVertical': 'lg',
  'sectionMarginBottom': 'sm',
  'sectionHeaderMarginBottom': 'xs',
  'cardPaddingVertical': 'md',
  'cardPaddingHorizontal': 'lg',
  'cardMarginBottom': 'md',
  'buttonPadding': 'sm',
  'buttonMarginTop': 'md',
  'headerMarginBottom': 'sm',
  'headerPaddingHorizontal': 'page',
  'containerPaddingHorizontal': 'page',
  'containerPaddingVertical': 'lg',
  'modalPaddingHorizontal': 'lg',
  'modalPaddingVertical': 'lg',
  'listItemMarginBottom': 'xs',
  'listItemPadding': 'md',
  'formFieldMarginBottom': 'md',
  'formSectionMarginBottom': 'lg',
  'iconMarginRight': 'sm',
  'iconSize': 'sm',
  'textLineHeight': 'sm',
  'textMarginBottom': 'xs'
};

// Files that need fixing
const filesToFix = [
  'src/features/bins/screens/CreateBinScreen.tsx',
  'src/features/search/screens/SearchScreen.tsx',
  'src/features/auth/screens/SignIn.tsx',
  'src/components/ui/Button.tsx',
  'src/components/ui/Card.tsx',
  'src/components/ui/PremiumFeatureWrapper.tsx',
  'src/components/ui/SessionHydrationGuard.tsx',
  'src/components/ui/TagChip.tsx'
];

function fixSpacingIssues(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Fix missing tokens references
    const missingTokensRegex = /\btokens\b(?!\s*:)/g;
    if (missingTokensRegex.test(content)) {
      content = content.replace(missingTokensRegex, 'designTokens');
      modified = true;
      console.log(`✅ Fixed missing tokens references in ${filePath}`);
    }

    // Fix spacing property mapping
    for (const [oldProp, newProp] of Object.entries(spacingMapping)) {
      const spacingRegex = new RegExp(`designTokens\\.spacing\\.${oldProp}\\b`, 'g');
      if (spacingRegex.test(content)) {
        content = content.replace(spacingRegex, `designTokens.spacing.${newProp}`);
        modified = true;
        console.log(`✅ Fixed spacing property ${oldProp} → ${newProp} in ${filePath}`);
      }
    }

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Fixing spacing issues and missing tokens references...\n');

let processedCount = 0;
let errorCount = 0;

for (const file of filesToFix) {
  if (fixSpacingIssues(file)) {
    processedCount++;
  } else {
    errorCount++;
  }
}

console.log(`\n📊 Fix Summary:`);
console.log(`✅ Successfully processed: ${processedCount} files`);
console.log(`❌ Errors: ${errorCount} files`);
console.log(`📁 Total files attempted: ${filesToFix.length}`);

if (errorCount === 0) {
  console.log('\n🎉 All spacing issues fixed!');
} else {
  console.log('\n⚠️  Some files had issues. Check the logs above.');
} 