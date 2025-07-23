#!/bin/bash
PATCH_FILE="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/tasks/patches/patch-v1.4.40(P0.00.99)_ghost-repair-handoff-verifier.json"
SUMMARY_FILE="/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/summary-v1.4.40(P0.00.99)_ghost-repair-handoff-verifier.md"

echo "[GHOST RELAY CHECK] 🛰️ Watching for patch and summary..."

for i in {1..10}; do
  if [[ -f "$PATCH_FILE" && -f "$SUMMARY_FILE" ]]; then
    echo "✅ GHOST relay appears healthy."
    exit 0
  fi
  sleep 3
done

echo "❌ GHOST relay file write failed after timeout."
exit 1
