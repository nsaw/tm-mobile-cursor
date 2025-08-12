#!/usr/bin/env node

/**
 * Hook Usage Audit Script
 * 
 * Searches for all uses of key hooks and outputs file/line for human audit
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src-nextgen');
const HOOKS_TO_AUDIT = [
  'useVoiceRecorder',
  'useTheme', 
  'useAuth',
  'useNavigation',
  'useThemeWithStyles',
  'useVoiceRecorderState',
  'useVoiceRecorderActions'
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logSection = (title) => {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
};

/**
 * Search for hook usage in files
 */
function searchHookUsage(hookName, files) {
  const results = [];
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes(hookName)) {
          results.push({
            file: path.relative(PROJECT_ROOT, file),
            line: index + 1,
            content: line.trim(),
            hook: hookName
          });
        }
      });
    } catch (error) {
      log(`Error reading file ${file}: ${error.message}`, 'red');
    }
  });
  
  return results;
}

/**
 * Analyze hook usage patterns
 */
function analyzeHookUsage(results) {
  const analysis = {};
  
  HOOKS_TO_AUDIT.forEach(hook => {
    const hookResults = results.filter(r => r.hook === hook);
    analysis[hook] = {
      totalUsage: hookResults.length,
      files: [...new Set(hookResults.map(r => r.file))],
      usageByFile: {}
    };
    
    hookResults.forEach(result => {
      if (!analysis[hook].usageByFile[result.file]) {
        analysis[hook].usageByFile[result.file] = [];
      }
      analysis[hook].usageByFile[result.file].push({
        line: result.line,
        content: result.content
      });
    });
  });
  
  return analysis;
}

/**
 * Check for potential provider wrapping issues
 */
function checkProviderWrapping(analysis) {
  const issues = [];
  
  // Check if screens using hooks are properly wrapped
  const screenFiles = Object.keys(analysis).flatMap(hook => 
    analysis[hook].files.filter(file => 
      file.includes('screens/') || file.includes('components/')
    )
  );
  
  screenFiles.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf8');
      
      // Check for common provider wrapping patterns
      const hasProviderWrapping = content.includes('Provider') || 
                                 content.includes('Context') ||
                                 content.includes('withProvider');
      
      if (!hasProviderWrapping) {
        issues.push({
          file,
          type: 'potential_missing_provider',
          message: 'Screen/component may not be wrapped with required provider'
        });
      }
    } catch (error) {
      // Ignore files that can't be read
    }
  });
  
  return issues;
}

/**
 * Generate audit report
 */
function generateReport(analysis, issues) {
  logSection('HOOK USAGE AUDIT REPORT');
  
  // Summary
  const totalUsage = Object.values(analysis).reduce((sum, hook) => sum + hook.totalUsage, 0);
  log(`Total hook usage found: ${totalUsage}`, 'bright');
  log(`Files analyzed: ${Object.values(analysis).flatMap(hook => hook.files).length}`, 'bright');
  log(`Potential issues found: ${issues.length}`, issues.length > 0 ? 'red' : 'green');
  
  // Hook-by-hook breakdown
  logSection('HOOK USAGE BREAKDOWN');
  
  Object.entries(analysis).forEach(([hook, data]) => {
    log(`\n${hook}:`, 'bright');
    log(`  Total usage: ${data.totalUsage}`, data.totalUsage > 0 ? 'green' : 'yellow');
    log(`  Files: ${data.files.length}`, 'cyan');
    
    if (data.totalUsage > 0) {
      log('  Usage locations:', 'cyan');
      Object.entries(data.usageByFile).forEach(([file, usages]) => {
        usages.forEach(usage => {
          log(`    ${file}:${usage.line} - ${usage.content}`, 'reset');
        });
      });
    }
  });
  
  // Issues
  if (issues.length > 0) {
    logSection('POTENTIAL ISSUES');
    issues.forEach(issue => {
      log(`❌ ${issue.file}: ${issue.message}`, 'red');
    });
  } else {
    log('\n✅ No potential provider wrapping issues detected', 'green');
  }
  
  // Recommendations
  logSection('RECOMMENDATIONS');
  log('1. Verify all screens using hooks are wrapped with appropriate providers', 'yellow');
  log('2. Check App.tsx for proper provider hierarchy', 'yellow');
  log('3. Run provider audit tests: npm run test:provider-audit', 'yellow');
  log('4. Review any files listed in "POTENTIAL ISSUES" above', 'yellow');
}

/**
 * Main execution
 */
function main() {
  log('🔍 Starting Hook Usage Audit...', 'bright');
  
  // Find all TypeScript/TSX files
  const pattern = path.join(SRC_DIR, '**/*.{ts,tsx}');
  
  glob(pattern, (err, files) => {
    if (err) {
      log(`Error finding files: ${err.message}`, 'red');
      process.exit(1);
    }
    
    log(`Found ${files.length} TypeScript/TSX files to analyze`, 'cyan');
    
    // Search for hook usage
    const allResults = [];
    HOOKS_TO_AUDIT.forEach(hook => {
      const results = searchHookUsage(hook, files);
      allResults.push(...results);
    });
    
    // Analyze results
    const analysis = analyzeHookUsage(allResults);
    const issues = checkProviderWrapping(analysis);
    
    // Generate report
    generateReport(analysis, issues);
    
    // Exit with appropriate code
    if (issues.length > 0) {
      log('\n⚠️  Audit completed with potential issues. Please review recommendations above.', 'yellow');
      process.exit(1);
    } else {
      log('\n✅ Hook usage audit completed successfully!', 'green');
      process.exit(0);
    }
  });
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  searchHookUsage,
  analyzeHookUsage,
  checkProviderWrapping,
  generateReport
};
