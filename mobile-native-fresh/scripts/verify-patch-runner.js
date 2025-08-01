#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🤖 Verifying Patch Runner Automation System...');

// Check if patch runner files exist
const patchRunnerFiles = [
  'src-nextgen/shell/automation/PatchRunner.ts',
  'src-nextgen/shell/automation/PatchValidator.ts',
  'src-nextgen/shell/automation/index.ts'
];

let allFilesExist = true;

patchRunnerFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if automation directory structure is correct
const automationDirs = [
  'src-nextgen/shell/automation'
];

automationDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir} directory exists`);
  } else {
    console.log(`❌ ${dir} directory missing`);
    allFilesExist = false;
  }
});

// Check if PatchRunner has required functionality
const patchRunnerPath = path.join(process.cwd(), 'src-nextgen/shell/automation/PatchRunner.ts');
if (fs.existsSync(patchRunnerPath)) {
  const content = fs.readFileSync(patchRunnerPath, 'utf8');
  
  const requiredMethods = [
    'addToQueue',
    'executePatch',
    'executeQueue',
    'rollbackPatch'
  ];
  
  requiredMethods.forEach(method => {
    if (content.includes(method)) {
      console.log(`✅ PatchRunner has '${method}' method`);
    } else {
      console.log(`❌ PatchRunner missing '${method}' method`);
      allFilesExist = false;
    }
  });
  
  // Check for required interfaces
  if (content.includes('PatchDefinition') && content.includes('PatchExecutionResult')) {
    console.log('✅ PatchRunner has required interfaces');
  } else {
    console.log('❌ PatchRunner missing required interfaces');
    allFilesExist = false;
  }
}

// Check if PatchValidator has required functionality
const patchValidatorPath = path.join(process.cwd(), 'src-nextgen/shell/automation/PatchValidator.ts');
if (fs.existsSync(patchValidatorPath)) {
  const content = fs.readFileSync(patchValidatorPath, 'utf8');
  
  const requiredMethods = [
    'runAllValidations',
    'runRequiredValidations',
    'addValidationGate'
  ];
  
  requiredMethods.forEach(method => {
    if (content.includes(method)) {
      console.log(`✅ PatchValidator has '${method}' method`);
    } else {
      console.log(`❌ PatchValidator missing '${method}' method`);
      allFilesExist = false;
    }
  });
  
  // Check for validation gates
  const validationGates = [
    'typescript-compilation',
    'eslint-validation',
    'unit-tests',
    'dual-mount-system',
    'environment-specific'
  ];
  
  validationGates.forEach(gate => {
    if (content.includes(gate)) {
      console.log(`✅ PatchValidator has '${gate}' validation gate`);
    } else {
      console.log(`❌ PatchValidator missing '${gate}' validation gate`);
      allFilesExist = false;
    }
  });
}

if (allFilesExist) {
  console.log('✅ Patch Runner Automation System verification PASSED');
  process.exit(0);
} else {
  console.log('❌ Patch Runner Automation System verification FAILED');
  process.exit(1);
} 