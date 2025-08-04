#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns to detect accessibility props inside functions
const accessibilityErrorPatterns = [
  /onPress=\{\(\) => accessibilityRole\s*=\s*["']button["']/g,
  /onPress=\{\(\) => accessible\s*=\s*{?true}?/g,
  /onPress=\{\(\) => accessibilityLabel\s*=/g,
  /onPress=\{\(\) => accessibilityRole\s*=\s*["']button["']\s*accessible\s*=\s*{?true}?\s*accessibilityLabel\s*=/g,
  /onPress=\{\(\) => accessible\s*=\s*{?true}?\s*accessibilityLabel\s*=/g,
  /onPress=\{\(\) => accessibilityRole\s*=\s*["']button["']\s*accessible\s*=\s*{?true}?/g
];

// Patterns to detect accessibility props in arrow functions
const arrowFunctionPatterns = [
  /onPress=\{\(\) => \{[^}]*accessibilityRole[^}]*\}/g,
  /onPress=\{\(\) => \{[^}]*accessible[^}]*\}/g,
  /onPress=\{\(\) => \{[^}]*accessibilityLabel[^}]*\}/g
];

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const errors = [];
    
    // Check for accessibility props inside onPress functions
    accessibilityErrorPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length;
          errors.push({
            type: 'accessibility_props_in_onpress',
            line: lineNumber,
            match: match.trim(),
            message: 'Accessibility props found inside onPress function body'
          });
        });
      }
    });
    
    // Check for accessibility props in arrow function bodies
    arrowFunctionPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length;
          errors.push({
            type: 'accessibility_props_in_arrow_function',
            line: lineNumber,
            match: match.trim(),
            message: 'Accessibility props found inside arrow function body'
          });
        });
      }
    });
    
    return errors;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function main() {
  console.log('🔍 Checking for accessibility prop violations...\n');
  
  // Get all TypeScript/TSX files
  const files = glob.sync('src/**/*.{ts,tsx}', { 
    ignore: ['node_modules/**', 'dist/**', 'build/**'],
    cwd: process.cwd()
  });
  
  let totalErrors = 0;
  let filesWithErrors = 0;
  
  files.forEach(file => {
    const errors = checkFile(file);
    if (errors.length > 0) {
      filesWithErrors++;
      console.log(`❌ ${file}:`);
      errors.forEach(error => {
        console.log(`   Line ${error.line}: ${error.message}`);
        console.log(`   Found: ${error.match}`);
        console.log('');
        totalErrors++;
      });
    }
  });
  
  console.log(`📊 Summary:`);
  console.log(`   Files checked: ${files.length}`);
  console.log(`   Files with errors: ${filesWithErrors}`);
  console.log(`   Total errors: ${totalErrors}`);
  
  if (totalErrors > 0) {
    console.log('\n🚨 ACCESSIBILITY PROP VIOLATIONS DETECTED!');
    console.log('These patterns can cause syntax errors and build failures.');
    console.log('Please fix these issues before committing.');
    console.log('\n💡 Correct pattern:');
    console.log('   <TouchableOpacity');
    console.log('     onPress={() => handlePress()}');
    console.log('     accessibilityRole="button"');
    console.log('     accessible={true}');
    console.log('     accessibilityLabel="Button"');
    console.log('   />');
    process.exit(1);
  } else {
    console.log('\n✅ No accessibility prop violations found!');
    console.log('All accessibility props are correctly placed outside function bodies.');
    process.exit(0);
  }
}

// Run the check
main(); 