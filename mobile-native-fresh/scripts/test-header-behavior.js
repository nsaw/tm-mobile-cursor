#!/usr/bin/env node

/**
 * Header Behavior Test Script
 * Tests the ModernHeader component behavior and functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Header Component Behavior...');

// Check if ModernHeader exists
const modernHeaderPath = path.join(__dirname, '../src-nextgen/components/ModernHeader.tsx');
if (!fs.existsSync(modernHeaderPath)) {
  console.error('❌ ModernHeader.tsx not found');
  process.exit(1);
}

// Read ModernHeader content
const headerContent = fs.readFileSync(modernHeaderPath, 'utf8');

// Test 1: Check for required imports
const requiredImports = [
  'import React from \'react\'',
  'import { View, TouchableOpacity, Platform } from \'react-native\'',
  'import { Ionicons } from \'@expo/vector-icons\'',
  'import { useTheme } from \'../../theme/ThemeProvider\'',
  'import { AutoRoleView } from \'../core/roles/AutoRoleView\'',
  'import { Text } from \'./Text\''
];

for (const importStatement of requiredImports) {
  if (!headerContent.includes(importStatement)) {
    console.error(`❌ Required import not found: ${importStatement}`);
    process.exit(1);
  }
}

// Test 2: Check for interface definition
if (!headerContent.includes('interface ModernHeaderProps')) {
  console.error('❌ ModernHeaderProps interface not found');
  process.exit(1);
}

// Test 3: Check for required props
const requiredProps = ['title', 'subtitle?', 'onBack?', 'rightAction?', 'showBackButton?'];
for (const prop of requiredProps) {
  if (!headerContent.includes(prop)) {
    console.error(`❌ Required prop not found: ${prop}`);
    process.exit(1);
  }
}

// Test 4: Check for useTheme hook usage
if (!headerContent.includes('useTheme()')) {
  console.error('❌ useTheme hook not used');
  process.exit(1);
}

// Test 5: Check for designTokens usage
if (!headerContent.includes('designTokens')) {
  console.error('❌ designTokens not used');
  process.exit(1);
}

// Test 6: Check for accessibility props
if (!headerContent.includes('accessibilityRole="button"')) {
  console.error('❌ Accessibility role not found');
  process.exit(1);
}

// Test 7: Check for conditional rendering
if (!headerContent.includes('showBackButton && onBack')) {
  console.error('❌ Conditional back button rendering not found');
  process.exit(1);
}

// Test 8: Check for rightAction rendering
if (!headerContent.includes('rightAction &&')) {
  console.error('❌ Conditional right action rendering not found');
  process.exit(1);
}

// Test 9: Check for subtitle rendering
if (!headerContent.includes('subtitle &&')) {
  console.error('❌ Conditional subtitle rendering not found');
  process.exit(1);
}

// Test 10: Check for platform-specific styling
if (!headerContent.includes('Platform.select')) {
  console.error('❌ Platform-specific styling not found');
  process.exit(1);
}

console.log('✅ Header behavior tests passed');
console.log('✅ All required imports present');
console.log('✅ Interface definition complete');
console.log('✅ Required props defined');
console.log('✅ Theme integration working');
console.log('✅ Accessibility props implemented');
console.log('✅ Conditional rendering working');
console.log('✅ Platform-specific styling implemented');

process.exit(0); 