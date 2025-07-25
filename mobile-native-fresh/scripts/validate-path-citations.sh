#!/bin/bash

ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"

cd "$ROOT" || exit 1

echo "🔍 Scanning for unresolved './src/' or bad relative references..."
grep -rE "(\'\.\/src\/|\"\.\/src\/)" . | grep -v node_modules | grep -v backend | grep -v archive | grep -v validate-path-citations.sh && echo "❌ Relative ./src references found" && exit 13

echo "✅ No invalid ./src relative paths found."
exit 0 