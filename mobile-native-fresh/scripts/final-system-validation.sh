#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
. "$ROOT/scripts/lib-nonblocking.sh"
nb_bg 45s expo-final "cd \"$ROOT\" && npx expo start --ios --clear"
sleep 5
nb_run 40s tsc-final "cd \"$ROOT\" && yarn tsc --noEmit"
nb_run 40s eslint-final "cd \"$ROOT\" && yarn eslint . --ext .ts,.tsx --max-warnings=0"
nb_run 90s jest-final "cd \"$ROOT\" && NODE_OPTIONS=--experimental-vm-modules yarn test:unit --config jest.config.js --runInBand --detectOpenHandles --forceExit --testTimeout=30000"
[ -x "$ROOT/scripts/validate-runtime.sh" ] && nb_run 30s runtime-final "cd \"$ROOT\" && scripts/validate-runtime.sh" || true
[ -x "$ROOT/scripts/capture-simlogs.sh" ] && nb_run 35s simlog-capture-final "cd \"$ROOT\" && scripts/capture-simlogs.sh 15 ./logs/simulator.log" || true
[ -x "$ROOT/scripts/validate-simlogs.sh" ] && nb_run 25s simlog-validate-final "cd \"$ROOT\" && scripts/validate-simlogs.sh ./logs/simulator.log" || true
echo "[final-system-validation] PASS"
