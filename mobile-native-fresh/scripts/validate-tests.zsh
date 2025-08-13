#!/bin/zsh
set -euo pipefail
ROOT="${1:-/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh}"
cd "$ROOT"
mkdir -p validations/logs validations/status
# JEST
if command -v npx >/dev/null 2>&1 && (npx --yes jest --version >/dev/null 2>&1 || grep -qi 'jest' package.json 2>/dev/null); then
  node scripts/run-bounded.js --cwd "$ROOT" --ttl 25m --label jest --log validations/logs/jest.log --status validations/status -- -- npx --yes jest --runInBand --colors
fi
# DETOX
if (npx --yes detox --version >/dev/null 2>&1 || grep -qi 'detox' package.json 2>/dev/null); then
  node scripts/run-bounded.js --cwd "$ROOT" --ttl 40m --label detox --log validations/logs/detox.log --status validations/status -- -- npx --yes detox test -c ios.sim.debug --headless
fi
# MAESTRO
if command -v maestro >/dev/null 2>&1; then
  if [ -d .maestro ] || [ -f maestro.yaml ] || [ -f flow.yaml ]; then
    node scripts/run-bounded.js --cwd "$ROOT" --ttl 25m --label maestro --log validations/logs/maestro.log --status validations/status -- -- maestro test .maestro || maestro test maestro.yaml || maestro test flow.yaml
  fi
fi
