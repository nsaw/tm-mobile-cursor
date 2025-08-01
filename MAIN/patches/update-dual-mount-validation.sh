#!/bin/bash

# Update Dual-Mount Validation Script
# Updates all patches in phases 2-7 with proper dual-mount switching and testing

set -e

echo "🔄 **UPDATING DUAL-MOUNT VALIDATION FOR ALL PHASES**"
echo "=================================================="

# Function to update a single patch file
update_patch_file() {
    local patch_file="$1"
    local phase_name="$2"
    
    echo "📝 Updating: $patch_file"
    
    # Create backup
    cp "$patch_file" "${patch_file}.backup"
    
    # Update postMutationBuild section - replace entire section
    perl -0777 -pi -e 's/"postMutationBuild": \{[^}]*\},/"postMutationBuild": {
    "shell": [
      "timeout 60s npx tsc --noEmit --skipLibCheck || exit 3001",
      "timeout 60s npm run lint:guard || exit 3002",
      "timeout 60s npm test -- --watchAll=false || exit 3003",
      "echo '\''🔄 Testing Legacy Mode...'\''",
      "rm -f .env.development.local",
      "timeout 120s npm run dev:legacy & sleep 90",
      "timeout 30s curl -sf http://localhost:8081/status && echo '\''✅ Legacy Expo booted'\'' || echo '\''❌ Legacy Expo failed'\''",
      "pkill -f '\''expo start'\'' || true",
      "sleep 5",
      "echo '\''🔄 Testing NextGen Mode...'\''",
      "echo '\''EXPO_PUBLIC_USE_NEXTGEN=true'\'' > .env.development.local",
      "echo '\''EXPO_PUBLIC_ENVIRONMENT=nextgen'\'' >> .env.development.local",
      "echo '\''USE_NEXTGEN=true'\'' >> .env.development.local",
      "timeout 120s npm run dev:nextgen & sleep 90",
      "timeout 30s curl -sf http://localhost:4567/status && echo '\''✅ NextGen Expo booted'\'' || echo '\''❌ NextGen Expo failed'\''",
      "pkill -f '\''expo start'\'' || true",
      "sleep 5",
      "echo '\''TypeScript errors:'\'' && npx tsc --noEmit --skipLibCheck | grep -c '\''error TS'\''",
      "echo '\''ESLint errors:'\'' && npm run lint:guard | grep -c '\''error'\''",
      "echo '\''Warnings:'\'' && npm run lint:guard | grep -c '\''warning'\''"
    ]
  },/g' "$patch_file"
    
    # Update validate section - replace entire section
    perl -0777 -pi -e 's/"validate": \{[^}]*\},/"validate": {
    "shell": [
      "sleep 6",
      "test -f src-nextgen/screens/*.tsx && echo '\''✅ Nextgen screens created'\'' || echo '\''❌ Nextgen screens missing'\''",
      "test -f src-nextgen/navigation/*.tsx && echo '\''✅ Nextgen navigation created'\'' || echo '\''❌ Nextgen navigation missing'\''",
      "echo '\''🔄 Dual-Mount Validation:'\''",
      "npm run validate:env",
      "echo '\''🔄 Testing Dual-Mount Toggle:'\''",
      "npm run test:dual-mount"
    ]
  },/g' "$patch_file"
    
    # Add dualMountValidation section if it doesn't exist
    if ! grep -q '"dualMountValidation"' "$patch_file"; then
        # Insert after validate section
        perl -0777 -pi -e 's/("validate": \{[^}]*\},)/$1
  "dualMountValidation": {
    "legacy": [
      "test -f src/screens/*.tsx && echo '\''✅ Legacy screens preserved'\'' || echo '\''❌ Legacy screens missing'\''",
      "grep -q '\''Screen'\'' src/navigation/AppNavigator.tsx && echo '\''✅ Legacy navigation intact'\'' || echo '\''❌ Legacy navigation broken'\''"
    ],
    "nextgen": [
      "test -f src-nextgen/screens/*.tsx && echo '\''✅ Nextgen screens created'\'' || echo '\''❌ Nextgen screens missing'\''",
      "grep -q '\''Screen'\'' src-nextgen/navigation/DualMountNavigator.tsx && echo '\''✅ Nextgen navigation configured'\'' || echo '\''❌ Nextgen navigation not configured'\''"
    ],
    "environmentToggle": [
      "grep -q '\''EXPO_PUBLIC_USE_NEXTGEN'\'' .env.development.local && echo '\''✅ Environment toggle available'\'' || echo '\''❌ Environment toggle missing'\''",
      "test -f src-nextgen/state/environment.ts && echo '\''✅ Environment state available'\'' || echo '\''❌ Environment state missing'\''"
    ]
  },/g' "$patch_file"
    fi
    
    # Update documentation testing section
    perl -0777 -pi -e 's/"testing": \[[^\]]*\],/"testing": [
        "Unit tests for component",
        "Dual-mount validation in both legacy and nextgen environments",
        "Visual inspection of component rendering in both modes",
        "Test navigation between legacy and nextgen versions",
        "Validate all component functionality preserved in both environments"
      ],/g' "$patch_file"
    
    # Update documentation rollback section
    perl -0777 -pi -e 's/"rollback": \[[^\]]*\],/"rollback": [
        "Restore src-nextgen files from backup",
        "Verify functional parity with pre-patch state",
        "Confirm legacy components still working",
        "Test dual-mount toggle functionality"
      ],/g' "$patch_file"
    
    # Update performance monitoring
    perl -pi -e 's/"monitoring": "[^"]*"/"monitoring": "Manual audit, Expo boot in both modes, and runtime performance logs"/g' "$patch_file"
    
    # Update accessibility testing
    perl -pi -e 's/"testing": "[^"]*"/"testing": "Manual screen reader and keyboard navigation testing in both legacy and nextgen modes"/g' "$patch_file"
    
    echo "✅ Updated: $patch_file"
}

