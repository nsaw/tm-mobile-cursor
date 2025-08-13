#!/bin/zsh
# Expo App Refresh Validation — non-blocking kickoff with a bounded readiness probe
set -euo pipefail
PORT=8081
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
cd "$ROOT"
mkdir -p validations/status

(
  kill $(lsof -ti:${PORT}) 2>/dev/null || true
  npx expo start --ios --clear &
  PID=$!
  sleep 15
  disown $PID
  date +%FT%T%z > validations/status/expo.started
) >/dev/null 2>&1 &

if command -v curl >/dev/null 2>&1; then
  timeout 30s bash -lc 'until curl -fsS http://localhost:8081 >/dev/null; do sleep 1; done' || true
fi
