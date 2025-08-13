#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
mkdir -p validations/logs validations/status validations/verify
nohup node scripts/nb.cjs \
  --ttl 45s \
  --label verify-nondestructive \
  --log validations/logs/verify-nondestructive.log \
  --status validations/status \
  -- node scripts/verify-nondestructive.cjs \
  >/dev/null 2>&1 &
echo "verify-nondestructive dispatched (NB-runner, background)."
