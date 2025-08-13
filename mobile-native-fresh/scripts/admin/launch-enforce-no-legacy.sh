#!/usr/bin/env bash
set -euo pipefail
cd /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh
mkdir -p validations/logs validations/status
nohup node scripts/nb.cjs \
  --ttl 30s \
  --label enforce-no-legacy \
  --log validations/logs/enforce-no-legacy.log \
  --status validations/status \
  -- node scripts/admin/enforce-no-legacy.cjs \
  >/dev/null 2>&1 &
