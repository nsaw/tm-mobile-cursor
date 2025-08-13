#!/usr/bin/env bash
set -euo pipefail
if command -v maestro >/dev/null 2>&1; then
  if [[ -d maestro/flows ]]; then
    echo "[check-maestro] Running flows via Maestro..."
    timeout 30s maestro test maestro/flows
  else
    echo "[check-maestro] No maestro/flows directory; skipping"
  fi
else
  echo "[check-maestro] Maestro not installed; skipping"
fi
