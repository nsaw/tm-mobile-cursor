#!/bin/bash

# Script to apply hardening to all specified Phase 4 patches

set -e

PATCHES=(
    "patch-v1.4.500(P4.01.01)_signin-screen-migration.json"
    "patch-v1.4.500(P4.01.02)_signup-screen-migration.json"
    "patch-v1.4.500(P4.01.03)_pinentry-screen-migration.json"
    "patch-v1.4.500(P4.01.04)_passwordreset-screen-migration.json"
    "patch-v1.4.510(P4.02.01)_allthoughtmarks-screen-migration.json"
    "patch-v1.4.510(P4.02.02)_allbins-screen-migration.json"
    "patch-v1.4.510(P4.02.03)_search-screen-migration.json"
    "patch-v1.4.510(P4.02.04)_thoughtmarkdetail-screen-migration.json"
    "patch-v1.4.510(P4.02.05)_createbin-screen-migration-hardened.json"
    "patch-v1.4.510(P4.02.04)_thoughtmarkdetail-screen-migration-hardened.json"
    "patch-v1.4.510(P4.02.05)_createbin-screen-migration.json"
    "patch-v1.4.520(P4.03.01)_settings-screen-migration.json"
    "patch-v1.4.510(P4.02.08)_duplicate-declaration-fix-and-app-refresh.json"
    "patch-v1.4.520(P4.03.01)_settings-screen-migration-hardened.json"
    "patch-v1.4.520(P4.03.02)_profile-screen-migration.json"
    "patch-v1.4.520(P4.03.03)_premium-screen-migration.json"
    "patch-v1.4.520(P4.03.02)_profile-screen-migration-hardened.json"
    "patch-v1.4.520(P4.03.04)_security-screen-migration.json"
    "patch-v1.4.520(P4.03.05)_theme-screen-migration.json"
)

PATCH_DIR="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-4"
HARDENING_SCRIPT="./scripts/apply-phase4-hardening.sh"

echo "🔒 Starting comprehensive Phase 4 patch hardening..."
echo "📁 Patch directory: $PATCH_DIR"
echo "🛠️ Hardening script: $HARDENING_SCRIPT"
echo "📋 Total patches to harden: ${#PATCHES[@]}"
echo ""

for patch in "${PATCHES[@]}"; do
    patch_path="$PATCH_DIR/$patch"
    
    if [ -f "$patch_path" ]; then
        echo "🔧 Hardening: $patch"
        "$HARDENING_SCRIPT" "$patch_path"
        echo "✅ Completed: $patch"
        echo ""
    else
        echo "⚠️ Patch not found: $patch_path"
        echo ""
    fi
done

echo "🎯 All Phase 4 patch hardening complete!"
echo "📊 Summary:"
echo "   - Total patches processed: ${#PATCHES[@]}"
echo "   - Backups created in: /Users/sawyer/gitSync/_backups/tm-safety_backups/"
echo "   - All patches now include comprehensive validation requirements" 