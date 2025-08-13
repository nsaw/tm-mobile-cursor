#!/usr/bin/env bash
set -euo pipefail
DURATION=${1:-15}
OUT=${2:-"./logs/simulator.log"}
mkdir -p "$(dirname "$OUT")"
# Prefer iOS sim logs via xcrun; degrade gracefully if unavailable
if command -v xcrun >/dev/null 2>&1; then
  if xcrun simctl list devices | grep -q Booted; then
    echo "[capture-simlogs] capturing ${DURATION}s from booted simulator → $OUT"
    # Capture for bounded duration; avoid background hangs
    timeout "${DURATION}s" xcrun simctl spawn booted log stream --level=debug --style syslog >"$OUT" 2>/dev/null || true
    echo "[capture-simlogs] done"
    exit 0
  else
    echo "[capture-simlogs] no booted simulator; writing empty log to $OUT"
    : >"$OUT"; exit 0
  fi
else
  echo "[capture-simlogs] xcrun not found; writing empty log to $OUT"
  : >"$OUT"; exit 0
fi
