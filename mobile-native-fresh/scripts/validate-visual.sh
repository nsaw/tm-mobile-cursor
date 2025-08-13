#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
VAL="/Users/sawyer/gitSync/.cursor-cache/MAIN/validation"
. "$ROOT/scripts/lib-nonblocking.sh"
FLOWS=()
[ -f "$VAL/maestro/flows/baseline.yaml" ] && FLOWS+=("$VAL/maestro/flows/baseline.yaml")
[ -f "$VAL/maestro/flows/visual-regression.yaml" ] && FLOWS+=("$VAL/maestro/flows/visual-regression.yaml")
[ ${#FLOWS[@]} -eq 0 ] && [ -f "$ROOT/maestro/flows/baseline.yaml" ] && FLOWS+=("$ROOT/maestro/flows/baseline.yaml")
[ ${#FLOWS[@]} -eq 1 ] && [ -f "$ROOT/maestro/flows/visual-regression.yaml" ] && FLOWS+=("$ROOT/maestro/flows/visual-regression.yaml")
if ! command -v maestro >/dev/null 2>&1; then echo "[validate-visual] Maestro not installed; skipping"; exit 0; fi
for f in "${FLOWS[@]}"; do
  nb_run 80s "maestro-$(basename "$f" .yaml)" "maestro test \"$f\""
done
echo "[validate-visual] PASS"
