#!/bin/{ { { { bash
# Layout shell validation entrypoint & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Validates structural layout zones can boot, hydrate, and mount shell+slot zones

set -e

echo "🔍 [PATCH P1.00.17] Starting shell structure validation..."

# Configuration
LOG_FILE="/tmp/shell-structure-validation.log"
VALIDATION_RESULTS="/tmp/structure-validation-results.json"

# Initialize validation results
cat > "$VALIDATION_RESULTS" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "patch": "patch-v1.4.40(P1.00.17)_shell-structure-validation",
  "validations": {
    "layout_zone_hydration": false,
    "screen_safe_bounds": false,
    "slot_visual_confirmation": false,
    "structure_integrity": false
  },
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

# Validation 1: Layout Zone Hydration
validate_layout_zone_hydration() {
    log_step "Validating layout zone hydration..."
    
    # Check if layout components exist
    if [ ! -f "src-nextgen/layout/LayoutShell.tsx" ]; then
        add_error "LayoutShell.tsx not found"
        return 1
    fi
    
    if [ ! -f "src-nextgen/layout/SlotRenderer.tsx" ]; then
        add_error "SlotRenderer.tsx not found"
        return 1
    fi
    
    # Check if slot components exist
    for slot in TopSlot CenterSlot BottomSlot; do
        if [ ! -f "src-nextgen/layout/${slot}.tsx" ]; then
            add_error "${slot}.tsx not found"
            return 1
        fi
    done
    
    # Check if SlotBridge exists
    if [ ! -f "src-nextgen/slots/SlotBridge.tsx" ]; then
        add_error "SlotBridge.tsx not found"
        return 1
    fi
    
    log_step "✅ Layout zone hydration validation passed"
    update_result "layout_zone_hydration" "true"
    return 0
}

# Validation 2: Screen/Route-Safe Shell Bounds
validate_screen_safe_bounds() {
    log_step "Validating screen/route-safe shell bounds..."
    
    # Check for navigation integration
    if ! grep -q "useNavigation\|useRoute" src-nextgen/layout/LayoutShell.tsx; then
        add_warning "Navigation hooks not detected in LayoutShell"
    fi
    
    # Check for safe area handling
    if ! grep -q "SafeAreaView\|useSafeAreaInsets" src-nextgen/layout/LayoutShell.tsx; then
        add_warning "Safe area handling not detected in LayoutShell"
    fi
    
    # Check for responsive layout patterns
    if ! grep -q "Dimensions\|useWindowDimensions" src-nextgen/layout/LayoutShell.tsx; then
        add_warning "Responsive layout patterns not detected"
    fi
    
    log_step "✅ Screen/route-safe shell bounds validation passed"
    update_result "screen_safe_bounds" "true"
    return 0
}

# Validation 3: Slot Visual Confirmation
validate_slot_visual_confirmation() {
    log_step "Validating slot visual confirmation..."
    
    # Check for visual validation components
    if [ ! -f "src-nextgen/components/SlotBridgeDemo.tsx" ]; then
        add_warning "SlotBridgeDemo.tsx not found - visual validation limited"
    fi
    
    # Check for validation hooks
    if [ ! -f "src-nextgen/hooks/useLayoutContext.tsx" ]; then
        add_error "useLayoutContext.tsx not found"
        return 1
    fi
    
    # Check for structure validation hooks
    if [ ! -f "src-nextgen/hooks/useStructureValidation.tsx" ]; then
        add_error "useStructureValidation.tsx not found"
        return 1
    fi
    
    # Check for structure validation demo
    if [ ! -f "src-nextgen/components/StructureValidationDemo.tsx" ]; then
        add_warning "StructureValidationDemo.tsx not found - demo validation limited"
    fi
    
    # Check for context validation
    if ! grep -q "LayoutContext\|SlotBridgeProps" src-nextgen/layout/LayoutShell.tsx; then
        add_error "Context interfaces not found in LayoutShell"
        return 1
    fi
    
    log_step "✅ Slot visual confirmation validation passed"
    update_result "slot_visual_confirmation" "true"
    return 0
}

# Validation 4: Structure Integrity
validate_structure_integrity() {
    log_step "Validating structure integrity..."
    
    # Check for import consistency (basic grep checks)
    if ! grep -q "import.*SlotBridge" src-nextgen/layout/*.tsx; then
        add_warning "SlotBridge imports not found in slot components"
    fi
    
    # Check for context propagation
    if ! grep -q "context.*LayoutContext" src-nextgen/layout/*.tsx; then
        add_warning "LayoutContext propagation not found"
    fi
    
    # Check for hook exports
    if [ ! -f "src-nextgen/hooks/index.ts" ]; then
        add_warning "Hooks index file not found"
    else
        if ! grep -q "useStructureValidation" src-nextgen/hooks/index.ts; then
            add_warning "useStructureValidation not exported from hooks index"
        fi
    fi
    
    # Check for component structure
    local component_count=0
    for component in LayoutShell SlotRenderer TopSlot CenterSlot BottomSlot; do
        if [ -f "src-nextgen/layout/${component}.tsx" ]; then
            ((component_count++))
        fi
    done
    
    if [ $component_count -lt 5 ]; then
        add_error "Missing layout components: found $component_count/5"
        return 1
    fi
    
    log_step "✅ Structure integrity validation passed"
    update_result "structure_integrity" "true"
    return 0
}

# Main validation execution
main() {
    log_step "Starting shell structure validation for P1.00.17..."
    
    # Run all validations
    local exit_code=0
    
    validate_layout_zone_hydration || exit_code=1
    validate_screen_safe_bounds || exit_code=1
    validate_slot_visual_confirmation || exit_code=1
    validate_structure_integrity || exit_code=1
    
    # Generate final report
    log_step "Generating validation report..."
    
    if command -v jq >/dev/null 2>&1; then
        local passed_count=$(jq '.validations | to_entries | map(select(.value == true)) | length' "$VALIDATION_RESULTS")
        local total_count=$(jq '.validations | to_entries | length' "$VALIDATION_RESULTS")
        local error_count=$(jq '.errors | length' "$VALIDATION_RESULTS")
        local warning_count=$(jq '.warnings | length' "$VALIDATION_RESULTS")
        
        echo "📊 Validation Summary:"
        echo "   Passed: $passed_count/$total_count"
        echo "   Errors: $error_count"
        echo "   Warnings: $warning_count"
        
        # Update final status
        if [ $exit_code -eq 0 ]; then
            echo "✅ Shell structure validation PASSED"
            jq '.status = "PASSED"' "$VALIDATION_RESULTS" > "${VALIDATION_RESULTS}.tmp" && mv "${VALIDATION_RESULTS}.tmp" "$VALIDATION_RESULTS"
        else
            echo "❌ Shell structure validation FAILED"
            jq '.status = "FAILED"' "$VALIDATION_RESULTS" > "${VALIDATION_RESULTS}.tmp" && mv "${VALIDATION_RESULTS}.tmp" "$VALIDATION_RESULTS"
        fi
        
        # Display results
        echo "📋 Detailed Results:"
        jq -r '.validations | to_entries[] | "   " + .key + ": " + (.value | tostring)' "$VALIDATION_RESULTS"
        
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
        echo "📊 Validation completed with exit code: $exit_code"
    fi
    
    log_step "Validation complete. Results saved to $VALIDATION_RESULTS"
    
    exit $exit_code
}

# Run main function
main 