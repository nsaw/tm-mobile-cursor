#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
. "$ROOT/scripts/lib-nonblocking.sh"
PATCH="${1:-}"
[[ -f "$PATCH" ]] || { echo "[strict] Patch not found: $PATCH"; exit 2; }

# If queued patch uses object-shaped mutations with .shell[], normalize to a single op shell
tmp="$(mktemp)"
if jq -e '(.mutations|type)=="object" and (.mutations.shell|type)=="array"' "$PATCH" >/dev/null 2>&1; then
  jq ' .mutations = [ { "op":"shell", "run": (.mutations.shell|join("\n")) } ] ' "$PATCH" > "$tmp" && mv "$tmp" "$PATCH"
  echo "[strict] normalized object-shaped mutations -> array(shell)"
else
  rm -f "$tmp" || true
fi

# Execute via existing local executor
echo "[strict] exec-patch-local.sh $PATCH"
scripts/exec-patch-local.sh "$PATCH"

# STRICT gates (block on failure)
echo "[strict] gating: typescript"
nb_run 60s tsc-strict "cd \"$ROOT\" && yarn tsc --noEmit"
echo "[strict] gating: eslint"
nb_run 60s eslint-strict "cd \"$ROOT\" && yarn eslint . --ext .ts,.tsx --max-warnings=0"

# Boot Expo non-blocking and basic health check
echo "[strict] boot expo"
nb_bg 45s expo "cd \"$ROOT\" && npx expo start --ios --clear"
sleep 6
echo "[strict] healthcheck expo"
nb_run 18s expo-health "bash -lc 'curl -sSf http://localhost:8081/status >/dev/null'"

# Sim logs (hardened) + Maestro visual if available
if [ -x "$ROOT/scripts/capture-simlogs.sh" ]; then
  nb_run 35s simlog-capture "cd \"$ROOT\" && scripts/capture-simlogs.sh 15 ./logs/simulator.log"
fi
if [ -x "$ROOT/scripts/validate-simlogs.sh" ]; then
  nb_run 25s simlog-validate "cd \"$ROOT\" && scripts/validate-simlogs.sh ./logs/simulator.log"
fi
if [ -x "$ROOT/scripts/validate-visual.sh" ]; then
  nb_run 90s maestro-visual "cd \"$ROOT\" && scripts/validate-visual.sh"
fi
echo "[strict] PASS: all strict gates cleared"
