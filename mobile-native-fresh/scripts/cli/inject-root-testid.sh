#!/usr/bin/env bash
set -euo pipefail
FILES=(
  "src-nextgen/App.tsx"
  "src-nextgen/AppContent.tsx"
  "src-nextgen/screens/dashboard/DashboardScreen.tsx"
)
for F in "${FILES[@]}"; do
  [ -f "$F" ] || continue
  if ! grep -q 'testID="app-root"' "$F"; then
    # naive but safe-ish insertion: add testID on the first top-level View or Root container
    perl -0777 -pe 's/<(View|SafeAreaView)([^>]*)>/<\1\2 testID="app-root">/ if $.==0' -i "$F" || true
  fi
done
