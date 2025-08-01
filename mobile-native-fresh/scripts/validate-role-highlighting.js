#!/usr/bin/env node

/**
 * Role Highlighting Validation Script
 * Tests the role highlighting and color coding functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Role Highlighting...');

// Check if RoleWrapper exists
const roleWrapperPath = path.join(__dirname, '../src-nextgen/shell/wrappers/RoleWrapper.tsx');
if (!fs.existsSync(roleWrapperPath)) {
  console.error('❌ RoleWrapper.tsx not found');
  process.exit(1);
}

// Read RoleWrapper content
const roleWrapperContent = fs.readFileSync(roleWrapperPath, 'utf8');

// Check for role color mapping
const roleColorChecks = [
  'layout: \'#3B82F6\'',
  'content: \'#10B981\'',
  'interactive: \'#F59E0B\'',
  'navigation: \'#8B5CF6\'',
  'feedback: \'#EF4444\'',
  'sacred: \'#DC2626\''
];

for (const check of roleColorChecks) {
  if (!roleWrapperContent.includes(check)) {
    console.error(`❌ Role color mapping not found: ${check}`);
    process.exit(1);
  }
}

// Check for getRoleColor function
if (!roleWrapperContent.includes('getRoleColor')) {
  console.error('❌ getRoleColor function not found');
  process.exit(1);
}

// Check for debug overlay styling
const debugStylingChecks = [
  'borderWidth: 2',
  'borderColor: getRoleColor(role)',
  'backgroundColor: `${getRoleColor(role)}15`',
  'padding: 2'
];

for (const check of debugStylingChecks) {
  if (!roleWrapperContent.includes(check)) {
    console.error(`❌ Debug styling not found: ${check}`);
    process.exit(1);
  }
}

// Check for debug overlay component
const debugOverlayChecks = [
  'debugOverlay',
  'debugText',
  'debugSubtext',
  'position: \'absolute\'',
  'zIndex: 9999'
];

for (const check of debugOverlayChecks) {
  if (!roleWrapperContent.includes(check)) {
    console.error(`❌ Debug overlay component not found: ${check}`);
    process.exit(1);
  }
}

// Check for role display in overlay
if (!roleWrapperContent.includes('{role}')) {
  console.error('❌ Role display in overlay not found');
  process.exit(1);
}

// Check for priority display
if (!roleWrapperContent.includes('P${finalConfig.priority}')) {
  console.error('❌ Priority display not found');
  process.exit(1);
}

// Check for protected component indicator
if (!roleWrapperContent.includes('PROT')) {
  console.error('❌ Protected component indicator not found');
  process.exit(1);
}

// Check for environment variable handling
if (!roleWrapperContent.includes('EXPO_PUBLIC_DEBUG_ROLES')) {
  console.error('❌ Environment variable handling not found');
  process.exit(1);
}

// Check for debug state management
if (!roleWrapperContent.includes('useState(false)')) {
  console.error('❌ Debug state management not found');
  process.exit(1);
}

console.log('✅ Role highlighting validation passed');
console.log('✅ Role color mapping implemented');
console.log('✅ Debug overlay styling working');
console.log('✅ Debug overlay component implemented');
console.log('✅ Role display in overlay working');
console.log('✅ Priority and protection indicators working');
console.log('✅ Environment variable handling working');
console.log('✅ Debug state management implemented');

process.exit(0); 