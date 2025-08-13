#!/usr/bin/env bash
set -euo pipefail
APP_DIR="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
cd "$APP_DIR"
LOG_DIR="$APP_DIR/validations/logs"
STATUS_DIR="$APP_DIR/validations/status"
mkdir -p "$LOG_DIR" "$STATUS_DIR"

NB="node scripts/nb.cjs"

DRY=0
for arg in "$@"; do
  [[ "$arg" == "--dry-run" ]] && DRY=1
done

run_fix () {
  local label="$1"; shift
  local ttl="$1"; shift
  local cmd=("$@")
  if (( DRY )); then
    echo "[DRY] ${cmd[*]}"
    return 0
  fi
  $NB --ttl "$ttl" \
     --label "$label" \
     --log "$LOG_DIR/$label.log" \
     --status "$STATUS_DIR" \
     -- bash -lc "${cmd[*]}"
}

exists () { [[ -f "$1" ]]; };

PARSER_FIX="scripts/fix-parsing-errors.sh"
TS_FIX="scripts/fix-typescript-errors.sh"
ESL_FIX_SH="scripts/fix-eslint-errors.sh"
ESL_FIX="scripts/fix-eslint-errors"

if   exists "$ESL_FIX_SH"; then ESL_PATH="$ESL_FIX_SH"
elif exists "$ESL_FIX";   then ESL_PATH="$ESL_FIX"
else ESL_PATH=""; fi

[[ -f "$PARSER_FIX" ]] && chmod 755 "$PARSER_FIX" || true
[[ -f "$TS_FIX"     ]] && chmod 755 "$TS_FIX"     || true
[[ -n "$ESL_PATH"   ]] && chmod 755 "$ESL_PATH"   || true

[[ -f "$PARSER_FIX" ]] && run_fix fix-parsing 120s bash "$PARSER_FIX" || true
[[ -f "$TS_FIX"     ]] && run_fix fix-ts       240s bash "$TS_FIX"     || true
[[ -n "$ESL_PATH"   ]] && run_fix fix-eslint   300s bash "$ESL_PATH"   || true

echo "ULTRA-fix complete."
exit 0


