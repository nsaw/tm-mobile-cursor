#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
Q="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/_queue"
COMPLETED="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/.completed"
FAILED="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/.failed"
ARTS="/Users/sawyer/gitSync/.cursor-cache/MAIN/artifacts/revalidation-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$COMPLETED" "$FAILED" "$ARTS"

json_error_set=(
  "patch-v1.4.658(P6.5.18)_migrate-complete-settings-subpages.json"
  "patch-v1.4.659(P6.5.20)_migrate-complex-ai-integration.json"
  "patch-v1.4.6514(P6.5.30)_final-complete-system-validation.json"
  "patch-v1.4.6516(P6.5.33)_migrate-dashboard-organization.json"
  "patch-v1.4.6516(P6.5.34)_migrate-advanced-filtering.json"
  "patch-v1.4.6517(P6.5.35)_migrate-ai-powered-organization.json"
  "patch-v1.4.6517(P6.5.36)_migrate-organization-analytics.json"
  "patch-v1.4.6518(P6.5.37)_migrate-cross-reference-system.json"
)

runtime_failure_set=(
  "patch-v1.6.542(P6.5.43)_ai-tools-system-migration.json"
  "patch-v1.6.543(P6.5.44)_authentication-system-migration.json"
  "patch-v1.6.545(P6.5.45)_dashboard-system-migration.json"
  "patch-v1.6.546(P6.5.47)_settings-system-migration.json"
  "patch-v1.6.545(P6.5.46)_search-system-migration.json"
  "patch-v1.6.547(P6.5.48)_thoughtmark-system-migration.json"
  "patch-v1.6.549(P6.5.50)_api-service-layer-migration.json"
  "patch-v1.6.548(P6.5.49)_voice-recording-system-migration.json"
  "patch-v1.6.551(P6.5.52)_organization-system-migration.json"
)

run_one() {
  local base="$1"; local f
  if [ -f "$Q/$base" ]; then f="$Q/$base"; elif [ -f "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/$base" ]; then f="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/$base"; else echo "[strict] missing $base"; return 2; fi
  echo "[strict] RUN $base"
  set +e
  scripts/exec-patch-strict.sh "$f"
  rc=$?
  set -e
  if [ $rc -eq 0 ]; then
    mv "$f" "$COMPLETED/" 2>/dev/null || true
    echo "$base :: PASS" >> "$ARTS/RESULTS.txt"
  else
    mkdir -p "$FAILED" 2>/dev/null || true
    cp "$f" "$FAILED/" 2>/dev/null || true
    echo "$base :: FAIL($rc)" >> "$ARTS/RESULTS.txt"
  fi
}

echo "[strict] Normalizing queued patches..."
scripts/normalize-queued-patches.sh

echo "[strict] JSON error set:"
for p in "${json_error_set[@]}"; do run_one "$p"; done

echo "[strict] Runtime failure set:"
for p in "${runtime_failure_set[@]}"; do run_one "$p"; done

echo "[strict] Done. Results at $ARTS/RESULTS.txt"
