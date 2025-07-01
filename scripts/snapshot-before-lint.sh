#!/bin/bash

# Snapshot .tsx/.ts files before mutation
DATE=$(date +%y%m%d_%H%MUTC)
DEST="/Users/sawyer/gitSync/tm-safety_backups/syntax-snapshots_$DATE"

mkdir -p "$DEST"
echo "📸 Saving .tsx/.ts snapshot to $DEST..."
find /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec cp --parents {} "$DEST" \;
echo "✅ Snapshot complete."

