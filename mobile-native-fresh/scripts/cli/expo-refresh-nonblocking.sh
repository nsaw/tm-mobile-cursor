#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="${ROOT_DIR:-/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh}"
EXPO_PORT="${EXPO_PORT:-8081}"
EXPO_BOOT_WAIT="${EXPO_BOOT_WAIT:-25}"
TIMEOUT_EXPO="${TIMEOUT_EXPO:-120}"

cd "$ROOT_DIR"

# Kill any existing process on port
(timeout 5s kill "$(lsof -ti:${EXPO_PORT})" 2>/dev/null || true) || true

# Start Expo in background with timeout + disown
(
  timeout "${TIMEOUT_EXPO}s" npx expo start --ios --clear >/dev/null 2>&1 &
  PID=$!
  sleep "${EXPO_BOOT_WAIT}"
  disown "$PID"
) >/dev/null 2>&1 &

# Return immediately (non-blocking). Health checks are done by validate-expo-status.sh.
exit 0


