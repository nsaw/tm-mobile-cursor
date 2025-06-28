#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files that need useTheme fixes
const filesToFix = [
  'src/components/ui/ActionSheet.tsx',
  'src/components/ui/BottomNav.tsx',
  'src/components/ui/Card.tsx',
  'src/components/ui/DesignSystemDemo.tsx',
  'src/components/ui/FloatingActionButton.tsx',
  'src/components/ui/GlassmorphicContainer.tsx',
  'src/components/ui/NeonGradientText.tsx',
  'src/components/ui/TagChip.tsx',
  'src/components/ui/TagFilter.tsx',
  'src/features/auth/components/LoginForm.tsx',
  'src/features/auth/components/OAuthButton.tsx',
  'src/features/auth/components/RegistrationForm.tsx',
  'src/features/auth/screens/SignInScreen.tsx',
  'src/features/auth/screens/SignUpScreen.tsx',
  'src/features/bins/screens/CreateBinScreen.tsx',
  'src/features/content/screens/ContentScreen.tsx',
  'src/features/home/components/AIToolsCard.tsx',
  'src/features/home/components/DashboardExample.tsx',
  'src/features/home/components/QuickActions.tsx',
  'src/features/home/screens/DashboardScreen.tsx',
  'src/features/home/screens/HomeScreen.tsx',
  'src/features/search/screens/SearchScreen.tsx',
  'src/features/settings/screens/ContactScreen.tsx',
  'src/features/settings/screens/ExportScreen.tsx',
  'src/features/settings/screens/HelpScreen.tsx',
  'src/features/settings/screens/HowToScreen.tsx',
  'src/features/settings/screens/PremiumScreen.tsx',
  'src/features/settings/screens/PrivacyScreen.tsx',
  'src/features/settings/screens/ProfileScreen.tsx',
  'src/features/settings/screens/SecurityScreen.tsx',
  'src/features/settings/screens/TermsScreen.tsx',
  'src/features/settings/screens/ThemeScreen.tsx',
  'src/features/thoughtmarks/screens/ThoughtmarkDetailScreen.tsx',
  'src/features/thoughtmarks/screens/UnifiedThoughtmarkScreen.tsx',
  'src/navigation/AppNavigator.tsx',
  'src/components/wrappers/AutoRoleView.tsx'
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if file uses tokens but doesn't have useTheme
  const usesTokens = /tokens\./g.test(content);
  const hasUseTheme = /useTheme/g.test(content);
  const hasThemeImport = /from.*ThemeProvider/g.test(content);

  if (usesTokens && !hasUseTheme) {
    console.log(`Fixing ${filePath} - missing useTheme`);
    
    // Add theme import if missing
    if (!hasThemeImport) {
      const importMatch = content.match(/import.*from.*['"]react['"]/);
      if (importMatch) {
        const importIndex = content.lastIndexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, importIndex) + '\nimport { useTheme } from \'../../theme/ThemeProvider\';' + content.slice(importIndex);
      } else {
        // Add after React import
        const reactImportMatch = content.match(/import.*React/);
        if (reactImportMatch) {
          const importIndex = content.lastIndexOf(reactImportMatch[0]) + reactImportMatch[0].length;
          content = content.slice(0, importIndex) + '\nimport { useTheme } from \'../../theme/ThemeProvider\';' + content.slice(importIndex);
        }
      }
    }

    // Find the component function and add useTheme
    const componentMatch = content.match(/(export\s+)?(const|function)\s+(\w+)\s*[:=]\s*(React\.)?FC/);
    if (componentMatch) {
      const componentName = componentMatch[3];
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
      const arrowMatch = content.match(/(export\s+)?const\s+(\w+)\s*[:=]\s*\([^)]*\)\s*[:=]\s*>\s*{/);
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

  // Fix specific issues in certain files
  if (filePath.includes('BottomNav.tsx')) {
    // Fix missing children prop in Badge component
    content = content.replace(
      /<Badge[^>]*forceRole="badge"[^>]*>/g,
      '<Badge forceRole="badge">0</Badge>'
    );
    modified = true;
  }

  if (filePath.includes('OnboardingModal.tsx')) {
    // Remove unused screenWidth variable
    content = content.replace(/const \{ width: screenWidth \} = Dimensions\.get\('window'\);\n/, '');
    // Remove unused onboardingButtonText
    content = content.replace(/\/\/ Button text size for onboarding\n  const onboardingButtonText = \{[\s\S]*?\};\n/, '');
    modified = true;
  }

  // Fix import spacing issues
  content = content.replace(/(import.*from.*['"]react['"])\n(import.*from.*['"]react-native['"])/g, '$1\n\n$2');
  content = content.replace(/(import.*from.*['"]react-native['"])\n(import.*from.*['"]lucide-react-native['"])/g, '$1\n\n$2');

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed for ${filePath}`);
  }
}

// Process all files
console.log('🔧 Starting comprehensive theme fixes...\n');

filesToFix.forEach(file => {
  fixFile(file);
});

console.log('\n✅ Comprehensive theme fixes completed!'); 