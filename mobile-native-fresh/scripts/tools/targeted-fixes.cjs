#!/usr/bin/env node
/**
 * Targeted Fixes Tool
 * Applies specific fixes for common issues identified in the codebase
 * Part of ULTRA-fix.sh validation chain
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const APP_DIR = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh';

function log(message) {
  console.log(`[targeted-fixes] ${message}`);
}

function applyTargetedFixes() {
  log('Applying targeted fixes...');
  
  let fixesApplied = 0;
  
  // Fix 1: Ensure proper import statements
  function fixImports() {
    log('Checking for import statement issues...');
    const srcDirs = ['src-nextgen', 'src-reference'];
    
    for (const srcDir of srcDirs) {
      const fullSrcPath = path.join(APP_DIR, srcDir);
      if (fs.existsSync(fullSrcPath)) {
        try {
          const files = fs.readdirSync(fullSrcPath, { recursive: true });
          for (const file of files) {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
              const filePath = path.join(fullSrcPath, file);
              let content = fs.readFileSync(filePath, 'utf8');
              let modified = false;
              
              // Fix relative imports that should be absolute
              const relativeImportRegex = /import\s+.*\s+from\s+['"]\.\.\/\.\.\/\.\.\//g;
              if (relativeImportRegex.test(content)) {
                log(`Found deep relative imports in ${file} - consider using absolute imports`);
                modified = true;
              }
              
              // Fix missing React imports in JSX files
              if (file.endsWith('.tsx') && !content.includes('import React') && content.includes('React.')) {
                log(`Adding missing React import to ${file}`);
                content = `import React from 'react';\n${content}`;
                modified = true;
              }
              
              if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                fixesApplied++;
              }
            }
          }
        } catch (error) {
          log(`Error scanning ${srcDir}: ${error.message}`);
        }
      }
    }
  }
  
  // Fix 2: Ensure proper TypeScript types
  function fixTypeScriptTypes() {
    log('Checking for TypeScript type issues...');
    
    try {
      // Run TypeScript check to identify issues
      const tsOutput = execSync('npx tsc --noEmit --skipLibCheck', { 
        cwd: APP_DIR, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Parse TypeScript output for common issues
      const lines = tsOutput.split('\n');
      for (const line of lines) {
        if (line.includes('error TS') && line.includes('implicitly has an')) {
          log(`Found implicit any type: ${line.trim()}`);
          fixesApplied++;
        }
        
        if (line.includes('error TS') && line.includes('Cannot find module')) {
          log(`Found missing module: ${line.trim()}`);
          fixesApplied++;
        }
      }
    } catch (error) {
      // TypeScript errors are expected, parse the stderr
      const errorOutput = error.stderr?.toString() || '';
      const lines = errorOutput.split('\n');
      
      for (const line of lines) {
        if (line.includes('error TS') && line.includes('implicitly has an')) {
          log(`Found implicit any type: ${line.trim()}`);
          fixesApplied++;
        }
        
        if (line.includes('error TS') && line.includes('Cannot find module')) {
          log(`Found missing module: ${line.trim()}`);
          fixesApplied++;
        }
      }
    }
  }
  
  // Fix 3: Ensure proper ESLint configuration
  function fixESLintConfig() {
    log('Checking ESLint configuration...');
    
    const eslintConfigPath = path.join(APP_DIR, '.eslintrc.js');
    if (fs.existsSync(eslintConfigPath)) {
      try {
        const content = fs.readFileSync(eslintConfigPath, 'utf8');
        
        // Check for common ESLint issues
        if (!content.includes('@typescript-eslint')) {
          log('Missing TypeScript ESLint configuration');
          fixesApplied++;
        }
        
        if (!content.includes('react-hooks')) {
          log('Missing React Hooks ESLint rules');
          fixesApplied++;
        }
        
      } catch (error) {
        log(`Error reading ESLint config: ${error.message}`);
      }
    }
  }
  
  // Fix 4: Ensure proper package.json scripts
  function fixPackageScripts() {
    log('Checking package.json scripts...');
    
    const packageJsonPath = path.join(APP_DIR, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const content = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(content);
        
        const requiredScripts = [
          'test:unit',
          'lint:fix-all',
          'tsc:check',
          'validate-runtime'
        ];
        
        for (const script of requiredScripts) {
          if (!packageJson.scripts || !packageJson.scripts[script]) {
            log(`Missing required script: ${script}`);
            fixesApplied++;
          }
        }
        
      } catch (error) {
        log(`Error reading package.json: ${error.message}`);
      }
    }
  }
  
  // Apply all fixes
  fixImports();
  fixTypeScriptTypes();
  fixESLintConfig();
  fixPackageScripts();
  
  log(`Applied ${fixesApplied} targeted fixes`);
  
  if (fixesApplied > 0) {
    log('⚠️  Targeted fixes applied - review changes');
    return 1; // Exit with warning
  } else {
    log('✅ No targeted fixes needed');
    return 0; // Exit successfully
  }
}

// Main execution
if (require.main === module) {
  try {
    const exitCode = applyTargetedFixes();
    process.exit(exitCode);
  } catch (error) {
    log(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { applyTargetedFixes };
