#!/bin/bash

# Simple Daemon Manager - Keeps critical systems alive
# No complex features, just basic process management

set -e

# Configuration
LOG_DIR="./logs"
PID_DIR="./logs/daemons"
CHECK_INTERVAL=60

# Ensure directories exist
mkdir -p "$LOG_DIR"
mkdir -p "$PID_DIR"

# Logging
log() {
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" | tee -a "$LOG_DIR/simple-daemon.log"
}

# Check if process is running
is_running() {
    local name=$1
    pgrep -f "$name" >/dev/null 2>&1
}

# Start a simple daemon
start_daemon() {
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

# Stop a daemon
stop_daemon() {
    local name=$1
    local pids=$(pgrep -f "$name" 2>/dev/null || echo "")
    
    if [ -n "$pids" ]; then
        log "🛑 Stopping $name (PIDs: $pids)"
        echo "$pids" | xargs kill 2>/dev/null || true
        sleep 2
        echo "$pids" | xargs kill -9 2>/dev/null || true
        log "✅ $name stopped"
    else
        log "ℹ️ $name not running"
    fi
}

# Show status
show_status() {
    echo "🔍 **SIMPLE DAEMON STATUS**"
    echo "=========================="
    
    local daemons=(
        "doc-sync:bash scripts/watchdog-doc-sync.sh"
        "summary-monitor:node scripts/summary-monitor.js"
        "realtime-monitor:node scripts/realtime-monitor.js start"
        "patch-executor:node scripts/patch-executor.js daemon"
        "ghost-bridge:node scripts/ghost-bridge.js"
    )
    
    for daemon in "${daemons[@]}"; do
        local name=$(echo "$daemon" | cut -d: -f1)
        local command=$(echo "$daemon" | cut -d: -f2)
        
        if is_running "$name"; then
            local pids=$(pgrep -f "$name" 2>/dev/null || echo "unknown")
            echo "✅ $name: RUNNING (PIDs: $pids)"
        else
            echo "❌ $name: STOPPED"
        fi
    done
    
    echo ""
    echo "📊 **System Health:**"
    echo "   • Doc Sync: $(is_running "doc-sync" && echo "✅" || echo "❌")"
    echo "   • Summary Monitor: $(is_running "summary-monitor" && echo "✅" || echo "❌")"
    echo "   • Realtime Monitor: $(is_running "realtime-monitor" && echo "✅" || echo "❌")"
    echo "   • Patch Executor: $(is_running "patch-executor" && echo "✅" || echo "❌")"
    echo "   • Ghost Bridge: $(is_running "ghost-bridge" && echo "✅" || echo "❌")"
}

# Start all daemons
start_all() {
    log "🚀 Starting all daemons"
    
    start_daemon "doc-sync" "bash scripts/watchdog-doc-sync.sh"
    start_daemon "summary-monitor" "node scripts/summary-monitor.js"
    start_daemon "realtime-monitor" "node scripts/realtime-monitor.js start"
    start_daemon "patch-executor" "node scripts/patch-executor.js daemon"
    start_daemon "ghost-bridge" "node scripts/ghost-bridge.js"
    
    log "✅ All daemons started"
}

# Stop all daemons
stop_all() {
    log "🛑 Stopping all daemons"
    
    stop_daemon "doc-sync"
    stop_daemon "summary-monitor"
    stop_daemon "realtime-monitor"
    stop_daemon "patch-executor"
    stop_daemon "ghost-bridge"
    
    log "✅ All daemons stopped"
}

# Monitor loop
monitor_loop() {
    log "🔍 Starting monitor loop (checking every $CHECK_INTERVAL seconds)"
    
    while true; do
        log "🔍 Checking daemon health"
        
        # Check and restart if needed
        if ! is_running "doc-sync"; then
            log "⚠️ doc-sync down, restarting"
            start_daemon "doc-sync" "bash scripts/watchdog-doc-sync.sh"
        fi
        
        if ! is_running "summary-monitor"; then
            log "⚠️ summary-monitor down, restarting"
            start_daemon "summary-monitor" "node scripts/summary-monitor.js"
        fi
        
        if ! is_running "realtime-monitor"; then
            log "⚠️ realtime-monitor down, restarting"
            start_daemon "realtime-monitor" "node scripts/realtime-monitor.js start"
        fi
        
        if ! is_running "patch-executor"; then
            log "⚠️ patch-executor down, restarting"
            start_daemon "patch-executor" "node scripts/patch-executor.js daemon"
        fi
        
        if ! is_running "ghost-bridge"; then
            log "⚠️ ghost-bridge down, restarting"
            start_daemon "ghost-bridge" "node scripts/ghost-bridge.js"
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
    "stop")
        stop_all
        ;;
    "monitor")
        monitor_loop
        ;;
    "status")
        show_status
        ;;
    *)
        echo "🔧 Simple Daemon Manager"
        echo ""
        echo "Usage: $0 [start|stop|monitor|status]"
        echo ""
        echo "Commands:"
        echo "  start   - Start all daemons"
        echo "  stop    - Stop all daemons"
        echo "  monitor - Start monitoring loop (keeps daemons alive)"
        echo "  status  - Show daemon status"
        ;;
esac 