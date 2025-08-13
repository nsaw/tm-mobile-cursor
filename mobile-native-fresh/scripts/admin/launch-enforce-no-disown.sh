#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
mkdir -p validations/logs validations/status
nohup node scripts/nb.cjs \
  --ttl 25s \
  --label enforce-no-disown \
  --log validations/logs/enforce-no-disown.log \
  --status validations/status \
  -- bash -lc 'scripts/admin/enforce-no-disown.sh' \
  >/dev/null 2>&1 &
echo "enforce-no-disown dispatched (NB-runner, background)."
