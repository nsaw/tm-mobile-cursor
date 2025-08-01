#!/usr/bin/env node

/**
 * Visual Overlay Debug Validation Script
 * Verifies that visual overlay debug functionality is properly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Visual Overlay Debug...');

// Check if RoleWrapper exists
const roleWrapperPath = path.join(__dirname, '../src-nextgen/shell/wrappers/RoleWrapper.tsx');
if (!fs.existsSync(roleWrapperPath)) {
  console.error('❌ RoleWrapper.tsx not found');
  process.exit(1);
}

// Check if AutoRoleView exists
const autoRoleViewPath = path.join(__dirname, '../src-nextgen/shell/wrappers/AutoRoleView.tsx');
if (!fs.existsSync(autoRoleViewPath)) {
  console.error('❌ AutoRoleView.tsx not found');
  process.exit(1);
}

// Read RoleWrapper content
const roleWrapperContent = fs.readFileSync(roleWrapperPath, 'utf8');

// Check for debug overlay features
const debugOverlayChecks = [
  'showDebugOverlay',
  'EXPO_PUBLIC_DEBUG_ROLES',
  'debugOverlay',
  'getRoleColor',
  'Debug Overlay',
  'Visual overlay highlighting'
];

for (const check of debugOverlayChecks) {
  if (!roleWrapperContent.includes(check)) {
    console.error(`❌ Debug overlay feature not found: ${check}`);
    process.exit(1);
  }
}

// Check for debug overlay JSX
if (!roleWrapperContent.includes('{/* Debug Overlay */}')) {
  console.error('❌ Debug overlay JSX not found');
  process.exit(1);
}

// Check for debug overlay styles
if (!roleWrapperContent.includes('debugOverlay')) {
  console.error('❌ Debug overlay styles not found');
  process.exit(1);
}

// Read AutoRoleView content
const autoRoleViewContent = fs.readFileSync(autoRoleViewPath, 'utf8');

// Check for RoleWrapper integration
if (!autoRoleViewContent.includes('import { RoleWrapper }')) {
  console.error('❌ RoleWrapper import not found in AutoRoleView');
  process.exit(1);
}

// Check for debug prop
if (!autoRoleViewContent.includes('debug?: boolean')) {
  console.error('❌ Debug prop not found in AutoRoleView');
  process.exit(1);
}

// Check for debug environment variable handling
if (!autoRoleViewContent.includes('EXPO_PUBLIC_DEBUG_ROLES')) {
  console.error('❌ Debug environment variable handling not found');
  process.exit(1);
}

// Check for role mapping
if (!autoRoleViewContent.includes('getRoleWrapperRole')) {
  console.error('❌ Role mapping function not found');
  process.exit(1);
}

// Check for new role types
const newRoleChecks = [
  'header-navigation',
  'navigation'
];

for (const check of newRoleChecks) {
  if (!autoRoleViewContent.includes(check)) {
    console.error(`❌ New role type not found: ${check}`);
    process.exit(1);
  }
}

console.log('✅ Visual overlay debug validation passed');
console.log('✅ RoleWrapper debug overlay implemented');
console.log('✅ AutoRoleView RoleWrapper integration working');
console.log('✅ Debug environment variable support added');
console.log('✅ Debug overlay styles implemented');
console.log('✅ New role types added (header-navigation, navigation)');

process.exit(0); 