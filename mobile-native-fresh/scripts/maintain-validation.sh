#!/usr/bin/env bash
set -euo pipefail
# maintain-validation.sh — cron-friendly maintenance sweeps
LOG_DIR="logs/maintenance"
mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/maintain-$(date +%Y%m%dT%H%M%S).log"
{
  echo "[$(date -u)] Starting maintenance sweep…"
  # 1. Prune old logs ( >30d )
  find logs -type f -mtime +30 -delete
  # 2. Touch heartbeat
  echo "$(date -u) — maintenance OK" > .cursor-cache/MAIN/summaries/_heartbeat/maintenance.txt
  echo "[$(date -u)] Sweep done."
} | tee "$LOG" 