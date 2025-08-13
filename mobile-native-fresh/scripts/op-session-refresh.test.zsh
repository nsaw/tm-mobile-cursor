#!/bin/zsh
set -euo pipefail
# Quick self-check: run refresh via nb runner (non-blocking), then report status.
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
cd "$ROOT"
mkdir -p validations/logs validations/status
node scripts/nb.cjs --ttl 10s --label op-refresh --log validations/logs/op-refresh.log --status validations/status -- ~/bin/op-session-refresh.zsh
sleep 1
if [ -f "$HOME/.1password/session.env" ]; then
  echo SESSION_FILE_OK
else
  echo SESSION_FILE_MISSING
fi
