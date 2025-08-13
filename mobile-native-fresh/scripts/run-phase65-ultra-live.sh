#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
Q="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/_queue"
COMPLETED="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/.completed"
FAILED="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/.failed"
ARTS="/Users/sawyer/gitSync/.cursor-cache/MAIN/artifacts/phase65-ultra-live-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$ARTS" "$COMPLETED" "$FAILED"
. "$ROOT/scripts/_orchestrate-common.sh"

echo "[ultra-live] JSON normalize queued patches..."
nb_ok 60s json-normalize "cd \"$ROOT\" && scripts/normalize-queued-patches.sh" || { echo "[ultra-live] normalize failed"; exit 3; }

echo "[ultra-live] STRICT re-validate known failing sets..."
nb_ok 300s strict-sets "cd \"$ROOT\" && scripts/strict-revalidate-sets.sh" || true

echo "[ultra-live] STRICT run explicit P6.5 queue (13,14,17,18,19,20,28,29,30)..."
declare -a P65_QUEUE=(
  "patch-v1.4.656(P6.5.13)_migrate-onboarding-modal.json"
  "patch-v1.4.656(P6.5.14)_migrate-voice-recorder-provider.json"
  "patch-v1.4.658(P6.5.17)_migrate-premium-enrollment.json"
  "patch-v1.4.658(P6.5.18)_migrate-complete-settings-subpages.json"
  "patch-v1.4.659(P6.5.19)_final-complete-validation.json"
  "patch-v1.4.659(P6.5.20)_migrate-complex-ai-integration.json"
  "patch-v1.4.6513(P6.5.28)_migrate-backend-api-integration.json"
  "patch-v1.4.6514(P6.5.29)_migrate-security-features.json"
  "patch-v1.4.6514(P6.5.30)_final-complete-system-validation.json"
)

touch "$ARTS/RESULTS.QUEUE.txt"
for base in "${P65_QUEUE[@]}"; do
  src=""
  if   [ -f "$Q/$base" ]; then src="$Q/$base";
  elif [ -f "/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/$base" ]; then src="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/$base";
  else echo "[ultra-live] missing $base"; echo "$base :: MISSING" >> "$ARTS/RESULTS.QUEUE.txt"; continue; fi

  echo "[ultra-live] STRICT RUN $base"
  set +e
  ( cd "$ROOT" && scripts/exec-patch-strict.sh "$src" )
  rc=$?
  set -e
  if [ $rc -eq 0 ]; then
    mv "$src" "$COMPLETED/" 2>/dev/null || true
    echo "$base :: PASS" >> "$ARTS/RESULTS.QUEUE.txt"
  else
    mkdir -p "$FAILED" && cp "$src" "$FAILED/" 2>/dev/null || true
    echo "$base :: FAIL($rc)" >> "$ARTS/RESULTS.QUEUE.txt"
  fi
done

echo "[ultra-live] Boot and validate with full Ultra (bounded)..."
nb_ok 1200s ultra-full "cd \"$ROOT\" && ./scripts/ultra-runtime-validation.sh || true"

# Collect logs/status artifacts last
mkdir -p "$ARTS/logs" "$ARTS/status"
cp -a "$ROOT/validations/logs/."   "$ARTS/logs/"   2>/dev/null || true
cp -a "$ROOT/validations/status/." "$ARTS/status/" 2>/dev/null || true

# Build final summary
{
  echo "# Phase 6.5 Ultra-Live Strict Orchestration"
  echo "Artifacts: $ARTS"
  echo
  echo "## Queue Results"
  cat "$ARTS/RESULTS.QUEUE.txt" || true
  echo
  echo "## Strict Sets Snapshot (tail)"
  [ -f "/Users/sawyer/gitSync/.cursor-cache/MAIN/artifacts"/revalidation-*/RESULTS.txt ] && tail -n 200 "/Users/sawyer/gitSync/.cursor-cache/MAIN/artifacts"/revalidation-*/RESULTS.txt || echo "No strict-sets RESULTS found"
} > "$ARTS/SUMMARY.md"

echo "[ultra-live] COMPLETE – see $ARTS/SUMMARY.md"
