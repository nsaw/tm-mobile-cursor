#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Device Runtime Error Validator: $(date)"

# Kill any existing Expo processes
kill $(lsof -ti:8081) 2>/dev/null || true

# Start Expo and capture device logs
echo "▶ Starting Expo with legacy mode and capturing device logs..."
EXPO_PUBLIC_USE_LEGACY=true EXPO_PUBLIC_DUAL_MOUNT=false npx expo start --no-dev --clear --max-workers 1 > /tmp/expo-device.log 2>&1 &
EXPO_PID=$!

# Wait for bundling to complete
echo "⏳ Waiting for bundling to complete..."
sleep 60

# Check if Expo is running
if ! kill -0 $EXPO_PID 2>/dev/null; then
  echo "❌ Expo process died during startup"
  cat /tmp/expo-device.log
  exit 1
fi

echo "✅ Expo started successfully"
echo "⏳ Waiting for device runtime errors to appear..."
sleep 60

# Kill Expo and check for runtime errors
kill $EXPO_PID 2>/dev/null || true

# Check for runtime errors in the device logs
echo "🔍 Checking for runtime errors in device logs..."

ERROR_PATTERNS=(
  "Component .* has not been registered"
  "Cannot read property .default. of undefined"
  "Text strings must be rendered"
  "Component auth has not been registered"
  "Failed to load legacy app"
  "Error: Component auth has not been registered"
)

FOUND_ERRORS=false

echo "=== FULL DEVICE LOG ==="
cat /tmp/expo-device.log
echo "=== END FULL DEVICE LOG ==="

for pattern in "${ERROR_PATTERNS[@]}"; do
  if grep -E "$pattern" /tmp/expo-device.log; then
    echo "❌ Runtime error detected: $pattern"
    echo "=== ERROR CONTEXT ==="
    grep -A 5 -B 5 -E "$pattern" /tmp/expo-device.log || true
    echo "=== END ERROR CONTEXT ==="
    FOUND_ERRORS=true
  fi
done

if [ "$FOUND_ERRORS" = true ]; then
  echo "❌ Device runtime validation FAILED"
  exit 13
else
  echo "✅ No device runtime errors detected"
  echo "✅ Device runtime validation PASSED"
fi 