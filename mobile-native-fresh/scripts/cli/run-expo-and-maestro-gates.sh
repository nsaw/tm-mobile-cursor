#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
VAL="/Users/sawyer/gitSync/.cursor-cache/MAIN/validation"
mkdir -p "$VAL"
bash "$ROOT/scripts/cli/dev-firebase-bypass.sh"
bash "$ROOT/scripts/cli/inject-root-testid.sh" || true
bash "$ROOT/scripts/cli/expo-refresh-nonblocking.sh"
bash "$ROOT/scripts/cli/validate-expo-status.sh"
bash "$ROOT/scripts/cli/maestro-run-boot.sh"
bash "$ROOT/scripts/cli/scan-simulator-errors.sh"
