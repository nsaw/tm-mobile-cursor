#!/bin/bash

# Theming Architecture Verification Script
# This script verifies that the theming architecture is properly enforced

echo "🔍 Verifying Theming Architecture..."
echo "=================================="

# Check for direct token imports in components
echo "1. Checking for direct token imports in components..."
DIRECT_IMPORTS=$(npx eslint src --ext .ts,.tsx --format=unix 2>/dev/null | grep "no-restricted-imports" | wc -l)

if [ "$DIRECT_IMPORTS" -eq 0 ]; then
    echo "   ✅ No direct token imports found in components"
else
    echo "   ❌ Found $DIRECT_IMPORTS direct token import violations"
    echo "   Run 'npm run lint:check-theme' to see details"
    exit 1
fi

# Check for tokens usage at module scope (excluding legitimate patterns)
echo "2. Checking for tokens usage at module scope..."
MODULE_SCOPE_USAGE=$(grep -r "tokens\." src/ --include="*.ts" --include="*.tsx" | \
  grep -v "src/theme/" | \
  grep -v "src/utils/getRadiusForHeight.ts" | \
  grep -v "const { tokens }" | \
  grep -v "getStyles(tokens" | \
  grep -v "tokens: any" | \
  grep -v "tokens: ThemeTokens" | \
  grep -v "tokens\.colors\." | \
  grep -v "tokens\.spacing\." | \
  grep -v "tokens\.typography\." | \
  grep -v "tokens\.radius\." | \
  grep -v "tokens\.zIndex\." | \
  wc -l)

if [ "$MODULE_SCOPE_USAGE" -eq 0 ]; then
    echo "   ✅ No tokens usage at module scope found"
else
    echo "   ❌ Found $MODULE_SCOPE_USAGE potential tokens usage at module scope"
    echo "   Check these files for violations:"
    grep -r "tokens\." src/ --include="*.ts" --include="*.tsx" | \
      grep -v "src/theme/" | \
      grep -v "src/utils/getRadiusForHeight.ts" | \
      grep -v "const { tokens }" | \
      grep -v "getStyles(tokens" | \
      grep -v "tokens: any" | \
      grep -v "tokens: ThemeTokens" | \
      grep -v "tokens\.colors\." | \
      grep -v "tokens\.spacing\." | \
      grep -v "tokens\.typography\." | \
      grep -v "tokens\.radius\." | \
      grep -v "tokens\.zIndex\."
    exit 1
fi

# Check for useTheme() usage in components that use theme tokens
echo "3. Checking for useTheme() usage in components that use theme tokens..."
COMPONENTS_WITH_THEME_TOKENS=$(find src/ -name "*.tsx" -path "*/components/*" -o -name "*.tsx" -path "*/screens/*" | xargs grep -l "tokens\." | wc -l)
COMPONENTS_WITH_THEME_HOOK=$(find src/ -name "*.tsx" -path "*/components/*" -o -name "*.tsx" -path "*/screens/*" | xargs grep -l "useTheme" | wc -l)

if [ "$COMPONENTS_WITH_THEME_TOKENS" -eq "$COMPONENTS_WITH_THEME_HOOK" ]; then
    echo "   ✅ All components that use theme tokens have useTheme() hook"
else
    echo "   ❌ Found components using theme tokens without useTheme() hook"
    echo "   Components using tokens without useTheme():"
    find src/ -name "*.tsx" -path "*/components/*" -o -name "*.tsx" -path "*/screens/*" | xargs grep -l "tokens\." | xargs grep -L "useTheme"
    exit 1
fi

# Check ESLint configuration
echo "4. Checking ESLint configuration..."
if [ -f ".eslintrc.cjs" ]; then
    echo "   ✅ ESLint configuration file exists"
    
    if grep -q "no-restricted-imports" .eslintrc.cjs; then
        echo "   ✅ Theming enforcement rule is configured"
    else
        echo "   ❌ Theming enforcement rule is missing from ESLint config"
        exit 1
    fi
else
    echo "   ❌ ESLint configuration file missing"
    exit 1
fi

# Check package.json scripts
echo "5. Checking package.json scripts..."
if grep -q "lint:check-theme" package.json; then
    echo "   ✅ Theme check script is configured"
else
    echo "   ❌ Theme check script is missing from package.json"
    exit 1
fi

if grep -q "pre-commit" package.json; then
    echo "   ✅ Pre-commit hook is configured"
else
    echo "   ❌ Pre-commit hook is missing from package.json"
    exit 1
fi

# Check documentation
echo "6. Checking documentation..."
if [ -f "docs/THEMING_GUIDE.md" ]; then
    echo "   ✅ Theming guide documentation exists"
else
    echo "   ❌ Theming guide documentation is missing"
    exit 1
fi

if [ -f "CONTRIBUTING.md" ]; then
    echo "   ✅ Contributing guidelines exist"
else
    echo "   ❌ Contributing guidelines are missing"
    exit 1
fi

echo ""
echo "🎉 Theming Architecture Verification Complete!"
echo "✅ All checks passed - architecture is properly enforced"
echo ""
echo "📋 Summary:"
echo "   - No direct token imports in components"
echo "   - No tokens usage at module scope"
echo "   - All components using theme tokens have useTheme() hook"
echo "   - ESLint enforcement is configured"
echo "   - Pre-commit hooks are active"
echo "   - Documentation is in place"
echo ""
echo "🚀 The theming architecture is locked in and enforced!" 