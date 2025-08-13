#!/usr/bin/env bash
# Emit a concise ledger for Phase 6.5 after queue drain
set -euo pipefail
PHASE_ROOT="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5"
COMPLETED_DIR="$PHASE_ROOT/.completed"
QUEUE_DIR="$PHASE_ROOT/_queue"

completed=$(find "$COMPLETED_DIR" -type f -name 'patch-v*.json' 2>/dev/null | wc -l | awk '{print $1}')
queued=$(find "$QUEUE_DIR" -type f -name 'patch-v*.json' 2>/dev/null | wc -l | awk '{print $1}')

echo "[p6.5-ledger] COMPLETED_COUNT=$completed QUEUED_COUNT=$queued"

if (( queued > 0 )); then
  echo "[p6.5-ledger] QUEUED:"
  (cd "$QUEUE_DIR" && ls -1 | LC_ALL=C sort)
fi
