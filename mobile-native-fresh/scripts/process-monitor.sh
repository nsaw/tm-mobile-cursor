#!/bin/bash

echo "🔍 Process Monitor - Checking for runaway processes..."

# Check for Jest processes
JEST_COUNT=$(ps aux | grep -i jest | grep -v grep | wc -l)
echo "📊 Jest processes: $JEST_COUNT"

# Check for Node processes
NODE_COUNT=$(ps aux | grep -i node | grep -v grep | wc -l)
echo "📊 Node processes: $NODE_COUNT"

# Check for Expo processes
EXPO_COUNT=$(ps aux | grep -i expo | grep -v grep | wc -l)
echo "📊 Expo processes: $EXPO_COUNT"

# Thresholds
JEST_THRESHOLD=5
NODE_THRESHOLD=20
EXPO_THRESHOLD=3

# Cleanup if thresholds exceeded
if [ $JEST_COUNT -gt $JEST_THRESHOLD ]; then
    echo "⚠️ Jest process count ($JEST_COUNT) exceeds threshold ($JEST_THRESHOLD)"
    echo "🧹 Cleaning up Jest processes..."
    pkill -f "jest-worker" 2>/dev/null || true
    pkill -f "jest" 2>/dev/null || true
    sleep 2
    REMAINING_JEST=$(ps aux | grep -i jest | grep -v grep | wc -l)
    echo "✅ Jest cleanup complete. Remaining: $REMAINING_JEST"
fi

if [ $NODE_COUNT -gt $NODE_THRESHOLD ]; then
    echo "⚠️ Node process count ($NODE_COUNT) exceeds threshold ($NODE_THRESHOLD)"
    echo "🧹 Cleaning up orphaned Node processes..."
    # Kill Node processes that are not Expo or critical services
    ps aux | grep -i node | grep -v grep | grep -v expo | grep -v "react-native" | awk '{print $2}' | xargs kill -9 2>/dev/null || true
    sleep 2
    REMAINING_NODE=$(ps aux | grep -i node | grep -v grep | wc -l)
    echo "✅ Node cleanup complete. Remaining: $REMAINING_NODE"
fi

# Check memory usage
MEMORY_USAGE=$(ps aux | grep -i node | grep -v grep | awk '{sum+=$6} END {print sum/1024}')
echo "📊 Total Node memory usage: ${MEMORY_USAGE}MB"

# Check for specific problematic patterns
if ps aux | grep -q "jest-worker.*processChild"; then
    echo "⚠️ Detected Jest worker processes - potential memory leak"
    pkill -f "processChild" 2>/dev/null || true
fi

echo "✅ Process monitoring complete" 