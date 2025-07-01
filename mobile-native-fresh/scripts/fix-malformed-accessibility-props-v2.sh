#!/bin/bash

# Script to fix malformed accessibility props in JSX onPress handlers - Version 2
# This script follows the v1.3.2 syntax-lint-boot-validation task requirements

set -e

echo "🔧 Starting malformed accessibility props fix - Version 2..."

# Function to fix a single file
fix_file() {
    local file="$1"
    echo "Processing: $file"
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Use Node.js to properly parse and fix the JSX
    node -e "
const fs = require('fs');
const path = require('path');

const filePath = '$file';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the malformed onPress handlers
// Pattern: onPress={() = accessibilityRole=\"button\" accessible={true} accessibilityLabel=\"Button\"> ... }
// Replace with: onPress={() => { ... }}

// First, fix the opening pattern
content = content.replace(
  /onPress=\{\(\) = accessibilityRole=\"button\" accessible=\{true\} accessibilityLabel=\"Button\">/g,
  'onPress={() => {'
);

// Then fix the closing pattern - remove the orphaned accessibility props
content = content.replace(
  /}} accessibilityRole=\"button\" accessible=\{true\} accessibilityLabel=\"Button\">/g,
  '}}'
);

// Fix any remaining orphaned accessibility props
content = content.replace(
  /accessibilityRole=\"button\"\s+accessible=\{true\}\s+accessibilityLabel=\"Button\">/g,
  '>'
);

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed:', filePath);
"
    
    echo "✅ Fixed malformed accessibility props: $file"
}

# Find and fix all files with malformed accessibility props
find src -name "*.tsx" -exec grep -l "onPress.*=.*accessibilityRole" {} \; | while read file; do
    fix_file "$file"
done

echo "🎉 Malformed accessibility props fix complete!"
echo "📝 Next steps:"
echo "  1. Run 'tsc --noEmit' to check for remaining TypeScript errors"
echo "  2. Run 'npm run lint' to check for remaining linting issues"
echo "  3. Test the application to ensure everything works" 