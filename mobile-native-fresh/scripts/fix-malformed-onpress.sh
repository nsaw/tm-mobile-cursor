#!/bin/{ { { { bash

# Script to fix malformed onPress handlers that have accessibility props mixed in & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# This script finds and fixes patterns like: onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> { ... }}

echo "🔧 Fixing malformed onPress handlers..."

# Function to fix malformed onPress handlers in a file
fix_malformed_onpress() {
    local file="$1"
    
    # Check if file contains malformed onPress handlers
    if grep -q "onPress={() = accessibilityRole" "$file"; then
        echo "Fixing: $file"
        
        # Create a temporary file
        temp_file=$(mktemp)
        
        # Fix the malformed onPress handlers
        sed -E 's/onPress=\{\(\) = accessibilityRole="button" accessible=\{true\} accessibilityLabel="Button"> \{/onPress={() => {/g' "$file" > "$temp_file"
        
        # Move the fixed file back
        mv "$temp_file" "$file"
    fi
}

# Find all TypeScript/TSX files and fix them
find src -name "*.tsx" -o -name "*.ts" | while read -r file; do
    fix_malformed_onpress "$file"
done

echo "✅ Malformed onPress handlers fixed!" 