#!/usr/bin/env node

/**
 * Chip Role Validation Script
 * 
 * This script validates that the TagChip component has proper role assignment
 * and accessibility features for chip-select functionality.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating chip role assignment...');

const tagChipPath = path.join(__dirname, '..', 'src-nextgen', 'components', 'TagChip.tsx');
if (!fs.existsSync(tagChipPath)) {
  console.error('❌ TagChip.tsx not found');
  process.exit(1);
}

const tagChipContent = fs.readFileSync(tagChipPath, 'utf8');

// Validate accessibility role
if (!tagChipContent.includes('accessibilityRole="button"')) {
  console.error('❌ Missing accessibilityRole="button"');
  process.exit(1);
}

// Validate accessible prop
if (!tagChipContent.includes('accessible={true}')) {
  console.error('❌ Missing accessible={true}');
  process.exit(1);
}

// Validate accessibility label
if (!tagChipContent.includes('accessibilityLabel=')) {
  console.error('❌ Missing accessibilityLabel');
  process.exit(1);
}

// Validate onPress handler
if (!tagChipContent.includes('onPress=')) {
  console.error('❌ Missing onPress handler');
  process.exit(1);
}

// Validate TouchableOpacity usage
if (!tagChipContent.includes('TouchableOpacity')) {
  console.error('❌ Not using TouchableOpacity for interactive behavior');
  process.exit(1);
}

// Validate activeOpacity for touch feedback
if (!tagChipContent.includes('activeOpacity=')) {
  console.error('❌ Missing activeOpacity for touch feedback');
  process.exit(1);
}

// Validate tag prop usage
if (!tagChipContent.includes('tag.toLowerCase()')) {
  console.error('❌ Missing tag prop usage in accessibility label');
  process.exit(1);
}

console.log('✅ Chip role validation passed!');
console.log('✅ accessibilityRole="button" present');
console.log('✅ accessible={true} present');
console.log('✅ accessibilityLabel present');
console.log('✅ onPress handler present');
console.log('✅ TouchableOpacity used for interaction');
console.log('✅ activeOpacity for touch feedback');
console.log('✅ tag prop properly used in accessibility');

process.exit(0); 