#!/bin/bash

# Mirror patches and summaries from mobile-native-fresh to unified MAIN cache
# This ensures all patches and summaries written to mobile-native-fresh are also available in .cursor-cache/MAIN

set -e

# Source and destination directories
PATCHES_SOURCE="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/patches"
PATCHES_DEST="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches"
SUMMARIES_SOURCE="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/summaries"
SUMMARIES_DEST="/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Starting comprehensive mirroring to MAIN cache...${NC}"

# Function to mirror directory
mirror_directory() {
    local source="$1"
    local dest="$2"
    local type="$3"
    
    echo -e "${YELLOW}📁 Mirroring $type from $source to $dest${NC}"
    
    # Check if source directory exists
    if [ ! -d "$source" ]; then
        echo -e "${RED}❌ Source directory not found: $source${NC}"
        return 1
    fi
    
    # Check if destination directory exists
    if [ ! -d "$dest" ]; then
        echo -e "${YELLOW}⚠️  Creating destination directory: $dest${NC}"
        mkdir -p "$dest"
    fi
    
    # Create backup of destination before syncing
    BACKUP_DIR="/Users/sawyer/gitSync/_backups/tm-mobile-cursor/$(date +%Y%m%d_%H%M%S)_${type}-mirror-backup"
    echo -e "${YELLOW}📦 Creating backup of MAIN $type to: $BACKUP_DIR${NC}"
    mkdir -p "$BACKUP_DIR"
    cp -r "$dest"/* "$BACKUP_DIR/" 2>/dev/null || echo "No existing files to backup"
    
    # Sync all files from source to destination
    echo -e "${GREEN}🔄 Syncing $type from $source to $dest${NC}"
    rsync -av --delete "$source/" "$dest/"
    
    # Verify sync
    if diff -r "$source" "$dest" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $type sync verification: Directories are identical${NC}"
    else
        echo -e "${RED}❌ $type sync verification: Differences detected${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ $type mirroring completed${NC}"
}

# Mirror patches
if [ -d "$PATCHES_SOURCE" ]; then
    mirror_directory "$PATCHES_SOURCE" "$PATCHES_DEST" "patches"
else
    echo -e "${YELLOW}⚠️  Patches directory not found: $PATCHES_SOURCE${NC}"
fi

# Mirror summaries
if [ -d "$SUMMARIES_SOURCE" ]; then
    mirror_directory "$SUMMARIES_SOURCE" "$SUMMARIES_DEST" "summaries"
else
    echo -e "${YELLOW}⚠️  Summaries directory not found: $SUMMARIES_SOURCE${NC}"
fi

echo -e "${GREEN}🎉 Comprehensive mirroring completed successfully!${NC}"
echo -e "${YELLOW}📊 Summary:${NC}"
echo "  Patches: $PATCHES_SOURCE → $PATCHES_DEST"
echo "  Summaries: $SUMMARIES_SOURCE → $SUMMARIES_DEST" 