#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
N="${1:-10}"
mkdir -p validations/logs validations/status
nohup node scripts/nb.cjs \
  --ttl 10s \
  --label print-diffs \
  --log validations/logs/print-diffs.log \
  --status validations/status \
  -- bash -lc "scripts/admin/print-sample-diffs.zsh $N" \
  >/dev/null 2>&1 &
echo "print-diffs dispatched (NB-runner, background) for top $N files."
