#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LEGACY_FILE="$ROOT/src-reference/features/auth/screens/SignIn.tsx"
BARREL_FILE="$ROOT/src-reference/features/auth/screens/index.ts"

[[ -f "$LEGACY_FILE" ]] || { echo "❌ SignIn.tsx missing"; exit 1; }
[[ -f "$BARREL_FILE" ]] || { echo "❌ Barrel export missing"; exit 1; }

echo "✅ SignIn.tsx file exists at expected path"
echo "✅ Barrel export file exists"

# Test manual path resolution
node -e "
const path = require('path');
const fs = require('fs');

const expectedPath = path.resolve('$ROOT/src-reference/features/auth/screens/SignIn.tsx');
if (fs.existsSync(expectedPath)) {
  console.log('✅ Manual path resolution works:', path.relative(process.cwd(), expectedPath));
} else {
  console.error('❌ Manual path resolution failed');
  process.exit(1);
}
" 