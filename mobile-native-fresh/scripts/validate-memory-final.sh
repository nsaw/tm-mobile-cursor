#!/bin/bash
set -euo pipefail

# Phase 8: Final memory monitoring (200s stability check)
echo "🧠 [MEMORY] Starting 200s memory validation..."

start_time=$(date +%s)

for (( i=0; i<20; i++ )); do
  echo "[MEMORY] 🔍 Check $i/20..."
  bash scripts/process-monitor.sh >/dev/null 2>&1 || echo "[MEMORY] ⚠️ Process cleanup triggered"
  mem_usage=$(ps aux | grep -i node | grep -v grep | awk '{sum+=$6} END {print sum/1024}')
  echo "[MEMORY] 📊 Current usage: ${mem_usage}MB"
  if (( $(echo "$mem_usage > 2100" | bc -l) )); then
    echo "❌ [MEMORY] CRITICAL: Memory usage exceeded 2.1GB"
    exit 1
  fi
  sleep 10
done

end_time=$(date +%s)
echo "✅ [MEMORY] 200s memory test passed. Duration: $((end_time - start_time))s" 