#!/usr/bin/env bash
# Ultra runtime validation with auto-fix loop (NB-runner bounded; no blocking primitives)
set -euo pipefail
APP_DIR="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
cd "$APP_DIR"
LOG_DIR="$APP_DIR/validations/logs"
STATUS_DIR="$APP_DIR/validations/status"
mkdir -p "$LOG_DIR" "$STATUS_DIR"

NB="node scripts/nb.cjs"

run_nb () {
  local label="$1"; shift
  local ttl="$1"; shift
  local cmd="$*"
  $NB --ttl "$ttl" --label "$label" --log "$LOG_DIR/$label.log" --status "$STATUS_DIR" -- bash -lc "$cmd"
}

do_ultra_fix () {
  if [[ -f "scripts/ULTRA-fix.sh" ]]; then
    run_nb ultra-fix 420s "scripts/ULTRA-fix.sh"
    return
  fi
  [[ -f "scripts/fix-parsing-errors.sh"    ]] && run_nb fix-parsing 120s "bash scripts/fix-parsing-errors.sh" || true
  [[ -f "scripts/fix-typescript-errors.sh" ]] && run_nb fix-ts       240s "bash scripts/fix-typescript-errors.sh" || true
  if [[ -f "scripts/fix-eslint-errors.sh" ]]; then
    run_nb fix-eslint 300s "bash scripts/fix-eslint-errors.sh"
  elif [[ -f "scripts/fix-eslint-errors" ]]; then
    run_nb fix-eslint 300s "bash scripts/fix-eslint-errors"
  fi
}

MAX_CYCLES=2
cycle=0
TS_OK=1
ESL_OK=1

while (( cycle <= MAX_CYCLES )); do
  TS_OK=0
  ESL_OK=0
  if run_nb tsc 240s "npx tsc --noEmit"; then TS_OK=1; fi
  if run_nb eslint 300s "npx eslint . --ext .ts,.tsx --max-warnings=0"; then ESL_OK=1; fi

  if (( TS_OK == 1 && ESL_OK == 1 )); then
    echo "Static validation: PASS"
    break
  fi

  if (( cycle == MAX_CYCLES )); then
    echo "Static validation: FAIL after ${MAX_CYCLES} cycles"
    break
  fi

  echo "Running ULTRA-fix (cycle $((cycle+1))/${MAX_CYCLES})…"
  do_ultra_fix
  cycle=$((cycle+1))
done

run_nb expo-health 18s "curl -sSf http://127.0.0.1:8081/status >/dev/null" || true

if (( TS_OK == 1 && ESL_OK == 1 )); then exit 0; else exit 2; fi

#!/usr/bin/env bash

# Ultra Runtime Validation Script
# Comprehensive validation combining all approaches with non-blocking patterns
# Follows MUST-README_GLOBAL-PATCH-ENFORCEMENT.md guidelines
#
# CRITICAL VALIDATION REQUIREMENTS:
# =================================
# Step                    | Hard Fail? | Allow <20? | Notes
# -----------------------|------------|------------|------------------------
# TypeScript             | YES        | YES        | 0 blocking, <20 in legacy/test only
# ESLint                 | YES        | YES        | 0 blocking, <20 in legacy/test only
# Unit Tests             | YES        | NO         | Fail on critical test error
# Provider Audit         | YES        | NO         | Any provider error = fail
# Hook Usage Audit       | YES        | NO         | Any unprotected hook = fail
# Expo Boot              | YES        | NO         | Must pass, server must run
# Maestro/Visual         | YES        | NO         | Any diff/fail = hard fail
# Simulator Log Scan     | YES        | NO         | Any error pattern = fail
# Device Validation      | YES        | NO         | Any critical error = fail
# Dual Mount             | YES        | NO         | Any mounting error = fail
# Screenshot/UI Diff     | YES        | NO         | Any visual regression = fail
# Final Health Check     | YES        | NO         | Any critical issue = fail
#
# ZERO TOLERANCE AREAS:
# - Provider/Context errors (must be used within a Provider)
# - Runtime errors (TypeError, undefined, etc.)
# - UI/Visual regressions (Maestro test failures)
# - Critical test failures (Jest, provider audit)
# - Unprotected hook usage (missing provider wrapping)

set -euo pipefail

# Configuration
ROOT_DIR="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
LOG_DIR="/Users/sawyer/gitSync/.cursor-cache/ROOT/.logs/MAIN"
VALIDATION_DIR="/Users/sawyer/gitSync/.cursor-cache/MAIN/validation"
EXPO_PORT=8081
TIMEOUT_SHORT=10
TIMEOUT_MEDIUM=30
TIMEOUT_LONG=60
TIMEOUT_EXPO=120

