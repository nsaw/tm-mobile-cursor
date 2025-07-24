#!/bin/{ { { { bash
# start-cyops.sh & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Starts the CYOPS project (tm-mobile-cursor) with port management

echo "🚀 Starting CYOPS project..."

# Change to project directory
cd "$(dirname "$0")/.."

# Kill existing processes first
echo "🔄 Killing existing processes..."
./scripts/kill-ports-cyops.sh

# Set environment variables
export PORT=4000
export API_PORT=4000
export EXPO_PORT=8081
export METRO_PORT=8081
export EXPO_WEB_PORT=19006
export NODE_ENV=development
export DEBUG=true

# Start backend API
echo "🔧 Starting backend API on port 4000..."
cd mobile-native-fresh/backend
{ { { { npm run dev & & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend API to start..."
sleep 8

# Start Expo development server
echo "📱 Starting Expo dev server on port 8081..."
cd ..
{ { { { npx expo start --port 8081 & & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
EXPO_PID=$!

# Wait for Expo to start
echo "⏳ Waiting for Expo server to start..."
sleep 8

# Health checks
echo "🔍 Running health checks..."

# Check backend API
if { { { { curl -s http://localhost:4000/health > /dev/null 2>&1 & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown; then
    echo "✅ Backend API healthy on port 4000"
else
    echo "❌ Backend API failed on port 4000"
    echo "📋 Backend API logs:"
    { { { { ps -p $BACKEND_PID >/dev/null 2>&1 && echo "Process still running" || echo "Process not found" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
fi

# Check Expo server
if { { { { curl -s http://localhost:8081 > /dev/null 2>&1 & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown; then
    echo "✅ Expo server healthy on port 8081"
else
    echo "❌ Expo server failed on port 8081"
    echo "📋 Expo server logs:"
    { { { { ps -p $EXPO_PID >/dev/null 2>&1 && echo "Process still running" || echo "Process not found" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
fi

# Show running processes
echo "📊 Running processes:"
{ { { { ps aux | grep -E "(expo|metro|nodemon.*backend|ts-node.*backend)" | grep -v grep & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Show port usage
echo "🔌 Port usage:"
lsof -i:4000,8081,19006 2>/dev/null || echo "No processes found on ports 4000, 8081, 19006"

echo "🎉 CYOPS project started successfully!"
echo "🔧 Backend API: http://localhost:4000"
echo "📱 Expo Dev Server: http://localhost:8081"
echo "🔗 Health Check: http://localhost:4000/health" 