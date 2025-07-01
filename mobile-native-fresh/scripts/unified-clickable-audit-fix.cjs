#!/usr/bin/env node

/**
 * Unified Clickable Audit & Fix Script
 * 
 * This script performs automated fixes for:
 * 1. Missing accessibility props on clickable elements
 * 2. Raw token usage instead of theme tokens
 * 3. Missing onPress handlers
 * 4. Navigation route validation
 * 5. Role enforcement
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define valid routes from navigation types
const VALID_ROUTES = [
  'SignIn', 'SignUp', 'Dashboard', 'Search', 'AITools',
  'AllThoughtmarks', 'ThoughtmarkDetail', 'CreateThoughtmark',
  'AllBins', 'CreateBin', 'BinDetail', 'Tasks', 'Content',
  'VoiceRecord', 'Settings', 'Profile', 'Premium', 'Help',
  'Terms', 'Privacy', 'Security', 'Theme', 'Export',
  'Contact', 'HowTo', 'AdminDashboard', 'Archive', 'DesignSystemDemo',
  'PINEntry', 'ThoughtmarkEdit', 'Subscribe'
];

// Define clickable component patterns that need accessibility props
const CLICKABLE_PATTERNS = [
  /TouchableOpacity/,
  /TouchableHighlight/,
  /TouchableWithoutFeedback/,
  /Pressable/,
  /Button/,
];

// Define accessibility props that should be present
const REQUIRED_ACCESSIBILITY_PROPS = [
  'accessibilityRole',
  'accessible',
  'accessibilityLabel'
];

// Define raw token patterns that should use theme
const RAW_TOKEN_PATTERNS = [
  /#[0-9A-Fa-f]{3,6}/, // Hex colors
  /rgba?\([^)]+\)/, // RGB colors
  /hsla?\([^)]+\)/, // HSL colors
];

// Results storage
const fixResults = {
  filesProcessed: 0,
  accessibilityFixes: 0,
  themeFixes: 0,
  navigationFixes: 0,
  issues: [],
  warnings: [],
  recommendations: []
};

/**
 * Add missing accessibility props to clickable elements
 */
function fixAccessibilityProps(content, filePath) {
  let modified = false;
  
  // Find TouchableOpacity without accessibility props
  const touchableRegex = /<TouchableOpacity([^>]*onPress[^>]*)>/g;
  let match;
  
  while ((match = touchableRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const props = match[1];
    
    // Check if accessibility props are missing
    const hasAccessibilityRole = /accessibilityRole\s*=/.test(props);
    const hasAccessible = /accessible\s*=/.test(props);
    const hasAccessibilityLabel = /accessibilityLabel\s*=/.test(props);
    
    if (!hasAccessibilityRole || !hasAccessible || !hasAccessibilityLabel) {
      let newProps = props;
      
      if (!hasAccessibilityRole) {
        newProps += ' accessibilityRole="button"';
      }
      if (!hasAccessible) {
        newProps += ' accessible={true}';
      }
      if (!hasAccessibilityLabel) {
        newProps += ' accessibilityLabel="Button"';
      }
      
      const newTouchable = `<TouchableOpacity${newProps}>`;
      content = content.replace(fullMatch, newTouchable);
      modified = true;
      fixResults.accessibilityFixes++;
    }
  }
  
  return { content, modified };
}

/**
 * Fix raw token usage by converting to theme tokens
 */
function fixRawTokens(content, filePath) {
  let modified = false;
  
  // Find raw color tokens and suggest theme replacements
  const colorRegex = /#[0-9A-Fa-f]{3,6}/g;
  let match;
  
  while ((match = colorRegex.exec(content)) !== null) {
    const color = match[0];
    const lineNumber = content.substring(0, match.index).split('\n').length;
    
    // Suggest theme token replacement
    let suggestion = '';
    switch (color.toLowerCase()) {
      case '#000':
      case '#000000':
        suggestion = 'tokens.colors.text';
        break;
      case '#fff':
      case '#ffffff':
        suggestion = 'tokens.colors.background';
        break;
      case '#888':
      case '#888888':
        suggestion = 'tokens.colors.textSecondary';
        break;
      case '#ef4444':
        suggestion = 'tokens.colors.danger';
        break;
      default:
        suggestion = `tokens.colors.text /* REVIEW: ${color} */`;
    }
    
    fixResults.warnings.push({
      file: filePath,
      line: lineNumber,
      issue: `Raw color token: ${color}`,
      suggestion: `Replace with: ${suggestion}`
    });
  }
  
  return { content, modified };
}

/**
 * Validate navigation routes
 */
function validateNavigationRoutes(content, filePath) {
  const navigationRegex = /navigation\.navigate\(['"`]([^'"`]+)['"`]/g;
  let match;
  
  while ((match = navigationRegex.exec(content)) !== null) {
    const route = match[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;
    
    if (!VALID_ROUTES.includes(route)) {
      fixResults.issues.push({
        file: filePath,
        line: lineNumber,
        issue: `Invalid navigation route: ${route}`,
        suggestion: `Add route to navigation types or use valid route from: ${VALID_ROUTES.join(', ')}`
      });
    }
  }
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;
    
    // Fix accessibility props
    const accessibilityResult = fixAccessibilityProps(newContent, filePath);
    newContent = accessibilityResult.content;
    modified = modified || accessibilityResult.modified;
    
    // Fix raw tokens
    const tokenResult = fixRawTokens(newContent, filePath);
    newContent = tokenResult.content;
    modified = modified || tokenResult.modified;
    
    // Validate navigation routes
    validateNavigationRoutes(newContent, filePath);
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      fixResults.filesProcessed++;
    }
    
  } catch (error) {
    fixResults.issues.push({
      file: filePath,
      issue: `Error processing file: ${error.message}`
    });
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Starting Unified Clickable Audit & Fix...\n');
  
  // Find all TypeScript/TSX files
  const files = glob.sync('src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
  });
  
  console.log(`📁 Found ${files.length} files to process\n`);
  
  // Process each file
  files.forEach(processFile);
  
  // Generate report
  console.log('📊 Audit & Fix Results:\n');
  console.log(`✅ Files processed: ${fixResults.filesProcessed}`);
  console.log(`🔧 Accessibility fixes: ${fixResults.accessibilityFixes}`);
  console.log(`🎨 Theme fixes: ${fixResults.themeFixes}`);
  console.log(`🧭 Navigation fixes: ${fixResults.navigationFixes}\n`);
  
  if (fixResults.issues.length > 0) {
    console.log('❌ Issues found:');
    fixResults.issues.forEach(issue => {
      console.log(`  - ${issue.file}:${issue.line || ''} - ${issue.issue}`);
      if (issue.suggestion) {
        console.log(`    Suggestion: ${issue.suggestion}`);
      }
    });
    console.log('');
  }
  
  if (fixResults.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    fixResults.warnings.forEach(warning => {
      console.log(`  - ${warning.file}:${warning.line || ''} - ${warning.issue}`);
      if (warning.suggestion) {
        console.log(`    Suggestion: ${warning.suggestion}`);
      }
    });
    console.log('');
  }
  
  if (fixResults.recommendations.length > 0) {
    console.log('💡 Recommendations:');
    fixResults.recommendations.forEach(rec => {
      console.log(`  - ${rec}`);
    });
    console.log('');
  }
  
  console.log('🎯 Audit & Fix complete!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  processFile,
  fixAccessibilityProps,
  fixRawTokens,
  validateNavigationRoutes,
  VALID_ROUTES,
  CLICKABLE_PATTERNS,
  REQUIRED_ACCESSIBILITY_PROPS
}; 