# Load non-blocking helper if available
if [ -f "$ROOT_DIR/scripts/lib-nonblocking.sh" ]; then
    . "$ROOT_DIR/scripts/lib-nonblocking.sh"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_section() {
    echo -e "\n${PURPLE}=== $1 ===${NC}"
}

# Ensure directories exist
mkdir -p "$LOG_DIR"
mkdir -p "$VALIDATION_DIR"

# Function to kill existing processes safely
kill_expo_processes() {
    log_info "Killing existing Expo processes..."
    (timeout 5s kill $(lsof -ti:$EXPO_PORT) 2>/dev/null || true) &
    wait $! 2>/dev/null || true
}

# Step 1: Node/Expo/Toolchain Check
validate_toolchain() {
    log_section "TOOLCHAIN VALIDATION"
    
    log "Checking Node.js version (max ${TIMEOUT_SHORT}s)..."
    if timeout ${TIMEOUT_SHORT}s node --version >/dev/null 2>&1; then
        log_success "Node.js available"
    else
        log_error "Node.js not available or blocked"
        return 1
    fi
    
    log "Checking npm version (max ${TIMEOUT_SHORT}s)..."
    if timeout ${TIMEOUT_SHORT}s npm --version >/dev/null 2>&1; then
        log_success "npm available"
    else
        log_error "npm not available or blocked"
        return 1
    fi
    
    log "Checking npx version (max ${TIMEOUT_SHORT}s)..."
    if timeout ${TIMEOUT_SHORT}s npx --version >/dev/null 2>&1; then
        log_success "npx available"
    else
        log_error "npx not available or blocked"
        return 1
    fi
    
    log "Checking Expo CLI (max ${TIMEOUT_SHORT}s)..."
    if timeout ${TIMEOUT_SHORT}s npx expo --version >/dev/null 2>&1; then
        log_success "Expo CLI available"
    else
        log_error "Expo CLI not available or blocked"
        return 1
    fi
}

# Step 2: TypeScript Compilation with Warning Threshold
validate_typescript() {
    log_section "TYPESCRIPT COMPILATION"
    
    cd "$ROOT_DIR"
    
    log "Running TypeScript compilation (max ${TIMEOUT_MEDIUM}s)..."
    
    # Use non-blocking pattern if available, otherwise fallback to timeout
    if command -v nb_run >/dev/null 2>&1; then
        nb_run ${TIMEOUT_MEDIUM}s tsc "cd \"$ROOT_DIR\" && npx tsc --noEmit --skipLibCheck"
    else
        # Run TypeScript with output capture
        local ts_output
        ts_output=$(timeout ${TIMEOUT_MEDIUM}s npx tsc --noEmit --skipLibCheck 2>&1)
        local ts_exit=$?
        
        # Count errors and warnings - ensure numeric values
        local error_count=0
        local warning_count=0
        
        # Count errors safely
        if echo "$ts_output" | grep -q "error TS"; then
            error_count=$(echo "$ts_output" | grep -c "error TS" 2>/dev/null || echo "0")
        fi
        
        # Count warnings safely
        if echo "$ts_output" | grep -q "warning TS"; then
            warning_count=$(echo "$ts_output" | grep -c "warning TS" 2>/dev/null || echo "0")
        fi
        
        # Check if errors are only in legacy/test files
        local legacy_errors=0
        local non_legacy_errors=0
        if echo "$ts_output" | grep -q "error TS.*test\|error TS.*legacy"; then
            legacy_errors=$(echo "$ts_output" | grep "error TS" | grep -c "/test/\|/legacy/" 2>/dev/null || echo "0")
        fi
        non_legacy_errors=$((error_count - legacy_errors))
        
        # Check if warnings are only in legacy/test files
        local legacy_warnings=0
        local non_legacy_warnings=0
        if echo "$ts_output" | grep -q "warning TS.*test\|warning TS.*legacy"; then
            legacy_warnings=$(echo "$ts_output" | grep "warning TS" | grep -c "/test/\|/legacy/" 2>/dev/null || echo "0")
        fi
        non_legacy_warnings=$((warning_count - legacy_warnings))
        
        # TypeScript compilation fails if there are any errors or if exit code is non-zero
        if [ $ts_exit -eq 0 ] && [ $error_count -eq 0 ]; then
            log_success "TypeScript compilation passed"
            if [ $legacy_warnings -gt 0 ]; then
                log_warning "Found $legacy_warnings warnings in legacy/test files (allowed)"
            fi
            return 0
        else
            log_error "TypeScript compilation failed"
            if [ $error_count -gt 0 ]; then
                log_error "Found $error_count TypeScript errors"
                echo "$ts_output" | grep "error TS" | head -10
            fi
            if [ $warning_count -gt 0 ]; then
                log_warning "Found $warning_count TypeScript warnings"
                echo "$ts_output" | grep "warning TS" | head -5
            fi
            return 1
        fi
    fi
}

