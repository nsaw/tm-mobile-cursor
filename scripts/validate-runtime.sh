#!/usr/bin/env bash
set -e

echo "=== [VALIDATION] Checking Node.js tools... ==="
command -v node || { echo "❌ Node.js not found"; exit 1; }
command -v npm  || { echo "❌ npm not found"; exit 1; }
command -v npx  || { echo "❌ npx not found"; exit 1; }
node --version
npm --version
npx --version

echo "=== [VALIDATION] Running TypeScript validation... ==="
timeout 30s npx tsc --noEmit || { echo "❌ TypeScript validation failed"; exit 1; }

echo "=== [VALIDATION] Running ESLint validation... ==="
timeout 30s npx eslint . --ext .ts,.tsx --max-warnings=0 || { echo "❌ ESLint validation failed"; exit 1; }

echo "=== [VALIDATION] Running unit tests... ==="
timeout 30s npm test -- --watchAll=false || { echo "❌ Unit tests failed"; exit 1; }

echo "=== [VALIDATION] Refreshing Expo server (background, non-blocking)... ==="
( 
  kill $(lsof -ti:8081) 2>/dev/null || true
  cd /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh
  timeout 30s npx expo start --ios --clear &
  PID=$!
  sleep 20
  disown $PID
) >/dev/null 2>&1 &

sleep 25
echo "=== [VALIDATION] Checking Expo server status... ==="
curl -s http://localhost:8081/status | grep -q "packager-status:running" || { echo "❌ Expo server not running"; exit 1; }

echo "=== [VALIDATION] Checking app console logs for errors... ==="
# Replace with your preferred log tailing strategy (adjust path as needed)
if grep -E "ERROR|FATAL|must be used within a" /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/logs/expo.log; then
  echo "❌ Runtime/console error detected in app logs"
  exit 1
fi

echo "=== [VALIDATION] Running Maestro visual and UI automation... ==="
timeout 60s npm run test:maestro:baseline || { echo "❌ Maestro baseline failed"; exit 1; }
timeout 60s npm run test:maestro:visual   || { echo "❌ Maestro visual regression failed"; exit 1; }

echo "=== [VALIDATION] Runtime validation COMPLETE: No errors detected ==="
exit 0
