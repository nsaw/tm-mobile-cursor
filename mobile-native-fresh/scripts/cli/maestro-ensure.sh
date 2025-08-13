#!/usr/bin/env bash
set -euo pipefail
if command -v maestro >/dev/null 2>&1; then
  exit 0
fi
if command -v brew >/dev/null 2>&1; then
  brew install maestro || true
  command -v maestro >/dev/null 2>&1 && exit 0
fi
# Fallback installer (official curl) — headless
/usr/bin/env bash -c "$(curl -Ls https://get.maestro.mobile.dev)" || true
if ! command -v maestro >/dev/null 2>&1; then
  echo "Maestro not installed" >&2
  exit 1
fi
