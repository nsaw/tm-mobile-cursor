#!/usr/bin/env node

/**
 * Role Wrappers Validation Script
 * 
 * Verifies that the role-based wrapper system was implemented correctly
 * and all required components and utilities are available.
 */

const fs = require('fs');
const path = require('path');

const WRAPPERS_DIR = path.join(__dirname, '..', 'src-nextgen', 'shell', 'wrappers');
const REQUIRED_FILES = [
  'index.ts',
  'types.ts',
  'RoleWrapper.tsx',
  'utils.ts',
  'validation.ts'
];

function validateRoleWrappers() {
  console.log('🔍 Validating role wrappers implementation...');
  
  // Check if wrappers directory exists
  if (!fs.existsSync(WRAPPERS_DIR)) {
    console.error('❌ Wrappers directory does not exist:', WRAPPERS_DIR);
    process.exit(1);
  }
  
  console.log('✅ Wrappers directory exists');
  
  // Check required files
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(WRAPPERS_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Required file missing: ${file}`);
      process.exit(1);
    }
    console.log(`✅ File exists: ${file}`);
  }
  
  // Validate index.ts content
  const indexPath = path.join(WRAPPERS_DIR, 'index.ts');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const requiredExports = [
    'RoleWrapper',
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
  const typesPath = path.join(WRAPPERS_DIR, 'types.ts');
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  
  const requiredTypes = [
    'ComponentRole',
    'RoleConfig',
    'RoleWrapperProps',
    'RoleAssignment',
    'RoleValidationResult'
  ];
  
  for (const typeName of requiredTypes) {
    if (!typesContent.includes(`export type ${typeName}`) && 
        !typesContent.includes(`export interface ${typeName}`)) {
      console.error(`❌ Missing type definition: ${typeName}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Types.ts definitions validated');
  
  // Validate RoleWrapper.tsx content
  const wrapperPath = path.join(WRAPPERS_DIR, 'RoleWrapper.tsx');
  const wrapperContent = fs.readFileSync(wrapperPath, 'utf8');
  
  const requiredWrapperFeatures = [
    'RoleWrapper',
    'role',
    'children',
    'config',
    'validateRoleAssignment'
  ];
  
  for (const feature of requiredWrapperFeatures) {
    if (!wrapperContent.includes(feature)) {
      console.error(`❌ Missing feature in RoleWrapper.tsx: ${feature}`);
      process.exit(1);
    }
  }
  
  console.log('✅ RoleWrapper.tsx implementation validated');
  
  // Validate utils.ts content
  const utilsPath = path.join(WRAPPERS_DIR, 'utils.ts');
  const utilsContent = fs.readFileSync(utilsPath, 'utf8');
  
  const requiredUtils = [
    'registerRoleAssignment',
    'getRoleAssignment',
    'validateRoleAssignment',
    'getRoleStatistics',
    'getRoleColor'
  ];
  
  for (const util of requiredUtils) {
    if (!utilsContent.includes(`export const ${util}`)) {
      console.error(`❌ Missing utility function: ${util}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Utils.ts functions validated');
  
  // Validate validation.ts content
  const validationPath = path.join(WRAPPERS_DIR, 'validation.ts');
  const validationContent = fs.readFileSync(validationPath, 'utf8');
  
  const requiredValidation = [
    'validateRoleConfig',
    'validateRoleHierarchy',
    'validateComponentRole',
    'getRoleSuggestions'
  ];
  
  for (const validation of requiredValidation) {
    if (!validationContent.includes(`export const ${validation}`)) {
      console.error(`❌ Missing validation function: ${validation}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Validation.ts functions validated');
  
  console.log('🎉 Role wrappers implementation validation PASSED');
  process.exit(0);
}

validateRoleWrappers(); 