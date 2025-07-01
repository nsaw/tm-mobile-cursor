#!/bin/bash

# Replace tokens references with designTokens in function bodies
echo "Replacing tokens references with designTokens in function bodies..."

# This is a more complex replacement that needs to be done carefully
# We'll focus on the specific files that have function parameters

# Fix variants.ts file
sed -i '' 's/tokens\./designTokens./g' src/theme/variants.ts

# Fix getRadiusForHeight.ts file
sed -i '' 's/tokens\./designTokens./g' src/utils/getRadiusForHeight.ts

# Fix getTextVariant.ts file
sed -i '' 's/tokens\./designTokens./g' src/utils/getTextVariant.ts

echo "Tokens references fixed!" 