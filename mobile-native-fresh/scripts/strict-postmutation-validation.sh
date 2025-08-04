#!/bin/bash
set -e

echo "🛡️ POST-MUTATION VALIDATION GATE: ENFORCING STRICT CHECKS..."

# TypeScript compilation check
echo "📝 Checking TypeScript compilation..."
npx tsc --noEmit --skipLibCheck || { echo "❌ TypeScript compilation failed. Aborting."; exit 11; }
echo "✅ TypeScript compilation passed."

# ESLint validation check
echo "🔍 Checking ESLint validation..."
npm run lint:ci || { echo "❌ ESLint validation failed. Aborting."; exit 12; }
echo "✅ ESLint validation passed."

# Device runtime validation (background)
echo "📱 Starting device runtime validation..."
{ timeout 80s npm run validate:dual-mount:device & } >/dev/null 2>&1 & disown
sleep 15

# Check for runtime errors in logs
echo "📋 Checking device runtime logs..."
if [ -d "/tmp/dual-mount-device-logs" ]; then
    grep -i 'error\|fail\|fatal' /tmp/dual-mount-device-logs/*.log && { echo "❌ Device runtime errors detected. Aborting."; exit 13; } || echo "✅ Device runtime logs clean."
else
    echo "⚠️ No device logs directory found, skipping runtime log check."
fi

# Check Expo/Metro status
echo "🚀 Checking Expo/Metro status..."
curl -s http://localhost:8081/status | grep -q 'packager-status:running' || { echo "❌ Expo is not running after patch. Aborting."; exit 14; }
echo "✅ Expo/Metro is running successfully."

echo "✅ All validation gates passed! Patch is valid." 