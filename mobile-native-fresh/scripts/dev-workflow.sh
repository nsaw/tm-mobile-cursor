#!/usr/bin/env bash
set -euo pipefail
# dev-workflow.sh — one-liner to launch full MAIN stack
bash scripts/start-MAIN.sh &
MAIN_PID=$!
trap 'echo "Stopping MAIN stack…"; kill $MAIN_PID' INT TERM
wait $MAIN_PID 