#!/bin/bash

# ngrok-tunnel-manager.sh
# Manages ngrok tunnels using agent configuration

set -e

CONFIG_FILE="$HOME/Library/Application Support/ngrok/ngrok.yml"
WEB_INTERFACE="http://localhost:4040"

function show_usage() {
    echo "Usage: $0 [start|stop|status|restart|list]"
    echo ""
    echo "Commands:"
    echo "  start   - Start all tunnels defined in ngrok config"
    echo "  stop    - Stop all ngrok tunnels"
    echo "  status  - Show status of all tunnels"
    echo "  restart - Restart all tunnels"
    echo "  list    - List all tunnel URLs"
    echo ""
}

function check_ngrok() {
    if ! command -v ngrok &> /dev/null; then
        echo "❌ ngrok not found. Please install ngrok first."
        exit 1
    fi
}

function start_tunnels() {
    echo "🚀 Starting all ngrok tunnels..."
    check_ngrok
    
    # Kill existing tunnels
    pkill -f ngrok || true
    
    # Start all tunnels
    nohup ngrok start --all > logs/ngrok-all-tunnels.log 2>&1 &
    NGROK_PID=$!
    echo $NGROK_PID > logs/ngrok-all-tunnels.pid
    
    echo "⏳ Waiting for tunnels to start..."
    sleep 5
    
    # Check if tunnels started successfully
    if curl -s "$WEB_INTERFACE/api/tunnels" > /dev/null 2>&1; then
        echo "✅ Tunnels started successfully!"
        list_tunnels
    else
        echo "❌ Failed to start tunnels. Check logs/ngrok-all-tunnels.log"
        exit 1
    fi
}

function stop_tunnels() {
    echo "🛑 Stopping all ngrok tunnels..."
    pkill -f ngrok || true
    rm -f logs/ngrok-all-tunnels.pid
    echo "✅ All tunnels stopped"
}

function show_status() {
    echo "📊 Ngrok Tunnel Status"
    echo "======================"
    
    if pgrep -f ngrok > /dev/null; then
        echo "🟢 Ngrok is running"
        echo ""
        echo "🌐 Web Interface: $WEB_INTERFACE"
        echo ""
        
        # Get tunnel information
        if curl -s "$WEB_INTERFACE/api/tunnels" > /dev/null 2>&1; then
            echo "📡 Active Tunnels:"
            curl -s "$WEB_INTERFACE/api/tunnels" | jq -r '.tunnels[] | "  \(.name): \(.public_url) -> \(.config.addr)"' 2>/dev/null || echo "  No tunnels found"
        else
            echo "⚠️  Web interface not accessible"
        fi
    else
        echo "🔴 Ngrok is not running"
    fi
    
    echo ""
    echo "📝 Logs: logs/ngrok-all-tunnels.log"
}

function list_tunnels() {
    echo "🔗 Active Tunnel URLs:"
    echo "======================"
    
    if curl -s "$WEB_INTERFACE/api/tunnels" > /dev/null 2>&1; then
        curl -s "$WEB_INTERFACE/api/tunnels" | jq -r '.tunnels[] | "\(.name): \(.public_url)"' 2>/dev/null || echo "No tunnels found"
    else
        echo "No tunnels accessible"
    fi
}

function restart_tunnels() {
    echo "🔄 Restarting all tunnels..."
    stop_tunnels
    sleep 2
    start_tunnels
}

# Create logs directory
mkdir -p logs

# Main execution
case "${1:-}" in
    start)
        start_tunnels
        ;;
    stop)
        stop_tunnels
        ;;
    status)
        show_status
        ;;
    restart)
        restart_tunnels
        ;;
    list)
        list_tunnels
        ;;
    *)
        show_usage
        exit 1
        ;;
esac 