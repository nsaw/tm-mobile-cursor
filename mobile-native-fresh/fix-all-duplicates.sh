#!/bin/bash

echo "Fixing all duplicate useTheme() declarations..."

# Find all TypeScript/TSX files and remove duplicate useTheme() declarations
find src -name "*.ts" -o -name "*.tsx" | while read -r file; do
  echo "Processing: $file"
  
  # Create a temporary file
  temp_file=$(mktemp)
  
  # Use awk to remove consecutive duplicate lines
  awk '
  BEGIN { prev_line = ""; skip_next = 0; }
  {
    current_line = $0
    if (current_line ~ /^const \{ tokens \} = useTheme\(\);$/) {
      if (prev_line ~ /^const \{ tokens \} = useTheme\(\);$/) {
        # Skip this line - it is a duplicate
        skip_next = 1
      } else {
        # Keep this line
        print current_line
        skip_next = 0
      }
    } else {
      if (!skip_next) {
        print current_line
      }
      skip_next = 0
    }
    prev_line = current_line
  }
  ' "$file" > "$temp_file"
  
  # Replace the original file with the cleaned version
  mv "$temp_file" "$file"
done

echo "All duplicate useTheme() declarations fixed!" 