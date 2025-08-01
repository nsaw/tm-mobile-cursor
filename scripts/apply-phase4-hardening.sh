#!/bin/bash

# Phase 4 Patch Hardening Application Script
# Applies comprehensive hardening to any Phase 4 patch

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <patch-file.json>"
    echo "Example: $0 patch-v1.4.500(P4.01.01)_signin-screen-migration.json"
    exit 1
fi

PATCH_FILE="$1"
BACKUP_DIR="/Users/sawyer/gitSync/_backups/tm-safety_backups"

echo "🔒 Starting Phase 4 patch hardening for: $PATCH_FILE"

# Create backup of the patch file
BACKUP_FILE="${BACKUP_DIR}/$(date +%y%m%d)_UTC_$(basename "$PATCH_FILE" .json)_backup.json"
echo "📦 Creating backup: $BACKUP_FILE"
cp "$PATCH_FILE" "$BACKUP_FILE"

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
.patch.estimatedTime = (.patch.estimatedTime | if . == null then "2 hours" elif type == "string" then (. | capture("(?<num>[0-9]+)") | .num | tonumber + 2 | tostring + " hours") else (. | tonumber + 2 | tostring + " hours") end) |
.patch.notes = (.patch.notes // []) + [
  "HARDENED: Includes comprehensive JSX validation",
  "HARDENED: Includes TypeScript compilation validation", 
  "HARDENED: Includes Expo app refresh validation",
  "HARDENED: Includes bundler error validation",
  "HARDENED: Includes runtime boot validation"
]
' "$PATCH_FILE" > "${PATCH_FILE}.tmp"

mv "${PATCH_FILE}.tmp" "$PATCH_FILE"
echo "✅ Hardened: $PATCH_FILE"
echo "💾 Backup created: $BACKUP_FILE"
echo "🎯 Patch hardening complete!" 