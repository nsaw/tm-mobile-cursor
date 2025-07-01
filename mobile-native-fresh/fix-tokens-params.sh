#!/bin/bash

# Fix function parameters named 'tokens' to 'designTokens'
echo "Fixing function parameters from tokens to designTokens..."

# Fix function parameter declarations
find src -name "*.ts" -exec sed -i '' 's/function \([^(]*\)(tokens: DesignTokens)/function \1(designTokens: DesignTokens)/g' {} \;

# Fix function parameter declarations in arrow functions
find src -name "*.ts" -exec sed -i '' 's/(tokens: DesignTokens)/(designTokens: DesignTokens)/g' {} \;

echo "Function parameters fixed!" 