#!/bin/zsh
set -euo pipefail
ROOT="${1:-/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh}"
cd "$ROOT"
mkdir -p validations/logs validations/status
if [ -f tsconfig.json ]; then
  node scripts/run-bounded.js --cwd "$ROOT" --ttl 15m --label tsc --log validations/logs/tsc.log --status validations/status -- -- npx --yes tsc --noEmit
fi
if command -v npx >/dev/null 2>&1 && (npx --yes eslint --version >/dev/null 2>&1 || grep -qi 'eslint' package.json 2>/dev/null); then
  node scripts/run-bounded.js --cwd "$ROOT" --ttl 15m --label eslint --log validations/logs/eslint.log --status validations/status -- -- npx --yes eslint . --ext .ts,.tsx
fi
if grep -qi 'test:unit' package.json 2>/dev/null; then
  node scripts/run-bounded.js --cwd "$ROOT" --ttl 30m --label unit --log validations/logs/unit.log --status validations/status -- -- yarn test:unit --watchAll=false
fi
