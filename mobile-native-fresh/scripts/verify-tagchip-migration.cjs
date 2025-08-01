#!/usr/bin/env node

/**
 * TagChip Migration Verification Script
 * 
 * This script verifies that the TagChip component has been successfully
 * migrated to the nextgen environment with proper role assignment.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying TagChip migration...');

// Check if TagChip exists in nextgen
const nextgenTagChipPath = path.join(__dirname, '..', 'src-nextgen', 'components', 'TagChip.tsx');
if (!fs.existsSync(nextgenTagChipPath)) {
  console.error('❌ TagChip.tsx not found in src-nextgen/components/');
  process.exit(1);
}

// Check if TagChip exists in legacy (should be preserved)
const legacyTagChipPath = path.join(__dirname, '..', 'src-reference', 'components', 'ui', 'TagChip.tsx');
if (!fs.existsSync(legacyTagChipPath)) {
  console.error('❌ TagChip.tsx not found in src-reference/components/ui/ (legacy preserved)');
  process.exit(1);
}

// Check if TagChip is exported from components index
const componentsIndexPath = path.join(__dirname, '..', 'src-nextgen', 'components', 'index.ts');
if (!fs.existsSync(componentsIndexPath)) {
  console.error('❌ components/index.ts not found in src-nextgen/components/');
  process.exit(1);
}

const componentsIndexContent = fs.readFileSync(componentsIndexPath, 'utf8');
if (!componentsIndexContent.includes('export { TagChip }')) {
  console.error('❌ TagChip not exported from src-nextgen/components/index.ts');
  process.exit(1);
}

// Check if TagChip has proper imports
const tagChipContent = fs.readFileSync(nextgenTagChipPath, 'utf8');
if (!tagChipContent.includes("import { useTheme } from '../theme/ThemeProvider'")) {
  console.error('❌ TagChip missing proper theme import');
  process.exit(1);
}

if (!tagChipContent.includes("import { Text } from './Text'")) {
  console.error('❌ TagChip missing Text component import');
  process.exit(1);
}

// Check if TagChip has proper accessibility props
if (!tagChipContent.includes('accessibilityRole="button"')) {
  console.error('❌ TagChip missing accessibilityRole="button"');
  process.exit(1);
}

if (!tagChipContent.includes('accessible={true}')) {
  console.error('❌ TagChip missing accessible={true}');
  process.exit(1);
}

console.log('✅ TagChip migration verification passed!');
console.log('✅ TagChip component exists in src-nextgen/components/');
console.log('✅ TagChip component preserved in src-reference/components/ui/');
console.log('✅ TagChip exported from components index');
console.log('✅ TagChip has proper theme and Text imports');
console.log('✅ TagChip has proper accessibility props');

process.exit(0); 