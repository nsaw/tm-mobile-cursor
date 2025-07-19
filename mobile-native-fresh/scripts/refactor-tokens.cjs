const fs = require('fs');
const path = require('path');

// Files to process (React components with useTheme)
const filesToProcess = [
  'src/features/bins/screens/CreateBinScreen.tsx',
  'src/features/bins/screens/AllBinsScreen.tsx',
  'src/features/home/screens/HomeScreen.tsx',
  'src/features/settings/screens/TermsScreen.tsx',
  'src/features/settings/screens/ThemeScreen.tsx',
  'src/features/search/screens/SearchScreen.tsx',
  'src/features/ai/screens/AIToolsScreen.tsx',
  'src/features/auth/screens/SignIn.tsx',
  'src/features/home/components/AIToolsCard.tsx',
  'src/features/home/screens/DetailScreen.tsx',
  'src/features/home/components/ThoughtmarkCard.tsx',
  'src/components/ui/Text.tsx',
  'src/features/home/components/DashboardExample.tsx',
  'src/features/auth/screens/SignUp.tsx',
  'src/features/settings/screens/ContactScreen.tsx',
  'src/features/auth/components/LoginForm.tsx',
  'src/features/auth/components/OAuthButton.tsx',
  'src/features/auth/screens/PINEntryScreen.tsx',
  'src/features/home/components/SearchBar.tsx',
  'src/features/home/components/BinCard.tsx',
  'src/features/home/components/TaskCard.tsx',
  'src/features/settings/screens/HowToScreen.tsx',
  'src/features/home/components/QuickActions.tsx',
  'src/features/settings/screens/AdminDashboardScreen.tsx',
  'src/components/ui/Button.tsx',
  'src/features/settings/screens/ProfileScreen.tsx',
  'src/features/content/screens/ContentScreen.tsx',
  'src/features/settings/screens/HelpScreen.tsx',
  'src/features/auth/components/RegistrationForm.tsx',
  'src/features/home/components/TagFilter.tsx',
  'src/components/ui/LoadingScreen.tsx',
  'src/features/settings/screens/SecurityScreen.tsx',
  'src/components/ui/PremiumFeatureWrapper.tsx',
  'src/features/settings/screens/PremiumScreen.tsx',
  'src/features/settings/screens/PrivacyScreen.tsx',
  'src/features/settings/screens/ExportScreen.tsx',
  'src/components/ui/BottomNav.tsx',
  'src/components/ui/ModernHeader.tsx',
  'src/components/ui/VoiceRecorder.tsx',
  'src/components/ui/SessionHydrationGuard.tsx',
  'src/components/ui/TagFilter.tsx',
  'src/components/ui/FloatingActionButton.tsx',
  'src/components/ui/DarkAlertDialog.tsx',
  'src/components/ui/DesignSystemDemo.tsx',
  'src/components/ui/ActionSheet.tsx',
  'src/components/ui/TagChip.tsx',
  'src/components/ui/Card.tsx',
  'src/features/thoughtmarks/screens/AllThoughtmarksScreen.tsx',
  'src/features/thoughtmarks/screens/ThoughtmarkDetailScreen.tsx',
  'src/features/thoughtmarks/screens/UnifiedThoughtmarkScreen.tsx',
  'App.tsx'
];

function refactorFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Step 1: Change destructuring from tokens to designTokens
    const destructuringRegex = /const\s*\{\s*tokens\s*\}\s*=\s*useTheme\(\)/g;
    if (destructuringRegex.test(content)) {
      content = content.replace(destructuringRegex, 'const { tokens: designTokens } = useTheme()');
      modified = true;
      console.log(`✅ Updated destructuring in ${filePath}`);
    }

    // Step 2: Replace all tokens. usage with designTokens.
    const tokensUsageRegex = /\btokens\./g;
    if (tokensUsageRegex.test(content)) {
      content = content.replace(tokensUsageRegex, 'designTokens.');
      modified = true;
      console.log(`✅ Updated tokens usage in ${filePath}`);
    }

    // Step 3: Remove direct spacingTokens imports and replace usage
    const spacingTokensImportRegex = /import\s*\{\s*spacingTokens\s*\}\s*from\s*['"][^'"]*spacing['"];?\s*\n?/g;
    if (spacingTokensImportRegex.test(content)) {
      content = content.replace(spacingTokensImportRegex, '');
      modified = true;
      console.log(`✅ Removed spacingTokens import in ${filePath}`);
    }

    // Step 4: Replace spacingTokens usage with designTokens.spacing
    const spacingTokensUsageRegex = /\bspacingTokens\./g;
    if (spacingTokensUsageRegex.test(content)) {
      content = content.replace(spacingTokensUsageRegex, 'designTokens.spacing.');
      modified = true;
      console.log(`✅ Updated spacingTokens usage in ${filePath}`);
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

console.log('🔄 Starting tokens → designTokens refactor...\n');

let processedCount = 0;
let errorCount = 0;

for (const file of filesToProcess) {
  if (refactorFile(file)) {
    processedCount++;
  } else {
    errorCount++;
  }
}

console.log(`\n📊 Refactor Summary:`);
console.log(`✅ Successfully processed: ${processedCount} files`);
console.log(`❌ Errors: ${errorCount} files`);
console.log(`📁 Total files attempted: ${filesToProcess.length}`);

if (errorCount === 0) {
  console.log('\n🎉 All files processed successfully!');
} else {
  console.log('\n⚠️  Some files had issues. Check the logs above.');
} 