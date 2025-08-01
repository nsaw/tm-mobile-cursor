#!/usr/bin/env node

/**
 * Layout Contracts Validation Script
 * 
 * Verifies that the layout contracts system was implemented correctly
 * and all required components and utilities are available.
 */

const fs = require('fs');
const path = require('path');

const CONTRACTS_DIR = path.join(__dirname, '..', 'src-nextgen', 'shell', 'contracts');
const REQUIRED_FILES = [
  'index.ts',
  'types.ts',
  'LayoutContract.tsx',
  'ZIndexProtection.tsx',
  'SafeFrameShell.tsx',
  'utils.ts',
  'validation.ts'
];

function validateLayoutContracts() {
  console.log('🔍 Validating layout contracts implementation...');
  
  // Check if contracts directory exists
  if (!fs.existsSync(CONTRACTS_DIR)) {
    console.error('❌ Contracts directory does not exist:', CONTRACTS_DIR);
    process.exit(1);
  }
  
  console.log('✅ Contracts directory exists');
  
  // Check required files
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(CONTRACTS_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Required file missing: ${file}`);
      process.exit(1);
    }
    console.log(`✅ File exists: ${file}`);
  }
  
  // Validate index.ts content
  const indexPath = path.join(CONTRACTS_DIR, 'index.ts');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const requiredExports = [
    'LayoutContract',
    'ZIndexProtection',
    'SafeFrameShell',
    'types',
    'utils',
    'validation'
  ];
  
  for (const exportName of requiredExports) {
    if (!indexContent.includes(`export * from './${exportName}'`)) {
      console.error(`❌ Missing export in index.ts: ${exportName}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Index.ts exports validated');
  
  // Validate types.ts content
  const typesPath = path.join(CONTRACTS_DIR, 'types.ts');
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  
  const requiredTypes = [
    'ZIndexLayer',
    'LayoutContract',
    'LayoutConstraints',
    'LayoutValidation',
    'ZIndexProtection',
    'SafeFrameShell',
    'LayoutContractProps',
    'ZIndexProtectionProps',
    'LayoutValidationResult'
  ];
  
  for (const typeName of requiredTypes) {
    if (!typesContent.includes(`export type ${typeName}`) && 
        !typesContent.includes(`export interface ${typeName}`)) {
      console.error(`❌ Missing type definition: ${typeName}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Types.ts definitions validated');
  
  // Validate LayoutContract.tsx content
  const layoutContractPath = path.join(CONTRACTS_DIR, 'LayoutContract.tsx');
  const layoutContractContent = fs.readFileSync(layoutContractPath, 'utf8');
  
  const requiredLayoutContractFeatures = [
    'LayoutContract',
    'contract',
    'children',
    'validateLayoutContract',
    'getZIndexValue'
  ];
  
  for (const feature of requiredLayoutContractFeatures) {
    if (!layoutContractContent.includes(feature)) {
      console.error(`❌ Missing feature in LayoutContract.tsx: ${feature}`);
      process.exit(1);
    }
  }
  
  console.log('✅ LayoutContract.tsx implementation validated');
  
  // Validate ZIndexProtection.tsx content
  const zIndexProtectionPath = path.join(CONTRACTS_DIR, 'ZIndexProtection.tsx');
  const zIndexProtectionContent = fs.readFileSync(zIndexProtectionPath, 'utf8');
  
  const requiredZIndexProtectionFeatures = [
    'ZIndexProtection',
    'layer',
    'children',
    'getZIndexValue',
    'validateZIndexProtection'
  ];
  
  for (const feature of requiredZIndexProtectionFeatures) {
    if (!zIndexProtectionContent.includes(feature)) {
      console.error(`❌ Missing feature in ZIndexProtection.tsx: ${feature}`);
      process.exit(1);
    }
  }
  
  console.log('✅ ZIndexProtection.tsx implementation validated');
  
  // Validate SafeFrameShell.tsx content
  const safeFrameShellPath = path.join(CONTRACTS_DIR, 'SafeFrameShell.tsx');
  const safeFrameShellContent = fs.readFileSync(safeFrameShellPath, 'utf8');
  
  const requiredSafeFrameShellFeatures = [
    'SafeFrameShell',
    'contract',
    'children',
    'validateSafeFrameShell'
  ];
  
  for (const feature of requiredSafeFrameShellFeatures) {
    if (!safeFrameShellContent.includes(feature)) {
      console.error(`❌ Missing feature in SafeFrameShell.tsx: ${feature}`);
      process.exit(1);
    }
  }
  
  console.log('✅ SafeFrameShell.tsx implementation validated');
  
  // Validate utils.ts content
  const utilsPath = path.join(CONTRACTS_DIR, 'utils.ts');
  const utilsContent = fs.readFileSync(utilsPath, 'utf8');
  
  const requiredUtils = [
    'getZIndexValue',
    'registerLayoutContract',
    'getLayoutContract',
    'validateLayoutContract',
    'validateZIndexProtection',
    'validateSafeFrameShell',
    'getLayoutContractStatistics'
  ];
  
  for (const util of requiredUtils) {
    if (!utilsContent.includes(`export const ${util}`)) {
      console.error(`❌ Missing utility function: ${util}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Utils.ts functions validated');
  
  // Validate validation.ts content
  const validationPath = path.join(CONTRACTS_DIR, 'validation.ts');
  const validationContent = fs.readFileSync(validationPath, 'utf8');
  
  const requiredValidation = [
    'validateLayoutConstraints',
    'validateZIndexHierarchy',
    'validateComponentLayoutContract',
    'getLayoutContractSuggestions',
    'validateLayoutContractConsistency'
  ];
  
  for (const validation of requiredValidation) {
    if (!validationContent.includes(`export const ${validation}`)) {
      console.error(`❌ Missing validation function: ${validation}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Validation.ts functions validated');
  
  console.log('🎉 Layout contracts implementation validation PASSED');
  process.exit(0);
}

validateLayoutContracts(); 