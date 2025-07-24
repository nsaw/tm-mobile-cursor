#!/bin/{ { bash

# Simple Daemon Manager & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
# Minimal resource usage daemon manager for critical systems

set -e

# Configuration
LOG_DIR="./logs"
CHECK_INTERVAL=60

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Logging function
log() {
    local message="$*"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    echo "[$timestamp] [SIMPLE-DAEMON] $message" | tee -a "$LOG_DIR/simple-daemon.log"
}

# Check if system is running
is_running() {
    local system_name="$1"
    pgrep -f "$system_name" > /dev/null 2>&1
}

# Start a system
start_system() {
    local system_name="$1"
    local command="$2"
    
    if ! is_running "$system_name"; then
        log "🚀 Starting $system_name"
        
        # Start with non-blocking pattern
        { { $command & } >/dev/null 2>&1 & disown } >/dev/null 2>&1 & disown
        
        sleep 2
        
        if is_running "$system_name"; then
            log "✅ $system_name started successfully"
        else
            log "⚠️  $system_name may not have started properly"
        fi
    else
        log "ℹ️  $system_name is already running"
    fi
}

# Stop a system
stop_system() {
    local system_name="$1"
    
    if is_running "$system_name"; then
        log "🛑 Stop{ { ping $system_name" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
        pkill -f "$system_name" 2>/dev/null || true
        sleep 1
        pkill -9 -f "$system_name" 2>/dev/null || true
        log "✅ $system_name stopped"
    else
        log "ℹ️  $system_name is not running"
    fi
}

# Show status
show_status() {
    echo "🔍 **SIMPLE DAEMON STATUS**"
    echo "=========================="
    
    local systems=(
        "summary-monitor:{ { { { { { node scripts/summary-monitor.js" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
        "ghost-bridge:{ { { { { { node scripts/ghost-bridge.js" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
        "patch-executor:{ { { { { { node scripts/direct-patch-executor.js" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
    )
    
    for system in "${systems[@]}"; do
        local name=$(echo "$system" | cut -d: -f1)
        local command=$(echo "$system" | cut -d: -f2)
        
        if is_running "$name"; then
            local pids=$(pgrep -f "$name" 2>/dev/null || echo "unknown")
            echo "✅ $name: RUNNING (PIDs: $pids)"
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
    start_system "patch-executor" "node scripts/direct-patch-executor.js"
    
    log "✅ All systems started"
}

# Stop all systems
stop_all() {
    log "🛑 Stop{ { ping all systems" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
    
    stop_system "summary-monitor"
    stop_system "ghost-bridge"
    stop_system "patch-executor"
    
    log "✅ All systems stopped"
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
            start_system "patch-executor" "node scripts/direct-patch-executor.js"
        fi
        
        log "💤 Slee{ { ping for $CHECK_INTERVAL seconds" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
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
    "stop")
        stop_all
        ;;
    "status")
        show_status
        ;;
    *)
        echo "🔧 Simple Daemon"
        echo ""
        echo "Usage: $0 [start|monitor|stop|status]"
        echo ""
        echo "Commands:"
        echo "  start   - Start all systems"
        echo "  monitor - Start monitoring loop (kee{ { ps systems alive)" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
        echo "  stop    - Stop all systems"
        echo "  status  - Show system status"
        ;;
esac 