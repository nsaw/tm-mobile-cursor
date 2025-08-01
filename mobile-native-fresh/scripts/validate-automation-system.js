#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('⚙️ Validating Automation System...');

// Check if automation system files exist
const automationFiles = [
  'src-nextgen/shell/automation/PatchRunner.ts',
  'src-nextgen/shell/automation/PatchValidator.ts'
];

let allFilesExist = true;

automationFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    
    // Check file content for key functionality
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (file.includes('PatchRunner.ts')) {
      if (content.includes('PatchRunner') && content.includes('executePatch')) {
        console.log(`✅ PatchRunner has execution functionality`);
      } else {
        console.log(`❌ PatchRunner missing execution functionality`);
        allFilesExist = false;
      }
      
      if (content.includes('rollbackPatch')) {
        console.log(`✅ PatchRunner has rollback functionality`);
      } else {
        console.log(`❌ PatchRunner missing rollback functionality`);
        allFilesExist = false;
      }
    }
    
    if (file.includes('PatchValidator.ts')) {
      if (content.includes('PatchValidator') && content.includes('runAllValidations')) {
        console.log(`✅ PatchValidator has validation functionality`);
      } else {
        console.log(`❌ PatchValidator missing validation functionality`);
        allFilesExist = false;
      }
      
      if (content.includes('addValidationGate')) {
        console.log(`✅ PatchValidator has extensible validation gates`);
      } else {
        console.log(`❌ PatchValidator missing extensible validation gates`);
        allFilesExist = false;
      }
    }
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if validation gates are properly defined
const validatorPath = path.join(process.cwd(), 'src-nextgen/shell/automation/PatchValidator.ts');
if (fs.existsSync(validatorPath)) {
  const validatorContent = fs.readFileSync(validatorPath, 'utf8');
  const expectedGates = [
    'typescript-compilation',
    'eslint-validation', 
    'unit-tests',
    'dual-mount-system',
    'environment-specific'
  ];
  
  expectedGates.forEach(gate => {
    if (validatorContent.includes(gate)) {
      console.log(`✅ Validation gate '${gate}' is defined`);
    } else {
      console.log(`❌ Validation gate '${gate}' is not defined`);
      allFilesExist = false;
    }
  });
}

// Check if automation system has proper error handling
const runnerPath = path.join(process.cwd(), 'src-nextgen/shell/automation/PatchRunner.ts');
if (fs.existsSync(runnerPath)) {
  const runnerContent = fs.readFileSync(runnerPath, 'utf8');
  
  if (runnerContent.includes('try') && runnerContent.includes('catch')) {
    console.log('✅ PatchRunner has error handling');
  } else {
    console.log('❌ PatchRunner missing error handling');
    allFilesExist = false;
  }
  
  if (runnerContent.includes('rollbackRequired')) {
    console.log('✅ PatchRunner has rollback detection');
  } else {
    console.log('❌ PatchRunner missing rollback detection');
    allFilesExist = false;
  }
}

if (allFilesExist) {
  console.log('✅ Automation System validation PASSED');
  process.exit(0);
} else {
  console.log('❌ Automation System validation FAILED');
  process.exit(1);
} 