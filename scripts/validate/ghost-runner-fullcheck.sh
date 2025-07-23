#!/bin/bash
logfile='/Users/sawyer/gitSync/tm-mobile-cursor/.ghost-runner-fullcheck.log'
echo "[CHECK] Starting full pipeline health check..." > "$logfile"

# Flask + tunnels
(timeout 5s curl -sSf http://localhost:4000/health || echo '❌ Flask down' >> "$logfile") &
(timeout 5s curl -sSf https://thoughtmarks.internal:4000/health || echo '❌ Tunnel dead' >> "$logfile") &

# Daemons
(pgrep -f ghost-md-watcher.sh || echo '❌ ghost-md-watcher missing' >> "$logfile") &
(pgrep -f ghost-heartbeat.sh || echo '❌ ghost-heartbeat missing' >> "$logfile") &
(pgrep -f conductor.js || echo '❌ conductor not running' >> "$logfile") &

# Metro/Expo
(pgrep -f 'node.*metro' || echo '❌ Metro not running' >> "$logfile") &
(pgrep -f 'expo' || echo '❌ Expo not detected' >> "$logfile") &

# Patch validation
(test -f ./summaries/.last-md-write.log || echo '❌ Missing .last-md-write.log' >> "$logfile") &

wait
echo "[CHECK] Completed." >> "$logfile" 