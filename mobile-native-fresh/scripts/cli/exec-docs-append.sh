#!/usr/bin/env bash
set -euo pipefail
PHASE_FILE="$1"; PATCH_NAME="$2"; STATUS="$3"
DATE="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
printf -- "\n- %s • %s • %s\n" "$DATE" "$PATCH_NAME" "$STATUS" >> "$PHASE_FILE"
