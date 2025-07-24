#!/bin/{ { { { bash

# 🔄 SYNC-FROM-REMOTE.SH & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Pulls latest state from remote branch and resets local to match.

BRANCH="release/v1.2.2"

echo "Fetching latest remote changes for $BRANCH..."
git fetch origin $BRANCH

echo "Resetting local branch to match remote state..."
git reset --hard origin/$BRANCH

echo "✅ Sync complete. Local state now matches latest remote $BRANCH."
