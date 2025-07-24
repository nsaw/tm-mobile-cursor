#!/bin/{ { { { bash
# MAIN patch/ghost heartbeat loop & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

LOG="/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/_heartbeat/.last-md-write.log"
echo "$(date -u) — MAIN ghost-cron-loop active" > "$LOG"

{ { { { ps -ef | grep -v grep | grep ghost.ts >/dev/null && echo "✅ Ghost running" || echo "❌ Ghost not found" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { ps -ef | grep -v grep | grep patch-runner.ts >/dev/null && echo "✅ Patch Runner active" || echo "❌ Patch Runner not found" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown