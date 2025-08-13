#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
OUT="/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/maestro/boot"
mkdir -p "$OUT"
bash "$ROOT/scripts/cli/maestro-ensure.sh"
# Resolve APP ID from app.json (ios.bundleIdentifier preferred, fallback to expo.android.package)
APP_ID="$(node -e 'const fs=require("fs"); const j=JSON.parse(fs.readFileSync("app.json","utf8")); const e=j.expo||j; const bid=(e.ios && e.ios.bundleIdentifier)|| (e.android && e.android.package)||""; if(!bid){process.exit(2);} console.log(bid);' || echo "")"
if [ -z "$APP_ID" ] && [ -n "${MAESTRO_APP_ID:-}" ]; then APP_ID="$MAESTRO_APP_ID"; fi
if [ -z "$APP_ID" ]; then echo "Unable to resolve appId for Maestro." >&2; exit 3; fi
export MAESTRO_APP_ID="$APP_ID"
maestro test "$ROOT/.maestro/flows/boot.yaml" --format junit --output "$OUT"
