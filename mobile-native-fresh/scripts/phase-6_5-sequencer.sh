#!/usr/bin/env bash
# Phase 6.5 Execution-Order Reconciler + Runner (HOTPATCH v2)
# - Reads canonical order from P6.5-execution.md (preferred)
# - Falls back to listing JSONs in phase dir
# - Moves PASSed patches to .completed/ using summary proofs
# - Dispatches missing canonical patches via Ghost webhook (fallback: local queue)
# - Emits a concise status ledger
set -euo pipefail
PATCH_ROOT="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5"
CANON_DOC="$PATCH_ROOT/P6.5-execution.md"
COMPLETED_DIR="$PATCH_ROOT/.completed"
QUEUE_DIR="$PATCH_ROOT/_queue"
SUMMARY_DIR="/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries"
WEBHOOK="https://webhook-thoughtmarks.thoughtmarks.app/webhook"
mkdir -p "$COMPLETED_DIR" "$QUEUE_DIR"

log(){ echo "[sequencer] $*"; }
report_line(){ printf "%-85s %s\n" "$1" "$2"; }

# --- Extract canonical order from doc (code-fenced or inline references) ---
read_canon(){
  if [[ -f "$CANON_DOC" ]]; then
    grep -Eo 'patch-v[0-9.]+\([^)]+\)_[^`"[:space:]]+\.json' "$CANON_DOC" | sed 's/`//g' | awk '!seen[$0]++'
  fi
}

# --- Fallback: list JSONs in dir (natural order) ---
list_phase(){
  find "$PATCH_ROOT" -maxdepth 1 -type f -name 'patch-v*.json' -printf '%f\n' | sort -V
}

# --- Determine PASS from summary proof files ---
pass_from_summary(){
  local base="$1"; local sumA="$SUMMARY_DIR/${base%.json}.summary.md"; local sumB="$SUMMARY_DIR/${base%.json}.md"
  for s in "$sumA" "$sumB"; do
    if [[ -f "$s" ]]; then
      if grep -Eqi '(PATCH[[:space:]-_A-Z0-9]*PASS|Status:[[:space:]]*✅? *PASS|PATCH COMPLETION STATUS.+PASS|^✅[[:space:]]*PATCH)' "$s"; then
        echo "$s"; return 0; fi
    fi
  done
  return 1
}

# --- Dispatch to Ghost webhook (your definition of "dispatch") ---
run_via_webhook(){
  local file="$1"; local path="$PATCH_ROOT/$file"
  [[ -f "$path" ]] || { log "MISSING: $path"; return 2; }
  if ! command -v jq >/dev/null 2>&1; then return 1; fi
  local payload; payload=$(jq -n --arg tf "$path" --argjson p "$(cat "$path")" '{type:"command_patch", target_file: $tf, patch: $p}')
  timeout 10s curl -fsSL -H 'content-type: application/json' -d "$payload" "$WEBHOOK" >/dev/null && return 0 || return 1
}

queue_local(){ cp -f "$PATCH_ROOT/$1" "$QUEUE_DIR/"; log "QUEUED_LOCAL: $1"; }

main(){
  log "reading canonical order…"
  # macOS compatible array reading
  PATCHES=()
  while IFS= read -r line; do
    PATCHES+=("$line")
  done < <(read_canon)
  
  if [[ ${#PATCHES[@]} -eq 0 ]]; then
    log "canonical doc not parsed; falling back to directory listing";
    PATCHES=()
    while IFS= read -r line; do
      PATCHES+=("$line")
    done < <(list_phase)
  fi
  
  echo "=== PHASE 6.5 — RECONCILE & RUN (HOTPATCH v2) ==="; echo
  for f in "${PATCHES[@]}"; do
    local_path="$PATCH_ROOT/$f"
    # Skip non-files (in case doc mentions things not present)
    if [[ ! -f "$local_path" && ! -f "$COMPLETED_DIR/$f" ]]; then
      report_line "$f" "MISSING_FILE"; continue
    fi
    # Already completed?
    if [[ -f "$COMPLETED_DIR/$f" ]]; then
      report_line "$f" "ALREADY_COMPLETED"; continue
    fi
    # Summary proves PASS → move into .completed
    if s=$(pass_from_summary "$f"); then
      mkdir -p "$(dirname "$COMPLETED_DIR/$f")" 2>/dev/null || true
      mv -f "$local_path" "$COMPLETED_DIR/$f"
      report_line "$f" "MOVED_TO_COMPLETED (proof: $(basename "$s"))"
      continue
    fi
    # No proof yet → dispatch now; on failure, queue locally
    if run_via_webhook "$f"; then
      report_line "$f" "DISPATCHED_TO_GHOST"
    else
      queue_local "$f"; report_line "$f" "WEBHOOK_FAIL → QUEUED_LOCAL"
    fi
  done
  echo; echo "=== DONE — audit complete. See statuses above. ==="
}

main "$@"
