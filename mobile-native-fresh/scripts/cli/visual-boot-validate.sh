#!/usr/bin/env bash
set -euo pipefail
APP_ROOT="${1:-$(pwd)}"
OUT_DIR="${2:-${APP_ROOT}/.cache/visual}"
mkdir -p "${OUT_DIR}"

# Prefer Detox if configured
if [ -f "${APP_ROOT}/.detoxrc.cjs" ] || [ -f "${APP_ROOT}/.detoxrc.js" ]; then
  if command -v npx >/dev/null 2>&1; then
    echo "[visual] Using Detox flow"
    npx detox --version >/dev/null 2>&1 || { echo "Detox not installed"; exit 12; }
    ( (command -v timeout >/dev/null 2>&1 && timeout 120s npx detox test --configuration ios.sim.debug --headless) || true ) > "${OUT_DIR}/detox-boot.out" 2>&1 || true
    xcrun simctl io booted screenshot "${OUT_DIR}/boot.png" >/dev/null 2>&1 || true
    exit 0
  fi
fi

# Fallback to Maestro if flows exist
if [ -d "${APP_ROOT}/.maestro" ] || [ -d "${APP_ROOT}/maestro" ]; then
  if command -v maestro >/dev/null 2>&1 || [ -x "$HOME/.maestro/bin/maestro" ]; then
    echo "[visual] Using Maestro flow"
    mkdir -p "${OUT_DIR}/maestro"
    MAESTRO_BIN="$(command -v maestro || echo "$HOME/.maestro/bin/maestro")"
    ( (command -v timeout >/dev/null 2>&1 && timeout 120s "$MAESTRO_BIN" test ".maestro/flows/boot.yaml") || (command -v timeout >/dev/null 2>&1 && timeout 120s "$MAESTRO_BIN" test "maestro/flows/boot.yaml") || true ) > "${OUT_DIR}/maestro/boot.out" 2>&1 || true
    if [ -d "report" ]; then cp -R "report" "${OUT_DIR}/maestro/report" || true; fi
    exit 0
  fi
fi

# Last resort: simulator screenshot
echo "[visual] Fallback to simctl screenshot"
mkdir -p "${OUT_DIR}/fallback"
xcrun simctl io booted screenshot "${OUT_DIR}/fallback/boot.png" >/dev/null 2>&1 || true
exit 0


