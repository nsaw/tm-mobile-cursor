#!/usr/bin/env node
/**
 * Enforcer Waivers Tool
 * Handles ESLint and TypeScript enforcement waivers for legacy code
 * Part of ULTRA-fix.sh validation chain
 */

const fs = require('fs');
const path = require('path');

const APP_DIR = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh';

function log(message) {
  console.log(`[enforcer-waivers] ${message}`);
}

function checkForWaivers() {
  log('Checking for enforcer waivers...');
  
  const waiverFiles = [
    '.eslintrc.js',
    '.eslintrc.json',
    'tsconfig.json',
    'scripts/eslint-waivers.json',
    'scripts/typescript-waivers.json'
  ];
  
  let waiverCount = 0;
  
  for (const waiverFile of waiverFiles) {
    const fullPath = path.join(APP_DIR, waiverFile);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const jsonContent = JSON.parse(content);
        
        // Check for waiver patterns
        if (jsonContent.rules && Object.keys(jsonContent.rules).length > 0) {
          waiverCount += Object.keys(jsonContent.rules).length;
          log(`Found ${Object.keys(jsonContent.rules).length} ESLint rule waivers in ${waiverFile}`);
        }
        
        if (jsonContent.ignorePatterns && jsonContent.ignorePatterns.length > 0) {
          waiverCount += jsonContent.ignorePatterns.length;
          log(`Found ${jsonContent.ignorePatterns.length} ignore patterns in ${waiverFile}`);
        }
        
        if (jsonContent.exclude && jsonContent.exclude.length > 0) {
          waiverCount += jsonContent.exclude.length;
          log(`Found ${jsonContent.exclude.length} exclude patterns in ${waiverFile}`);
        }
        
      } catch (error) {
        log(`Error reading ${waiverFile}: ${error.message}`);
      }
    }
  }
  
  // Check for inline waivers in source files
  const srcDirs = ['src-nextgen', 'src-reference'];
  for (const srcDir of srcDirs) {
    const fullSrcPath = path.join(APP_DIR, srcDir);
    if (fs.existsSync(fullSrcPath)) {
      try {
        const files = fs.readdirSync(fullSrcPath, { recursive: true });
        for (const file of files) {
          if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            const filePath = path.join(fullSrcPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Count inline waivers
            const eslintDisableMatches = content.match(/eslint-disable/g);
            const tsIgnoreMatches = content.match(/@ts-ignore/g);
            const tsExpectErrorMatches = content.match(/@ts-expect-error/g);
            
            if (eslintDisableMatches) {
              waiverCount += eslintDisableMatches.length;
              log(`Found ${eslintDisableMatches.length} eslint-disable comments in ${file}`);
            }
            
            if (tsIgnoreMatches) {
              waiverCount += tsIgnoreMatches.length;
              log(`Found ${tsIgnoreMatches.length} @ts-ignore comments in ${file}`);
            }
            
            if (tsExpectErrorMatches) {
              waiverCount += tsExpectErrorMatches.length;
              log(`Found ${tsExpectErrorMatches.length} @ts-expect-error comments in ${file}`);
            }
          }
        }
      } catch (error) {
        log(`Error scanning ${srcDir}: ${error.message}`);
      }
    }
  }
  
  log(`Total waivers found: ${waiverCount}`);
  
  if (waiverCount > 0) {
    log('⚠️  Enforcer waivers detected - review for compliance');
    return 1; // Exit with warning
  } else {
    log('✅ No enforcer waivers found');
    return 0; // Exit successfully
  }
}

// Main execution
if (require.main === module) {
  try {
    const exitCode = checkForWaivers();
    process.exit(exitCode);
  } catch (error) {
    log(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { checkForWaivers };