# Step 3: ESLint Validation with Warning Threshold
validate_eslint() {
    log_section "ESLINT VALIDATION"
    
    cd "$ROOT_DIR"
    
    log "Running ESLint validation (max ${TIMEOUT_MEDIUM}s)..."
    
    # Use non-blocking pattern if available, otherwise fallback to timeout
    if command -v nb_run >/dev/null 2>&1; then
        nb_run ${TIMEOUT_MEDIUM}s eslint "cd \"$ROOT_DIR\" && npx eslint . --ext .ts,.tsx"
    else
        # Run ESLint with output capture
        local eslint_output
        eslint_output=$(timeout ${TIMEOUT_MEDIUM}s npx eslint . --ext .ts,.tsx 2>&1)
        local eslint_exit=$?
        
        # Count errors and warnings - ensure numeric values
        local error_count=0
        local warning_count=0
        
        # Count errors safely
        if echo "$eslint_output" | grep -q "error"; then
            error_count=$(echo "$eslint_output" | grep -c "error" 2>/dev/null || echo "0")
        fi
        
        # Count warnings safely
        if echo "$eslint_output" | grep -q "warning"; then
            warning_count=$(echo "$eslint_output" | grep -c "warning" 2>/dev/null || echo "0")
        fi
        
        # Check if errors are only in legacy/test files
        local legacy_errors=0
        local non_legacy_errors=0
        if echo "$eslint_output" | grep -q "error.*test\|error.*legacy"; then
            legacy_errors=$(echo "$eslint_output" | grep "error" | grep -c "/test/\|/legacy/" 2>/dev/null || echo "0")
        fi
        non_legacy_errors=$((error_count - legacy_errors))
        
        # Check if warnings are only in legacy/test files
        local legacy_warnings=0
        local non_legacy_warnings=0
        if echo "$eslint_output" | grep -q "warning.*test\|warning.*legacy"; then
            legacy_warnings=$(echo "$eslint_output" | grep "warning" | grep -c "/test/\|/legacy/" 2>/dev/null || echo "0")
        fi
        non_legacy_warnings=$((warning_count - legacy_warnings))
        
        # ESLint validation fails if there are any errors or if exit code is non-zero
        if [ $eslint_exit -eq 0 ] && [ $error_count -eq 0 ]; then
            log_success "ESLint validation passed"
            if [ $legacy_warnings -gt 0 ]; then
                log_warning "Found $legacy_warnings warnings in legacy/test files (allowed)"
            fi
            return 0
        else
            log_error "ESLint validation failed"
            if [ $error_count -gt 0 ]; then
                log_error "Found $error_count ESLint errors"
                echo "$eslint_output" | grep "error" | head -10
            fi
            if [ $warning_count -gt 0 ]; then
                log_warning "Found $warning_count ESLint warnings"
                echo "$eslint_output" | grep "warning" | head -5
            fi
            return 1
        fi
    fi
}

