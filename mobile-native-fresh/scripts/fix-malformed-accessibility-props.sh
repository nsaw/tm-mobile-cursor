#!/bin/bash

# Script to fix malformed accessibility props in JSX onPress handlers
# This script follows the v1.3.2 syntax-lint-boot-validation task requirements

set -e

echo "🔧 Starting malformed accessibility props fix..."

# Pattern to fix: onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> ... }
# Should be: onPress={() => { ... }}

find src -name "*.tsx" -exec grep -l "onPress.*=.*accessibilityRole" {} \; | while read file; do
    echo "Processing: $file"
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Fix the malformed onPress handlers
    # Pattern: onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> ... }
    # Replace with: onPress={() => { ... }}
    
    # Use sed to fix the pattern - replace the malformed start
    sed -i '' 's/onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button">/onPress={() => {/g' "$file"
    
    # Fix the closing pattern - remove the duplicate accessibility props
    sed -i '' 's/}} accessibilityRole="button" accessible={true} accessibilityLabel="Button">/}}/g' "$file"
    
    echo "✅ Fixed malformed accessibility props: $file"
done

echo "🎉 Malformed accessibility props fix complete!"
echo "📝 Next steps:"
echo "  1. Run 'tsc --noEmit' to check for remaining TypeScript errors"
echo "  2. Run 'npm run lint' to check for remaining linting issues"
echo "  3. Test the application to ensure everything works" 