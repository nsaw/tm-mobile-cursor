#!/usr/bin/env bash
set -euo pipefail
EXPO_PORT="${EXPO_PORT:-8081}"
ATTEMPTS="${ATTEMPTS:-20}"
SLEEP_SECS="${SLEEP_SECS:-2}"

i=0
while [ "$i" -lt "$ATTEMPTS" ]; do
  if timeout 5s curl -s "http://localhost:${EXPO_PORT}/status" | grep -q "packager-status:running"; then
    exit 0
  fi
  sleep "${SLEEP_SECS}"
  i=$((i+1))
done
echo "Expo status check failed after ${ATTEMPTS} attempts" >&2
exit 1


