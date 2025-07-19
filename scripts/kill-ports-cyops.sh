#!/bin/bash
# kill-ports-cyops.sh
# Kills all ports and processes for the CYOPS project (tm-mobile-cursor)

echo "🔄 Killing ports for CYOPS project..."

# Kill Expo development server
echo "📱 Killing Expo development server..."
pkill -f "expo start" 2>/dev/null || true
pkill -f "expo" 2>/dev/null || true
pkill -f "npx expo" 2>/dev/null || true

# Kill Metro bundler
echo "🚇 Killing Metro bundler..."
pkill -f "metro" 2>/dev/null || true
pkill -f "metro.*start" 2>/dev/null || true

# Kill backend API
echo "🔧 Killing backend API..."
pkill -f "nodemon.*backend" 2>/dev/null || true
pkill -f "ts-node.*backend" 2>/dev/null || true
pkill -f "node.*backend" 2>/dev/null || true

# Kill specific ports
echo "🔌 Killing specific ports..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
lsof -ti:19006 | xargs kill -9 2>/dev/null || true

# Wait a moment for processes to fully terminate
sleep 2

# Verify ports are free
echo "🔍 Verifying ports are free..."
if lsof -i:4000 >/dev/null 2>&1; then
    echo "⚠️  Port 4000 still in use"
else
    echo "✅ Port 4000 is free"
fi

if lsof -i:8081 >/dev/null 2>&1; then
    echo "⚠️  Port 8081 still in use"
else
    echo "✅ Port 8081 is free"
fi

if lsof -i:19006 >/dev/null 2>&1; then
    echo "⚠️  Port 19006 still in use"
else
    echo "✅ Port 19006 is free"
fi

echo "✅ CYOPS project ports killed" 