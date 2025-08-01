#!/bin/bash

# Script to fix JSON control characters in the problematic patch

set -e

PATCH_FILE="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-4/patch-v1.4.510(P4.02.05)_createbin-screen-migration-hardened.json"
BACKUP_FILE="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-4/patch-v1.4.510(P4.02.05)_createbin-screen-migration-hardened-backup.json"

echo "🔧 Fixing JSON control characters in: $PATCH_FILE"

# Create backup if it doesn't exist
if [ ! -f "$BACKUP_FILE" ]; then
    echo "📦 Creating backup: $BACKUP_FILE"
    cp "$PATCH_FILE" "$BACKUP_FILE"
fi

# Fix the JSON by properly escaping quotes and removing control characters
echo "🔧 Processing JSON file..."

# Create a temporary file
TEMP_FILE=$(mktemp)

# Use sed to fix common JSON issues
sed 's/\\"/"/g' "$PATCH_FILE" | \
sed 's/"/\\"/g' | \
sed 's/\\\\"/"/g' | \
sed 's/\\\\n/\\n/g' | \
sed 's/\\\\t/\\t/g' | \
sed 's/\\\\r/\\r/g' > "$TEMP_FILE"

# Validate the fixed JSON
if jq '.' "$TEMP_FILE" > /dev/null 2>&1; then
    echo "✅ JSON validation passed"
    mv "$TEMP_FILE" "$PATCH_FILE"
    echo "✅ Fixed JSON saved to: $PATCH_FILE"
else
    echo "❌ JSON still has errors, trying alternative approach..."
    rm "$TEMP_FILE"
    
    # Alternative approach: use jq to parse and reformat
    if jq -c '.' "$BACKUP_FILE" > "$TEMP_FILE" 2>/dev/null; then
        echo "✅ Alternative JSON fix successful"
        mv "$TEMP_FILE" "$PATCH_FILE"
        echo "✅ Fixed JSON saved to: $PATCH_FILE"
    else
        echo "❌ Failed to fix JSON automatically"
        echo "🔍 Manual inspection required"
        rm -f "$TEMP_FILE"
        exit 1
    fi
fi

echo "🎯 JSON control character fix complete!" 