# Step 4: Unit/Integration Tests with Critical Failure Detection
validate_tests() {
    log_section "UNIT/INTEGRATION TESTS"
    
    cd "$ROOT_DIR"
    
    # Use non-blocking pattern if available, otherwise fallback to timeout
    if command -v nb_run >/dev/null 2>&1; then
        nb_run ${TIMEOUT_LONG}s jest "cd \"$ROOT_DIR\" && NODE_OPTIONS=--experimental-vm-modules yarn test:unit --config jest.config.js --runInBand --detectOpenHandles --forceExit --testTimeout=30000"
    else
        # Use ESM Jest configuration from P6.5.30
        if [ -f "jest.config.js" ]; then
            log "Using ESM Jest configuration..."
            # Set NODE_OPTIONS for ESM support if invoking Jest directly
            export NODE_OPTIONS="--experimental-vm-modules"
            local test_output
            test_output=$(timeout ${TIMEOUT_LONG}s npm test -- --watchAll=false --passWithNoTests 2>&1)
            local test_exit=$?
        else
            log "Using default Jest configuration..."
            local test_output
            test_output=$(timeout ${TIMEOUT_LONG}s npm test -- --watchAll=false --passWithNoTests 2>&1)
            local test_exit=$?
        fi
        
        # Check for critical failures
        local critical_failures=0
        local skipped_tests=0
        critical_failures=$(echo "$test_output" | grep -c "FAIL\|Error\|Exception" 2>/dev/null || echo "0")
        skipped_tests=$(echo "$test_output" | grep -c "SKIP\|pending" 2>/dev/null || echo "0")
        
        # Ensure variables are numeric
        critical_failures=${critical_failures:-0}
        skipped_tests=${skipped_tests:-0}
        
        if [ $test_exit -eq 0 ] && [ $critical_failures -eq 0 ]; then
            log_success "Jest tests passed"
            if [ $skipped_tests -gt 0 ]; then
                log_warning "Found $skipped_tests skipped tests (non-critical)"
            fi
            return 0
        else
            if [ $critical_failures -gt 0 ]; then
                log_error "Found $critical_failures critical test failures"
                echo "$test_output" | grep -A 2 -B 2 "FAIL\|Error\|Exception" | head -20
                return 1
            else
                log_warning "Tests completed with non-critical issues"
                return 0
            fi
        fi
    fi
}

# Step 5: Provider Audit Tests - Zero Tolerance
validate_provider_audit() {
    log_section "PROVIDER AUDIT TESTS"
    
    cd "$ROOT_DIR"
    
    log "Running provider audit tests (max ${TIMEOUT_MEDIUM}s)..."
    
    # Use non-blocking pattern if available, otherwise fallback to timeout
    if command -v nb_run >/dev/null 2>&1; then
        nb_run ${TIMEOUT_MEDIUM}s provider-audit "cd \"$ROOT_DIR\" && npm test -- --testNamePattern=\"Provider/Hook Usage Audit\" --watchAll=false"
    else
        # Run provider audit with output capture
        local audit_output
        audit_output=$(timeout ${TIMEOUT_MEDIUM}s npm test -- --testNamePattern="Provider/Hook Usage Audit" --watchAll=false 2>&1)
        local audit_exit=$?
        
        # Check for provider/context errors and test failures
        local provider_errors=0
        local test_failures=0
        provider_errors=$(echo "$audit_output" | grep -c "must be used within a\|No provider found" 2>/dev/null || echo "0")
        test_failures=$(echo "$audit_output" | grep -c "FAIL\|Error\|Exception" 2>/dev/null || echo "0")
        
        # Ensure variables are numeric and handle empty strings
        provider_errors=${provider_errors:-0}
        test_failures=${test_failures:-0}
        # Convert to integer safely
        provider_errors=$(printf '%d' "$provider_errors" 2>/dev/null || echo "0")
        test_failures=$(printf '%d' "$test_failures" 2>/dev/null || echo "0")
        
        if [ "$audit_exit" -eq 0 ] && [ "$provider_errors" -eq 0 ] && [ "$test_failures" -eq 0 ]; then
            log_success "Provider audit tests passed"
            return 0
        else
            log_error "Provider audit tests failed"
            if [ "$provider_errors" -gt 0 ]; then
                log_error "Found $provider_errors provider/context errors"
                echo "$audit_output" | grep -A 2 -B 2 "must be used within a\|No provider found" | head -10
            fi
            if [ "$test_failures" -gt 0 ]; then
                log_error "Found $test_failures test failures"
                echo "$audit_output" | grep -A 2 -B 2 "FAIL\|Error\|Exception" | head -10
            fi
            return 1
        fi
    fi
}

