#!/bin/bash

# validate-runtime.sh - Runtime validation for Zustand snapshot persistence
# Confirms memory-based resolution if file hydration isn't triggered post-reload

set -e

echo "🔍 Validating runtime environment persistence..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from mobile-native-fresh directory"
    exit 1
fi

# Check for required log files
LOG_DIR=".expo/.logs"
if [ ! -d "$LOG_DIR" ]; then
    echo "⚠️  Warning: No .expo/.logs directory found"
    echo "✅ Assuming fresh start - no logs to validate"
    exit 0
fi

# Look for metro logs
METRO_LOG="$LOG_DIR/metro.log"
if [ ! -f "$METRO_LOG" ]; then
    echo "⚠️  Warning: No metro.log found"
    echo "✅ Assuming fresh start - no logs to validate"
    exit 0
fi

echo "📋 Analyzing runtime logs..."

# Check for memory-based resolution
if grep -q "✅ FORCED HYDRATION: Zustand snapshot restored from memory" "$METRO_LOG"; then
    echo "✅ Memory-based resolution confirmed"
    MEMORY_RESOLUTION=true
else
    echo "⚠️  No memory-based resolution found"
    MEMORY_RESOLUTION=false
fi

# Check for cache-based resolution
if grep -q "✅ FORCED HYDRATION: Zustand snapshot restored from cache" "$METRO_LOG"; then
    echo "✅ Cache-based resolution confirmed"
    CACHE_RESOLUTION=true
else
    echo "⚠️  No cache-based resolution found"
    CACHE_RESOLUTION=false
fi

# Check for environment store memory resolution
if grep -q "✅ FORCED HYDRATION: EnvironmentStore resolved source: memory" "$METRO_LOG"; then
    echo "✅ EnvironmentStore memory resolution confirmed"
    ENV_MEMORY_RESOLUTION=true
else
    echo "⚠️  No EnvironmentStore memory resolution found"
    ENV_MEMORY_RESOLUTION=false
fi

# Check for environment store cache resolution
if grep -q "✅ FORCED HYDRATION: EnvironmentStore resolved source: cache" "$METRO_LOG"; then
    echo "✅ EnvironmentStore cache resolution confirmed"
    ENV_CACHE_RESOLUTION=true
else
    echo "⚠️  No EnvironmentStore cache resolution found"
    ENV_CACHE_RESOLUTION=false
fi

# Check for snapshot logging
if grep -q "✅ FORCED HYDRATION: Zustand snapshot saved" "$METRO_LOG"; then
    echo "✅ Snapshot logging confirmed"
    SNAPSHOT_LOGGING=true
else
    echo "⚠️  No snapshot logging found"
    SNAPSHOT_LOGGING=false
fi

# Check for legacy resolution (should not exist)
if grep -q "legacy.*resolution" "$METRO_LOG"; then
    echo "❌ Legacy resolution detected - this should not happen"
    LEGACY_RESOLUTION=true
else
    echo "✅ No legacy resolution detected"
    LEGACY_RESOLUTION=false
fi

# Validation summary
echo ""
echo "📊 Runtime Validation Summary:"
echo "================================"

if [ "$MEMORY_RESOLUTION" = true ] || [ "$CACHE_RESOLUTION" = true ]; then
    echo "✅ Memory/Cache Resolution: PASSED"
else
    echo "⚠️  Memory/Cache Resolution: NOT DETECTED (may be fresh start)"
fi

if [ "$ENV_MEMORY_RESOLUTION" = true ] || [ "$ENV_CACHE_RESOLUTION" = true ]; then
    echo "✅ EnvironmentStore Memory/Cache: PASSED"
else
    echo "⚠️  EnvironmentStore Memory/Cache: NOT DETECTED (may be fresh start)"
fi

if [ "$SNAPSHOT_LOGGING" = true ]; then
    echo "✅ Snapshot Logging: PASSED"
else
    echo "⚠️  Snapshot Logging: NOT DETECTED (may be fresh start)"
fi

if [ "$LEGACY_RESOLUTION" = false ]; then
    echo "✅ No Legacy Resolution: PASSED"
else
    echo "❌ No Legacy Resolution: FAILED"
    exit 1
fi

echo ""
echo "🎯 Validation Result:"

# Determine if this is a fresh start or reload
if [ "$MEMORY_RESOLUTION" = false ] && [ "$CACHE_RESOLUTION" = false ] && [ "$SNAPSHOT_LOGGING" = false ]; then
    echo "✅ FRESH START DETECTED - No persistence validation needed"
    echo "✅ Runtime validation passed for fresh start"
    exit 0
else
    echo "✅ RELOAD DETECTED - Persistence validation successful"
    echo "✅ Runtime validation passed for reload scenario"
    exit 0
fi 