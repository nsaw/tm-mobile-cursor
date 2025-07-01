#!/bin/bash

echo "Fixing malformed onPress handlers..."

# Find all TypeScript/TSX files and fix malformed onPress handlers
find src -name "*.ts" -o -name "*.tsx" | while read -r file; do
  echo "Processing: $file"
  
  # Create a temporary file
  temp_file=$(mktemp)
  
  # Use sed to fix malformed onPress handlers
  sed -E '
    # Fix onPress handlers with accessibility props mixed in
    s/onPress=\{\(\) = accessibilityRole="button" accessible=\{true\} accessibilityLabel="Button"> ([^}]+)\}/onPress={() => \1}\n      accessibilityRole="button"\n      accessible={true}\n      accessibilityLabel="Button"/g
    
    # Fix onPress handlers with accessibility props mixed in (single line)
    s/onPress=\{\(\) = accessibilityRole="button" accessible=\{true\} accessibilityLabel="Button"> ([^}]+)\}/onPress={() => \1}/g
  ' "$file" > "$temp_file"
  
  # Replace the original file with the cleaned version
  mv "$temp_file" "$file"
done

echo "Malformed onPress handlers fixed!" 