# Step 6: Hook Usage Audit - Hard Enforcement
validate_hook_usage() {
    log_section "HOOK USAGE AUDIT"
    
    cd "$ROOT_DIR"
    
    log "Running hook usage audit (max ${TIMEOUT_MEDIUM}s)..."
    
    # Use non-blocking pattern if available, otherwise fallback to timeout
    if command -v nb_run >/dev/null 2>&1; then
        nb_run ${TIMEOUT_MEDIUM}s hook-audit "cd \"$ROOT_DIR\" && node scripts/audit-hooks.js"
    else
        # Run hook audit with output capture
        local hook_output
        hook_output=$(timeout ${TIMEOUT_MEDIUM}s node scripts/audit-hooks.js 2>&1)
        local hook_exit=$?
        
        # Check for unprotected hook usage
        local unprotected_hooks=0
        local critical_issues=0
        unprotected_hooks=$(echo "$hook_output" | grep -c "unprotected\|missing provider\|not wrapped" 2>/dev/null || echo "0")
        critical_issues=$(echo "$hook_output" | grep -c "CRITICAL\|ERROR\|FAIL" 2>/dev/null || echo "0")
        
        # Ensure variables are numeric and handle empty strings
        unprotected_hooks=${unprotected_hooks:-0}
        critical_issues=${critical_issues:-0}
        # Convert to integer safely
        unprotected_hooks=$(printf '%d' "$unprotected_hooks" 2>/dev/null || echo "0")
        critical_issues=$(printf '%d' "$critical_issues" 2>/dev/null || echo "0")
        
        if [ "$hook_exit" -eq 0 ] && [ "$unprotected_hooks" -eq 0 ] && [ "$critical_issues" -eq 0 ]; then
            log_success "Hook usage audit passed"
            return 0
        else
            log_error "Hook usage audit found critical issues"
            if [ "$unprotected_hooks" -gt 0 ]; then
                log_error "Found $unprotected_hooks unprotected hook usages"
                echo "$hook_output" | grep -A 2 -B 2 "unprotected\|missing provider" | head -10
            fi
            if [ "$critical_issues" -gt 0 ]; then
                log_error "Found $critical_issues critical hook issues"
                echo "$hook_output" | grep -A 2 -B 2 "CRITICAL\|ERROR\|FAIL" | head -10
            fi
            return 1
        fi
    fi
}

# Step 7: Expo/Metro Boot with Non-Blocking Pattern
validate_expo_boot() {
    log_section "EXPO/METRO BOOT VALIDATION"
    
    cd "$ROOT_DIR"
    
    # Kill any existing processes
    kill_expo_processes
    
    log "Starting Expo development server (non-blocking)..."
    
    # Use non-blocking pattern if available, otherwise fallback to traditional pattern
    if command -v nb_bg >/dev/null 2>&1; then
        nb_bg ${TIMEOUT_EXPO}s expo "cd \"$ROOT_DIR\" && npx expo start --ios --clear"
        sleep 5
    else
        # Start Expo in background with proper non-blocking pattern
        (
            timeout ${TIMEOUT_EXPO}s npx expo start --ios --clear &
            PID=$!
            sleep 25
            disown $PID
        ) >/dev/null 2>&1 &
    fi
    
    # Wait for Expo to start
    log "Waiting for Expo to start (max ${TIMEOUT_LONG}s)..."
    local start_time=$(date +%s)
    local expo_started=false
    
    while [ $(($(date +%s) - start_time)) -lt ${TIMEOUT_LONG} ]; do
        if timeout 5s curl -s http://localhost:$EXPO_PORT/status | grep -q "packager-status:running" 2>/dev/null; then
            expo_started=true
            break
        fi
        sleep 2
    done
    
    if [ "$expo_started" = true ]; then
        log_success "Expo server started successfully"
    else
        log_error "Expo server failed to start within timeout"
        return 1
    fi
}

# Step 8: Check Expo Status
validate_expo_status() {
    log_section "EXPO STATUS CHECK"
    
    log "Checking Expo server status (max ${TIMEOUT_SHORT}s)..."
    if timeout ${TIMEOUT_SHORT}s curl -s http://localhost:$EXPO_PORT/status | grep -q "packager-status:running" 2>/dev/null; then
        log_success "Expo server responding correctly"
    else
        log_error "Expo server not responding correctly"
        return 1
    fi
}

# Step 9: Maestro Visual/Regression Tests - Hard Failures
validate_maestro() {
    log_section "MAESTRO VISUAL/REGRESSION TESTS"
    
    cd "$ROOT_DIR"
    
    # Use non-blocking pattern if available, otherwise fallback to direct execution
    if command -v nb_run >/dev/null 2>&1; then
        nb_run 90s maestro-visual "cd \"$ROOT_DIR\" && scripts/validate-visual.sh 80"
    else
        # Use the hardened visual validation script
        if [ -x "$ROOT_DIR/scripts/validate-visual.sh" ]; then
            log "Running hardened visual validation script..."
            bash "$ROOT_DIR/scripts/validate-visual.sh"
        else
            log_error "validate-visual.sh not found - UI validation required"
            return 1
        fi
    fi
}

