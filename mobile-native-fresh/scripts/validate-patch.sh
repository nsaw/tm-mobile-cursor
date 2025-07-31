#!/usr/bin/env bash
set -euo pipefail
# ----------------------------------------
# validate-patch.sh  —  lightweight wrapper
# Usage: ./scripts/validate-patch.sh <patch-name>
PATCH_NAME="${1:-unnamed}"
LOG="logs/validate-patch-${PATCH_NAME}-$(date +%s).log"
{
  echo "[INFO] Validating patch: $PATCH_NAME"
  bash scripts/validate-runtime-alternative.sh || { echo '[FAIL] Runtime validation failed'; exit 1; }
  echo '[PASS] Runtime validation complete.'
} | tee "$LOG" 