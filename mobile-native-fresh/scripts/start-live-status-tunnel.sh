#!/bin/bash

# start-live-status-tunnel.sh
# Start live patch status server and ngrok tunnel

set -e

echo "🚀 Starting live patch status server and ngrok tunnel..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Kill any existing processes
echo "🔄 Stopping existing processes..."
pkill -f "live-patch-status-server.js" || true
pkill -f "ngrok http 4123" || true

# Start the live patch status server
echo "📡 Starting live patch status server..."
nohup node scripts/live-patch-status-server.js > logs/live-status-server.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Check if server is running
if ! curl -s http://localhost:4123/health > /dev/null; then
    echo "❌ Server failed to start. Check logs/live-status-server.log"
    exit 1
fi

echo "✅ Server started successfully"

# Start ngrok tunnel
echo "🔗 Starting ngrok tunnel..."
nohup ngrok http 4123 > logs/ngrok-tunnel.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok to start
echo "⏳ Waiting for ngrok tunnel to start..."
sleep 5

# Extract ngrok URL from logs
echo "🔍 Looking for ngrok URL..."
if [ -f logs/ngrok-tunnel.log ]; then
    NGROK_URL=$(grep -o "https://[a-zA-Z0-9]*\.ngrok\.io" logs/ngrok-tunnel.log | head -1)
    if [ -n "$NGROK_URL" ]; then
        echo "✅ Tunnel launched successfully!"
        echo "🔗 Public URL: $NGROK_URL"
        echo "📊 Status endpoints:"
        echo "   - $NGROK_URL/          - Basic patch status"
        echo "   - $NGROK_URL/detailed  - Detailed patch status"
        echo "   - $NGROK_URL/json      - JSON patch status"
        echo "   - $NGROK_URL/health    - Health check"
        echo ""
        echo "📝 Logs:"
        echo "   - Server: logs/live-status-server.log"
        echo "   - Tunnel: logs/ngrok-tunnel.log"
        echo ""
        echo "🔄 To stop: pkill -f 'live-patch-status-server.js' && pkill -f 'ngrok http 4123'"
    else
        echo "⚠️  Tunnel started but URL not found in logs"
        echo "📝 Check logs/ngrok-tunnel.log for details"
    fi
else
    echo "❌ Failed to start ngrok tunnel"
    echo "📝 Check logs/ngrok-tunnel.log for details"
fi

# Save PIDs for later cleanup
echo $SERVER_PID > logs/live-status-server.pid
echo $NGROK_PID > logs/ngrok-tunnel.pid

echo "✅ Live patch status tunnel setup complete!" 