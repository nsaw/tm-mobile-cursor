#!/usr/bin/env node

/**
 * Unified Clickable/Theme/Role Enforcement Script
 * Validates and auto-fixes clickables, onPress, routing, theme tokens, accessibility, and roleView
 */

const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full, callback);
    else if (full.endsWith('.tsx') || full.endsWith('.ts')) callback(full);
  });
}

function fixFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let original = src;

  if (/Touchable|Pressable/.test(src) && !/accessibilityRole/.test(src)) {
    src = src.replace(/<(\w+)([^>]*onPress=)/, '<$1 accessibilityRole="button" $2');
  }
  if (/tokens\.(colors|spacing)/.test(src)) {
    src = src.replace(/tokens\./g, 'useTheme().tokens.');
  }
  if (src.includes('tokens') && !src.includes('useTheme')) {
    src = 'const { tokens } = useTheme();
' + src;
  }
  if (/<View[^>]*>/.test(src)) {
    src = src.replace(/<View/g, '<AutoRoleView');
    src = src.replace(/<\/View>/g, '</AutoRoleView>');
  }

  if (src !== original) {
    fs.writeFileSync(filePath, src, 'utf8');
    console.log(`[FIXED] ${filePath}`);
  }
}

const srcRoot = path.resolve(__dirname, '../mobile-native-fresh/src');
walk(srcRoot, fixFile);
