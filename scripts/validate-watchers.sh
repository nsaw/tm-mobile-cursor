#!/bin/{ { { { bash

# Validate GHOST 2.x Watcher Paths & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Ensures all routing paths are correctly configured

set -e

PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

echo "🔍 Validating GHOST 2.x watcher paths..."

# Check if required directories exist
echo "📁 Checking directory structure..."

PATCH_WATCH_DIR="$PROJECT_ROOT/.cursor-cache/MAIN/patches"
PATCH_COMPLETED_DIR="$PROJECT_ROOT/.cursor-cache/MAIN/patches/.completed"
SUMMARY_WRITE_DIR="$PROJECT_ROOT/.cursor-cache/CYOPS/summaries"
SUMMARY_ARCHIVE_DIR="$PROJECT_ROOT/.cursor-cache/CYOPS/summaries/.archive"

# Validate patch directories
if [ ! -d "$PATCH_WATCH_DIR" ]; then
    echo "❌ Patch watch directory missing: $PATCH_WATCH_DIR"
    exit 1
fi

if [ ! -d "$PATCH_COMPLETED_DIR" ]; then
    echo "❌ Patch completed directory missing: $PATCH_COMPLETED_DIR"
    exit 1
fi

if [ ! -d "$SUMMARY_WRITE_DIR" ]; then
    echo "❌ Summary write directory missing: $SUMMARY_WRITE_DIR"
    exit 1
fi

if [ ! -d "$SUMMARY_ARCHIVE_DIR" ]; then
    echo "❌ Summary archive directory missing: $SUMMARY_ARCHIVE_DIR"
    exit 1
fi

echo "✅ All required directories exist"

# Test file writing permissions
echo "📝 Testing write permissions..."

# Test patch directory write
TEST_PATCH="$PATCH_WATCH_DIR/test-validation-patch.json"
echo '{"test": "validation"}' > "$TEST_PATCH"
if [ -f "$TEST_PATCH" ]; then
    echo "✅ Patch directory writable"
    rm "$TEST_PATCH"
else
    echo "❌ Patch directory not writable"
    exit 1
fi

# Test summary directory write
TEST_SUMMARY="$SUMMARY_WRITE_DIR/test-validation-summary.md"
echo "# Test Summary" > "$TEST_SUMMARY"
if [ -f "$TEST_SUMMARY" ]; then
    echo "✅ Summary directory writable"
    rm "$TEST_SUMMARY"
else
    echo "❌ Summary directory not writable"
    exit 1
fi

# Validate paths.js constants
echo "🔧 Validating paths constants..."

if [ ! -f "$SCRIPTS_DIR/constants/paths.js" ]; then
    echo "❌ paths.js constants file missing"
    exit 1
fi

# Check if paths.js contains required exports
if grep -q "PATCH_WATCH_DIR" "$SCRIPTS_DIR/constants/paths.js"; then
    echo "✅ PATCH_WATCH_DIR constant found"
else
    echo "❌ PATCH_WATCH_DIR constant missing"
    exit 1
fi

if grep -q "SUMMARY_WRITE_DIR" "$SCRIPTS_DIR/constants/paths.js"; then
    echo "✅ SUMMARY_WRITE_DIR constant found"
else
    echo "❌ SUMMARY_WRITE_DIR constant missing"
    exit 1
fi

# Test patch watcher
echo "👁️  Testing patch watcher..."

if [ ! -f "$SCRIPTS_DIR/watchers/patch-watcher.js" ]; then
    echo "❌ Patch watcher file missing"
    exit 1
fi

# Test summary writer
echo "📄 Testing summary writer..."

if [ ! -f "$SCRIPTS_DIR/summary-writer.js" ]; then
    echo "❌ Summary writer file missing"
    exit 1
fi

# Test Node.js module syntax
echo "🔧 Testing module syntax..."

cd "$SCRIPTS_DIR"

# Test paths.js import
if { { { { node -e "import('./constants/paths.js').then(() => console.log('✅ paths.js imports successfully')).catch(e => { console.error('❌ paths.js import failed:', e.message) & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown; process.exit(1); })" 2>/dev/null; then
    echo "✅ paths.js module syntax valid"
else
    echo "❌ paths.js module syntax invalid"
    exit 1
fi

# Test summary writer
if { { { { node -e "import('./summary-writer.js').then(() => console.log('✅ summary-writer.js imports successfully')).catch(e => { console.error('❌ summary-writer.js import failed:', e.message) & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown; process.exit(1); })" 2>/dev/null; then
    echo "✅ summary-writer.js module syntax valid"
else
    echo "❌ summary-writer.js module syntax invalid"
    exit 1
fi

echo ""
echo "🎉 All GHOST 2.x watcher validations passed!"
echo "✅ Directory structure: Valid"
echo "✅ Write permissions: Valid"
echo "✅ Path constants: Valid"
echo "✅ Module syntax: Valid"
echo "✅ Watcher files: Valid"

exit 0 