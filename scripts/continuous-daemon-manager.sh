#!/bin/bash

# Continuous Daemon Manager
# Keeps all monitoring scripts running and restarts them if they die

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
    "patch-executor.js:watch"
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
        nohup node "$daemon_name" "$start_command" > "$log_file" 2>&1 &
        sleep 2
    fi
}

# Function to stop a daemon
stop_daemon() {
    local daemon_name="$1"
    if is_daemon_running "$daemon_name"; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🛑 Stopping $daemon_name"
        pkill -f "$daemon_name"
        sleep 1
    fi
}

# Function to restart a daemon
restart_daemon() {
    local daemon_name="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔄 Restarting $daemon_name"
    stop_daemon "$daemon_name"
    start_daemon "$daemon_name"
}

# Function to get daemon name from array
get_daemon_name() {
    local daemon_entry="$1"
    echo "${daemon_entry%:*}"
}

# Function to check and restart all daemons
check_and_restart_daemons() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔍 Checking daemon status..."
    
    for daemon_entry in "${DAEMONS[@]}"; do
        local daemon_name=$(get_daemon_name "$daemon_entry")
        if is_daemon_running "$daemon_name"; then
            echo "   ✅ $daemon_name is running"
        else
            echo "   ❌ $daemon_name is not running - restarting"
            start_daemon "$daemon_name"
        fi
    done
}

# Function to show status
show_status() {
    echo "🔍 DAEMON STATUS:"
    echo "=================="
    
    for daemon_entry in "${DAEMONS[@]}"; do
        local daemon_name=$(get_daemon_name "$daemon_entry")
        if is_daemon_running "$daemon_name"; then
            echo "   ✅ $daemon_name"
        else
            echo "   ❌ $daemon_name"
        fi
    done
    
    echo ""
    echo "📊 System Status:"
    echo "=================="
    
    # Check if Expo is running
    if lsof -i :8081 > /dev/null 2>&1; then
        echo "   ✅ Expo (port 8081)"
    else
        echo "   ❌ Expo (port 8081)"
    fi
    
    # Check if Backend is running
    if lsof -i :4000 > /dev/null 2>&1; then
        echo "   ✅ Backend (port 4000)"
    else
        echo "   ❌ Backend (port 4000)"
    fi
}

# Main loop
main() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚀 Continuous Daemon Manager starting"
    echo "📋 Managing daemons: ${DAEMONS[*]}"
    echo "📁 Logs: $LOG_DIR"
    echo "⏰ Check interval: 30 seconds"
    echo ""
    
    # Initial start of all daemons
    for daemon_entry in "${DAEMONS[@]}"; do
        local daemon_name=$(get_daemon_name "$daemon_entry")
        start_daemon "$daemon_name"
    done
    
    # Continuous monitoring loop
    while true; do
        check_and_restart_daemons
        sleep 30
    done
}

# Handle command line arguments
case "${1:-start}" in
    start)
        main
        ;;
    stop)
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🛑 Stopping all daemons..."
        for daemon_entry in "${DAEMONS[@]}"; do
            local daemon_name=$(get_daemon_name "$daemon_entry")
            stop_daemon "$daemon_name"
        done
        echo "✅ All daemons stopped"
        ;;
    restart)
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔄 Restarting all daemons..."
        for daemon_entry in "${DAEMONS[@]}"; do
            local daemon_name=$(get_daemon_name "$daemon_entry")
            restart_daemon "$daemon_name"
        done
        echo "✅ All daemons restarted"
        ;;
    status)
        show_status
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|status]"
        echo ""
        echo "Commands:"
        echo "  start   - Start continuous daemon management"
        echo "  stop    - Stop all daemons"
        echo "  restart - Restart all daemons"
        echo "  status  - Show current status"
        ;;
esac 