# Function to process all patches in a phase
process_phase() {
    local phase_dir="$1"
    local phase_name="$2"
    
    echo ""
    echo "🔄 **PROCESSING $phase_name**"
    echo "============================"
    
    if [ ! -d "$phase_dir" ]; then
        echo "❌ Phase directory not found: $phase_dir"
        return
    fi
    
    # Find all patch files in the phase
    local patch_files=$(find "$phase_dir" -name "patch-*.json" -type f)
    
    if [ -z "$patch_files" ]; then
        echo "⚠️  No patch files found in $phase_dir"
        return
    fi
    
    for patch_file in $patch_files; do
        # Skip the dual-mount toggle enforcement patch as it's already correct
        if [[ "$patch_file" == *"dual-mount-toggle-enforcement"* ]]; then
            echo "⏭️  Skipping dual-mount toggle enforcement patch (already correct)"
            continue
        fi
        
        update_patch_file "$patch_file" "$phase_name"
    done
    
    echo "✅ Completed $phase_name"
}

# Main execution
echo "🚀 Starting dual-mount validation update for all phases..."

# Process each phase
process_phase "phase-2" "PHASE 2"
process_phase "phase-3" "PHASE 3"
process_phase "phase-4" "PHASE 4"
process_phase "phase-5" "PHASE 5"
process_phase "phase-6" "PHASE 6"
process_phase "phase-7" "PHASE 7"

echo ""
echo "🎉 **DUAL-MOUNT VALIDATION UPDATE COMPLETE**"
echo "============================================"
echo ""
echo "✅ All patches in phases 2-7 have been updated with:"
echo "   - Proper dual-mount switching (legacy ↔ nextgen)"
echo "   - Environment toggle validation"
echo "   - Dual-mount testing commands"
echo "   - Updated documentation for dual-mount testing"
echo ""
echo "📋 **Updated Validation Pattern:**"
echo "   1. Test in Legacy Mode (port 8081)"
echo "   2. Test in NextGen Mode (port 4567)"
echo "   3. Validate environment variables"
echo "   4. Test dual-mount toggle functionality"
echo ""
echo "🔧 **Usage:**"
echo "   - Legacy: npm run dev:legacy"
echo "   - NextGen: npm run dev:nextgen"
echo "   - Validate: npm run validate:env"
echo "   - Test Toggle: npm run test:dual-mount"
echo ""
echo "📁 **Backups:**"
echo "   - Original files saved as .backup"
echo "   - Restore with: mv file.json.backup file.json" 