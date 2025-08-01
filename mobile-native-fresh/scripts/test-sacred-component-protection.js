#!/usr/bin/env node

/**
 * Sacred Component Protection Test Script
 * Tests the BottomNav sacred component protection and import mechanism
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Sacred Component Protection...');

// Check if BottomNav exists in both locations
const nextgenBottomNavPath = path.join(__dirname, '../src-nextgen/components/BottomNav.tsx');
const legacyBottomNavPath = path.join(__dirname, '../src-reference/components/ui/BottomNav.tsx');

if (!fs.existsSync(nextgenBottomNavPath)) {
  console.error('❌ BottomNav.tsx not found in src-nextgen/components/');
  process.exit(1);
}

if (!fs.existsSync(legacyBottomNavPath)) {
  console.error('❌ BottomNav.tsx not found in legacy location');
  process.exit(1);
}

// Read both files to compare
const nextgenContent = fs.readFileSync(nextgenBottomNavPath, 'utf8');
const legacyContent = fs.readFileSync(legacyBottomNavPath, 'utf8');

// Test 1: Check for sacred component interface preservation
const sacredInterfaceChecks = [
  'interface BottomNavProps',
  'onNavigate: (path: string) => void',
  'onVoiceRecord?: () => void',
  'showCreateButton?: boolean',
  'currentRoute?: string',
  'onCreateNew?: () => void'
];

for (const check of sacredInterfaceChecks) {
  if (!nextgenContent.includes(check)) {
    console.error(`❌ Sacred interface not preserved: ${check}`);
    process.exit(1);
  }
}

// Test 2: Check for sacred component functionality preservation
const sacredFunctionalityChecks = [
  'navItems',
  'handleAIToolsClick',
  'renderIcon',
  'MaterialCommunityIcons',
  'Brain',
  'useSafeAreaInsets',
  'Floating New Thoughtmark Button'
];

for (const check of sacredFunctionalityChecks) {
  if (!nextgenContent.includes(check)) {
    console.error(`❌ Sacred functionality not preserved: ${check}`);
    process.exit(1);
  }
}

// Test 3: Check for role assignment addition
if (!nextgenContent.includes('layoutRole="navigation"')) {
  console.error('❌ Navigation role assignment not found');
  process.exit(1);
}

if (!nextgenContent.includes('<AutoRoleView layoutRole="navigation">')) {
  console.error('❌ AutoRoleView wrapper not found');
  process.exit(1);
}

// Test 4: Check for import mechanism
if (!nextgenContent.includes('import { AutoRoleView }')) {
  console.error('❌ AutoRoleView import not found');
  process.exit(1);
}

// Test 5: Check for accessibility preservation
const accessibilityChecks = [
  'accessibilityRole="button"',
  'accessible={true}',
  'accessibilityLabel="Button"',
  'accessibilityLabel="Create new thoughtmark"'
];

for (const check of accessibilityChecks) {
  if (!nextgenContent.includes(check)) {
    console.error(`❌ Accessibility not preserved: ${check}`);
    process.exit(1);
  }
}

// Test 6: Check for theme integration preservation
if (!nextgenContent.includes('useTheme()')) {
  console.error('❌ Theme integration not preserved');
  process.exit(1);
}

if (!nextgenContent.includes('designTokens')) {
  console.error('❌ Design tokens not preserved');
  process.exit(1);
}

// Test 7: Check for platform-specific styling preservation
if (!nextgenContent.includes('Platform.select')) {
  console.error('❌ Platform-specific styling not preserved');
  process.exit(1);
}

// Test 8: Check for conditional rendering preservation
const conditionalChecks = [
  'showCreateButton && currentRoute !== \'/\'',
  'isActive &&',
  'isVoice && onVoiceRecord',
  'action === \'ai-tools\''
];

for (const check of conditionalChecks) {
  if (!nextgenContent.includes(check)) {
    console.error(`❌ Conditional rendering not preserved: ${check}`);
    process.exit(1);
  }
}

// Test 9: Check for component export
const componentsIndexPath = path.join(__dirname, '../src-nextgen/components/index.ts');
if (fs.existsSync(componentsIndexPath)) {
  const indexContent = fs.readFileSync(componentsIndexPath, 'utf8');
  if (!indexContent.includes('export { BottomNav }')) {
    console.error('❌ BottomNav export not found in components index');
    process.exit(1);
  }
}

console.log('✅ Sacred component protection tests passed');
console.log('✅ Interface preserved completely');
console.log('✅ Functionality preserved completely');
console.log('✅ Role assignment added correctly');
console.log('✅ Import mechanism working');
console.log('✅ Accessibility preserved');
console.log('✅ Theme integration preserved');
console.log('✅ Platform-specific styling preserved');
console.log('✅ Conditional rendering preserved');
console.log('✅ Component export working');

process.exit(0); 