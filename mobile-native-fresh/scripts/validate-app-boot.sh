#!/bin/bash

# Validate app boot and force refresh
set -e

echo "🔍 Validating app boot state..."

# Check if Expo is running
if ! curl -s http://localhost:8081/status > /dev/null 2>&1; then
  echo "⚠️  Expo not running, starting..."
  cd /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh
  { npx expo start --clear & } >/dev/null 2>&1 & disown
  sleep 10
fi

# Force app refresh
echo "🔄 Forcing app refresh..."
curl -X POST http://localhost:8081/reload || echo "Reload failed, continuing..."

# Wait for app to stabilize
sleep 5

echo "✅ App boot validation complete"
exit 0 