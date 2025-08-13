#!/usr/bin/env bash
set -euo pipefail
PATCH_FILE="$1"; WEBHOOK="https://webhook-thoughtmarks.thoughtmarks.app/webhook"
if [[ -z "${PATCH_FILE:-}" || ! -f "$PATCH_FILE" ]]; then echo "[ghost-dispatch] invalid patch file: $PATCH_FILE" >&2; exit 2; fi
if ! command -v jq >/dev/null 2>&1; then echo "[ghost-dispatch] jq not found" >&2; exit 3; fi
PAYLOAD=$(jq -n --arg tf "$PATCH_FILE" --slurpfile p "$PATCH_FILE" '{type:"command_patch", target_file:$tf, patch:$p[0]}')
exec timeout 10s curl -fsSL -H 'content-type: application/json' -d "$PAYLOAD" "$WEBHOOK"
