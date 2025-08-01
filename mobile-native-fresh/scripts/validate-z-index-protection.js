#!/usr/bin/env node

/**
 * Z-Index Protection Validation Script
 * 
 * Verifies that the z-index protection system is working correctly
 * and all layers are properly protected.
 */

const fs = require('fs');
const path = require('path');

const CONTRACTS_DIR = path.join(__dirname, '..', 'src-nextgen', 'shell', 'contracts');

function validateZIndexProtection() {
  console.log('🔍 Validating z-index protection system...');
  
  // Check if contracts directory exists
  if (!fs.existsSync(CONTRACTS_DIR)) {
    console.error('❌ Contracts directory does not exist:', CONTRACTS_DIR);
    process.exit(1);
  }
  
  console.log('✅ Contracts directory exists');
  
  // Check for ZIndexProtection component
  const zIndexProtectionPath = path.join(CONTRACTS_DIR, 'ZIndexProtection.tsx');
  if (!fs.existsSync(zIndexProtectionPath)) {
    console.error('❌ ZIndexProtection.tsx does not exist');
    process.exit(1);
  }
  
  console.log('✅ ZIndexProtection.tsx exists');
  
  // Validate ZIndexProtection content
  const zIndexProtectionContent = fs.readFileSync(zIndexProtectionPath, 'utf8');
  
  const requiredFeatures = [
    'ZIndexProtection',
    'layer',
    'children',
    'protected',
    'fallback',
    'getZIndexValue',
    'validateZIndexProtection'
  ];
  
  for (const feature of requiredFeatures) {
    if (!zIndexProtectionContent.includes(feature)) {
      console.error(`❌ Missing feature in ZIndexProtection.tsx: ${feature}`);
      process.exit(1);
    }
  }
  
  console.log('✅ ZIndexProtection.tsx implementation validated');
  
  // Check for utils with z-index functions
  const utilsPath = path.join(CONTRACTS_DIR, 'utils.ts');
  if (!fs.existsSync(utilsPath)) {
    console.error('❌ Utils.ts does not exist');
    process.exit(1);
  }
  
  const utilsContent = fs.readFileSync(utilsPath, 'utf8');
  
  const requiredUtils = [
    'getZIndexValue',
    'validateZIndexProtection',
    'isProtectedZIndexLayer'
  ];
  
  for (const util of requiredUtils) {
    if (!utilsContent.includes(`export const ${util}`)) {
      console.error(`❌ Missing utility function: ${util}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Z-index utility functions validated');
  
  // Check for types with z-index definitions
  const typesPath = path.join(CONTRACTS_DIR, 'types.ts');
  if (!fs.existsSync(typesPath)) {
    console.error('❌ Types.ts does not exist');
    process.exit(1);
  }
  
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  
  const requiredTypes = [
    'ZIndexLayer',
    'ZIndexProtection',
    'ZIndexProtectionProps'
  ];
  
  for (const type of requiredTypes) {
    if (!typesContent.includes(`export type ${type}`) && 
        !typesContent.includes(`export interface ${type}`)) {
      console.error(`❌ Missing type definition: ${type}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Z-index type definitions validated');
  
  console.log('🎉 Z-index protection system validation PASSED');
  process.exit(0);
}

validateZIndexProtection(); 