#!/bin/{ { { { bash

# Boot All Systems Script & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Starts all critical systems in the correct order

PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"
MOBILE_DIR="$PROJECT_ROOT/mobile-native-fresh"
BACKEND_DIR="$MOBILE_DIR/backend"
LOG_DIR="$PROJECT_ROOT/logs"

# Create log directory
mkdir -p "$LOG_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log with timestamp
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if a process is running
is_running() {
    local process_name="$1"
    pgrep -f "$process_name" > /dev/null 2>&1
}

# Function to check if a port is in use
is_port_in_use() {
    local port="$1"
    lsof -i :$port > /dev/null 2>&1
}

# Function to wait for port to be available
wait_for_port() {
    local port="$1"
    local max_attempts=30
    local attempt=1
    
    log "${YELLOW}Waiting for port $port to be available...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if ! is_port_in_use $port; then
            log "${GREEN}Port $port is available${NC}"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log "${RED}Port $port is still in use after $max_attempts attempts${NC}"
    return 1
}

# Function to start a service with error handling
start_service() {
    local service_name="$1"
    local command="$2"
    local log_file="$3"
    
    log "${BLUE}Starting $service_name...${NC}"
    
    if is_running "$service_name"; then
        log "${YELLOW}$service_name is already running${NC}"
        return 0
    fi
    
    # Run the command in background
    eval "$command" > "$log_file" 2>&1 &
    local pid=$!
    
    # Wait a moment for the process to start
    sleep 3
    
    # Check if it's running
    if is_running "$service_name"; then
        log "${GREEN}✅ $service_name started successfully (PID: $pid)${NC}"
        return 0
    else
        log "${RED}❌ Failed to start $service_name${NC}"
        return 1
    fi
}

# Function to stop a service
stop_service() {
    local service_name="$1"
    
    if is_running "$service_name"; then
        log "${YELLOW}Stop{ { { { ping $service_name...${NC & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown}"
        pkill -f "$service_name"
        sleep 2
    fi
}

# Function to show status
show_status() {
    echo ""
    echo "🔍 SYSTEM STATUS:"
    echo "=================="
    
    # Check Expo instances
    if is_running "expo.*8081"; then
        echo "   ✅ Expo Dev Server (port 8081)"
    else
        echo "   ❌ Expo Dev Server (port 8081)"
    fi
    
    if is_running "expo.*tunnel"; then
        echo "   ✅ Expo Tunnel Server"
    else
        echo "   ❌ Expo Tunnel Server"
    fi
    
    # Check Backend
    if is_port_in_use 4000; then
        echo "   ✅ Backend API (port 4000)"
    else
        echo "   ❌ Backend API (port 4000)"
    fi
    
    # Check monitoring scripts
    local monitors=("live-patch-status" "patch-executor" "ghost-bridge" "summary-monitor" "realtime-monitor" "continuous-daemon-manager")
    
    for monitor in "${monitors[@]}"; do
        if is_running "$monitor"; then
            echo "   ✅ $monitor"
        else
            echo "   ❌ $monitor"
        fi
    done
    
    # Check Fly.io and Ghost Runner
    if is_running "fly"; then
        echo "   ✅ Fly.io"
    else
        echo "   ❌ Fly.io"
    fi
    
    if is_running "ghost.*runner"; then
        echo "   ✅ Ghost Runner"
    else
        echo "   ❌ Ghost Runner"
    fi
    
    echo ""
}

