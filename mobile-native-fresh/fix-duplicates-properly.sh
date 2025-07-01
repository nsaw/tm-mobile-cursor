#!/bin/bash

echo "Fixing duplicate useTheme() declarations properly..."

# Find all TypeScript/TSX files and remove duplicate useTheme() declarations
find src -name "*.ts" -o -name "*.tsx" | while read -r file; do
  echo "Processing: $file"
  
  # Create a temporary file
  temp_file=$(mktemp)
  
  # Use sed to remove consecutive duplicate lines
  sed '/^const { tokens } = useTheme();$/,/^const { tokens } = useTheme();$/ {
    /^const { tokens } = useTheme();$/!d
    /^const { tokens } = useTheme();$/ {
      N
      /^const { tokens } = useTheme();\nconst { tokens } = useTheme();$/ {
        s/^const { tokens } = useTheme();\nconst { tokens } = useTheme();$/const { tokens } = useTheme();/
        t
      }
    }
  }' "$file" > "$temp_file"
  
  # Replace the original file with the cleaned version
  mv "$temp_file" "$file"
done

echo "Duplicate useTheme() declarations fixed!" 