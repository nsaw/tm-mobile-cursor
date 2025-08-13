#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
mkdir -p validations/logs validations/status
REPORT="${1:-validations/verify/verify-nondestructive.json}"
nohup node scripts/nb.cjs \
  --ttl 120s \
  --label rollback-from-report \
  --log validations/logs/rollback-from-report.log \
  --status validations/status \
  -- node scripts/rollback-from-report.cjs --from "$REPORT" \
  >/dev/null 2>&1 &
echo "rollback-from-report dispatched (NB-runner, background) with report: $REPORT"
