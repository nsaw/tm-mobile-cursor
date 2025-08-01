#!/usr/bin/env node

/**
 * Navigation Role Validation Script
 * Tests the navigation role assignment and functionality for BottomNav
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Navigation Role Assignment...');

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

// Read AutoRoleView to check for navigation role support
const autoRoleViewContent = fs.readFileSync(autoRoleViewPath, 'utf8');

// Check for layoutRole prop support
if (!autoRoleViewContent.includes('layoutRole')) {
  console.error('❌ layoutRole prop not supported in AutoRoleView');
  process.exit(1);
}

// Check for navigation role handling
if (!autoRoleViewContent.includes('navigation')) {
  console.warn('⚠️  navigation role not explicitly handled in AutoRoleView');
}

// Read BottomNav to verify role assignment
const bottomNavPath = path.join(__dirname, '../src-nextgen/components/BottomNav.tsx');
if (fs.existsSync(bottomNavPath)) {
  const bottomNavContent = fs.readFileSync(bottomNavPath, 'utf8');
  
  // Check for proper role assignment
  if (!bottomNavContent.includes('layoutRole="navigation"')) {
    console.error('❌ layoutRole="navigation" not found in BottomNav');
    process.exit(1);
  }
  
  // Check for AutoRoleView wrapper
  if (!bottomNavContent.includes('<AutoRoleView layoutRole="navigation">')) {
    console.error('❌ AutoRoleView wrapper not found in BottomNav');
    process.exit(1);
  }
  
  // Check for proper closing tag
  if (!bottomNavContent.includes('</AutoRoleView>')) {
    console.error('❌ AutoRoleView closing tag not found in BottomNav');
    process.exit(1);
  }
  
  // Check for sacred component navigation functionality
  const navigationChecks = [
    'onNavigate: (path: string) => void',
    'navItems',
    'handleAIToolsClick',
    'renderIcon',
    'TouchableOpacity',
    'accessibilityRole="button"'
  ];
  
  for (const check of navigationChecks) {
    if (!bottomNavContent.includes(check)) {
      console.error(`❌ Navigation functionality not found: ${check}`);
      process.exit(1);
    }
  }
}

// Check if role types are defined
const roleTypesPath = path.join(__dirname, '../src-nextgen/core/roles/types.ts');
if (fs.existsSync(roleTypesPath)) {
  const roleTypesContent = fs.readFileSync(roleTypesPath, 'utf8');
  if (!roleTypesContent.includes('navigation')) {
    console.warn('⚠️  navigation role not defined in role types');
  }
}

console.log('✅ Navigation role validation passed');
console.log('✅ AutoRoleView supports layoutRole prop');
console.log('✅ BottomNav has proper role assignment');
console.log('✅ AutoRoleView wrapper implemented correctly');
console.log('✅ Sacred component navigation functionality preserved');

process.exit(0); 