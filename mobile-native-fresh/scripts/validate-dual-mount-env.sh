#!/bin/bash

# Dual-mount environment validation script
# Validates that environment variables are properly set for dual-mount architecture

set -e

echo "🔍 Validating dual-mount environment configuration..."

# Check if .env.development.local exists
if [ ! -f ".env.development.local" ]; then
    echo "❌ .env.development.local file not found"
    echo "   Creating default NextGen configuration..."
    echo '# Dual-mount toggle override for NextGen mode' > .env.development.local
    echo 'EXPO_PUBLIC_USE_NEXTGEN=true' >> .env.development.local
    echo 'EXPO_PUBLIC_ENVIRONMENT=nextgen' >> .env.development.local
    echo 'USE_NEXTGEN=true' >> .env.development.local
fi

# Validate environment variables
echo "📋 Checking environment variables..."

# Check EXPO_PUBLIC_USE_NEXTGEN
if grep -q "EXPO_PUBLIC_USE_NEXTGEN=true" .env.development.local; then
    echo "✅ EXPO_PUBLIC_USE_NEXTGEN=true (NextGen mode enabled)"
    ENVIRONMENT="nextgen"
elif grep -q "EXPO_PUBLIC_USE_NEXTGEN=false" .env.development.local; then
    echo "✅ EXPO_PUBLIC_USE_NEXTGEN=false (Legacy mode enabled)"
    ENVIRONMENT="legacy"
else
    echo "⚠️  EXPO_PUBLIC_USE_NEXTGEN not found, defaulting to NextGen"
    ENVIRONMENT="nextgen"
fi

# Check EXPO_PUBLIC_ENVIRONMENT
if grep -q "EXPO_PUBLIC_ENVIRONMENT=nextgen" .env.development.local; then
    echo "✅ EXPO_PUBLIC_ENVIRONMENT=nextgen"
elif grep -q "EXPO_PUBLIC_ENVIRONMENT=legacy" .env.development.local; then
    echo "✅ EXPO_PUBLIC_ENVIRONMENT=legacy"
else
    echo "⚠️  EXPO_PUBLIC_ENVIRONMENT not found"
fi

# Check USE_NEXTGEN
if grep -q "USE_NEXTGEN=true" .env.development.local; then
    echo "✅ USE_NEXTGEN=true"
elif grep -q "USE_NEXTGEN=false" .env.development.local; then
    echo "✅ USE_NEXTGEN=false"
else
    echo "⚠️  USE_NEXTGEN not found"
fi

# Display current configuration
echo ""
echo "🎯 Current Environment Configuration:"
echo "======================================"
cat .env.development.local
echo "======================================"

# Validate package.json scripts
echo ""
echo "📦 Checking package.json scripts..."

if grep -q '"dev:nextgen"' package.json; then
    echo "✅ dev:nextgen script found"
else
    echo "❌ dev:nextgen script not found in package.json"
fi

if grep -q '"dev:legacy"' package.json; then
    echo "✅ dev:legacy script found"
else
    echo "❌ dev:legacy script not found in package.json"
fi

if grep -q '"validate:env"' package.json; then
    echo "✅ validate:env script found"
else
    echo "❌ validate:env script not found in package.json"
fi

# Check if env-cmd is installed
echo ""
echo "🔧 Checking dependencies..."

if npm list env-cmd >/dev/null 2>&1; then
    echo "✅ env-cmd package installed"
else
    echo "⚠️  env-cmd package not installed, installing..."
    npm install --save-dev env-cmd
fi

# Test environment variable loading
echo ""
echo "🧪 Testing environment variable loading..."

# Create a temporary test script
cat > /tmp/test-env.js << 'EOF'
require('dotenv').config({ path: '.env.development.local' });
console.log('EXPO_PUBLIC_USE_NEXTGEN:', process.env.EXPO_PUBLIC_USE_NEXTGEN);
console.log('EXPO_PUBLIC_ENVIRONMENT:', process.env.EXPO_PUBLIC_ENVIRONMENT);
console.log('USE_NEXTGEN:', process.env.USE_NEXTGEN);
EOF

if node /tmp/test-env.js 2>/dev/null; then
    echo "✅ Environment variables load correctly"
else
    echo "❌ Environment variables failed to load"
fi

# Clean up
rm -f /tmp/test-env.js

echo ""
echo "🎉 Dual-mount environment validation complete!"
echo "Current environment: $ENVIRONMENT"
echo ""
echo "To switch environments:"
echo "  NextGen: npm run dev:nextgen"
echo "  Legacy:  npm run dev:legacy"
echo "  Validate: npm run validate:env" 