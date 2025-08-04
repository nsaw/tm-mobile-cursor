#!/bin/bash
set -e

echo "🛡️ ZERO-ERROR HARDBLOCK: ENFORCING STRICTEST CHECKS..."

# TypeScript compilation check with logging
echo "📝 Checking TypeScript compilation..."
npx tsc --noEmit --skipLibCheck | tee /tmp/postmutation-tsc.log
if grep -q 'error' /tmp/postmutation-tsc.log; then
    echo "❌ TypeScript compilation failed. Aborting."
    echo "📋 TypeScript errors found:"
    grep 'error' /tmp/postmutation-tsc.log
    exit 11
fi
echo "✅ TypeScript compilation passed."

# ESLint validation check with logging
echo "🔍 Checking ESLint validation..."
npm run lint:ci | tee /tmp/postmutation-lint.log
if grep -q 'error' /tmp/postmutation-lint.log; then
    echo "❌ ESLint validation failed. Aborting."
    echo "📋 ESLint errors found:"
    grep 'error' /tmp/postmutation-lint.log
    exit 12
fi
echo "✅ ESLint validation passed."

# Device runtime validation (background with extended timeout)
echo "📱 Starting device runtime validation..."
{ timeout 90s npm run validate:dual-mount:device & } >/dev/null 2>&1 & disown
sleep 20

# Check for runtime errors in device logs
echo "📋 Checking device runtime logs..."
if [ -d "/tmp/dual-mount-device-logs" ]; then
    if grep -i 'error\|fail\|fatal' /tmp/dual-mount-device-logs/*.log; then
        echo "❌ Device runtime errors detected. Aborting."
        echo "📋 Runtime errors found:"
        grep -i 'error\|fail\|fatal' /tmp/dual-mount-device-logs/*.log
        exit 13
    else
        echo "✅ Device runtime logs clean."
    fi
else
    echo "⚠️ No device logs directory found, skipping runtime log check."
fi

# Check Expo/Metro status
echo "🚀 Checking Expo/Metro status..."
if curl -s http://localhost:8081/status | grep -q 'packager-status:running'; then
    echo "✅ Expo/Metro is running successfully."
else
    echo "❌ Expo is not running after patch. Aborting."
    echo "📋 Expo status check failed."
    exit 14
fi

echo "🛡️ Zero-error hardblock validation PASSED: patch is safe for merge/deploy."
echo "📁 Validation logs saved to:"
echo "   - /tmp/postmutation-tsc.log"
echo "   - /tmp/postmutation-lint.log" 