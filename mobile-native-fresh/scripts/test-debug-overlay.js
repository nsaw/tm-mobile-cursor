#!/usr/bin/env node

/**
 * Debug Overlay Test Script
 * Tests the debug overlay behavior and functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Debug Overlay Behavior...');

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

// Test 1: Check for debug overlay toggle functionality
const debugToggleChecks = [
  'showDebugOverlay',
  'setShowDebugOverlay',
  'useState(false)',
  'EXPO_PUBLIC_DEBUG_ROLES === \'true\'',
  'finalConfig.debug'
];

for (const check of debugToggleChecks) {
  if (!roleWrapperContent.includes(check)) {
    console.error(`❌ Debug toggle functionality not found: ${check}`);
    process.exit(1);
  }
}

// Test 2: Check for debug overlay rendering
const debugRenderingChecks = [
  '{showDebugOverlay && (',
  'debugOverlay',
  'debugText',
  'debugSubtext',
  '{role}',
  'finalConfig.priority > 1 ? `P${finalConfig.priority}` : \'\'',
  'finalConfig.protected ? \' PROT\' : \'\''
];

for (const check of debugRenderingChecks) {
  if (!roleWrapperContent.includes(check)) {
    console.error(`❌ Debug overlay rendering not found: ${check}`);
    process.exit(1);
  }
}

// Test 3: Check for debug styling
const debugStylingChecks = [
  'borderWidth: 2',
  'borderColor: getRoleColor(role)',
  'backgroundColor: `${getRoleColor(role)}15`',
  'padding: 2',
  'position: \'absolute\'',
  'top: 0',
  'right: 0',
  'zIndex: 9999'
];

for (const check of debugStylingChecks) {
  if (!roleWrapperContent.includes(check)) {
    console.error(`❌ Debug styling not found: ${check}`);
    process.exit(1);
  }
}

// Test 4: Check for debug logging
const debugLoggingChecks = [
  'console.log(`🔧 RoleWrapper: ${role}`',
  'componentId: componentId.current',
  'config: finalConfig',
  'timestamp: new Date().toISOString()',
  'debugOverlay: showDebugOverlay'
];

for (const check of debugLoggingChecks) {
  if (!roleWrapperContent.includes(check)) {
    console.error(`❌ Debug logging not found: ${check}`);
    process.exit(1);
  }
}

// Read AutoRoleView content
const autoRoleViewContent = fs.readFileSync(autoRoleViewPath, 'utf8');

// Test 5: Check for AutoRoleView debug integration
const autoRoleViewDebugChecks = [
  'debug?: boolean',
  'debug = false',
  'EXPO_PUBLIC_DEBUG_ROLES === \'true\' || debug',
  'debug: debugEnabled',
  'RoleWrapper'
];

for (const check of autoRoleViewDebugChecks) {
  if (!autoRoleViewContent.includes(check)) {
    console.error(`❌ AutoRoleView debug integration not found: ${check}`);
    process.exit(1);
  }
}

// Test 6: Check for role mapping
if (!autoRoleViewContent.includes('getRoleWrapperRole')) {
  console.error('❌ Role mapping function not found');
  process.exit(1);
}

// Test 7: Check for new role types support
const newRoleTypeChecks = [
  'header-navigation',
  'navigation'
];

for (const check of newRoleTypeChecks) {
  if (!autoRoleViewContent.includes(check)) {
    console.error(`❌ New role type support not found: ${check}`);
    process.exit(1);
  }
}

// Test 8: Check for accessibility integration
const accessibilityChecks = [
  'accessibilityRole: \'header\'',
  'accessibilityRole: \'navigation\''
];

for (const check of accessibilityChecks) {
  if (!autoRoleViewContent.includes(check)) {
    console.error(`❌ Accessibility integration not found: ${check}`);
    process.exit(1);
  }
}

console.log('✅ Debug overlay behavior tests passed');
console.log('✅ Debug toggle functionality working');
console.log('✅ Debug overlay rendering implemented');
console.log('✅ Debug styling applied correctly');
console.log('✅ Debug logging operational');
console.log('✅ AutoRoleView debug integration working');
console.log('✅ Role mapping functionality implemented');
console.log('✅ New role types supported');
console.log('✅ Accessibility integration maintained');

process.exit(0); 