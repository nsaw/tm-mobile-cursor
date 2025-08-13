#!/usr/bin/env bash
# Fix parsing errors introduced by ESLint auto-fix
set -euo pipefail

echo "[fix-parsing] Starting parsing error fixes..."

# Fix malformed onPress handlers
find src-nextgen -name "*.tsx" -exec grep -l "onPress.*=.*accessibilityRole" {} \; | while read file; do
  echo "[fix-parsing] Fixing malformed onPress in $file"
  # Fix the pattern: onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> ...}
  sed -i '' 's/onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button">/onPress={() =>/g' "$file" || true
done

# Fix malformed accessibilityLabel attributes
find src-nextgen -name "*.tsx" -exec grep -l "accessibilityLabel={[^}]*}" {} \; | while read file; do
  echo "[fix-parsing] Fixing malformed accessibilityLabel in $file"
  # Replace complex accessibilityLabel with simple string
  sed -i '' 's/accessibilityLabel={[^}]*}/accessibilityLabel="Button"/g' "$file" || true
done

# Fix malformed accessibilityRole attributes
find src-nextgen -name "*.tsx" -exec grep -l "accessibilityRole={[^}]*}" {} \; | while read file; do
  echo "[fix-parsing] Fixing malformed accessibilityRole in $file"
  # Replace complex accessibilityRole with simple string
  sed -i '' 's/accessibilityRole={[^}]*}/accessibilityRole="button"/g' "$file" || true
done

echo "[fix-parsing] Parsing error fixes completed"
