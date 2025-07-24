#!/bin/{ { { { bash

# emergency-logout.sh & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Safely kills GUI session via osascript to prevent stuck processes

set -e

echo "🚨 EMERGENCY LOGOUT INITIATED"
echo "Timestamp: $(date)"
echo ""

# Function to safely logout GUI session
emergency_logout() {
    echo "🔄 Attempting safe GUI logout..."
    
    # Try graceful logout first
    osascript -e 'tell application "System Events" to log out' 2>/dev/null || {
        echo "⚠️  Graceful logout failed, attempting force logout..."
        osascript -e 'tell application "System Events" to restart' 2>/dev/null || {
            echo "❌ Force logout failed, manual intervention required"
            return 1
        }
    }
    
    echo "✅ Emergency logout completed"
}

# Function to kill stuck processes
kill_stuck_processes() {
    echo "🔧 Killing stuck development processes..."
    
    # Kill common stuck processes
    pkill -f "patch-executor" 2>/dev/null || true
    pkill -f "live-patch-status" 2>/dev/null || true
    pkill -f "ghost-bridge" 2>/dev/null || true
    pkill -f "expo" 2>/dev/null || true
    pkill -f "ngrok" 2>/dev/null || true
    pkill -f "watchman" 2>/dev/null || true
    
    echo "✅ Stuck processes terminated"
}

# Function to clean dev state
clean_dev_state() {
    echo "🧹 Cleaning development state..."
    
    # Remove common dev cache directories
    rm -rf .expo 2>/dev/null || true
    rm -rf .turbo 2>/dev/null || true
    rm -rf .next 2>/dev/null || true
    rm -rf node_modules/.cache 2>/dev/null || true
    rm -rf mobile-native-fresh/.expo 2>/dev/null || true
    rm -rf mobile-native-fresh/.turbo 2>/dev/null || true
    
    echo "✅ Development state cleaned"
}

# Main execution
main() {
    echo "🚨 EMERGENCY RECOVERY TOOLKIT"
    echo "================================"
    
    case "${1:-logout}" in
        "logout")
            emergency_logout
            ;;
        "kill")
            kill_stuck_processes
            ;;
        "clean")
            clean_dev_state
            ;;
        "all")
            kill_stuck_processes
            clean_dev_state
            emergency_logout
            ;;
        *)
            echo "Usage: $0 [logout|kill|clean|all]"
            echo ""
            echo "Commands:"
            echo "  logout  - Safe GUI session logout"
            echo "  kill    - Kill stuck development processes"
            echo "  clean   - Clean development cache state"
            echo "  all     - Execute all recovery actions"
            ;;
    esac
}

main "$@" 