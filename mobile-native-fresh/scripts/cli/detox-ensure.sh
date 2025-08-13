#!/usr/bin/env bash
set -euo pipefail
if command -v npx >/dev/null 2>&1; then
  npx detox --version >/dev/null 2>&1 || npm i -D detox @types/jest jest jest-circus >/dev/null 2>&1 || true
fi
exit 0


