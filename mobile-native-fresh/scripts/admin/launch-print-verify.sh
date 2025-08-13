#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
mkdir -p validations/logs validations/status
nohup node scripts/nb.cjs \
  --ttl 6s \
  --label print-verify \
  --log validations/logs/print-verify.log \
  --status validations/status \
  -- bash -lc 'scripts/admin/print-verify-head.zsh || true' \
  >/dev/null 2>&1 &
echo "print-verify dispatched (NB-runner, background)."
