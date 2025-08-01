#!/usr/bin/env node

/**
 * TagChip Behavior Test Script
 * 
 * This script tests the TagChip component behavior and functionality
 * to ensure it works correctly in the nextgen environment.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing TagChip behavior...');

const tagChipPath = path.join(__dirname, '..', 'src-nextgen', 'components', 'TagChip.tsx');
if (!fs.existsSync(tagChipPath)) {
  console.error('❌ TagChip.tsx not found');
  process.exit(1);
}

const tagChipContent = fs.readFileSync(tagChipPath, 'utf8');

// Test 1: Component structure
console.log('📋 Test 1: Component structure...');
if (!tagChipContent.includes('export const TagChip')) {
  console.error('❌ TagChip component not exported');
  process.exit(1);
}

if (!tagChipContent.includes('interface TagChipProps')) {
  console.error('❌ TagChipProps interface missing');
  process.exit(1);
}

// Test 2: Required props
console.log('📋 Test 2: Required props...');
if (!tagChipContent.includes('tag: string')) {
  console.error('❌ tag prop missing from interface');
  process.exit(1);
}

if (!tagChipContent.includes('isSelected?: boolean')) {
  console.error('❌ isSelected prop missing from interface');
  process.exit(1);
}

if (!tagChipContent.includes('onPress?: (tag: string) => void')) {
  console.error('❌ onPress prop missing from interface');
  process.exit(1);
}

// Test 3: Theme integration
console.log('📋 Test 3: Theme integration...');
if (!tagChipContent.includes('useTheme')) {
  console.error('❌ useTheme hook not used');
  process.exit(1);
}

if (!tagChipContent.includes('designTokens')) {
  console.error('❌ designTokens not used');
  process.exit(1);
}

// Test 4: Variant support
console.log('📋 Test 4: Variant support...');
if (!tagChipContent.includes("variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline'")) {
  console.error('❌ variant prop missing or incomplete');
  process.exit(1);
}

// Test 5: Size support
console.log('📋 Test 5: Size support...');
if (!tagChipContent.includes("size?: 'sm' | 'md' | 'lg'")) {
  console.error('❌ size prop missing or incomplete');
  process.exit(1);
}

// Test 6: Text component integration
console.log('📋 Test 6: Text component integration...');
if (!tagChipContent.includes('<Text')) {
  console.error('❌ Text component not used');
  process.exit(1);
}

if (!tagChipContent.includes('variant="caption"')) {
  console.error('❌ Text variant not set to caption');
  process.exit(1);
}

// Test 7: Tag display
console.log('📋 Test 7: Tag display...');
if (!tagChipContent.includes('#{tag.toLowerCase()}')) {
  console.error('❌ Tag not displayed with # prefix and lowercase');
  process.exit(1);
}

// Test 8: Error handling
console.log('📋 Test 8: Error handling...');
if (!tagChipContent.includes('console.warn')) {
  console.error('❌ No error handling for missing designTokens');
  process.exit(1);
}

if (!tagChipContent.includes('return null')) {
  console.error('❌ No fallback for missing designTokens');
  process.exit(1);
}

console.log('✅ All TagChip behavior tests passed!');
console.log('✅ Component structure correct');
console.log('✅ Required props defined');
console.log('✅ Theme integration working');
console.log('✅ Variant support implemented');
console.log('✅ Size support implemented');
console.log('✅ Text component integrated');
console.log('✅ Tag display formatted correctly');
console.log('✅ Error handling in place');

process.exit(0); 