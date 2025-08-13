#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
ENVFILE="$ROOT/.env.development.local"
mkdir -p "$ROOT/src-nextgen/dev-shims"
# Env override
grep -q '^EXPO_PUBLIC_USE_FIREBASE=' "$ENVFILE" 2>/dev/null || echo 'EXPO_PUBLIC_USE_FIREBASE=false' >> "$ENVFILE"
# Shim module (treeshake-safe)
cat > "$ROOT/src-nextgen/dev-shims/firebaseShim.ts" <<'EOF'
export const firebase = { initialized: false };
export const firestore = undefined as any;
export const auth = { currentUser: null };
export default {};
EOF
