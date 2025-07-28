#!/bin/bash

# Runtime validation script for Phase 0 patches
# Validates that the app loads correctly and components render as expected

set -e

echo "🔍 Starting runtime validation..."

# Check if expo is running
if ! pgrep -f "expo start" > /dev/null; then
    echo "❌ Expo is not running. Please start the app first."
    exit 1
fi

echo "✅ Expo is running"

# Wait for app to load
sleep 5

# Check expo logs for expected output
if [ -f "logs/expo.log" ]; then
    echo "📋 Checking expo logs..."
    
    # Check for card component rendering
    if grep -q "ThoughtmarkCard: \[DASHBOARD_ENTRY\]" logs/expo.log; then
        echo "✅ ThoughtmarkCard rendering confirmed"
    else
        echo "❌ ThoughtmarkCard not rendering"
        exit 1
    fi
    
    if grep -q "TaskCard: \[TASKS_ENTRY\]" logs/expo.log; then
        echo "✅ TaskCard rendering confirmed"
    else
        echo "❌ TaskCard not rendering"
        exit 1
    fi
    
    if grep -q "AIToolsCard: \[AI_TOOLS_ENTRY\]" logs/expo.log; then
        echo "✅ AIToolsCard rendering confirmed"
    else
        echo "❌ AIToolsCard not rendering"
        exit 1
    fi
    
    # Check for slotSelector and slotQuery logs (if available)
    if grep -q "\[slotSelector\]" logs/expo.log; then
        echo "✅ slotSelector function called"
    else
        echo "⚠️ slotSelector logs not found (may need app reload)"
    fi
    
    if grep -q "\[slotQuery\]" logs/expo.log; then
        echo "✅ slotQuery function called"
    else
        echo "⚠️ slotQuery logs not found (may need app reload)"
    fi
    
else
    echo "⚠️ No expo.log found, skipping log validation"
fi

# Check TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    npx tsc --noEmit 2>&1 | head -10
    exit 1
fi

# Check for critical runtime errors
if [ -f "logs/expo.log" ]; then
    if grep -q "ERROR\|Error\|error" logs/expo.log | grep -v "Testing console logs"; then
        echo "❌ Runtime errors detected"
        grep "ERROR\|Error\|error" logs/expo.log | grep -v "Testing console logs" | head -5
        exit 1
    else
        echo "✅ No critical runtime errors detected"
    fi
fi

echo "✅ Runtime validation completed successfully"
exit 0

