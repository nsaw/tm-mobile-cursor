#!/usr/bin/env bash
# Drain phase-6.5/_queue locally (macOS portable: no mapfile, no sort -V)
set -euo pipefail
PHASE_ROOT="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5"
QUEUE_DIR="$PHASE_ROOT/_queue"
COMPLETED_DIR="$PHASE_ROOT/.completed"
SUMMARY_DIR="/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries"
mkdir -p "$QUEUE_DIR" "$COMPLETED_DIR"

status(){ printf "%-90s %s\n" "$1" "$2"; }

# Build an ordered list using portable tools
PATCH_LIST=$(ls -1 "$QUEUE_DIR"/patch-v*.json 2>/dev/null | LC_ALL=C sort || true)
if [[ -z "${PATCH_LIST:-}" ]]; then echo "[run-queue] nothing queued"; exit 0; fi

while IFS= read -r PATCH; do
  base="$(basename "$PATCH")"; status "$base" "EXECUTING_LOCAL"
  if scripts/exec-patch-local.sh "$PATCH"; then
    status "$base" "PASS → MOVED_TO_COMPLETED"
  else
    status "$base" "FAIL → LEFT_IN_QUEUE"; fi
done <<< "$PATCH_LIST"

echo "[run-queue] done"
