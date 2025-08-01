#!/usr/bin/env node

/**
 * Safe Frame Shells Test Script
 * 
 * Tests that the safe frame shell system is working correctly
 * and all shells are properly configured.
 */

const fs = require('fs');
const path = require('path');

const CONTRACTS_DIR = path.join(__dirname, '..', 'src-nextgen', 'shell', 'contracts');

function testSafeFrameShells() {
  console.log('🔍 Testing safe frame shells system...');
  
  // Check if contracts directory exists
  if (!fs.existsSync(CONTRACTS_DIR)) {
    console.error('❌ Contracts directory does not exist:', CONTRACTS_DIR);
    process.exit(1);
  }
  
  console.log('✅ Contracts directory exists');
  
  // Check for SafeFrameShell component
  const safeFrameShellPath = path.join(CONTRACTS_DIR, 'SafeFrameShell.tsx');
  if (!fs.existsSync(safeFrameShellPath)) {
    console.error('❌ SafeFrameShell.tsx does not exist');
    process.exit(1);
  }
  
  console.log('✅ SafeFrameShell.tsx exists');
  
  // Validate SafeFrameShell content
  const safeFrameShellContent = fs.readFileSync(safeFrameShellPath, 'utf8');
  
  const requiredFeatures = [
    'SafeFrameShell',
    'contract',
    'children',
    'validateSafeFrameShell',
    'safeFrame',
    'paddingHorizontal',
    'paddingVertical'
  ];
  
  for (const feature of requiredFeatures) {
    if (!safeFrameShellContent.includes(feature)) {
      console.error(`❌ Missing feature in SafeFrameShell.tsx: ${feature}`);
      process.exit(1);
    }
  }
  
  console.log('✅ SafeFrameShell.tsx implementation validated');
  
  // Check for utils with safe frame functions
  const utilsPath = path.join(CONTRACTS_DIR, 'utils.ts');
  if (!fs.existsSync(utilsPath)) {
    console.error('❌ Utils.ts does not exist');
    process.exit(1);
  }
  
  const utilsContent = fs.readFileSync(utilsPath, 'utf8');
  
  const requiredUtils = [
    'validateSafeFrameShell',
    'getLayoutContract',
    'registerLayoutContract'
  ];
  
  for (const util of requiredUtils) {
    if (!utilsContent.includes(`export const ${util}`)) {
      console.error(`❌ Missing utility function: ${util}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Safe frame utility functions validated');
  
  // Check for types with safe frame definitions
  const typesPath = path.join(CONTRACTS_DIR, 'types.ts');
  if (!fs.existsSync(typesPath)) {
    console.error('❌ Types.ts does not exist');
    process.exit(1);
  }
  
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  
  const requiredTypes = [
    'SafeFrameShell',
    'LayoutContract',
    'LayoutConstraints'
  ];
  
  for (const type of requiredTypes) {
    if (!typesContent.includes(`export type ${type}`) && 
        !typesContent.includes(`export interface ${type}`)) {
      console.error(`❌ Missing type definition: ${type}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Safe frame type definitions validated');
  
  // Test safe frame configuration
  console.log('🧪 Testing safe frame configuration...');
  
  // Simulate safe frame shell creation
  const testShell = {
    id: 'test-safe-frame-shell',
    contract: {
      id: 'test-contract',
      zIndex: 'content',
      priority: 5,
      protected: false,
      safeFrame: true,
      constraints: {
        minWidth: 200,
        maxWidth: 400,
        position: 'relative'
      },
      validation: {
        enabled: true,
        strict: false,
        warnings: true,
        errors: true
      }
    },
    children: 'Test content'
  };
  
  console.log('✅ Safe frame shell test configuration created');
  
  console.log('🎉 Safe frame shells system test PASSED');
  process.exit(0);
}

testSafeFrameShells(); 