#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Audit results
const auditResults = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: 0,
    totalIssues: 0,
    accessibilityIssues: 0,
    navigationIssues: 0,
    emptyHandlerIssues: 0,
  },
  issues: []
};

// Patterns to search for
const patterns = {
  touchable: /TouchableOpacity|TouchableHighlight|TouchableWithoutFeedback|Pressable/,
  button: /Button/,
  onPress: /onPress\s*[:=]\s*(?:\(\)\s*=>\s*\{\}|\(\)\s*=>\s*\{\s*\}|undefined|null|\(\)\s*=>\s*\(\))/,
  navigation: /navigate\(['"`]([^'"`]+)['"`]\)/,
  accessibility: /(?:accessibilityRole|accessible|accessibilityLabel)/,
};

// Screen names from navigation - updated to match routes.ts
const registeredScreens = [
  'Home',
  'Dashboard',
  'SignIn',
  'SignUp',
  'PINEntry',
  'Account',
  'Settings',
  'Premium',
  'Search',
  'CreateThoughtmark',
  'ThoughtmarkDetail',
  'AllThoughtmarks',
  'AllBins',
  'CreateBin',
  'Content',
  'Profile',
  'Security',
  'Theme',
  'Help',
  'Terms',
  'Privacy',
  'Contact',
  'Export',
  'HowTo',
  'AdminDashboard',
  'AITools',
  'VoiceRecord',
  'Archive',
  'DesignSystemDemo',
  'BinDetail',
  'Tasks',
];

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, lineNumber) => {
    const lineNum = lineNumber + 1;
    
    // Check for TouchableOpacity/Pressable without accessibility props
    if (patterns.touchable.test(line) && !patterns.accessibility.test(line)) {
      issues.push({
        type: 'accessibility',
        severity: 'error',
        message: 'Touchable element missing accessibility props',
        line: lineNum,
        code: line.trim()
      });
    }

    // Check for empty onPress handlers
    if (patterns.onPress.test(line)) {
      issues.push({
        type: 'empty_handler',
        severity: 'error',
        message: 'Empty or no-op onPress handler',
        line: lineNum,
        code: line.trim()
      });
    }

    // Check for navigation calls
    const navMatch = line.match(patterns.navigation);
    if (navMatch) {
      const screenName = navMatch[1];
      if (!registeredScreens.includes(screenName)) {
        issues.push({
          type: 'navigation',
          severity: 'error',
          message: `Navigation to unregistered screen: ${screenName}`,
          line: lineNum,
          code: line.trim()
        });
      }
    }

    // Check for Button without accessibility props
    if (line.includes('<Button') && !patterns.accessibility.test(line)) {
      issues.push({
        type: 'accessibility',
        severity: 'warning',
        message: 'Button component missing accessibility props',
        line: lineNum,
        code: line.trim()
      });
    }
  });

  return issues;
}

function main() {
  console.log('🔍 Starting Clickable Audit...\n');

  // Find all TypeScript/TSX files
  const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });
  
  auditResults.summary.totalFiles = files.length;

  files.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    const issues = auditFile(fullPath);
    
    if (issues.length > 0) {
      auditResults.issues.push({
        file,
        issues
      });
      
      issues.forEach(issue => {
        auditResults.summary.totalIssues++;
        switch (issue.type) {
          case 'accessibility':
            auditResults.summary.accessibilityIssues++;
            break;
          case 'navigation':
            auditResults.summary.navigationIssues++;
            break;
          case 'empty_handler':
            auditResults.summary.emptyHandlerIssues++;
            break;
        }
      });
    }
  });

  // Write audit results
  const outputPath = '/tmp/clickable-audit-summary.json';
  fs.writeFileSync(outputPath, JSON.stringify(auditResults, null, 2));

  // Print summary
  console.log('📊 Audit Summary:');
  console.log(`   Files scanned: ${auditResults.summary.totalFiles}`);
  console.log(`   Total issues: ${auditResults.summary.totalIssues}`);
  console.log(`   Accessibility issues: ${auditResults.summary.accessibilityIssues}`);
  console.log(`   Navigation issues: ${auditResults.summary.navigationIssues}`);
  console.log(`   Empty handler issues: ${auditResults.summary.emptyHandlerIssues}`);
  console.log(`\n📄 Full report written to: ${outputPath}`);

  // Print detailed issues
  if (auditResults.issues.length > 0) {
    console.log('\n🚨 Issues Found:');
    auditResults.issues.forEach(fileIssue => {
      console.log(`\n📁 ${fileIssue.file}:`);
      fileIssue.issues.forEach(issue => {
        console.log(`   Line ${issue.line}: ${issue.message}`);
        console.log(`   Code: ${issue.code}`);
      });
    });
  } else {
    console.log('\n✅ No issues found!');
  }

  return auditResults.summary.totalIssues === 0 ? 0 : 1;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { auditFile, patterns, registeredScreens }; 