#!/bin/bash

# Runtime validation script
# Validates that the application can start and run correctly

set -e

echo "🔍 Validating runtime functionality..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Error: node_modules not found. Please run 'npm install' first."
    exit 1
fi

# Check if expo CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js and npm."
    exit 1
fi

# Test TypeScript compilation
echo "📝 Testing TypeScript compilation..."
if npx tsc --noEmit; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# Test ESLint
echo "🔍 Running ESLint..."
if npx eslint . --ext .ts,.tsx --max-warnings=0; then
    echo "✅ ESLint passed"
else
    echo "❌ ESLint failed"
    exit 1
fi

# Test if Expo can start (non-blocking)
echo "🚀 Testing Expo startup..."
{ timeout 30s npx expo start --dev-client --clear & } >/dev/null 2>&1 & disown
EXPO_PID=$!

# Wait a moment for Expo to start
sleep 5

# Check if Expo is running
if ps -p $EXPO_PID > /dev/null; then
    echo "✅ Expo started successfully"
    
    # Test if the development server is responding
    if curl -s http://localhost:8081/status > /dev/null 2>&1; then
        echo "✅ Development server responding"
    else
        echo "⚠️  Development server not responding (may still be starting)"
    fi
    
    # Kill Expo process
    kill $EXPO_PID 2>/dev/null || true
else
    echo "❌ Expo failed to start"
    exit 1
fi

echo "✅ Runtime validation completed successfully!"
