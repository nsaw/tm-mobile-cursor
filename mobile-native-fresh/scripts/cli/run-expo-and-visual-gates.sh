#!/usr/bin/env bash
set -euo pipefail
APP="${1:?APP path required}"
VAL="${2:?Validation dir required}"
VIS="$VAL/visual"
mkdir -p "$VAL" "$VIS"

# Expo refresh (non-blocking) + status
bash "$APP/scripts/cli/expo-refresh-nonblocking.sh"
bash "$APP/scripts/cli/validate-expo-status.sh"

# Visual boot: prefer Detox if configured, else Maestro, else simctl fallback
if [ -f "$APP/.detoxrc.cjs" ] || [ -f "$APP/.detoxrc.js" ]; then
  npm run -s test:detox:boot 1>"$VIS/detox-boot.out" 2>&1 || true
  find "$APP" -type f -name "*boot*.png" -maxdepth 6 -print -quit | xargs -I{} cp "{}" "$VIS/boot.png" 2>/dev/null || true
elif command -v maestro >/dev/null 2>&1 && [ -f "$APP/.maestro/flows/boot.yaml" ]; then
  maestro test "$APP/.maestro/flows/boot.yaml" 1>"$VIS/maestro-boot.out" 2>&1 || true
  find "$APP" -type f -name "boot.png" -maxdepth 6 -print -quit | xargs -I{} cp "{}" "$VIS/boot.png" 2>/dev/null || true
else
  mkdir -p "$VIS"
  xcrun simctl io booted screenshot "$VIS/boot.png" || true
fi

# Always capture simulator logs to a canonical path and HARD FAIL on critical patterns
bash "$APP/scripts/cli/scan-simulator-errors.sh" 1>"$VAL/simulator-errors.log" 2>&1 || true
if grep -Eiq "(must be used within a|Invariant Violation|TypeError|undefined is not an object|Cannot read property|Component .* has not been registered)" "$VAL/simulator-errors.log"; then
  echo "❌ Critical runtime pattern detected in simulator logs"
  exit 61
fi
echo "✅ Visual + log gates completed"


