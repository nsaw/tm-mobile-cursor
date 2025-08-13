#!/usr/bin/env bash
set -euo pipefail
UNIFIED="/Users/sawyer/gitSync/.cursor-cache/MAIN/validation"
# ensure unified dirs (shared with maestro, detox)
mkdir -p "$UNIFIED/__tests__" "$UNIFIED/__mocks__" "$UNIFIED/maestro" "$UNIFIED/detox"
# sync any project-local tests/mocks into unified
if [[ -d ./__tests__ ]]; then rsync -a ./__tests__/ "$UNIFIED/__tests__/" && rm -rf ./__tests__; fi
if [[ -d ./__mocks__ ]]; then rsync -a ./__mocks__/ "$UNIFIED/__mocks__/" && rm -rf ./__mocks__; fi
if [[ -d ./validation/__tests__ ]]; then rsync -a ./validation/__tests__/ "$UNIFIED/__tests__/"; fi
if [[ -d ./validation/__mocks__ ]]; then rsync -a ./validation/__mocks__/ "$UNIFIED/__mocks__/"; fi
# replace ./validation with a symlink to unified
rm -rf ./validation 2>/dev/null || true
ln -sfn "$UNIFIED" ./validation
printf "[ensure-unified-validation] unified at %s -> ./validation symlinked\n" "$UNIFIED"
