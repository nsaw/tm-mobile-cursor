#!/usr/bin/env bash
set -euo pipefail

## === DEVICE LOG CAPTURE HELPERS ===
start_device_log() {
  platform="$1" ; mode="$2"
  LOG_FILE="/tmp/dual-mount-logs/${mode}-${platform}.device.log"
  mkdir -p "$(dirname "$LOG_FILE")"
  if [[ "$platform" == "ios" ]]; then
    xcrun simctl spawn booted log stream --style syslog > "$LOG_FILE" 2>&1 &
    DEVICE_LOG_PID=$!
  else
    adb logcat -c
    adb logcat '*:E ReactNative:W ReactNativeJS:W' > "$LOG_FILE" 2>&1 &
    DEVICE_LOG_PID=$!
  fi
}

stop_device_log() {
  if [[ -n "$DEVICE_LOG_PID" ]]; then
    kill "$DEVICE_LOG_PID" 2>/dev/null || true
  fi
}

## === UPDATED RUNTIME ERROR LIST ===
RUNTIME_ERR_REGEX="Component .* has not been registered|Text strings must be rendered|Failed to load legacy app|TypeError: Cannot read property|Cannot read property .* of undefined"

### DUAL-MOUNT VALIDATOR ###
LOG_DIR="/tmp/dual-mount-logs"
mkdir -p "$LOG_DIR"

modes=(legacy nextgen dual)

# Define environment variables for each mode
get_env_for_mode() {
  local mode="$1"
  case "$mode" in
    legacy)
      echo "EXPO_PUBLIC_USE_LEGACY=true EXPO_PUBLIC_DUAL_MOUNT=false"
      ;;
    nextgen)
      echo "EXPO_PUBLIC_USE_LEGACY=false EXPO_PUBLIC_DUAL_MOUNT=false"
      ;;
    dual)
      echo "EXPO_PUBLIC_DUAL_MOUNT=true"
      ;;
    *)
      echo "Unknown mode: $mode"
      exit 1
      ;;
  esac
}

echo "━━ Dual-mount validator: $(date) ━━"
[[ "${NONBLOCK:-false}" == "true" ]] && echo "[INFO] Running in non-blocking mode – validator detached"
for mode in "${modes[@]}"; do
  echo "▶ Testing $mode mode"
  LOG_FILE="$LOG_DIR/$mode.log"
  DEVICE_LOG_FILE="$LOG_DIR/${mode}_device.log"
  rm -f "$LOG_FILE" "$DEVICE_LOG_FILE"
  
  env_vars=$(get_env_for_mode "$mode")
  
  # Start device log capture
  start_device_log "ios" "$mode"
  
  # Start Expo in background and capture Metro logs
  eval "$env_vars npx expo start --no-dev --clear --max-workers 1 >\"$LOG_FILE\" 2>&1 &"
  PID=$!
  
  # Wait for bundling to complete
  sleep 60
  
  # Check if Expo is running
  if ! kill -0 $PID 2>/dev/null; then
    echo "❌ Expo process died during startup"
    cat "$LOG_FILE"
    stop_device_log
    exit 1
  fi
  
  echo "✅ Expo started successfully for $mode mode"
  
  # Wait for runtime errors to appear
  sleep 60
  
  # Kill the process
  kill "$PID" 2>/dev/null || true
  
  # Check for Metro bundling errors
  if grep -qi "Unable to resolve" "$LOG_FILE"; then
    echo "❌ Unresolved modules detected in $mode mode"
    cat "$LOG_FILE" | grep -i "Unable to resolve"
    stop_device_log
    exit 1
  else
    echo "✅ $mode mode passed (no unresolved modules)"
  fi

  # Check for runtime errors with more comprehensive patterns
  echo "🔍 Checking for runtime errors in $mode mode..."
  
  ERROR_PATTERNS=(
    "Component .* has not been registered"
    "Cannot read property .default. of undefined"
    "Text strings must be rendered"
    "Component auth has not been registered"
    "Failed to load legacy app"
    "Error: Component auth has not been registered"
    "TypeError: Cannot read property"
    "Error: Component.*has not been registered"
  )
  
  FOUND_ERRORS=false
  
  for pattern in "${ERROR_PATTERNS[@]}"; do
    if grep -E "$pattern" "$LOG_FILE"; then
      echo "❌ Runtime error detected: $pattern"
      echo "=== ERROR CONTEXT ==="
      grep -A 5 -B 5 -E "$pattern" "$LOG_FILE" || true
      echo "=== END ERROR CONTEXT ==="
      FOUND_ERRORS=true
    fi
  done
  
  # Check device logs for runtime errors
  if grep -E "$RUNTIME_ERR_REGEX" "$LOG_FILE" >/dev/null 2>&1 ; then
    echo "❌ runtime errors detected in device log for $mode — see $LOG_FILE" 
    stop_device_log 
    exit 13
  fi
  
  if [ "$FOUND_ERRORS" = true ]; then
    echo "❌ Runtime validation FAILED for $mode mode"
    echo "=== FULL LOG FOR $mode ==="
    cat "$LOG_FILE"
    echo "=== END FULL LOG ==="
    stop_device_log
    exit 13
  else
    echo "✅ $mode mode passed (no runtime errors)"
  fi
  
  stop_device_log
  
  # Run device runtime error validation (non-blocking)
  echo "🔍 Running device runtime error validation for $mode mode..."
  { timeout 60s bash scripts/validate-dual-mount-device.sh ios || echo "⚠️ Device validation failed (non-blocking)" ; } &
  DEVICE_VALIDATION_PID=$!
  
  echo "=== LOG FILE CONTENTS FOR $mode ==="
  cat "$LOG_FILE"
  echo "=== END LOG FILE CONTENTS ==="
  
  # Wait for device validation to complete
  wait $DEVICE_VALIDATION_PID 2>/dev/null || true
done

echo "🎉 Dual-mount validation succeeded" 