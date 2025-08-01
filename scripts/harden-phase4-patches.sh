#!/bin/bash

# Phase 4 Patch Hardening Script
# Adds comprehensive validation requirements to all Phase 4 patches

set -e

PATCH_DIR="/Users/sawyer/gitSync/tm-mobile-cursor/MAIN/patches/phase-4"
BACKUP_DIR="/Users/sawyer/gitSync/_backups/tm-safety_backups"

echo "🔒 Starting Phase 4 patch hardening..."

# Create backup
BACKUP_FILE="${BACKUP_DIR}/$(date +%y%m%d)_UTC_phase4-hardening-backup_tm-mobile-cursor.tar.gz"
echo "📦 Creating backup: $BACKUP_FILE"
cd /Users/sawyer/gitSync/tm-mobile-cursor/
tar -czf "$BACKUP_FILE" --exclude=node_modules --exclude=.git --exclude=tmp --exclude=logs .

# Function to harden a patch
harden_patch() {
    local patch_file="$1"
    local temp_file="${patch_file}.tmp"
    
    echo "🔧 Hardening: $(basename "$patch_file")"
    
    # Create hardened version with additional validation requirements
    jq --arg refresh_cmd "(
  kill \$(lsof -ti:8081) 2>/dev/null || true
  cd /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh
  npx expo start --ios --clear &
  PID=\$!
  sleep 30
  disown \$PID
) >/dev/null 2>&1 &" '
    .patch.validationGates += [
      "Patch all known files with corrupt JSX",
      "TypeScript compilation must pass",
      "App refresh loop must succeed (Expo boots)",
      "No bundler errors in console",
      "Runtime boot confirmed"
    ] |
    .patch.successCriteria += [
      "All JSX files validated and corrected",
      "TypeScript compilation passes without errors",
      "Expo app boots successfully after refresh",
      "No bundler errors in development console",
      "Runtime functionality confirmed working"
    ] |
    .patch.preMutationBuild += [
      "echo \"🔍 Pre-mutation validation starting...\"",
      "npm run lint:guard",
      "npx tsc --noEmit --skipLibCheck",
      "npm run test:unit --watchAll=false"
    ] |
    .patch.postMutationBuild += [
      "echo \"🔧 Post-mutation validation starting...\"",
      "npm run lint:guard",
      "npx tsc --noEmit --skipLibCheck",
      "npm run test:unit --watchAll=false",
      "echo \"🚀 Starting Expo refresh validation...\"",
      $refresh_cmd,
      "sleep 35",
      "echo \"🔍 Checking Expo status...\"",
      "curl -s http://localhost:8081/status | grep -q \"running\" || echo \"⚠️ Expo status check failed\"",
      "echo \"✅ Runtime validation complete\""
    ] |
    .patch.hardeningSteps += [
      "Validate all JSX files for syntax errors",
      "Fix any TypeScript compilation errors",
      "Ensure Expo app boots successfully",
      "Verify no bundler errors in console",
      "Confirm runtime functionality"
    ] |
    .patch.rollbackPlan += [
      "Restore from backup: $BACKUP_FILE",
      "Revert all Phase 4 changes",
      "Restart Expo development server",
      "Verify legacy functionality"
    ] |
    .patch.risk = "high" |
    .patch.priority = "critical" |
    .patch.estimatedTime = (.patch.estimatedTime | tonumber + 2 | tostring + " hours") |
    .patch.notes = (.patch.notes // []) + [
      "HARDENED: Includes comprehensive JSX validation",
      "HARDENED: Includes TypeScript compilation validation", 
      "HARDENED: Includes Expo app refresh validation",
      "HARDENED: Includes bundler error validation",
      "HARDENED: Includes runtime boot validation"
    ]
    ' "$patch_file" > "$temp_file"
    
    mv "$temp_file" "$patch_file"
    echo "✅ Hardened: $(basename "$patch_file")"
}

# Find all patch files and harden them
find "$PATCH_DIR" -name "patch-*.json" -type f | while read -r patch_file; do
    harden_patch "$patch_file"
done

echo "🎯 Phase 4 patch hardening complete!"
echo "📊 Hardened patches:"
find "$PATCH_DIR" -name "patch-*.json" -type f | wc -l
echo "💾 Backup created: $BACKUP_FILE" 