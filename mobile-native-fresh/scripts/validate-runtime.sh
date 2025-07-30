#!/bin/bash

echo "🔍 Runtime validation starting..."

# Run process monitor first
echo "🔍 Checking for runaway processes..."
bash scripts/process-monitor.sh

# Check if Expo is running
if curl -s http://localhost:8081/status >/dev/null 2>&1; then
    echo "✅ Expo server is running on port 8081"
else
    echo "❌ Expo server not running on port 8081"
    exit 1
fi

# Check if app is responding
if curl -s http://localhost:8081/logs >/dev/null 2>&1; then
    echo "✅ App logs endpoint responding"
else
    echo "❌ App logs endpoint not responding"
    exit 1
fi

# Check for auth logs
if curl -s http://localhost:8081/logs | grep -q "\[AUTH\]" 2>/dev/null; then
    echo "✅ Auth logs detected"
else
    echo "⚠️ Auth logs not detected (may be normal during startup)"
fi

# Check memory usage
MEMORY_USAGE=$(ps aux | grep -i node | grep -v grep | awk '{sum+=$6} END {print sum/1024}')
echo "📊 Current Node memory usage: ${MEMORY_USAGE}MB"

# Memory threshold check (2GB)
MEMORY_THRESHOLD=2048
if (( $(echo "$MEMORY_USAGE > $MEMORY_THRESHOLD" | bc -l) )); then
    echo "⚠️ High memory usage detected: ${MEMORY_USAGE}MB"
    echo "🧹 Running memory cleanup..."
    bash scripts/process-monitor.sh
fi

echo "✅ Runtime validation complete"
exit 0 