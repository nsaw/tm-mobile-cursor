#!/bin/bash
set -euo pipefail
TMPDIR="/tmp/dual-mount-device-logs"
mkdir -p "$TMPDIR"
LOGFILE="$TMPDIR/device-$(date +%s).log"
PLATFORM=${1:-ios}

echo "🔍 Device runtime log validation for $PLATFORM platform"
echo "📁 Log file: $LOGFILE"

if [ "$PLATFORM" = "ios" ]; then
  echo "📱 Starting iOS simulator log capture..."
  xcrun simctl spawn booted log stream --style syslog | tee "$LOGFILE" &
  LOG_PID=$!
  sleep 40
  kill $LOG_PID || true
else
  echo "🤖 Starting Android device log capture..."
  adb logcat '*:E ReactNative:W ReactNativeJS:W' | tee "$LOGFILE" &
  LOG_PID=$!
  sleep 40
  kill $LOG_PID || true
fi

echo "🔍 Scanning for critical runtime errors..."

ERROR_PATTERNS=(
  "Component auth has not been registered yet"
  "Failed to load legacy app"
  "Cannot read property 'default' of undefined"
  "Falling back to mock app"
  "Text strings must be rendered within a <Text> component"
  "Invariant Violation"
  "TypeError: Cannot read property"
  "Error: Component.*has not been registered"
)

for pattern in "${ERROR_PATTERNS[@]}"; do
  if grep -q "$pattern" "$LOGFILE"; then
    echo "❌ Critical runtime error detected: $pattern"
    grep -A 5 -B 5 "$pattern" "$LOGFILE"
    exit 13
  fi
done

echo "✅ No critical device runtime errors detected."
exit 0 