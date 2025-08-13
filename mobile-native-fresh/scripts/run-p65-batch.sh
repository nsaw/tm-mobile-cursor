#!/usr/bin/env bash
set -euo pipefail
PATCH_ROOT="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5"
SUMMARY_DIR="/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries"
COMPLETED_DIR="$PATCH_ROOT/.completed"
QUEUE_DIR="$PATCH_ROOT/_queue"
mkdir -p "$COMPLETED_DIR" "$QUEUE_DIR"

PATCHES=(
  "patch-v1.4.656(P6.5.13)_migrate-onboarding-modal.json"
  "patch-v1.4.656(P6.5.14)_migrate-voice-recorder-provider.json"
  "patch-v1.4.657(P6.5.15)_update-navigation-structure.json"
  "patch-v1.4.658(P6.5.17)_migrate-premium-enrollment.json"
  "patch-v1.4.658(P6.5.18)_migrate-complete-settings-subpages.json"
  "patch-v1.4.659(P6.5.19)_final-complete-validation.json"
  "patch-v1.4.659(P6.5.20)_migrate-complex-ai-integration.json"
  "patch-v1.4.6513(P6.5.28)_migrate-backend-api-integration.json"
  "patch-v1.4.6514(P6.5.29)_migrate-security-features.json"
  "patch-v1.4.6514(P6.5.30)_final-complete-system-validation.json"
)

pass_from_summary(){
  local base="$1"; local a="$SUMMARY_DIR/${base%.json}.summary.md"; local b="$SUMMARY_DIR/${base%.json}.md"
  for s in "$a" "$b"; do
    if [[ -f "$s" ]] && grep -Eqi '(PATCH[[:space:]-_A-Z0-9]*PASS|Status:[[:space:]]*✅? *PASS|PATCH COMPLETION STATUS.+PASS|^✅[[:space:]]*PATCH)' "$s"; then
      echo "$s"; return 0; fi
  done
  return 1
}

wait_for_pass(){
  local base="$1"; local limit=${2:-90}; local step=3; local t=0
  while (( t < limit )); do
    if pass_from_summary "$base" >/dev/null; then return 0; fi
    sleep $step; t=$((t+step))
  done
  return 1
}

status(){ printf "%-88s %s\n" "$1" "$2"; }

for f in "${PATCHES[@]}"; do
  SRC="$PATCH_ROOT/$f"; DST="$COMPLETED_DIR/$f"
  # Already completed → report
  if [[ -f "$DST" ]]; then status "$f" "ALREADY_COMPLETED"; continue; fi
  # If PASS proof exists → move to completed
  if s=$(pass_from_summary "$f"); then
    mkdir -p "$(dirname "$DST")"; mv -f "$SRC" "$DST" 2>/dev/null || true
    status "$f" "MOVED_TO_COMPLETED (proof: $(basename "$s"))"; continue
  fi
  # If patch file missing → report
  if [[ ! -f "$SRC" ]]; then status "$f" "MISSING_FILE"; continue; fi
  # Attempt Ghost dispatch (3 tries)
  ok=0; for i in 1 2 3; do
    if scripts/ghost-dispatch.sh "$SRC" >/dev/null 2>&1; then ok=1; break; fi
    sleep 5
  done
  if [[ "$ok" -eq 1 ]]; then
    status "$f" "DISPATCHED_TO_GHOST (awaiting PASS)";
    if wait_for_pass "$f" 90; then
      s=$(pass_from_summary "$f"); mkdir -p "$(dirname "$DST")"; mv -f "$SRC" "$DST" 2>/dev/null || true
      status "$f" "COMPLETED (proof: $(basename "$s"))"
    else
      status "$f" "DISPATCHED_NO_PROOF_YET (will retry next run)"
    fi
  else
    # Webhook down → queue locally
    cp -f "$SRC" "$QUEUE_DIR/"; status "$f" "WEBHOOK_FAIL → QUEUED_LOCAL"
  fi
done
