#!/bin/bash

# Minimal Daemon - Keeps critical systems alive with minimal resource usage
# No complex monitoring, just basic process management

set -e

# Configuration
LOG_DIR="./logs"
CHECK_INTERVAL=120  # Check every 2 minutes instead of every 30 seconds

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Logging
log() {
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" >> "$LOG_DIR/minimal-daemon.log"
}

# Check if process is running by log activity
is_running() {
    local name=$1
    local log_file="$LOG_DIR/${name}.log"
    
    if [ -f "$log_file" ]; then
        local file_age=$(($(date +%s) - $(stat -f %m "$log_file" 2>/dev/null || echo 0)))
        # Consider running if log file was modified in last 10 minutes
        [ $file_age -lt 600 ]
    else
        false
    fi
}

# Start a system if not running
start_system() {
    local name=$1
    local command=$2
    
    if is_running "$name"; then
        log "✅ $name already running"
        return 0
    fi
    
    log "🚀 Starting $name: $command"
    nohup $command > "$LOG_DIR/${name}.log" 2>&1 &
    local pid=$!
    log "✅ $name started (PID: $pid)"
    return 0
}

# Show status
show_status() {
    echo "🔍 **MINIMAL DAEMON STATUS**"
    echo "============================"
    
    local systems=(
        "summary-monitor:node scripts/summary-monitor.js"
        "ghost-bridge:node scripts/ghost-bridge.js"
        "patch-executor:node scripts/patch-executor.js daemon"
    )
    
    for system in "${systems[@]}"; do
        local name=$(echo "$system" | cut -d: -f1)
        local command=$(echo "$system" | cut -d: -f2)
        
        if is_running "$name"; then
            echo "✅ $name: RUNNING"
        else
            echo "❌ $name: STOPPED"
        fi
    done
    
    echo ""
    echo "📊 **System Health:**"
    echo "   • Summary Monitor: $(is_running "summary-monitor" && echo "✅" || echo "❌")"
    echo "   • Ghost Bridge: $(is_running "ghost-bridge" && echo "✅" || echo "❌")"
    echo "   • Patch Executor: $(is_running "patch-executor" && echo "✅" || echo "❌")"
}

# Start all systems
start_all() {
    log "🚀 Starting all systems"
    
    start_system "summary-monitor" "node scripts/summary-monitor.js"
    start_system "ghost-bridge" "node scripts/ghost-bridge.js"
    start_system "patch-executor" "node scripts/patch-executor.js daemon"
    
    log "✅ All systems started"
}

# Monitor loop (minimal resource usage)
monitor_loop() {
    log "🔍 Starting minimal monitor loop (checking every $CHECK_INTERVAL seconds)"
    
    while true; do
        log "🔍 Checking system health"
        
        # Check and restart if needed
        if ! is_running "summary-monitor"; then
            log "⚠️ summary-monitor down, restarting"
            start_system "summary-monitor" "node scripts/summary-monitor.js"
        fi
        
        if ! is_running "ghost-bridge"; then
            log "⚠️ ghost-bridge down, restarting"
            start_system "ghost-bridge" "node scripts/ghost-bridge.js"
        fi
        
        if ! is_running "patch-executor"; then
            log "⚠️ patch-executor down, restarting"
            start_system "patch-executor" "node scripts/patch-executor.js daemon"
        fi
        
        log "💤 Sleeping for $CHECK_INTERVAL seconds"
        sleep "$CHECK_INTERVAL"
    done
}

# CLI interface
case "${1:-status}" in
    "start")
        start_all
        ;;
    "monitor")
        monitor_loop
        ;;
    "status")
        show_status
        ;;
    *)
        echo "🔧 Minimal Daemon"
        echo ""
        echo "Usage: $0 [start|monitor|status]"
        echo ""
        echo "Commands:"
        echo "  start   - Start all systems"
        echo "  monitor - Start monitoring loop (keeps systems alive)"
        echo "  status  - Show system status"
        ;;
esac 