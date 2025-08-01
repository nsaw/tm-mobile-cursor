#!/usr/bin/env python3

import json
import os
import glob
import shutil
from pathlib import Path

def update_patch_file(patch_file, phase_name):
    """Update a single patch file with dual-mount validation"""
    print(f"📝 Updating: {patch_file}")
    
    # Create backup
    backup_file = f"{patch_file}.backup"
    shutil.copy2(patch_file, backup_file)
    
    try:
        # Read the patch file
        with open(patch_file, 'r') as f:
            patch_data = json.load(f)
        
        # Update postMutationBuild section
        new_post_mutation_build = {
            "shell": [
                "timeout 60s npx tsc --noEmit --skipLibCheck || exit 3001",
                "timeout 60s npm run lint:guard || exit 3002",
                "timeout 60s npm test -- --watchAll=false || exit 3003",
                "echo '🔄 Testing Legacy Mode...'",
                "rm -f .env.development.local",
                "timeout 120s npm run dev:legacy & sleep 90",
                "timeout 30s curl -sf http://localhost:8081/status && echo '✅ Legacy Expo booted' || echo '❌ Legacy Expo failed'",
                "pkill -f 'expo start' || true",
                "sleep 5",
                "echo '🔄 Testing NextGen Mode...'",
                "echo 'EXPO_PUBLIC_USE_NEXTGEN=true' > .env.development.local",
                "echo 'EXPO_PUBLIC_ENVIRONMENT=nextgen' >> .env.development.local",
                "echo 'USE_NEXTGEN=true' >> .env.development.local",
                "timeout 120s npm run dev:nextgen & sleep 90",
                "timeout 30s curl -sf http://localhost:4567/status && echo '✅ NextGen Expo booted' || echo '❌ NextGen Expo failed'",
                "pkill -f 'expo start' || true",
                "sleep 5",
                "echo 'TypeScript errors:' && npx tsc --noEmit --skipLibCheck | grep -c 'error TS'",
                "echo 'ESLint errors:' && npm run lint:guard | grep -c 'error'",
                "echo 'Warnings:' && npm run lint:guard | grep -c 'warning'"
            ]
        }
        patch_data["postMutationBuild"] = new_post_mutation_build
        
        # Update validate section
        new_validate = {
            "shell": [
                "sleep 6",
                "test -f src-nextgen/screens/*.tsx && echo '✅ Nextgen screens created' || echo '❌ Nextgen screens missing'",
                "test -f src-nextgen/navigation/*.tsx && echo '✅ Nextgen navigation created' || echo '❌ Nextgen navigation missing'",
                "echo '🔄 Dual-Mount Validation:'",
                "npm run validate:env",
                "echo '🔄 Testing Dual-Mount Toggle:'",
                "npm run test:dual-mount"
            ]
        }
        patch_data["validate"] = new_validate
        
        # Add dualMountValidation section if it doesn't exist
        if "dualMountValidation" not in patch_data:
            patch_data["dualMountValidation"] = {
                "legacy": [
                    "test -f src/screens/*.tsx && echo '✅ Legacy screens preserved' || echo '❌ Legacy screens missing'",
                    "grep -q 'Screen' src/navigation/AppNavigator.tsx && echo '✅ Legacy navigation intact' || echo '❌ Legacy navigation broken'"
                ],
                "nextgen": [
                    "test -f src-nextgen/screens/*.tsx && echo '✅ Nextgen screens created' || echo '❌ Nextgen screens missing'",
                    "grep -q 'Screen' src-nextgen/navigation/DualMountNavigator.tsx && echo '✅ Nextgen navigation configured' || echo '❌ Nextgen navigation not configured'"
                ],
                "environmentToggle": [
                    "grep -q 'EXPO_PUBLIC_USE_NEXTGEN' .env.development.local && echo '✅ Environment toggle available' || echo '❌ Environment toggle missing'",
                    "test -f src-nextgen/state/environment.ts && echo '✅ Environment state available' || echo '❌ Environment state missing'"
                ]
            }
        
        # Update documentation sections if they exist
        if "documentation" in patch_data:
            if "testing" in patch_data["documentation"]:
                patch_data["documentation"]["testing"] = [
                    "Unit tests for component",
                    "Dual-mount validation in both legacy and nextgen environments",
                    "Visual inspection of component rendering in both modes",
                    "Test navigation between legacy and nextgen versions",
                    "Validate all component functionality preserved in both environments"
                ]
            
            if "rollback" in patch_data["documentation"]:
                patch_data["documentation"]["rollback"] = [
                    "Restore src-nextgen files from backup",
                    "Verify functional parity with pre-patch state",
                    "Confirm legacy components still working",
                    "Test dual-mount toggle functionality"
                ]
        
        # Update performance section if it exists
        if "performance" in patch_data and "monitoring" in patch_data["performance"]:
            patch_data["performance"]["monitoring"] = "Manual audit, Expo boot in both modes, and runtime performance logs"
        
        # Update accessibility section if it exists
        if "accessibility" in patch_data and "testing" in patch_data["accessibility"]:
            patch_data["accessibility"]["testing"] = "Manual screen reader and keyboard navigation testing in both legacy and nextgen modes"
        
        # Write the updated patch file
        with open(patch_file, 'w') as f:
            json.dump(patch_data, f, indent=2)
        
        print(f"✅ Updated: {patch_file}")
        
    except Exception as e:
        print(f"❌ Error updating {patch_file}: {e}")
        # Restore backup on error
        if os.path.exists(backup_file):
            shutil.move(backup_file, patch_file)
        raise

