#!/bin/bash

# Script to remove orphaned accessibility props from lines not attached to a JSX tag
set -e

echo "🧹 Cleaning up orphaned accessibility props..."

find src -name "*.tsx" | while read file; do
  cp "$file" "$file.backup2"
  sed -i '' \
    -e '/^\s*accessibilityRole="button"\s*$/d' \
    -e '/^\s*accessible={true}\s*$/d' \
    -e '/^\s*accessibilityLabel="Button"\s*$/d' \
    -e '/^\s*accessibilityLabel="Modal"\s*$/d' \
    "$file"
  echo "Cleaned: $file"
done

echo "✅ Orphaned accessibility props cleanup complete!" 