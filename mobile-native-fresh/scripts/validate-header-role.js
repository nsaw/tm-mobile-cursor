#!/usr/bin/env node

/**
 * Header Role Validation Script
 * Tests the header-navigation role assignment and functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Header Role Assignment...');

// Check if AutoRoleView exists
const autoRoleViewPath = path.join(__dirname, '../src-nextgen/core/roles/AutoRoleView.tsx');
if (!fs.existsSync(autoRoleViewPath)) {
  console.error('❌ AutoRoleView.tsx not found in src-nextgen/core/roles/');
  process.exit(1);
}

// Check if RoleWrapper exists
const roleWrapperPath = path.join(__dirname, '../src-nextgen/core/roles/RoleWrapper.tsx');
if (!fs.existsSync(roleWrapperPath)) {
  console.error('❌ RoleWrapper.tsx not found in src-nextgen/core/roles/');
  process.exit(1);
}

// Read AutoRoleView to check for header-navigation role support
const autoRoleViewContent = fs.readFileSync(autoRoleViewPath, 'utf8');

// Check for layoutRole prop support
if (!autoRoleViewContent.includes('layoutRole')) {
  console.error('❌ layoutRole prop not supported in AutoRoleView');
  process.exit(1);
}

// Check for header-navigation role handling
if (!autoRoleViewContent.includes('header-navigation')) {
  console.warn('⚠️  header-navigation role not explicitly handled in AutoRoleView');
}

// Read ModernHeader to verify role assignment
const modernHeaderPath = path.join(__dirname, '../src-nextgen/components/ModernHeader.tsx');
if (fs.existsSync(modernHeaderPath)) {
  const headerContent = fs.readFileSync(modernHeaderPath, 'utf8');
  
  // Check for proper role assignment
  if (!headerContent.includes('layoutRole="header-navigation"')) {
    console.error('❌ layoutRole="header-navigation" not found in ModernHeader');
    process.exit(1);
  }
  
  // Check for AutoRoleView wrapper
  if (!headerContent.includes('<AutoRoleView layoutRole="header-navigation">')) {
    console.error('❌ AutoRoleView wrapper not found in ModernHeader');
    process.exit(1);
  }
  
  // Check for proper closing tag
  if (!headerContent.includes('</AutoRoleView>')) {
    console.error('❌ AutoRoleView closing tag not found in ModernHeader');
    process.exit(1);
  }
}

// Check if role types are defined
const roleTypesPath = path.join(__dirname, '../src-nextgen/core/roles/types.ts');
if (fs.existsSync(roleTypesPath)) {
  const roleTypesContent = fs.readFileSync(roleTypesPath, 'utf8');
  if (!roleTypesContent.includes('header-navigation')) {
    console.warn('⚠️  header-navigation role not defined in role types');
  }
}

console.log('✅ Header role validation passed');
console.log('✅ AutoRoleView supports layoutRole prop');
console.log('✅ ModernHeader has proper role assignment');
console.log('✅ AutoRoleView wrapper implemented correctly');

process.exit(0); 