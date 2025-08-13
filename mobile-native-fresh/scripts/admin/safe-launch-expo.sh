#!/usr/bin/env bash
set -euo pipefail
set +H
cd /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh
mkdir -p validations/logs validations/status
PID="$(lsof -ti:8081 || true)"; [[ -n "${PID:-}" ]] && kill "$PID" 2>/dev/null || true
LOG="validations/logs/expo-launch.log"; : > "$LOG"
( nohup npx expo start --ios --clear >>"$LOG" 2>&1 & echo $! > validations/status/expo.pid ) >/dev/null 2>&1 || true
sleep 1; exit 0
