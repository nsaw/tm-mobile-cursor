#!/usr/bin/env bash
# Fix TypeScript errors systematically
set -euo pipefail

echo "[fix-ts] Starting TypeScript error fixes..."

# Install missing packages
echo "[fix-ts] Installing missing packages..."
npm install axios expo-local-authentication expo-crypto crypto-js @types/crypto-js || true

# Fix common TypeScript issues
echo "[fix-ts] Fixing common TypeScript issues..."

# Create missing type declarations
mkdir -p "src-nextgen/types"

# Fix AppState interface
echo "[fix-ts] Creating AppState interface..."
cat > "src-nextgen/types/AppState.ts" << 'EOF'
export interface AppState {
  // Core app state
  isAuthenticated: boolean;
  user: any | null;
  theme: 'light' | 'dark';
  
  // Feature flags
  premiumEnabled: boolean;
  voiceRecordingEnabled: boolean;
  
  // Navigation state
  currentRoute: string;
  navigationReady: boolean;
  
  // Device state
  androidId?: string;
  deviceInfo: any;
  
  // API state
  apiClient: any;
  
  // Add other properties as needed
}
EOF

# Fix window references
find src-nextgen -name "*.ts" -o -name "*.tsx" | xargs grep -l "window" | head -5 | while read file; do
  echo "[fix-ts] Fixing window reference in $file"
  sed -i '' 's/window\./globalThis./g' "$file" || true
done

echo "[fix-ts] TypeScript fixes completed"
