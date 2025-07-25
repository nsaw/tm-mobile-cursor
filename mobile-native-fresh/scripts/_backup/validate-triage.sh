#!/bin/{ { { { bash
# Validate orphan slot zones in runtime & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Final sweep of unregistered slots, broken projections, orphaned bridges

set -e

echo "🔍 [PATCH P1.00.18] Starting final slot triage validation..."

# Configuration
LOG_FILE="/tmp/slot-triage-validation.log"
VALIDATION_RESULTS="/tmp/triage-validation-results.json"

# Initialize validation results
cat > "$VALIDATION_RESULTS" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "patch": "patch-v1.4.40(P1.00.18)_final-slot-triage",
  "validations": {
    "orphan_slots_empty": false,
    "projected_zone_match": false,
    "hydration_logs_clean": false,
    "bridge_registration": false
  },
  "orphan_slots": [],
  "broken_projections": [],
  "orphaned_bridges": [],
  "errors": [],
  "warnings": []
}
EOF

# Function to log validation ste{ { { { ps
log_step() { & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to update validation result
update_result() {
    local key=$1
    local value=$2
    if command -v jq >/dev/null 2>&1; then
        jq ".validations.$key = $value" "$VALIDATION_RESULTS" > "${VALIDATION_RESULTS}.tmp" && mv "${VALIDATION_RESULTS}.tmp" "$VALIDATION_RESULTS"
    else
        echo "Warning: jq not available, skip{ { { { ping result update" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    fi
}

# Function to add orphan slot
add_orphan_slot() {
    local slot=$1
    if command -v jq >/dev/null 2>&1; then
        jq ".orphan_slots += [\"$slot\"]" "$VALIDATION_RESULTS" > "${VALIDATION_RESULTS}.tmp" && mv "${VALIDATION_RESULTS}.tmp" "$VALIDATION_RESULTS"
    else
        echo "Orphan slot found: $slot"
    fi
}

# Function to add broken projection
add_broken_projection() {
    local projection=$1
    if command -v jq >/dev/null 2>&1; then
        jq ".broken_projections += [\"$projection\"]" "$VALIDATION_RESULTS" > "${VALIDATION_RESULTS}.tmp" && mv "${VALIDATION_RESULTS}.tmp" "$VALIDATION_RESULTS"
    else
        echo "Broken projection found: $projection"
    fi
}

# Function to add orphaned bridge
add_orphaned_bridge() {
    local bridge=$1
    if command -v jq >/dev/null 2>&1; then
        jq ".orphaned_bridges += [\"$bridge\"]" "$VALIDATION_RESULTS" > "${VALIDATION_RESULTS}.tmp" && mv "${VALIDATION_RESULTS}.tmp" "$VALIDATION_RESULTS"
    else
        echo "Orphaned bridge found: $bridge"
    fi
}

# Function to add error
add_error() {
    local error=$1
    if command -v jq >/dev/null 2>&1; then
        jq ".errors += [\"$error\"]" "$VALIDATION_RESULTS" > "${VALIDATION_RESULTS}.tmp" && mv "${VALIDATION_RESULTS}.tmp" "$VALIDATION_RESULTS"
    else
        echo "Error: $error"
    fi
}

# Function to add warning
add_warning() {
    local warning=$1
    if command -v jq >/dev/null 2>&1; then
        jq ".warnings += [\"$warning\"]" "$VALIDATION_RESULTS" > "${VALIDATION_RESULTS}.tmp" && mv "${VALIDATION_RESULTS}.tmp" "$VALIDATION_RESULTS"
    else
        echo "Warning: $warning"
    fi
}

# Validation 1: Orphan Slots Detection
validate_orphan_slots() {
    log_step "Validating orphan slots detection..."
    
    local orphan_count=0
    
    # Check for slot components that aren't properly linked
    for slot_file in src-nextgen/layout/*Slot.tsx; do
        if [ -f "$slot_file" ]; then
            local slot_name=$(basename "$slot_file" .tsx)
            
            # Check if slot is imported in SlotRenderer
            if ! grep -q "import.*$slot_name" src-nextgen/layout/SlotRenderer.tsx; then
                add_orphan_slot "$slot_name"
                ((orphan_count++))
            fi
            
            # Check if slot has proper context integration
            if ! grep -q "context.*LayoutContext" "$slot_file"; then
                add_orphan_slot "$slot_name (no context)"
                ((orphan_count++))
            fi
            
            # Check if slot has SlotBridge integration
            if ! grep -q "SlotBridge" "$slot_file"; then
                add_orphan_slot "$slot_name (no bridge)"
                ((orphan_count++))
            fi
        fi
    done
    
    # Check for slot zone hooks that aren't used
    for hook_file in src-nextgen/hooks/use*Slot*.tsx; do
        if [ -f "$hook_file" ]; then
            local hook_name=$(basename "$hook_file" .tsx)
            
            # Check if hook is exported from index
            if ! grep -q "$hook_name" src-nextgen/hooks/index.ts; then
                add_orphan_slot "$hook_name (unexported)"
                ((orphan_count++))
            fi
        fi
    done
    
    if [ $orphan_count -eq 0 ]; then
        log_step "✅ No orphan slots found"
        update_result "orphan_slots_empty" "true"
        return 0
    else
        log_step "❌ Found $orphan_count orphan slots"
        update_result "orphan_slots_empty" "false"
        return 1
    fi
}

# Validation 2: Projected Zone Match Shell Layout
validate_projected_zones() {
    log_step "Validating projected zone match shell layout..."
    
    local broken_count=0
    
    # Check if LayoutShell defines expected zones
    if ! grep -q "top\|center\|bottom" src-nextgen/layout/LayoutShell.tsx; then
        add_broken_projection "LayoutShell missing zone definitions"
        ((broken_count++))
    fi
    
    # Check if SlotRenderer matches LayoutShell zones
    if ! grep -q "TopSlot\|CenterSlot\|BottomSlot" src-nextgen/layout/SlotRenderer.tsx; then
        add_broken_projection "SlotRenderer missing slot components"
        ((broken_count++))
    fi
    
    # Check if slot zone hooks match expected zones
    if ! grep -q "useTopSlot" src-nextgen/hooks/useSlotZone.tsx; then
        add_broken_projection "Missing top slot zone hook"
        ((broken_count++))
    fi
    
    if ! grep -q "useCenterSlot" src-nextgen/hooks/useSlotZone.tsx; then
        add_broken_projection "Missing center slot zone hook"
        ((broken_count++))
    fi
    
    if ! grep -q "useBottomSlot" src-nextgen/hooks/useSlotZone.tsx; then
        add_broken_projection "Missing bottom slot zone hook"
        ((broken_count++))
    fi
    
    # Check if SlotBridge zones match layout zones
    if ! grep -q "zone.*top\|zone.*center\|zone.*bottom" src-nextgen/slots/SlotBridge.tsx; then
        add_broken_projection "SlotBridge missing zone definitions"
        ((broken_count++))
    fi
    
    if [ $broken_count -eq 0 ]; then
        log_step "✅ All projected zones match shell layout"
        update_result "projected_zone_match" "true"
        return 0
    else
        log_step "❌ Found $broken_count broken projections"
        update_result "projected_zone_match" "false"
        return 1
    fi
}

# Validation 3: Hydration Logs Clean
validate_hydration_logs() {
    log_step "Validating hydration logs clean..."
    
    local warning_count=0
    
    # Check for bridge injection warnings in components
    for component_file in src-nextgen/layout/*.tsx src-nextgen/slots/*.tsx; do
        if [ -f "$component_file" ]; then
            # Check for console.warn or console.error about bridges
            if grep -q "console\.warn.*bridge\|console\.error.*bridge" "$component_file"; then
                add_warning "Bridge injection warning in $(basename "$component_file")"
                ((warning_count++))
            fi
            
            # Check for TODO or FIXME comments about bridges
            if grep -q "TODO.*bridge\|FIXME.*bridge" "$component_file"; then
                add_warning "Bridge TODO/FIXME in $(basename "$component_file")"
                ((warning_count++))
            fi
        fi
    done
    
    # Check for hydration-related issues
    for hook_file in src-nextgen/hooks/*.tsx; do
        if [ -f "$hook_file" ]; then
            # Check for hydration warnings
            if grep -q "console\.warn.*hydration\|console\.error.*hydration" "$hook_file"; then
                add_warning "Hydration warning in $(basename "$hook_file")"
                ((warning_count++))
            fi
        fi
    done
    
    if [ $warning_count -eq 0 ]; then
        log_step "✅ Hydration logs clean"
        update_result "hydration_logs_clean" "true"
        return 0
    else
        log_step "⚠️  Found $warning_count hydration warnings"
        update_result "hydration_logs_clean" "false"
        return 1
    fi
}

# Validation 4: Bridge Registration
validate_bridge_registration() {
    log_step "Validating bridge registration..."
    
    local orphaned_count=0
    
    # Check if SlotBridge is properly registered in slot components
    for slot_file in src-nextgen/layout/*Slot.tsx; do
        if [ -f "$slot_file" ]; then
            local slot_name=$(basename "$slot_file" .tsx)
            
            # Check if SlotBridge is imported
            if ! grep -q "import.*SlotBridge" "$slot_file"; then
                add_orphaned_bridge "$slot_name missing SlotBridge import"
                ((orphaned_count++))
            fi
            
            # Check if SlotBridge is used in component
            if ! grep -q "<SlotBridge" "$slot_file"; then
                add_orphaned_bridge "$slot_name missing SlotBridge usage"
                ((orphaned_count++))
            fi
        fi
    done
    
    # Check if SlotBridge has proper context integration
    if ! grep -q "context.*LayoutContext" src-nextgen/slots/SlotBridge.tsx; then
        add_orphaned_bridge "SlotBridge missing context integration"
        ((orphaned_count++))
    fi
    
    # Check if SlotBridge has proper zone handling
    if ! grep -q "zone.*top\|zone.*center\|zone.*bottom" src-nextgen/slots/SlotBridge.tsx; then
        add_orphaned_bridge "SlotBridge missing zone handling"
        ((orphaned_count++))
    fi
    
    # Check if SlotBridge is exported from hooks
    if ! grep -q "SlotBridge" src-nextgen/hooks/index.ts; then
        add_orphaned_bridge "SlotBridge not exported from hooks"
        ((orphaned_count++))
    fi
    
    if [ $orphaned_count -eq 0 ]; then
        log_step "✅ All bridges properly registered"
        update_result "bridge_registration" "true"
        return 0
    else
        log_step "❌ Found $orphaned_count orphaned bridges"
        update_result "bridge_registration" "false"
        return 1
    fi
}

# Main validation execution
main() {
    log_step "Starting final slot triage validation for P1.00.18..."
    
    # Run all validations
    local exit_code=0
    
    validate_orphan_slots || exit_code=1
    validate_projected_zones || exit_code=1
    validate_hydration_logs || exit_code=1
    validate_bridge_registration || exit_code=1
    
    # Generate final report
    log_step "Generating triage validation report..."
    
    if command -v jq >/dev/null 2>&1; then
        local passed_count=$(jq '.validations | to_entries | map(select(.value == true)) | length' "$VALIDATION_RESULTS")
        local total_count=$(jq '.validations | to_entries | length' "$VALIDATION_RESULTS")
        local orphan_count=$(jq '.orphan_slots | length' "$VALIDATION_RESULTS")
        local broken_count=$(jq '.broken_projections | length' "$VALIDATION_RESULTS")
        local orphaned_bridge_count=$(jq '.orphaned_bridges | length' "$VALIDATION_RESULTS")
        local error_count=$(jq '.errors | length' "$VALIDATION_RESULTS")
        local warning_count=$(jq '.warnings | length' "$VALIDATION_RESULTS")
        
        echo "📊 Triage Validation Summary:"
        echo "   Passed: $passed_count/$total_count"
        echo "   Orphan Slots: $orphan_count"
        echo "   Broken Projections: $broken_count"
        echo "   Orphaned Bridges: $orphaned_bridge_count"
        echo "   Errors: $error_count"
        echo "   Warnings: $warning_count"
        
        # Update final status
        if [ $exit_code -eq 0 ]; then
            echo "✅ Final slot triage validation PASSED"
            jq '.status = "PASSED"' "$VALIDATION_RESULTS" > "${VALIDATION_RESULTS}.tmp" && mv "${VALIDATION_RESULTS}.tmp" "$VALIDATION_RESULTS"
        else
            echo "❌ Final slot triage validation FAILED"
            jq '.status = "FAILED"' "$VALIDATION_RESULTS" > "${VALIDATION_RESULTS}.tmp" && mv "${VALIDATION_RESULTS}.tmp" "$VALIDATION_RESULTS"
        fi
        
        # Display detailed results
        echo "📋 Detailed Results:"
        jq -r '.validations | to_entries[] | "   " + .key + ": " + (.value | tostring)' "$VALIDATION_RESULTS"
        
        if [ "$orphan_count" -gt 0 ]; then
            echo "🔍 Orphan Slots:"
            jq -r '.orphan_slots[] | "   - " + .' "$VALIDATION_RESULTS"
        fi
        
        if [ "$broken_count" -gt 0 ]; then
            echo "🔍 Broken Projections:"
            jq -r '.broken_projections[] | "   - " + .' "$VALIDATION_RESULTS"
        fi
        
        if [ "$orphaned_bridge_count" -gt 0 ]; then
            echo "🔍 Orphaned Bridges:"
            jq -r '.orphaned_bridges[] | "   - " + .' "$VALIDATION_RESULTS"
        fi
        
        if [ "$error_count" -gt 0 ]; then
            echo "❌ Errors:"
            jq -r '.errors[] | "   - " + .' "$VALIDATION_RESULTS"
        fi
        
        if [ "$warning_count" -gt 0 ]; then
            echo "⚠️  Warnings:"
            jq -r '.warnings[] | "   - " + .' "$VALIDATION_RESULTS"
        fi
    else
        echo "Warning: jq not available, using basic reporting"
        echo "📊 Triage validation completed with exit code: $exit_code"
    fi
    
    log_step "Triage validation complete. Results saved to $VALIDATION_RESULTS"
    
    exit $exit_code
}

# Run main function
main 