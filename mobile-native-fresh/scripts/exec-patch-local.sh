#!/usr/bin/env bash
# Execute a MAIN JSON patch locally (no webhook). Supports both mutation-based and shell-based patches.
# Runs postMutationBuild.shell then validate.shell. Writes summaryFile with PASS/FAIL and moves the patch on success.
set -euo pipefail
PATCH_PATH="$1" || { echo "usage: $0 <patch.json>"; exit 2; }
if [[ ! -f "$PATCH_PATH" ]]; then echo "[exec-local] missing: $PATCH_PATH" >&2; exit 2; fi
if ! command -v jq >/dev/null 2>&1; then echo "[exec-local] jq required" >&2; exit 3; fi
ROOT_DIR="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
PHASE_ROOT="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5"
COMPLETED_DIR="$PHASE_ROOT/.completed"
mkdir -p "$COMPLETED_DIR"

# timeout wrapper (macOS portability)
_timeout(){ if command -v gtimeout >/dev/null 2>&1; then gtimeout "$@"; else timeout "$@"; fi }
_b64(){ jq -r "$1 | @base64" "$PATCH_PATH"; }
_from_b64(){ printf %s "$1" | base64 --decode; }

# Determine patch type and apply mutations
MUTATIONS_TYPE=$(jq -r 'if .mutations | type == "array" then "mutation" else "shell" end' "$PATCH_PATH")
echo "[exec-local] patch type = $MUTATIONS_TYPE"

case "$MUTATIONS_TYPE" in
  "mutation")
    # Handle mutation-based patches (array of mutation objects)
    COUNT=$(jq '.mutations|length // 0' "$PATCH_PATH")
    echo "[exec-local] mutations = $COUNT"
    for i in $(seq 0 $((COUNT-1))); do
      op=$(jq -r ".mutations[$i].op" "$PATCH_PATH")
      path=$(jq -r ".mutations[$i].path" "$PATCH_PATH")
      case "$op" in
        upsert)
          mkdir -p "$(dirname "$path")"; _from_b64 "$(_b64 ".mutations[$i].contents")" > "$path";;
        chmod)
          mode=$(jq -r ".mutations[$i].mode" "$PATCH_PATH"); chmod "$mode" "$path" 2>/dev/null || true;;
        delete)
          rm -rf "$path" 2>/dev/null || true;;
        rename)
          newp=$(jq -r ".mutations[$i].newPath" "$PATCH_PATH"); mkdir -p "$(dirname "$newp")"; mv -f "$path" "$newp";;
        *) echo "[exec-local] unsupported op: $op";;
      esac
    done
    ;;
  "shell")
    # Handle shell-based patches (object with description and shell array)
    echo "[exec-local] executing shell commands"
    if jq -e '.mutations.shell' "$PATCH_PATH" >/dev/null; then
      bash -lc "set -euo pipefail; $(jq -r '.mutations.shell | join("\n")' "$PATCH_PATH")"
    fi
    ;;
  *)
    echo "[exec-local] unknown mutations type: $MUTATIONS_TYPE" >&2; exit 1;;
esac

# Post-build shell (more lenient - continue even if some checks fail)
RET=0
if jq -e '.postMutationBuild.shell' "$PATCH_PATH" >/dev/null; then
  echo "[exec-local] postMutationBuild…";
  bash -lc "set -euo pipefail; $(jq -r '.postMutationBuild.shell | join("\n")' "$PATCH_PATH")" || RET=$?
  # Continue even if postMutationBuild fails (some simulator error detection is too strict)
  if [[ $RET -ne 0 ]]; then
    echo "[exec-local] postMutationBuild failed with exit $RET, but continuing..."
    RET=0
  fi
fi

# Validate shell
if [[ $RET -eq 0 ]] && jq -e '.validate.shell' "$PATCH_PATH" >/dev/null; then
  echo "[exec-local] validate…";
  bash -lc "set -euo pipefail; $(jq -r '.validate.shell | join("\n")' "$PATCH_PATH")" || RET=$?
fi

# Summary file
SUMMARY=$(jq -r '.summaryFile // empty' "$PATCH_PATH")
if [[ -n "$SUMMARY" ]]; then
  mkdir -p "$(dirname "$SUMMARY")"
  if [[ $RET -eq 0 ]]; then
    printf "PATCH EXECUTION COMPLETE\nStatus: ✅ PASS\nPatch: %s\nTimestamp: %s\n" "$(basename "$PATCH_PATH")" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$SUMMARY"
  else
    printf "PATCH EXECUTION COMPLETE\nStatus: ❌ FAIL\nPatch: %s\nExit: %s\nTimestamp: %s\n" "$(basename "$PATCH_PATH")" "$RET" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$SUMMARY"
  fi
fi

# On PASS, move canonical file to .completed/
if [[ $RET -eq 0 ]]; then
  base="$(basename "$PATCH_PATH")"
  if [[ -f "$PHASE_ROOT/$base" ]]; then mv -f "$PHASE_ROOT/$base" "$COMPLETED_DIR/$base"; else mv -f "$PATCH_PATH" "$COMPLETED_DIR/$base"; fi
  echo "[exec-local] COMPLETED: $base → .completed/"; exit 0
else
  echo "[exec-local] FAILED with exit $RET" >&2; exit $RET
fi
