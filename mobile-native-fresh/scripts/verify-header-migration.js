#!/usr/bin/env node

/**
 * Header Migration Validation Script
 * Verifies that ModernHeader.tsx was successfully migrated to src-nextgen/components/
 * with proper layoutRole="header-navigation" assignment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Header Migration...');

// Check if ModernHeader exists in src-nextgen/components/
const nextgenHeaderPath = path.join(__dirname, '../src-nextgen/components/ModernHeader.tsx');
if (!fs.existsSync(nextgenHeaderPath)) {
  console.error('❌ ModernHeader.tsx not found in src-nextgen/components/');
  process.exit(1);
}

// Check if ModernHeader exists in legacy location
const legacyHeaderPath = path.join(__dirname, '../src-reference/components/ui/ModernHeader.tsx');
if (!fs.existsSync(legacyHeaderPath)) {
  console.error('❌ ModernHeader.tsx not found in legacy location');
  process.exit(1);
}

// Read the nextgen header file and check for layoutRole assignment
const nextgenHeaderContent = fs.readFileSync(nextgenHeaderPath, 'utf8');

// Check for AutoRoleView import
if (!nextgenHeaderContent.includes('import { AutoRoleView }')) {
  console.error('❌ AutoRoleView import not found in ModernHeader.tsx');
  process.exit(1);
}

// Check for layoutRole="header-navigation" assignment
if (!nextgenHeaderContent.includes('layoutRole="header-navigation"')) {
  console.error('❌ layoutRole="header-navigation" assignment not found in ModernHeader.tsx');
  process.exit(1);
}

// Check for AutoRoleView wrapper
if (!nextgenHeaderContent.includes('<AutoRoleView layoutRole="header-navigation">')) {
  console.error('❌ AutoRoleView wrapper with header-navigation role not found');
  process.exit(1);
}

// Check if ModernHeader is exported in components index
const componentsIndexPath = path.join(__dirname, '../src-nextgen/components/index.ts');
if (fs.existsSync(componentsIndexPath)) {
  const indexContent = fs.readFileSync(componentsIndexPath, 'utf8');
  if (!indexContent.includes('export { ModernHeader }')) {
    console.error('❌ ModernHeader export not found in components index.ts');
    process.exit(1);
  }
}

console.log('✅ Header migration validation passed');
console.log('✅ ModernHeader.tsx successfully migrated to src-nextgen/components/');
console.log('✅ layoutRole="header-navigation" assignment verified');
console.log('✅ AutoRoleView wrapper implemented');
console.log('✅ Component export added to index.ts');

process.exit(0); 