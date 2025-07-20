#!/bin/bash

# Daemon Manager - Keeps critical systems alive with auto-restart
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
    "bash scripts/watchdog-doc-sync.sh"
    "node scripts/summary-monitor.js"
    "node scripts/realtime-monitor.js start"
    "node scripts/patch-executor.js daemon"
    "node scripts/ghost-bridge.js"
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
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            return 0  # Running
        else
            log "WARN" "Stale PID file for $daemon_name, removing"
            rm -f "$pid_file"
        fi
    fi
    return 1  # Not running
}

# Start a daemon
start_daemon() {
    local daemon_name=$1
    local command=$(get_daemon_command "$daemon_name")
    local pid_file="$PID_DIR/${daemon_name}.pid"
    local log_file="$LOG_DIR/${daemon_name}.log"
    
    if [ -z "$command" ]; then
        log "ERROR" "Unknown daemon: $daemon_name"
        return 1
    fi
    
    if is_daemon_running "$daemon_name"; then
        log "INFO" "✅ $daemon_name is already running"
        return 0
    fi
    
    log "INFO" "🚀 Starting $daemon_name: $command"
    
    # Start daemon in background
    nohup $command > "$log_file" 2>&1 &
    local pid=$!
    
    # Save PID
    echo "$pid" > "$pid_file"
    
    # Wait a moment to see if it starts successfully
    sleep 2
    
    if kill -0 "$pid" 2>/dev/null; then
        log "INFO" "✅ $daemon_name started successfully (PID: $pid)"
        return 0
    else
        log "ERROR" "❌ $daemon_name failed to start"
        rm -f "$pid_file"
        return 1
    fi
}

# Stop a daemon
stop_daemon() {
    local daemon_name=$1
    local pid_file="$PID_DIR/${daemon_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        log "INFO" "🛑 Stopping $daemon_name (PID: $pid)"
        
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            sleep 2
            
            if kill -0 "$pid" 2>/dev/null; then
                log "WARN" "⚠️ $daemon_name didn't stop gracefully, force killing"
                kill -9 "$pid" 2>/dev/null || true
            fi
        fi
        
        rm -f "$pid_file"
        log "INFO" "✅ $daemon_name stopped"
    else
        log "INFO" "ℹ️ $daemon_name not running"
    fi
}

# Restart a daemon
restart_daemon() {
    local daemon_name=$1
    log "INFO" "🔄 Restarting $daemon_name"
    stop_daemon "$daemon_name"
    sleep 1
    start_daemon "$daemon_name"
}

# Check and restart daemons if needed
check_daemons() {
    log "INFO" "🔍 Checking daemon health"
    
    for daemon_name in "${DAEMON_NAMES[@]}"; do
        if ! is_daemon_running "$daemon_name"; then
            log "WARN" "⚠️ $daemon_name is down, restarting"
            start_daemon "$daemon_name"
        else
            log "INFO" "✅ $daemon_name is healthy"
        fi
    done
}

# Show daemon status
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
        log "INFO" "💤 Sleeping for $CHECK_INTERVAL seconds"
        sleep "$CHECK_INTERVAL"
    done
}

# CLI interface
case "${1:-status}" in
    "start")
        daemon_loop
        ;;
    "stop")
        log "INFO" "🛑 Stopping all daemons"
        for daemon_name in "${DAEMON_NAMES[@]}"; do
            stop_daemon "$daemon_name"
        done
        ;;
    "restart")
        log "INFO" "🔄 Restarting all daemons"
        for daemon_name in "${DAEMON_NAMES[@]}"; do
            restart_daemon "$daemon_name"
        done
        ;;
    "status")
        show_status
        ;;
    "start-daemon")
        if [ -z "$2" ]; then
            echo "Usage: $0 start-daemon <daemon-name>"
            echo "Available daemons: ${DAEMON_NAMES[*]}"
            exit 1
        fi
        start_daemon "$2"
        ;;
    "stop-daemon")
        if [ -z "$2" ]; then
            echo "Usage: $0 stop-daemon <daemon-name>"
            echo "Available daemons: ${DAEMON_NAMES[*]}"
            exit 1
        fi
        stop_daemon "$2"
        ;;
    *)
        echo "🔧 Daemon Manager"
        echo ""
        echo "Usage: $0 [start|stop|restart|status|start-daemon|stop-daemon]"
        echo ""
        echo "Commands:"
        echo "  start         - Start daemon manager (monitors all daemons)"
        echo "  stop          - Stop all daemons"
        echo "  restart       - Restart all daemons"
        echo "  status        - Show daemon status"
        echo "  start-daemon  - Start specific daemon"
        echo "  stop-daemon   - Stop specific daemon"
        echo ""
        echo "Available daemons: ${DAEMON_NAMES[*]}"
        ;;
esac 