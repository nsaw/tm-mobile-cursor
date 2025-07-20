#!/bin/bash

# Enhanced Ghost Runner v3.0 with Screen Capture Verification
# Intelligent patch and summary routing with UI verification
# Supports multiple project types and environment-based configuration

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_ROOT/logs"
PID_FILE="$LOG_DIR/ghost-runner.pid"
CHECK_INTERVAL=30
MAX_RETRIES=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${BLUE}[$timestamp] INFO:${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[$timestamp] WARN:${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[$timestamp] ERROR:${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[$timestamp] SUCCESS:${NC} $message"
            ;;
    esac
}

# Check if task requires UI verification
requires_ui_verification() {
    local content="$1"
    local content_type="$2"
    
    # Check for UI-related keywords
    local ui_keywords=(
        "UI" "interface" "screen" "component" "layout" "visual" "design"
        "React Native" "Expo" "mobile" "app" "dashboard" "navigation"
        "button" "modal" "form" "input" "style" "theme" "render"
        "Screen" "View" "Text" "TouchableOpacity" "ScrollView"
    )
    
    for keyword in "${ui_keywords[@]}"; do
        if [[ "$content" == *"$keyword"* ]]; then
            return 0  # Requires verification
        fi
    done
    
    return 1  # No verification needed
}

# Run screen capture verification
run_verification() {
    local task_data="$1"
    local content="$2"
    local content_type="$3"
    
    log "INFO" "Running screen capture verification for $content_type..."
    
    # Create verification task data
    local verification_data=$(cat <<EOF
{
    "content": "$content",
    "contentType": "$content_type",
    "requiresUI": true,
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")",
    "priority": "high"
}
EOF
)
    
    # Run verification workflow
    local result=$(node "$SCRIPT_DIR/verification-manager.js" verify "$verification_data")
    echo "$result"
}

# Get project information using enhanced path router
get_project_info() {
    local info=$(node "$SCRIPT_DIR/enhanced-path-router.js" project-info)
    echo "$info"
}

# Get target paths for specific target
get_target_paths() {
    local target=${1:-default}
    local paths=$(node "$SCRIPT_DIR/enhanced-path-router.js" target-paths "$target")
    echo "$paths"
}

# Write patch to appropriate target
write_patch() {
    local patch_data="$1"
    local target=${2:-default}
    local result=$(node "$SCRIPT_DIR/enhanced-path-router.js" write-patch "$target" "$patch_data")
    echo "$result"
}

# Write summary to appropriate target
write_summary() {
    local summary_data="$1"
    local target=${2:-default}
    local result=$(node "$SCRIPT_DIR/enhanced-path-router.js" write-summary "$target" "$summary_data")
    echo "$result"
}

# Determine appropriate target based on content analysis
determine_target() {
    local content="$1"
    local content_type="$2"
    
    # Analyze content to determine target
    if [[ "$content" == *"mobile-native-fresh"* ]] || [[ "$content" == *"React Native"* ]] || [[ "$content" == *"Expo"* ]]; then
        echo "mobile-native-fresh"
    elif [[ "$content" == *"server"* ]] || [[ "$content" == *"API"* ]] || [[ "$content" == *"Express"* ]]; then
        echo "server"
    elif [[ "$content" == *"Python"* ]] || [[ "$content" == *"gpt_cursor_runner"* ]]; then
        echo "python"
    else
        echo "default"
    fi
}

# Process incoming patch with verification
process_patch_with_verification() {
    local patch_file="$1"
    local patch_content=$(cat "$patch_file")
    local target=$(determine_target "$patch_content" "patch")
    
    log "INFO" "Processing patch: $patch_file"
    log "INFO" "Determined target: $target"
    
    # Check if UI verification is required
    if requires_ui_verification "$patch_content" "patch"; then
        log "INFO" "UI verification required for patch"
        
        # Run verification workflow
        local verification_result=$(run_verification "$patch_file" "$patch_content" "patch")
        
        # Parse verification result
        local verification_success=$(echo "$verification_result" | node -e "
            const result = JSON.parse(require('fs').readFileSync(0, 'utf8'));
            console.log(result.success ? 'true' : 'false');
        ")
        
        if [[ "$verification_success" == "true" ]]; then
            log "SUCCESS" "Verification passed for patch"
        else
            log "ERROR" "Verification failed for patch"
            return 1
        fi
    else
        log "INFO" "No UI verification required for patch"
    fi
    
    # Get target paths
    local target_paths=$(get_target_paths "$target")
    log "INFO" "Target paths: $target_paths"
    
    # Write patch to appropriate location
    local result=$(write_patch "$patch_content" "$target")
    log "SUCCESS" "Patch written: $result"
    
    echo "$result"
}

# Process incoming summary with verification
process_summary_with_verification() {
    local summary_file="$1"
    local summary_content=$(cat "$summary_file")
    local target=$(determine_target "$summary_content" "summary")
    
    log "INFO" "Processing summary: $summary_file"
    log "INFO" "Determined target: $target"
    
    # Check if UI verification is required
    if requires_ui_verification "$summary_content" "summary"; then
        log "INFO" "UI verification required for summary"
        
        # Run verification workflow
        local verification_result=$(run_verification "$summary_file" "$summary_content" "summary")
        
        # Parse verification result
        local verification_success=$(echo "$verification_result" | node -e "
            const result = JSON.parse(require('fs').readFileSync(0, 'utf8'));
            console.log(result.success ? 'true' : 'false');
        ")
        
        if [[ "$verification_success" == "true" ]]; then
            log "SUCCESS" "Verification passed for summary"
        else
            log "ERROR" "Verification failed for summary"
            return 1
        fi
    else
        log "INFO" "No UI verification required for summary"
    fi
    
    # Get target paths
    local target_paths=$(get_target_paths "$target")
    log "INFO" "Target paths: $target_paths"
    
    # Write summary to appropriate location
    local result=$(write_summary "$summary_content" "$target")
    log "SUCCESS" "Summary written: $result"
    
    echo "$result"
}

# Monitor for new files and route them appropriately with verification
monitor_and_route_with_verification() {
    local watch_dir="$1"
    local file_type="$2"
    
    log "INFO" "Starting monitor for $file_type files in $watch_dir"
    
    # Create watch directory if it doesn't exist
    mkdir -p "$watch_dir"
    
    # Monitor directory for new files
    inotifywait -m -e create --format '%w%f' "$watch_dir" | while read file; do
        if [[ "$file" == *".json" ]] && [[ "$file_type" == "patch" ]]; then
            log "INFO" "New patch detected: $file"
            process_patch_with_verification "$file"
        elif [[ "$file" == *".md" ]] && [[ "$file_type" == "summary" ]]; then
            log "INFO" "New summary detected: $file"
            process_summary_with_verification "$file"
        fi
    done
}

# Start ghost runner daemon with verification
start_daemon_with_verification() {
    log "INFO" "Starting Enhanced Ghost Runner Daemon with Verification..."
    
    # Get project information
    local project_info=$(get_project_info)
    log "INFO" "Project info: $project_info"
    
    # Create log directory
    mkdir -p "$LOG_DIR"
    
    # Write PID file
    echo $$ > "$PID_FILE"
    log "SUCCESS" "Ghost runner daemon started with PID: $$"
    
    # Start monitoring for patches and summaries with verification
    (
        monitor_and_route_with_verification "$PROJECT_ROOT/patches" "patch" &
        monitor_and_route_with_verification "$PROJECT_ROOT/summaries" "summary" &
        wait
    )
}

# Stop ghost runner daemon
stop_daemon() {
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        log "INFO" "Stopping ghost runner daemon (PID: $pid)..."
        kill "$pid" 2>/dev/null || true
        rm -f "$PID_FILE"
        log "SUCCESS" "Ghost runner daemon stopped"
    else
        log "WARN" "No PID file found"
    fi
}

# Check daemon status
check_status() {
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            log "SUCCESS" "Ghost runner daemon is running (PID: $pid)"
            return 0
        else
            log "ERROR" "Ghost runner daemon is not running (stale PID file)"
            rm -f "$PID_FILE"
            return 1
        fi
    else
        log "WARN" "Ghost runner daemon is not running (no PID file)"
        return 1
    fi
}

# Test verification functionality
test_verification() {
    log "INFO" "Testing verification functionality..."
    
    # Test screen capture
    local capture_result=$(node "$SCRIPT_DIR/screen-capture-verifier.js" capture-all)
    log "INFO" "Screen capture test result: $capture_result"
    
    # Test verification manager
    local test_data='{"test": true, "content": "UI test content", "contentType": "test"}'
    local verification_result=$(node "$SCRIPT_DIR/verification-manager.js" verify "$test_data")
    log "INFO" "Verification test result: $verification_result"
    
    log "SUCCESS" "Verification functionality test completed"
}

# Test routing functionality with verification
test_routing_with_verification() {
    log "INFO" "Testing enhanced routing functionality with verification..."
    
    # Test project info
    local project_info=$(get_project_info)
    log "INFO" "Project info: $project_info"
    
    # Test target paths
    local target_paths=$(get_target_paths "default")
    log "INFO" "Default target paths: $target_paths"
    
    # Test patch writing with verification
    local test_patch='{"test": true, "timestamp": "'$(date -Iseconds)'", "target": "test", "UI": "test component"}'
    local patch_result=$(write_patch "$test_patch" "default")
    log "SUCCESS" "Test patch written: $patch_result"
    
    # Test summary writing with verification
    local test_summary="# Test Summary\n\nThis is a test summary with UI components for enhanced routing."
    local summary_result=$(write_summary "$test_summary" "default")
    log "SUCCESS" "Test summary written: $summary_result"
    
    log "SUCCESS" "Enhanced routing with verification test completed successfully"
}

# Main function
main() {
    case "${1:-}" in
        "start")
            start_daemon_with_verification
            ;;
        "stop")
            stop_daemon
            ;;
        "status")
            check_status
            ;;
        "test")
            test_routing_with_verification
            ;;
        "test-verification")
            test_verification
            ;;
        *)
            echo "Usage: $0 {start|stop|status|test|test-verification}"
            echo ""
            echo "Commands:"
            echo "  start              Start the enhanced ghost runner daemon with verification"
            echo "  stop               Stop the ghost runner daemon"
            echo "  status             Check daemon status"
            echo "  test               Test routing functionality with verification"
            echo "  test-verification  Test verification functionality"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 