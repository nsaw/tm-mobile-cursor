#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * JSX Style Role Audit Script
 * 
 * This script performs continuous auditing of JSX components to ensure:
 * 1. Proper role assignments for layout components
 * 2. AutoRoleView compliance patterns
 * 3. Consistent style application via useTheme()
 * 4. Proper component composition and hierarchy
 */

// Define JSX role patterns
const ROLE_PATTERNS = {
  container: /role\s*=\s*["']container["']/,
  header: /role\s*=\s*["']header["']/,
  main: /role\s*=\s*["']main["']/,
  footer: /role\s*=\s*["']footer["']/,
  navigation: /role\s*=\s*["']navigation["']/,
  section: /role\s*=\s*["']section["']/,
  article: /role\s*=\s*["']article["']/,
  button: /role\s*=\s*["']button["']/,
  list: /role\s*=\s*["']list["']/,
  listitem: /role\s*=\s*["']listitem["']/,
};

// Define layout component patterns
const LAYOUT_COMPONENTS = [
  'View',
  'SafeAreaView', 
  'ScrollView',
  'FlatList',
  'SectionList',
  'KeyboardAvoidingView',
];

// Define style compliance patterns
const STYLE_PATTERNS = {
  inlineStyle: /style\s*=\s*\{\{[^}]+\}\}/,
  hardcodedColor: /(color|backgroundColor|borderColor)\s*:\s*["']#[0-9a-fA-F]{3,6}["']/,
  hardcodedDimension: /(width|height|padding|margin)\s*:\s*\d+/,
  tokensUsage: /tokens\.(colors|spacing|typography)/,
  useThemeHook: /const\s*\{\s*tokens\s*\}\s*=\s*useTheme\(\)/,
};

// Results storage
const auditResults = {
  totalFiles: 0,
  filesScanned: 0,
  totalComponents: 0,
  componentsWithRoles: 0,
  componentsWithoutRoles: 0,
  styleViolations: 0,
  autoRoleViewCandidates: 0,
  issues: [],
  suggestions: [],
};

/**
 * Check if a component should have a role assigned
 */
function shouldHaveRole(componentName, context) {
  const layoutRegex = new RegExp(`<(${LAYOUT_COMPONENTS.join('|')})\\b`);
  return layoutRegex.test(context);
}

/**
 * Check for style compliance
 */
function checkStyleCompliance(code, filePath, lineNumber) {
  // Check for hardcoded colors
  if (STYLE_PATTERNS.hardcodedColor.test(code)) {
    auditResults.styleViolations++;
    auditResults.issues.push({
      type: 'style',
      file: filePath,
      line: lineNumber,
      message: 'Hardcoded color detected. Use tokens.colors instead.',
      severity: 'error',
    });
  }

  // Check for hardcoded dimensions
  if (STYLE_PATTERNS.hardcodedDimension.test(code)) {
    auditResults.styleViolations++;
    auditResults.issues.push({
      type: 'style',
      file: filePath,
      line: lineNumber,
      message: 'Hardcoded dimension detected. Use tokens.spacing instead.',
      severity: 'warning',
    });
  }

  // Check for inline styles
  if (STYLE_PATTERNS.inlineStyle.test(code)) {
    auditResults.issues.push({
      type: 'style',
      file: filePath,
      line: lineNumber,
      message: 'Inline styles detected. Consider using StyleSheet or themed styles.',
      severity: 'info',
    });
  }
}

/**
 * Check for AutoRoleView candidates
 */
function checkAutoRoleViewCandidate(code, filePath) {
  const hasMultipleLayoutComponents = (code.match(new RegExp(`<(${LAYOUT_COMPONENTS.join('|')})\\b`, 'g')) || []).length > 3;
  const lacksRoles = !Object.values(ROLE_PATTERNS).some(pattern => pattern.test(code));
  
  if (hasMultipleLayoutComponents && lacksRoles) {
    auditResults.autoRoleViewCandidates++;
    auditResults.suggestions.push(
      `Consider implementing AutoRoleView pattern in ${filePath} - detected ${hasMultipleLayoutComponents} layout components without roles`
    );
  }
}

/**
 * Audit a single file
 */
function auditFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    auditResults.filesScanned++;
    
    let componentCount = 0;
    let rolesFound = 0;
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for layout components
      LAYOUT_COMPONENTS.forEach(component => {
        const componentRegex = new RegExp(`<${component}\\b`);
        if (componentRegex.test(line)) {
          componentCount++;
          auditResults.totalComponents++;
          
          // Check if it has a role
          const hasRole = Object.values(ROLE_PATTERNS).some(pattern => pattern.test(line));
          if (hasRole) {
            rolesFound++;
            auditResults.componentsWithRoles++;
          } else {
            auditResults.componentsWithoutRoles++;
            auditResults.issues.push({
              type: 'role',
              file: filePath,
              line: lineNumber,
              message: `${component} component missing semantic role assignment`,
              severity: 'warning',
            });
          }
        }
      });
      
      // Check style compliance
      checkStyleCompliance(line, filePath, lineNumber);
    });
    
    // Check if file is AutoRoleView candidate
    checkAutoRoleViewCandidate(content, filePath);
    
    // Check if useTheme is properly imported when tokens are used
    if (STYLE_PATTERNS.tokensUsage.test(content) && !STYLE_PATTERNS.useThemeHook.test(content)) {
      auditResults.issues.push({
        type: 'style',
        file: filePath,
        line: 0,
        message: 'File uses tokens but missing useTheme() hook',
        severity: 'error',
      });
    }
    
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
  }
}

/**
 * Generate audit report
 */
function generateReport() {
  const timestamp = new Date().toISOString();
  const complianceRate = auditResults.totalComponents > 0 
    ? Math.round((auditResults.componentsWithRoles / auditResults.totalComponents) * 100)
    : 0;
    
  const report = `
# JSX Style Role Audit Report
Generated: ${timestamp}

## Summary
- Files scanned: ${auditResults.filesScanned}/${auditResults.totalFiles}
- Total layout components: ${auditResults.totalComponents}
- Components with roles: ${auditResults.componentsWithRoles}
- Components without roles: ${auditResults.componentsWithoutRoles}
- Style violations: ${auditResults.styleViolations}
- AutoRoleView candidates: ${auditResults.autoRoleViewCandidates}
- Role compliance rate: ${complianceRate}%

## Issues (${auditResults.issues.length})
${auditResults.issues
  .sort((a, b) => {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  })
  .map(issue => `- **${issue.severity.toUpperCase()}** [${issue.type}]: ${issue.file}:${issue.line} - ${issue.message}`)
  .join('\n')}

## AutoRoleView Suggestions (${auditResults.suggestions.length})
${auditResults.suggestions.map(suggestion => `- ${suggestion}`).join('\n')}

## Next Steps
1. Address all ERROR level issues immediately
2. Review WARNING level issues for accessibility compliance
3. Consider implementing AutoRoleView pattern for complex layouts
4. Ensure all interactive elements have proper semantic roles
`;

  return report;
}

/**
 * Main audit function
 */
function runAudit() {
  console.log('🔍 Starting JSX Style Role Audit...\n');
  
  // Reset results
  Object.assign(auditResults, {
    totalFiles: 0,
    filesScanned: 0,
    totalComponents: 0,
    componentsWithRoles: 0,
    componentsWithoutRoles: 0,
    styleViolations: 0,
    autoRoleViewCandidates: 0,
    issues: [],
    suggestions: [],
  });
  
  // Find all TypeScript/TypeScript React files
  const files = glob.sync('src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.test.*', '**/*.spec.*'],
  });
  
  auditResults.totalFiles = files.length;
  console.log(`Found ${files.length} files to audit...\n`);
  
  // Audit each file
  files.forEach(file => {
    auditFile(file);
  });
  
  // Generate and save report
  const report = generateReport();
  const reportPath = path.join(__dirname, '../audit-style-roles-report.md');
  
  fs.writeFileSync(reportPath, report);
  
  console.log('📊 Audit Complete!');
  console.log(`Report saved to: ${reportPath}\n`);
  
  // Console summary
  console.log('📋 Summary:');
  console.log(`- Files scanned: ${auditResults.filesScanned}`);
  console.log(`- Layout components: ${auditResults.totalComponents}`);
  console.log(`- With roles: ${auditResults.componentsWithRoles}`);
  console.log(`- Without roles: ${auditResults.componentsWithoutRoles}`);
  console.log(`- Style violations: ${auditResults.styleViolations}`);
  
  const errorCount = auditResults.issues.filter(i => i.severity === 'error').length;
  const warningCount = auditResults.issues.filter(i => i.severity === 'warning').length;
  
  if (errorCount > 0) {
    console.log(`\n❌ ${errorCount} errors found that need immediate attention`);
  }
  
  if (warningCount > 0) {
    console.log(`⚠️  ${warningCount} warnings found for review`);
  }
  
  if (auditResults.autoRoleViewCandidates > 0) {
    console.log(`\n💡 ${auditResults.autoRoleViewCandidates} files could benefit from AutoRoleView pattern`);
  }
  
  console.log('\n✅ Audit completed at', new Date().toLocaleTimeString());
}

// Run the audit if executed directly
if (require.main === module) {
  runAudit();
}

module.exports = { runAudit, auditResults };