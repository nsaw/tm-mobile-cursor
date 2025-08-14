#!/usr/bin/env bash
set -euo pipefail
if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <label> <ttl> <command...>" >&2
  exit 2
fi
LABEL="$1"; TTL="$2"; shift 2
# Run through NB runner (non-blocking semantics via TTL + logging)
exec node scripts/nb.cjs --ttl "${TTL}" --label "${LABEL}" --log "validations/logs/${LABEL}.log" --status validations/status -- bash -lc "$*"


