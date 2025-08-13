#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
MATCHES=$(grep -RIn --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=android/build --exclude-dir=ios/build -E "(\{[[:space:]]*g?timeout|g?timeout[[:space:]]+[0-9]+.*&[[:space:]]*(disown)?|tail[[:space:]]+-f)" || true)
if [[ -n "$MATCHES" ]]; then
  echo "Found legacy timeout/disown/tail -f patterns:"
  echo "$MATCHES" | head -n 200
  exit 2
fi
echo "No legacy disown/timeouts found."