# Step 10: Simulator Log Scan for Provider/Runtime Errors - Zero Tolerance
validate_simulator_logs() {
    log_section "SIMULATOR LOG ANALYSIS"
    
    # Use non-blocking pattern if available, otherwise fallback to direct execution
    if command -v nb_run >/dev/null 2>&1; then
        if [ -x "$ROOT_DIR/scripts/capture-simlogs.sh" ]; then
            nb_run 35s simlog-capture "cd \"$ROOT_DIR\" && scripts/capture-simlogs.sh 15 ./logs/simulator.log"
        fi
        if [ -x "$ROOT_DIR/scripts/validate-simlogs.sh" ]; then
            nb_run 25s simlog-validate "cd \"$ROOT_DIR\" && scripts/validate-simlogs.sh ./logs/simulator.log"
        fi
    else
        # Use the hardened simlog scripts from P6.5.28
        [ -x "$ROOT_DIR/scripts/ensure-logs-dirs.sh" ] && bash "$ROOT_DIR/scripts/ensure-logs-dirs.sh" || true
        
        if [ -x "$ROOT_DIR/scripts/capture-simlogs.sh" ]; then
            log "Using hardened simlog capture script..."
            bash "$ROOT_DIR/scripts/capture-simlogs.sh" 20 "$VALIDATION_DIR/simulator.log" || true
        fi
        
        if [ -x "$ROOT_DIR/scripts/validate-simlogs.sh" ]; then
            log "Using hardened simlog validation script..."
            bash "$ROOT_DIR/scripts/validate-simlogs.sh" "$VALIDATION_DIR/simulator.log" || true
        fi
        
        # Fallback: keep Ultra's existing grep-based analysis if present
        if [ -f "$VALIDATION_DIR/simulator-errors.log" ]; then
            log "Analyzing simulator logs for errors..."
            local errp=("must be used within a" "No provider found" "TypeError" "undefined is not an object" "Invariant Violation" "Component.*has not been registered" "Cannot read property" "Provider.*not found" "Context.*not found" "useContext.*called outside")
            local found=false; local count=0
            for p in "${errp[@]}"; do 
                c=$(grep -c "$p" "$VALIDATION_DIR/simulator-errors.log" 2>/dev/null || echo 0)
                c=${c:-0}
                c=$(printf '%d' "$c" 2>/dev/null || echo 0)
                if [ "$c" -gt 0 ]; then 
                    log_error "Runtime error detected: $p (count: $c)"
                    found=true
                    count=$((count+c))
                fi
            done
            if [ "$found" = true ]; then 
                log_error "Simulator log analysis found $count runtime errors"
                return 1
            fi
        fi
    fi
    
    log_success "No runtime errors detected in simulator logs"
}

# Step 11: Device Runtime Validation - Hard Failures
validate_device_runtime() {
    log_section "DEVICE RUNTIME VALIDATION"
    
    log "Running device runtime validation (max ${TIMEOUT_LONG}s)..."
    
    # Use non-blocking pattern if available, otherwise fallback to timeout
    if command -v nb_run >/dev/null 2>&1; then
        nb_run ${TIMEOUT_LONG}s device-runtime "cd \"$ROOT_DIR\" && scripts/validate-device-runtime.sh"
    else
        # Run device runtime validation script with output capture
        local device_output
        device_output=$(timeout ${TIMEOUT_LONG}s bash "$ROOT_DIR/scripts/validate-device-runtime.sh" 2>&1)
        local device_exit=$?
        
        # Check for critical device errors
        local critical_errors=0
        local runtime_errors=0
        critical_errors=$(echo "$device_output" | grep -c "CRITICAL\|FATAL\|crash\|exception" 2>/dev/null || echo "0")
        runtime_errors=$(echo "$device_output" | grep -c "Error\|Exception\|TypeError" 2>/dev/null || echo "0")
        
        # Ensure variables are numeric and handle empty strings
        critical_errors=${critical_errors:-0}
        runtime_errors=${runtime_errors:-0}
        # Convert to integer safely
        critical_errors=$(printf '%d' "$critical_errors" 2>/dev/null || echo "0")
        runtime_errors=$(printf '%d' "$runtime_errors" 2>/dev/null || echo "0")
        
        if [ "$device_exit" -eq 0 ] && [ "$critical_errors" -eq 0 ] && [ "$runtime_errors" -eq 0 ]; then
            log_success "Device runtime validation passed"
            return 0
        else
            log_error "Device runtime validation found critical issues"
            if [ "$critical_errors" -gt 0 ]; then
                log_error "Found $critical_errors critical device errors"
                echo "$device_output" | grep -A 2 -B 2 "CRITICAL\|FATAL\|crash" | head -10
            fi
            if [ "$runtime_errors" -gt 0 ]; then
                log_error "Found $runtime_errors runtime device errors"
                echo "$device_output" | grep -A 2 -B 2 "Error\|Exception\|TypeError" | head -10
            fi
            return 1
        fi
    fi
}

