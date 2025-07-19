#!/bin/bash

# =============================================================================
# TM-MOBILE-CURSOR SYSTEM CONTROL
# =============================================================================
# Simple wrapper for boot and shutdown scripts
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Script paths
BOOT_SCRIPT="$(dirname "$0")/boot-all-systems.sh"
SHUTDOWN_SCRIPT="$(dirname "$0")/shutdown-all-systems.sh"

# Function to show usage
show_usage() {
    echo -e "${BLUE}TM-MOBILE-CURSOR SYSTEM CONTROL${NC}"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start, boot, up     Start all systems"
    echo "  stop, shutdown, down Stop all systems"
    echo "  restart, reboot     Restart all systems"
    echo "  status              Show system status"
    echo "  help                Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 start           # Start all systems"
    echo "  $0 stop            # Stop all systems"
    echo "  $0 restart         # Restart all systems"
    echo "  $0 status          # Check system status"
}

# Function to check system status
check_status() {
    echo -e "${BLUE}=== SYSTEM STATUS ===${NC}"
    
    # Check if PID file exists
    PID_FILE="/Users/sawyer/gitSync/tm-mobile-cursor/logs/boot-pids.json"
    if [ -f "$PID_FILE" ]; then
        echo -e "${GREEN}✅ Systems are running${NC}"
        echo ""
        echo "Running processes:"
        node -e "
        const fs = require('fs');
        try {
            const pids = JSON.parse(fs.readFileSync('$PID_FILE', 'utf8'));
            Object.entries(pids).forEach(([name, info]) => {
                console.log(\`  \${name.padEnd(20)} PID: \${info.pid} (started: \${info.started})\`);
            });
        } catch (e) {
            console.log('Error reading PID file');
        }
        " 2>/dev/null || echo "  Error reading PID file"
    else
        echo -e "${YELLOW}⚠️  No systems are running${NC}"
    fi
    
    echo ""
    echo "Port status:"
    ports=(4000 8081 3000 3001 5050 5051 5052)
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "  ${GREEN}✅ Port $port is in use${NC}"
        else
            echo -e "  ${YELLOW}⚠️  Port $port is free${NC}"
        fi
    done
}

# Main script logic
case "${1:-help}" in
    start|boot|up)
        echo -e "${GREEN}🚀 Starting all systems...${NC}"
        "$BOOT_SCRIPT"
        ;;
    stop|shutdown|down)
        echo -e "${YELLOW}🛑 Stopping all systems...${NC}"
        "$SHUTDOWN_SCRIPT"
        ;;
    restart|reboot)
        echo -e "${CYAN}🔄 Restarting all systems...${NC}"
        "$SHUTDOWN_SCRIPT"
        sleep 3
        "$BOOT_SCRIPT"
        ;;
    status)
        check_status
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_usage
        exit 1
        ;;
esac 