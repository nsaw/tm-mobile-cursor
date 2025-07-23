#!/bin/bash
# MAIN patch/ghost heartbeat loop

LOG="/Users/sawyer/gitSync/tm-mobile-cursor/summaries/_heartbeat/.last-md-write.log"
echo "$(date -u) — MAIN ghost-cron-loop active" > "$LOG"

ps -ef | grep -v grep | grep ghost.ts >/dev/null && echo "✅ Ghost running" || echo "❌ Ghost not found"
ps -ef | grep -v grep | grep patch-runner.ts >/dev/null && echo "✅ Patch Runner active" || echo "❌ Patch Runner not found" 