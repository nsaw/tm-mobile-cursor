#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Runtime Error Validator: $(date)"

# Kill any existing Expo processes
kill $(lsof -ti:8081) 2>/dev/null || true

# Start Expo and capture logs
echo "▶ Starting Expo with legacy mode..."
EXPO_PUBLIC_USE_LEGACY=true EXPO_PUBLIC_DUAL_MOUNT=false npx expo start --no-dev --clear --max-workers 1 > /tmp/expo-startup.log 2>&1 &
EXPO_PID=$!

# Wait for bundling to complete
echo "⏳ Waiting for bundling to complete..."
sleep 60

# Check if Expo is running
if ! kill -0 $EXPO_PID 2>/dev/null; then
  echo "❌ Expo process died during startup"
  cat /tmp/expo-startup.log
  exit 1
fi

echo "✅ Expo started successfully"
echo "⏳ Waiting for runtime errors to appear..."
sleep 30

# Kill Expo and check for runtime errors
kill $EXPO_PID 2>/dev/null || true

# Check for runtime errors in the logs
echo "🔍 Checking for runtime errors..."

ERROR_PATTERNS=(
  "Component .* has not been registered"
  "Cannot read property .default. of undefined"
  "Text strings must be rendered"
  "Component auth has not been registered"
)

FOUND_ERRORS=false

for pattern in "${ERROR_PATTERNS[@]}"; do
  if grep -E "$pattern" /tmp/expo-startup.log; then
    echo "❌ Runtime error detected: $pattern"
    echo "=== ERROR CONTEXT ==="
    grep -A 3 -B 3 -E "$pattern" /tmp/expo-startup.log || true
    echo "=== END ERROR CONTEXT ==="
    FOUND_ERRORS=true
  fi
done

if [ "$FOUND_ERRORS" = true ]; then
  echo "❌ Runtime validation FAILED"
  exit 13
else
  echo "✅ No runtime errors detected"
  echo "✅ Runtime validation PASSED"
fi 