#!/bin/{ { bash

# Continuous Daemon Manager & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
# Kee{ { ps all monitoring scripts running and restarts them if they die & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown

PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"
LOG_DIR="$PROJECT_ROOT/logs"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Daemon processes to manage with their start commands
DAEMONS=(
    "live-patch-status.js:start"
    "ghost-bridge.js:monitor"
    "summary-monitor.js:start"
    "direct-patch-executor.js"
    "realtime-monitor.js:start"
)

# Function to check if a daemon is running
is_daemon_running() {
    local daemon_name="$1"
    pgrep -f "$daemon_name" > /dev/null 2>&1
}

# Function to get start command for a daemon
get_start_command() {
    local daemon_name="$1"
    for daemon in "${DAEMONS[@]}"; do
        if [[ "$daemon" == "$daemon_name:"* ]]; then
            echo "${daemon#*:}"
            return 0
        fi
    done
    echo "start"  # default
}

# Function to start a daemon
start_daemon() {
    local daemon_name="$1"
    local start_command=$(get_start_command "$daemon_name")
    local log_file="$LOG_DIR/${daemon_name%.*}.log"
    
    if ! is_daemon_running "$daemon_name"; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚀 Starting $daemon_name with command: $start_command"
        cd "$SCRIPTS_DIR"
        
        # Start with non-blocking pattern
        { { { { node "$daemon_name" "$start_command" > "$log_file" 2>&1 &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown } >/dev/null 2>&1 & disown
        
        sleep 2
    fi
}

# Function to stop a daemon
stop_daemon() {
    local daemon_name="$1"
    if is_daemon_running "$daemon_name"; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🛑 Stop{ { ping $daemon_name" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
        pkill -f "$daemon_name"
        sleep 1
    fi
}

# Function to restart a daemon
restart_daemon() {
    local daemon_name="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔄 Restarting $daemon_name"
    stop_daemon "$daemon_name"
    sleep 2
    start_daemon "$daemon_name"
}

# Function to check all daemons
check_daemons() {
    for daemon in "${DAEMONS[@]}"; do
        local daemon_name="${daemon%:*}"
        if ! is_daemon_running "$daemon_name"; then
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $daemon_name is down, restarting"
            start_daemon "$daemon_name"
        fi
    done
}

# Function to show status
show_status() {
    echo "🔍 **CONTINUOUS DAEMON STATUS**"
    echo "=============================="
    
    for daemon in "${DAEMONS[@]}"; do
        local daemon_name="${daemon%:*}"
        if is_daemon_running "$daemon_name"; then
            local pids=$(pgrep -f "$daemon_name" 2>/dev/null || echo "unknown")
            echo "✅ $daemon_name: RUNNING (PIDs: $pids)"
        else
            echo "❌ $daemon_name: STOPPED"
        fi
    done
}

# Function to start all daemons
start_all() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚀 Starting all daemons"
    for daemon in "${DAEMONS[@]}"; do
        local daemon_name="${daemon%:*}"
        start_daemon "$daemon_name"
    done
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ All daemons started"
}

# Function to stop all daemons
stop_all() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🛑 Stop{ { ping all daemons" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
    for daemon in "${DAEMONS[@]}"; do
        local daemon_name="${daemon%:*}"
        stop_daemon "$daemon_name"
    done
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ All daemons stopped"
}

# Function to restart all daemons
restart_all() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔄 Restarting all daemons"
    stop_all
    sleep 3
    start_all
}

# Main monitoring loop
monitor_loop() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔍 Starting continuous daemon monitoring"
    
    # Start all daemons initially
    start_all
    
    # Main monitoring loop
    while true; do
        check_daemons
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] 💤 Slee{ { ping for 30 seconds" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
        sleep 30
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
    "restart")
        restart_all
        ;;
    "monitor")
        monitor_loop
        ;;
    "status")
        show_status
        ;;
    *)
        echo "🔧 Continuous Daemon Manager"
        echo ""
        echo "Usage: $0 [start|stop|restart|monitor|status]"
        echo ""
        echo "Commands:"
        echo "  start   - Start all daemons"
        echo "  stop    - Stop all daemons"
        echo "  restart - Restart all daemons"
        echo "  monitor - Start monitoring loop (kee{ { ps daemons alive)" & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
        echo "  status  - Show daemon status"
        echo ""
        echo "Managed daemons:"
        for daemon in "${DAEMONS[@]}"; do
            local daemon_name="${daemon%:*}"
            echo "  • $daemon_name"
        done
        ;;
esac 