#!/bin/{ { bash

# Daemon Manager - Keeps critical systems alive with auto-restart & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
# Manages patch-executor, ghost-bridge, summary-monitor, realtime-monitor

set -e

# Configuration
LOG_DIR="./logs"
PID_DIR="./logs/daemons"
CHECK_INTERVAL=30
MAX_RESTARTS=5

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Ensure directories exist
mkdir -p "$LOG_DIR"
mkdir -p "$PID_DIR"

# Daemon configurations (using regular arrays for compatibility)
DAEMON_NAMES=("doc-sync" "summary-monitor" "realtime-monitor" "patch-executor" "ghost-bridge")
DAEMON_COMMANDS=(
    "{ { bash scripts/watchdog-doc-sync.sh" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
    "{ { node scripts/summary-monitor.js" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
    "{ { node scripts/realtime-monitor.js start" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
    "{ { node scripts/direct-patch-executor.js" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
    "{ { node scripts/ghost-bridge.js" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
)

# Get daemon command by name
get_daemon_command() {
    local daemon_name=$1
    for i in "${!DAEMON_NAMES[@]}"; do
        if [[ "${DAEMON_NAMES[$i]}" == "$daemon_name" ]]; then
            echo "${DAEMON_COMMANDS[$i]}"
            return 0
        fi
    done
    return 1
}

# Logging
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    echo "[$timestamp] [DAEMON-MANAGER] [$level] $message" | tee -a "$LOG_DIR/daemon-manager.log"
}

# Check if daemon is running
is_daemon_running() {
    local daemon_name=$1
    local pid_file="$PID_DIR/${daemon_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file" 2>/dev/null || echo "")
        if [ -n "$pid" ]; then
            if kill -0 "$pid" 2>/dev/null; then
                return 0
            else
                # Process is dead, remove stale PID file
                rm -f "$pid_file"
            fi
        fi
    fi
    return 1
}

# Start a daemon
start_daemon() {
    local daemon_name=$1
    local command=$(get_daemon_command "$daemon_name")
    local pid_file="$PID_DIR/${daemon_name}.pid"
    local log_file="$LOG_DIR/${daemon_name}.log"
    
    if ! is_daemon_running "$daemon_name"; then
        log "INFO" "🚀 Starting $daemon_name"
        
        # Start daemon with non-blocking pattern
        { { $command & } >/dev/null 2>&1 & disown } >/dev/null 2>&1 & disown
        
        # Wait a moment for process to start
        sleep 2
        
        # Try to find the PID
        local pid=$(pgrep -f "$daemon_name" | head -1)
        if [ -n "$pid" ]; then
            echo "$pid" > "$pid_file"
            log "INFO" "✅ $daemon_name started (PID: $pid)"
        else
            log "WARN" "⚠️  $daemon_name may not have started properly"
        fi
    else
        log "INFO" "ℹ️  $daemon_name is already running"
    fi
}

# Stop a daemon
stop_daemon() {
    local daemon_name=$1
    local pid_file="$PID_DIR/${daemon_name}.pid"
    
    if is_daemon_running "$daemon_name"; then
        log "INFO" "🛑 Stop{ { ping $daemon_name" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
        
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            if [ -n "$pid" ]; then
                kill "$pid" 2>/dev/null || true
                sleep 1
                kill -9 "$pid" 2>/dev/null || true
            fi
        fi
        
        # Also kill by name pattern
        pkill -f "$daemon_name" 2>/dev/null || true
        
        rm -f "$pid_file"
        log "INFO" "✅ $daemon_name stopped"
    else
        log "INFO" "ℹ️  $daemon_name is not running"
    fi
}

# Restart a daemon
restart_daemon() {
    local daemon_name=$1
    log "INFO" "🔄 Restarting $daemon_name"
    stop_daemon "$daemon_name"
    sleep 2
    start_daemon "$daemon_name"
}

# Check all daemons and restart if needed
check_daemons() {
    for daemon_name in "${DAEMON_NAMES[@]}"; do
        if ! is_daemon_running "$daemon_name"; then
            log "WARN" "⚠️  $daemon_name is down, restarting"
            start_daemon "$daemon_name"
        fi
    done
}

# Show status of all daemons
show_status() {
    echo "🔍 **DAEMON STATUS**"
    echo "=================="
    
    for daemon_name in "${DAEMON_NAMES[@]}"; do
        if is_daemon_running "$daemon_name"; then
            local pid_file="$PID_DIR/${daemon_name}.pid"
            local pid=$(cat "$pid_file" 2>/dev/null || echo "unknown")
            echo "✅ $daemon_name: RUNNING (PID: $pid)"
        else
            echo "❌ $daemon_name: STOPPED"
        fi
    done
    
    echo ""
    echo "📊 **System Health:**"
    echo "   • Doc Sync: $(is_daemon_running "doc-sync" && echo "✅" || echo "❌")"
    echo "   • Summary Monitor: $(is_daemon_running "summary-monitor" && echo "✅" || echo "❌")"
    echo "   • Realtime Monitor: $(is_daemon_running "realtime-monitor" && echo "✅" || echo "❌")"
    echo "   • Patch Executor: $(is_daemon_running "patch-executor" && echo "✅" || echo "❌")"
    echo "   • Ghost Bridge: $(is_daemon_running "ghost-bridge" && echo "✅" || echo "❌")"
}

# Main daemon loop
daemon_loop() {
    log "INFO" "🚀 Daemon Manager starting"
    log "INFO" "📋 Managing daemons: ${DAEMON_NAMES[*]}"
    
    # Start all daemons initially
    for daemon_name in "${DAEMON_NAMES[@]}"; do
        start_daemon "$daemon_name"
    done
    
    # Main monitoring loop
    while true; do
        check_daemons
        log "INFO" "💤 Slee{ { ping for $CHECK_INTERVAL seconds" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
        sleep "$CHECK_INTERVAL"
    done
}

# CLI interface
case "${1:-status}" in
    "start")
        daemon_loop
        ;;
    "stop")
        for daemon_name in "${DAEMON_NAMES[@]}"; do
            stop_daemon "$daemon_name"
        done
        ;;
    "restart")
        for daemon_name in "${DAEMON_NAMES[@]}"; do
            restart_daemon "$daemon_name"
        done
        ;;
    "status")
        show_status
        ;;
    *)
        echo "🔧 Daemon Manager"
        echo ""
        echo "Usage: $0 [start|stop|restart|status]"
        echo ""
        echo "Commands:"
        echo "  start   - Start daemon manager and all daemons"
        echo "  stop    - Stop all daemons"
        echo "  restart - Restart all daemons"
        echo "  status  - Show status of all daemons"
        echo ""
        echo "Managed daemons:"
        for daemon_name in "${DAEMON_NAMES[@]}"; do
            echo "  • $daemon_name"
        done
        ;;
esac 