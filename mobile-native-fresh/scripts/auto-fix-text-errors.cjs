#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

// ANSI color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function detectTextErrors() {
  log('🔍 Detecting text string errors...', 'blue');
  
  const srcPath = path.join(__dirname, '../src');
  const tsxFiles = glob.sync(path.join(srcPath, '**/*.tsx'));
  
  let hasErrors = false;
  const errorFiles = [];
  
  for (const file of tsxFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for common text string error patterns
      const errorPatterns = [
        // Direct text in JSX without Text wrapper
        /<[^>]*>[^<]*[a-zA-Z][^<]*<\/[^>]*>/g,
        // Text in View without Text wrapper
        /<View[^>]*>[^<]*[a-zA-Z][^<]*<\/View>/g,
        // Text in TouchableOpacity without Text wrapper
        /<TouchableOpacity[^>]*>[^<]*[a-zA-Z][^<]*<\/TouchableOpacity>/g,
        // Text in Button without Text wrapper (if not using custom Button component)
        /<Button[^>]*>[^<]*[a-zA-Z][^<]*<\/Button>/g,
      ];
      
      let fileHasErrors = false;
      
      for (const pattern of errorPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          // Filter out false positives (already wrapped text, comments, etc.)
          const realErrors = matches.filter(match => {
            // Skip if it's already wrapped in Text component
            if (match.includes('<Text>') || match.includes('</Text>')) return false;
            // Skip if it's a comment
            if (match.includes('{/*') || match.includes('*/}')) return false;
            // Skip if it's just whitespace or special characters
            if (match.replace(/[<>\s\/]/g, '').length === 0) return false;
            // Skip if it's a JSX expression
            if (match.includes('{') && match.includes('}')) return false;
            return true;
          });
          
          if (realErrors.length > 0) {
            fileHasErrors = true;
            break;
          }
        }
      }
      
      if (fileHasErrors) {
        errorFiles.push(file);
        hasErrors = true;
        log(`❌ Found potential text errors in: ${path.relative(process.cwd(), file)}`, 'red');
      }
      
    } catch (error) {
      log(`⚠️  Error reading file ${file}: ${error.message}`, 'yellow');
    }
  }
  
  return { hasErrors, errorFiles };
}

function runFixScript() {
  log('🔧 Running automated fix script...', 'cyan');
  
  try {
    const fixScriptPath = path.join(__dirname, 'fix-unwrapped-text.cjs');
    const output = execSync(`node "${fixScriptPath}"`, { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    
    log('✅ Fix script completed successfully!', 'green');
    log('\n📋 Fix script output:', 'blue');
    console.log(output);
    
    return true;
  } catch (error) {
    log(`❌ Error running fix script: ${error.message}`, 'red');
    return false;
  }
}

function runLinter() {
  log('🔍 Running linter to check for remaining issues...', 'blue');
  
  try {
    const output = execSync('npm run lint', { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    
    log('✅ Linter completed successfully!', 'green');
    return true;
  } catch (error) {
    log(`⚠️  Linter found issues: ${error.message}`, 'yellow');
    return false;
  }
}

function main() {
  log('🚀 Starting automated text error detection and fix...', 'bold');
  
  // Step 1: Detect errors
  const { hasErrors, errorFiles } = detectTextErrors();
  
  if (!hasErrors) {
    log('✅ No text string errors detected!', 'green');
    return;
  }
  
  log(`\n📊 Found ${errorFiles.length} files with potential text errors`, 'yellow');
  
  // Step 2: Run fix script
  const fixSuccess = runFixScript();
  
  if (!fixSuccess) {
    log('❌ Failed to run fix script', 'red');
    return;
  }
  
  // Step 3: Run linter to verify fixes
  const lintSuccess = runLinter();
  
  if (lintSuccess) {
    log('\n🎉 All text string errors have been automatically fixed!', 'green');
  } else {
    log('\n⚠️  Some issues may remain. Please review the linter output.', 'yellow');
  }
  
  log('\n💡 Next steps:', 'blue');
  log('   1. Test your app to ensure everything works correctly');
  log('   2. Review the changes made by the fix script');
  log('   3. Commit the changes if everything looks good');
}

// Run the main function
if (require.main === module) {
  main();
}

module.exports = { detectTextErrors, runFixScript, runLinter }; 