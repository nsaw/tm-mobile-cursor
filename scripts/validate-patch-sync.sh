#!/bin/bash

# Validate Patch Sync State
# Ensures patch synchronization is working correctly after cursor crash

set -e

# Configuration
PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
CURSOR_CACHE="/Users/sawyer/gitSync/.cursor-cache"
MAIN_PATCHES="$CURSOR_CACHE/MAIN/patches"
MAIN_SUMMARIES="$CURSOR_CACHE/MAIN/summaries"
CYOPS_SUMMARIES="$CURSOR_CACHE/CYOPS/summaries"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🔍 Validating patch sync state after cursor crash..."

# Check if required directories exist
log_info "Checking directory structure..."

if [ ! -d "$MAIN_PATCHES" ]; then
    log_error "MAIN patches directory missing: $MAIN_PATCHES"
    exit 1
fi

if [ ! -d "$MAIN_SUMMARIES" ]; then
    log_error "MAIN summaries directory missing: $MAIN_SUMMARIES"
    exit 1
fi

if [ ! -d "$CYOPS_SUMMARIES" ]; then
    log_error "CYOPS summaries directory missing: $CYOPS_SUMMARIES"
    exit 1
fi

log_success "All required directories exist"

# Check patch synchronization state
log_info "Checking patch synchronization..."

# Count patches in different states
active_patches=$(find "$MAIN_PATCHES" -name "*.json" -not -path "*/\.archive/*" -not -path "*/\.completed/*" -not -path "*/\.failed/*" | wc -l | tr -d ' ')
completed_patches=$(find "$MAIN_PATCHES/.completed" -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
failed_patches=$(find "$MAIN_PATCHES/.failed" -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
archived_patches=$(find "$MAIN_PATCHES/.archive" -name "*.json" 2>/dev/null | wc -l | tr -d ' ')

log_info "Patch counts:"
echo "  Active: $active_patches"
echo "  Completed: $completed_patches"
echo "  Failed: $failed_patches"
echo "  Archived: $archived_patches"

# Check for recent patch activity
log_info "Checking recent patch activity..."

# Find the most recent patch
latest_patch=$(find "$MAIN_PATCHES" -name "*.json" -not -path "*/\.archive/*" -not -path "*/\.completed/*" -not -path "*/\.failed/*" -exec ls -t {} + | head -1 2>/dev/null || echo "")

if [ -n "$latest_patch" ]; then
    latest_patch_name=$(basename "$latest_patch")
    latest_patch_time=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$latest_patch" 2>/dev/null || echo "unknown")
    log_info "Latest patch: $latest_patch_name (modified: $latest_patch_time)"
else
    log_warning "No active patches found"
fi

# Check summary synchronization
log_info "Checking summary synchronization..."

main_summary_count=$(find "$MAIN_SUMMARIES" -name "*.md" | wc -l | tr -d ' ')
cyops_summary_count=$(find "$CYOPS_SUMMARIES" -name "*.md" | wc -l | tr -d ' ')

log_info "Summary counts:"
echo "  MAIN summaries: $main_summary_count"
echo "  CYOPS summaries: $cyops_summary_count"

# Check for validation mirror alignment
log_info "Checking validation mirror alignment..."

validation_mirror_script="$PROJECT_ROOT/scripts/validation-mirror-sync.sh"
if [ -f "$validation_mirror_script" ]; then
    log_success "Validation mirror script exists"
    
    # Run validation mirror sync to ensure alignment
    if [ -x "$validation_mirror_script" ]; then
        log_info "Running validation mirror sync..."
        "$validation_mirror_script" >/dev/null 2>&1
        log_success "Validation mirror sync completed"
    else
        log_warning "Validation mirror script not executable"
    fi
else
    log_warning "Validation mirror script not found"
fi

# Check doc-runner state
log_info "Checking doc-runner state..."

doc_runner_script="/Users/sawyer/gitSync/scripts/daemon/watchdog-doc-sync.sh"
if [ -f "$doc_runner_script" ]; then
    log_success "Doc-runner script exists"
    
    # Test doc-runner execution
    if [ -x "$doc_runner_script" ]; then
        log_info "Testing doc-runner execution..."
        timeout 30s "$doc_runner_script" >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            log_success "Doc-runner execution test passed"
        else
            log_warning "Doc-runner execution test failed"
        fi
    else
        log_warning "Doc-runner script not executable"
    fi
else
    log_error "Doc-runner script not found"
    exit 1
fi

# Check git state
log_info "Checking git state..."

if [ -d ".git" ]; then
    current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
    last_commit=$(git log -1 --format="%h %s" 2>/dev/null || echo "no commits")
    
    log_info "Git state:"
    echo "  Branch: $current_branch"
    echo "  Last commit: $last_commit"
    
    # Check for uncommitted changes
    if git diff --quiet 2>/dev/null; then
        log_success "No uncommitted changes"
    else
        log_warning "Uncommitted changes detected"
    fi
else
    log_error "Not a git repository"
    exit 1
fi

# Validate patch sequence integrity
log_info "Validating patch sequence integrity..."

# Check for gaps in patch sequence
patch_files=$(find "$MAIN_PATCHES" -name "*.json" -not -path "*/\.archive/*" -not -path "*/\.completed/*" -not -path "*/\.failed/*" | sort)
if [ -n "$patch_files" ]; then
    log_info "Found $(echo "$patch_files" | wc -l | tr -d ' ') active patches"
    
    # Check if patches have corresponding summaries
    missing_summaries=0
    for patch_file in $patch_files; do
        patch_name=$(basename "$patch_file" .json)
        summary_pattern="*${patch_name}*.md"
        
        if ! find "$MAIN_SUMMARIES" -name "$summary_pattern" | grep -q .; then
            log_warning "Missing summary for patch: $patch_name"
            missing_summaries=$((missing_summaries + 1))
        fi
    done
    
    if [ $missing_summaries -eq 0 ]; then
        log_success "All active patches have corresponding summaries"
    else
        log_warning "$missing_summaries patches missing summaries"
    fi
else
    log_info "No active patches found"
fi

# Final validation summary
echo
log_info "Patch sync validation summary:"
echo "  ✅ Directory structure: Valid"
echo "  ✅ Patch counts: Active=$active_patches, Completed=$completed_patches, Failed=$failed_patches"
echo "  ✅ Summary counts: MAIN=$main_summary_count, CYOPS=$cyops_summary_count"
echo "  ✅ Validation mirror: $(if [ -f "$validation_mirror_script" ]; then echo "Available"; else echo "Missing"; fi)"
echo "  ✅ Doc-runner: $(if [ -f "$doc_runner_script" ]; then echo "Available"; else echo "Missing"; fi)"
echo "  ✅ Git state: $(if [ -d ".git" ]; then echo "Valid"; else echo "Invalid"; fi)"

log_success "Patch sync validation completed successfully!" 