def process_phase(phase_dir, phase_name):
    """Process all patches in a phase"""
    print(f"\n🔄 **PROCESSING {phase_name}**")
    print("=" * 50)
    
    if not os.path.exists(phase_dir):
        print(f"❌ Phase directory not found: {phase_dir}")
        return
    
    # Find all patch files in the phase
    patch_files = glob.glob(os.path.join(phase_dir, "**", "patch-*.json"), recursive=True)
    
    if not patch_files:
        print(f"⚠️  No patch files found in {phase_dir}")
        return
    
    for patch_file in patch_files:
        # Skip the dual-mount toggle enforcement patch as it's already correct
        if "dual-mount-toggle-enforcement" in patch_file:
            print("⏭️  Skipping dual-mount toggle enforcement patch (already correct)")
            continue
        
        update_patch_file(patch_file, phase_name)
    
    print(f"✅ Completed {phase_name}")

def main():
    """Main execution function"""
    print("🔄 **UPDATING DUAL-MOUNT VALIDATION FOR ALL PHASES**")
    print("=" * 60)
    print("🚀 Starting dual-mount validation update for all phases...")
    
    # Process each phase
    phases = [
        ("phase-2", "PHASE 2"),
        ("phase-3", "PHASE 3"),
        ("phase-4", "PHASE 4"),
        ("phase-5", "PHASE 5"),
        ("phase-6", "PHASE 6"),
        ("phase-7", "PHASE 7")
    ]
    
    for phase_dir, phase_name in phases:
        process_phase(phase_dir, phase_name)
    
    print("\n🎉 **DUAL-MOUNT VALIDATION UPDATE COMPLETE**")
    print("=" * 50)
    print("\n✅ All patches in phases 2-7 have been updated with:")
    print("   - Proper dual-mount switching (legacy ↔ nextgen)")
    print("   - Environment toggle validation")
    print("   - Dual-mount testing commands")
    print("   - Updated documentation for dual-mount testing")
    print("\n📋 **Updated Validation Pattern:**")
    print("   1. Test in Legacy Mode (port 8081)")
    print("   2. Test in NextGen Mode (port 4567)")
    print("   3. Validate environment variables")
    print("   4. Test dual-mount toggle functionality")
    print("\n🔧 **Usage:**")
    print("   - Legacy: npm run dev:legacy")
    print("   - NextGen: npm run dev:nextgen")
    print("   - Validate: npm run validate:env")
    print("   - Test Toggle: npm run test:dual-mount")
    print("\n📁 **Backups:**")
    print("   - Original files saved as .backup")
    print("   - Restore with: mv file.json.backup file.json")

if __name__ == "__main__":
    main() 