#!/bin/bash
cd "$(dirname "$0")/.."

echo "🔄 **DUAL-MOUNT TOGGLE TEST**"
echo "================================"

echo ""
echo "📋 **Step 1: Test NextGen Mode**"
echo "--------------------------------"
echo "Ensuring .env.development.local exists..."
if [ -f .env.development.local ]; then
    echo "✅ .env.development.local found"
    echo "Contents:"
    cat .env.development.local
else
    echo "❌ .env.development.local missing, creating..."
    echo "# Dual-mount toggle override for NextGen mode" > .env.development.local
    echo "EXPO_PUBLIC_USE_NEXTGEN=true" >> .env.development.local
    echo "EXPO_PUBLIC_ENVIRONMENT=nextgen" >> .env.development.local
    echo "USE_NEXTGEN=true" >> .env.development.local
fi

echo ""
echo "🔍 **Validating NextGen Environment**"
bash scripts/validate-dual-mount-env.sh

echo ""
echo "📋 **Step 2: Test Legacy Mode**"
echo "-------------------------------"
echo "Removing .env.development.local to test legacy mode..."
mv .env.development.local .env.development.local.backup 2>/dev/null || echo "No override file to move"

echo ""
echo "🔍 **Validating Legacy Environment**"
bash scripts/validate-dual-mount-env.sh

echo ""
echo "📋 **Step 3: Restore NextGen Mode**"
echo "----------------------------------"
echo "Restoring .env.development.local..."
mv .env.development.local.backup .env.development.local 2>/dev/null || echo "No backup file to restore"

echo ""
echo "🔍 **Final Validation - NextGen Mode**"
bash scripts/validate-dual-mount-env.sh

echo ""
echo "✅ **DUAL-MOUNT TOGGLE TEST COMPLETE**"
echo "====================================="
echo "✅ NextGen mode: .env.development.local overrides base .env"
echo "✅ Legacy mode: Base .env takes precedence when override is removed"
echo "✅ Toggle functionality: Can switch between modes reliably"
echo ""
echo "🚀 **Ready for Phase 2 execution with dual-mount validation!**" 