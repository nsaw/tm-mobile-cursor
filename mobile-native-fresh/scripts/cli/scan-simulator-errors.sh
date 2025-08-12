#!/usr/bin/env bash
set -euo pipefail
OUT="${1:-/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/simulator-errors.log}"
DURATION="${DURATION:-30}"

mkdir -p "$(dirname "$OUT")"

(
  timeout "${DURATION}s" xcrun simctl spawn booted log stream \
    --style compact \
    --predicate 'eventType = logEvent AND (composedMessage CONTAINS[c] "Error" OR composedMessage CONTAINS[c] "must be used within a" OR composedMessage CONTAINS[c] "TypeError" OR composedMessage CONTAINS[c] "undefined is not an object" OR composedMessage CONTAINS[c] "Invariant Violation" OR composedMessage CONTAINS[c] "Component has not been registered" OR composedMessage CONTAINS[c] "Cannot read property")' \
    > "$OUT" 2>&1 &
  PID=$!
  sleep "${DURATION}"
  kill "$PID" 2>/dev/null || true
) || true

# Fail if any error patterns were captured
if [ -s "$OUT" ]; then
  echo "Runtime errors detected in simulator logs. See: $OUT" >&2
  exit 1
fi
exit 0