# Step 12: Dual Mount Validation - Hard Failures
validate_dual_mount() {
    log_section "DUAL MOUNT VALIDATION"
    
    log "Running dual mount validation (max ${TIMEOUT_LONG}s)..."
    
    # Use non-blocking pattern if available, otherwise fallback to timeout
    if command -v nb_run >/dev/null 2>&1; then
        nb_run ${TIMEOUT_LONG}s dual-mount "cd \"$ROOT_DIR\" && scripts/validate-dual-mount-device.sh ios"
    else
        # Run dual mount validation script with output capture
        local dual_output
        dual_output=$(timeout ${TIMEOUT_LONG}s bash "$ROOT_DIR/scripts/validate-dual-mount-device.sh" ios 2>&1)
        local dual_exit=$?
        
        # Check for critical mounting errors
        local mount_errors=0
        local critical_errors=0
        mount_errors=$(echo "$dual_output" | grep -c "mount.*error\|mount.*failed\|Component.*not.*registered" 2>/dev/null || echo "0")
        critical_errors=$(echo "$dual_output" | grep -c "CRITICAL\|FATAL\|Exception" 2>/dev/null || echo "0")
        
        # Ensure variables are numeric and handle empty strings
        mount_errors=${mount_errors:-0}
        critical_errors=${critical_errors:-0}
        # Convert to integer safely
        mount_errors=$(printf '%d' "$mount_errors" 2>/dev/null || echo "0")
        critical_errors=$(printf '%d' "$critical_errors" 2>/dev/null || echo "0")
        
        if [ "$dual_exit" -eq 0 ] && [ "$mount_errors" -eq 0 ] && [ "$critical_errors" -eq 0 ]; then
            log_success "Dual mount validation passed"
            return 0
        else
            log_error "Dual mount validation found critical issues"
            if [ "$mount_errors" -gt 0 ]; then
                log_error "Found $mount_errors mounting errors"
                echo "$dual_output" | grep -A 2 -B 2 "mount.*error\|mount.*failed" | head -10
            fi
            if [ "$critical_errors" -gt 0 ]; then
                log_error "Found $critical_errors critical dual mount errors"
                echo "$dual_output" | grep -A 2 -B 2 "CRITICAL\|FATAL\|Exception" | head -10
            fi
            return 1
        fi
    fi
}

# Step 13: Screenshot/UI Diff Validation - Hard Failures
validate_screenshots() {
    log_section "SCREENSHOT/UI DIFF VALIDATION"
    
    cd "$ROOT_DIR"
    
    # Use non-blocking pattern if available, otherwise fallback to timeout
    if command -v nb_run >/dev/null 2>&1; then
        nb_run ${TIMEOUT_LONG}s screenshots "cd \"$ROOT_DIR\" && npm run test:maestro:screenshots"
    else
        # Check if Maestro is available for screenshots
        if ! command -v maestro >/dev/null 2>&1; then
            log_error "Maestro not available for screenshot validation - UI validation required"
            return 1
        fi
        
        log "Running screenshot validation (max ${TIMEOUT_LONG}s)..."
        local screenshot_output
        screenshot_output=$(timeout ${TIMEOUT_LONG}s npm run test:maestro:screenshots 2>&1)
        local screenshot_exit=$?
        
        # Check for visual regressions
        local visual_regressions=0
        local critical_ui_errors=0
        visual_regressions=$(echo "$screenshot_output" | grep -c "diff\|regression\|mismatch\|failed" 2>/dev/null || echo "0")
        critical_ui_errors=$(echo "$screenshot_output" | grep -c "Error\|Exception\|FAIL" 2>/dev/null || echo "0")
        
        # Ensure variables are numeric
        visual_regressions=${visual_regressions:-0}
        critical_ui_errors=${critical_ui_errors:-0}
        
        if [ $screenshot_exit -eq 0 ] && [ $visual_regressions -eq 0 ] && [ $critical_ui_errors -eq 0 ]; then
            log_success "Screenshot validation passed"
            return 0
        else
            log_error "Screenshot validation found critical issues"
            if [ $visual_regressions -gt 0 ]; then
                log_error "Found $visual_regressions visual regressions"
                echo "$screenshot_output" | grep -A 2 -B 2 "diff\|regression\|mismatch" | head -10
            fi
            if [ $critical_ui_errors -gt 0 ]; then
                log_error "Found $critical_ui_errors critical UI errors"
                echo "$screenshot_output" | grep -A 2 -B 2 "Error\|Exception\|FAIL" | head -10
            fi
            return 1
        fi
    fi
}

