#!/bin/bash

# Script to fix tokens → designTokens refactor across the project
# This script follows the v1.3.6 tokens_to_design_tokens.json task requirements

set -e

echo "🔧 Starting tokens → designTokens refactor..."

# Step 1: Find and fix files with multiple useTheme() calls
echo "📋 Step 1: Fixing files with multiple useTheme() calls..."

# Find files with multiple useTheme() calls and collapse them
find src -name "*.tsx" -exec grep -l "const { tokens } = useTheme()" {} \; | while read file; do
    echo "Processing: $file"
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Replace multiple useTheme() calls with single call and destructuring
    # Pattern: multiple lines of "const { tokens } = useTheme();" → single "const { designTokens } = useTheme();"
    sed -i '' '/^[[:space:]]*const { tokens } = useTheme();$/d' "$file"
    
    # Add single useTheme call at the beginning of the component
    # Find the first occurrence of "const { tokens } = useTheme();" and replace with designTokens
    sed -i '' 's/const { tokens } = useTheme();/const { designTokens } = useTheme();/' "$file"
    
    # Replace all tokens. references with designTokens.
    sed -i '' 's/tokens\./designTokens./g' "$file"
    
    echo "✅ Fixed: $file"
done

# Step 2: Fix function parameters named 'tokens'
echo "📋 Step 2: Fixing function parameters named 'tokens'..."

find src -name "*.tsx" -exec grep -l "function.*tokens" {} \; | while read file; do
    echo "Processing function parameters: $file"
    
    # Replace function parameters named 'tokens' with 'designTokens'
    sed -i '' 's/function.*\([^)]*\)tokens\([^)]*\)/function \1designTokens\2/g' "$file"
    sed -i '' 's/\([^a-zA-Z0-9_]\)\(tokens\)\([^a-zA-Z0-9_]\)/\1designTokens\3/g' "$file"
    
    echo "✅ Fixed function parameters: $file"
done

# Step 3: Update any remaining tokens references
echo "📋 Step 3: Updating remaining tokens references..."

find src -name "*.tsx" -exec grep -l "tokens\." {} \; | while read file; do
    echo "Processing remaining tokens: $file"
    
    # Replace any remaining tokens. with designTokens.
    sed -i '' 's/tokens\./designTokens./g' "$file"
    
    echo "✅ Updated remaining tokens: $file"
done

echo "🎉 Tokens → designTokens refactor complete!"
echo "📝 Next steps:"
echo "  1. Run 'npm run lint' to check for any remaining issues"
echo "  2. Run 'tsc --noEmit' to check TypeScript errors"
echo "  3. Test the application to ensure everything works" 