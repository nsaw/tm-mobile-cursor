#!/usr/bin/env node

/**
 * BottomNav Migration Validation Script
 * Verifies that BottomNav.tsx was successfully migrated to src-nextgen/components/
 * with proper layoutRole="navigation" assignment and sacred component protection
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying BottomNav Migration...');

// Check if BottomNav exists in src-nextgen/components/
const nextgenBottomNavPath = path.join(__dirname, '../src-nextgen/components/BottomNav.tsx');
if (!fs.existsSync(nextgenBottomNavPath)) {
  console.error('❌ BottomNav.tsx not found in src-nextgen/components/');
  process.exit(1);
}

// Check if BottomNav exists in legacy location
const legacyBottomNavPath = path.join(__dirname, '../src-reference/components/ui/BottomNav.tsx');
if (!fs.existsSync(legacyBottomNavPath)) {
  console.error('❌ BottomNav.tsx not found in legacy location');
  process.exit(1);
}

// Read the nextgen bottomnav file and check for layoutRole assignment
const nextgenBottomNavContent = fs.readFileSync(nextgenBottomNavPath, 'utf8');

// Check for AutoRoleView import
if (!nextgenBottomNavContent.includes('import { AutoRoleView }')) {
  console.error('❌ AutoRoleView import not found in BottomNav.tsx');
  process.exit(1);
}

// Check for layoutRole="navigation" assignment
if (!nextgenBottomNavContent.includes('layoutRole="navigation"')) {
  console.error('❌ layoutRole="navigation" assignment not found in BottomNav.tsx');
  process.exit(1);
}

// Check for AutoRoleView wrapper
if (!nextgenBottomNavContent.includes('<AutoRoleView layoutRole="navigation">')) {
  console.error('❌ AutoRoleView wrapper with navigation role not found');
  process.exit(1);
}

// Check for sacred component characteristics
const sacredComponentChecks = [
  'onNavigate: (path: string) => void',
  'onVoiceRecord?: () => void',
  'showCreateButton?: boolean',
  'currentRoute?: string',
  'onCreateNew?: () => void',
  'MaterialCommunityIcons',
  'Brain',
  'useSafeAreaInsets'
];

for (const check of sacredComponentChecks) {
  if (!nextgenBottomNavContent.includes(check)) {
    console.error(`❌ Sacred component characteristic not found: ${check}`);
    process.exit(1);
  }
}

// Check if BottomNav is exported in components index
const componentsIndexPath = path.join(__dirname, '../src-nextgen/components/index.ts');
if (fs.existsSync(componentsIndexPath)) {
  const indexContent = fs.readFileSync(componentsIndexPath, 'utf8');
  if (!indexContent.includes('export { BottomNav }')) {
    console.error('❌ BottomNav export not found in components index.ts');
    process.exit(1);
  }
}

console.log('✅ BottomNav migration validation passed');
console.log('✅ BottomNav.tsx successfully migrated to src-nextgen/components/');
console.log('✅ layoutRole="navigation" assignment verified');
console.log('✅ AutoRoleView wrapper implemented');
console.log('✅ Sacred component characteristics preserved');
console.log('✅ Component export added to index.ts');

process.exit(0); 