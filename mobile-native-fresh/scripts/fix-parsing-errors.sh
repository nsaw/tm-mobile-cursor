#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
cd "$APP_DIR"
LOG_DIR="$APP_DIR/validations/logs"; STATUS_DIR="$APP_DIR/validations/status"
mkdir -p "$LOG_DIR" "$STATUS_DIR"
NB="node scripts/nb.cjs"

# Ensure latest triage exists
$NB --ttl 20s --label triage-static --log "$LOG_DIR/triage-static.log" --status "$STATUS_DIR" -- node scripts/tools/triage-static.cjs

# Focused pass over top TS offenders
$NB --ttl 90s --label focused-parser-pass --log "$LOG_DIR/focused-parser-pass.log" --status "$STATUS_DIR" -- node scripts/tools/focused-parser-pass.cjs --top 50

# Targeted sed fixes (idempotent)
find src-nextgen -name "*.tsx" -exec grep -l "onPress.*=.*accessibilityRole" {} \; | while read file; do
  sed -i '' 's/onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button">/onPress={() =>/g' "$file" || true
done

find src-nextgen -name "*.tsx" -exec grep -l "accessibilityLabel={[^}]*}" {} \; | while read file; do
  sed -i '' 's/accessibilityLabel={[^}]*}/accessibilityLabel="Button"/g' "$file" || true
done

echo "[fix-parsing] completed"
