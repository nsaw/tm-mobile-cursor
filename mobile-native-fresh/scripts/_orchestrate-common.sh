#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
Q="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/_queue"
COMPLETED="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/.completed"
FAILED="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/.failed"
ARTS_BASE="/Users/sawyer/gitSync/.cursor-cache/MAIN/artifacts"
. "$ROOT/scripts/lib-nonblocking.sh"
# tiny helpers
nb_ok()   { nb_run "$1" "$2" "$3"; }
nb_bg_ok(){ nb_bg  "$1" "$2" "$3"; }