# Main boot sequence
main() {
    log "${BLUE}🚀 BOOTING ALL SYSTEMS${NC}"
    log "Project Root: $PROJECT_ROOT"
    log "Scripts Dir: $SCRIPTS_DIR"
    log "Mobile Dir: $MOBILE_DIR"
    log "Backend Dir: $BACKEND_DIR"
    log "Log Dir: $LOG_DIR"
    echo ""
    
    # Step 1: Stop any existing processes
    log "${YELLOW}🛑 Stop{ { { { ping existing processes...${NC & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown}"
    stop_service "expo"
    stop_service "node.*backend"
    stop_service "live-patch-status"
    stop_service "patch-executor"
    stop_service "ghost-bridge"
    stop_service "summary-monitor"
    stop_service "realtime-monitor"
    stop_service "continuous-daemon-manager"
    sleep 3
    
    # Step 2: Start Backend API
    log "${BLUE}📡 Starting Backend API...${NC}"
    if wait_for_port 4000; then
        cd "$BACKEND_DIR"
        start_service "backend-api" "{ { { { npm start" "$LOG_DIR/backend-boot.log" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        cd "$SCRIPTS_DIR"
    else
        log "${RED}Backend port 4000 is still in use${NC}"
    fi
    
    # Step 3: Start Expo Dev Server (port 8081)
    log "${BLUE}📱 Starting Expo Dev Server (port 8081)...${NC}"
    if wait_for_port 8081; then
        cd "$MOBILE_DIR"
        start_service "expo.*8081" "{ { { { npx expo start --port 8081 --no-dev --minify" "$LOG_DIR/expo-boot.log" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        cd "$SCRIPTS_DIR"
    else
        log "${RED}Expo port 8081 is still in use${NC}"
    fi
    
    # Step 4: Start Expo Tunnel Server
    log "${BLUE}🌐 Starting Expo Tunnel Server...${NC}"
    cd "$MOBILE_DIR"
    start_service "expo.*tunnel" "{ { { { npx expo start --tunnel" "$LOG_DIR/expo-tunnel-boot.log" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    cd "$SCRIPTS_DIR"
    
    # Step 5: Start background monitoring processes
    log "${BLUE}🔧 Starting background monitoring processes...${NC}"
    
    # Start continuous daemon manager first
    start_service "continuous-daemon-manager" "{ { { { bash continuous-daemon-manager.sh start" "$LOG_DIR/daemon-manager-boot.log" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    
    # Start individual monitoring scripts
    start_service "live-patch-status" "{ { { node live-patch-status.js start &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown" "$LOG_DIR/live-patch-boot.log"
    start_service "patch-executor" "{ { { node direct-patch-executor.js &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown" "$LOG_DIR/patch-executor-boot.log"
    start_service "ghost-bridge" "{ { { node ghost-bridge.js monitor &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown" "$LOG_DIR/ghost-bridge-boot.log"
    start_service "summary-monitor" "{ { { node summary-monitor.js start &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown" "$LOG_DIR/summary-monitor-boot.log"
    start_service "realtime-monitor" "{ { { node realtime-monitor.js start &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown" "$LOG_DIR/realtime-monitor-boot.log"
    
    # Step 6: Start Fly.io and Ghost Runner (if available)
    log "${BLUE}☁️ Starting cloud services...${NC}"
    
    # Check if fly CLI is available
    if command -v fly &> /dev/null; then
        start_service "fly" "fly deploy" "$LOG_DIR/fly-boot.log"
    else
        log "${YELLOW}Fly CLI not found, skip{ { ping Fly.io deployment${NC & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown}"
    fi
    
    # Start Ghost Runner (if available)
    if [ -d "/Users/sawyer/gitSync/gpt-cursor-runner" ]; then
        cd "/Users/sawyer/gitSync/gpt-cursor-runner"
        start_service "ghost.*runner" "{ { { python3 -m gpt_cursor_runner.main &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown" "$LOG_DIR/ghost-runner-boot.log"
        cd "$SCRIPTS_DIR"
    else
        log "${YELLOW}Ghost Runner directory not found, skipping${NC}"
    fi
    
    # Step 7: Show final status
    sleep 5
    show_status
    
    log "${GREEN}🎉 Boot sequence completed!${NC}"
    log "Check logs in: $LOG_DIR"
    log "Use '{ { { { bash boot-all-systems.sh status' to check status" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    log "Use '{ { { { bash boot-all-systems.sh stop' to stop all systems" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
}

# Handle command line arguments
case "${1:-start}" in
    start)
        main
        ;;
    stop)
        log "${YELLOW}🛑 Stop{ { { { ping all systems...${NC & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown}"
        stop_service "expo"
        stop_service "node.*backend"
        stop_service "live-patch-status"
        stop_service "patch-executor"
        stop_service "ghost-bridge"
        stop_service "summary-monitor"
        stop_service "realtime-monitor"
        stop_service "continuous-daemon-manager"
        stop_service "fly"
        stop_service "ghost.*runner"
        log "${GREEN}✅ All systems stopped${NC}"
        ;;
    status)
        show_status
        ;;
    restart)
        log "${YELLOW}🔄 Restarting all systems...${NC}"
        { { { { bash "$0" stop & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        sleep 3
        { { { { bash "$0" start & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        ;;
    *)
        echo "Usage: $0 [start|stop|status|restart]"
        echo ""
        echo "Commands:"
        echo "  start   - Boot all systems (default)"
        echo "  stop    - Stop all systems"
        echo "  status  - Show current status"
        echo "  restart - Restart all systems"
        echo ""
        echo "Systems started:"
        echo "  • Expo Dev Server (port 8081)"
        echo "  • Expo Tunnel Server"
        echo "  • Backend API (port 4000)"
        echo "  • Live Patch Status Monitor"
        echo "  • Patch Executor"
        echo "  • Ghost Bridge"
        echo "  • Summary Monitor"
        echo "  • Realtime Monitor"
        echo "  • Continuous Daemon Manager"
        echo "  • Fly.io (if available)"
        echo "  • Ghost Runner (if available)"
        ;;
esac 