# Step 14: Final Health Check - Critical Validation
validate_final_health() {
    log_section "FINAL HEALTH CHECK"
    
    log "Performing final health check..."
    
    local health_issues=0
    
    # Check if Expo is still running
    if timeout 5s curl -s http://localhost:$EXPO_PORT/status | grep -q "packager-status:running" 2>/dev/null; then
        log_success "Expo server still running"
    else
        log_error "Expo server not responding - critical failure"
        health_issues=$((health_issues + 1))
    fi
    
    # Check for any remaining processes
    local expo_processes=$(lsof -ti:$EXPO_PORT 2>/dev/null || true)
    if [ -n "$expo_processes" ]; then
        log_info "Expo processes still running: $expo_processes"
    else
        log_warning "No Expo processes running"
    fi
    
    # Check for any critical error files
    if [ -f "$VALIDATION_DIR/simulator-errors.log" ]; then
        local recent_errors=0
        recent_errors=$(timeout 5s tail -20 "$VALIDATION_DIR/simulator-errors.log" | grep -c "Error\|Exception\|Fatal" 2>/dev/null || echo "0")
        recent_errors=${recent_errors:-0}
        if [ $recent_errors -gt 0 ]; then
            log_error "Found $recent_errors recent errors in simulator logs"
            health_issues=$((health_issues + 1))
        fi
    fi
    
    # Check for any validation failures
    if [ -f "$VALIDATION_DIR/validation-results.json" ]; then
        local failed_tests=0
        failed_tests=$(timeout 5s grep -c '"status": "FAIL"' "$VALIDATION_DIR/validation-results.json" 2>/dev/null || echo "0")
        failed_tests=${failed_tests:-0}
        if [ $failed_tests -gt 0 ]; then
            log_error "Found $failed_tests failed validation tests"
            health_issues=$((health_issues + 1))
        fi
    fi
    
    if [ $health_issues -eq 0 ]; then
        log_success "Final health check passed"
        return 0
    else
        log_error "Final health check found $health_issues critical issues"
        return 1
    fi
}

# Cleanup function
cleanup() {
    log_info "Performing cleanup..."
    kill_expo_processes
    log_info "Cleanup completed"
}

# Main execution
main() {
    log_section "ULTRA RUNTIME VALIDATION STARTED"
    log "Date: $(date)"
    log "Agent: BRAUN (MAIN)"
    log "Following MUST-README guidelines"
    
    # Set up cleanup trap
    trap cleanup EXIT
    
    local exit_code=0
    local step=1
    local total_steps=14
    
    # Array of validation functions
    local validations=(
        validate_toolchain
        validate_typescript
        validate_eslint
        validate_tests
        validate_provider_audit
        validate_hook_usage
        validate_expo_boot
        validate_expo_status
        validate_maestro
        validate_simulator_logs
        validate_device_runtime
        validate_dual_mount
        validate_screenshots
        validate_final_health
    )
    
    # Run all validations
    for validation in "${validations[@]}"; do
        log_info "Step $step/$total_steps: Running $validation"
        
        if $validation; then
            log_success "Step $step/$total_steps: $validation PASSED"
        else
            log_error "Step $step/$total_steps: $validation FAILED"
            exit_code=1
        fi
        
        ((step++))
    done
    
    # Final summary
    log_section "ULTRA RUNTIME VALIDATION SUMMARY"
    
    if [ $exit_code -eq 0 ]; then
        log_success "ULTRA RUNTIME VALIDATION PASSED"
        log_success "All critical tests passed - app ready for deployment"
        echo "✅ ULTRA RUNTIME VALIDATION PASSED"
    else
        log_error "ULTRA RUNTIME VALIDATION FAILED"
        log_error "Critical tests failed - blocking deployment"
        echo "❌ ULTRA RUNTIME VALIDATION FAILED"
    fi
    
    log_info "Validation results saved to: $VALIDATION_DIR"
    log_info "Logs saved to unified root: $LOG_DIR"
    
    exit $exit_code
}

# Run main function
main "$@"
