#!/bin/bash

# Fix malformed accessibility props in all TypeScript files
echo "Fixing malformed accessibility props..."

# Pattern 1: Fix onPress with malformed accessibility props
find src -name "*.tsx" -exec sed -i '' 's/onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button">/onPress={() => /g' {} \;

# Pattern 2: Fix any remaining malformed accessibility props
find src -name "*.tsx" -exec sed -i '' 's/accessibilityRole="button" accessible={true} accessibilityLabel="Button">/accessibilityRole="button"\n                accessible={true}\n                accessibilityLabel="Button">/g' {} \;

echo "Accessibility props fixed!" 