#!/usr/bin/env bash
# Fix ESLint errors systematically
set -euo pipefail

echo "[fix-eslint] Starting ESLint error fixes..."

# Run auto-fix
npm run lint:fix-all || true

echo "[fix-eslint] ESLint fixes completed"
