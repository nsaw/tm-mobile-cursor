#!/bin/bash

# Mirror patches from mobile-native-fresh to unified MAIN cache
# This ensures all patches written to mobile-native-fresh/patches also appear in .cursor-cache/MAIN/patches

set -e

# Source and destination directories
SOURCE_DIR="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/patches"
DEST_DIR="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Starting patch mirroring from mobile-native-fresh to MAIN cache...${NC}"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}❌ Source directory not found: $SOURCE_DIR${NC}"
    exit 1
fi

# Check if destination directory exists
if [ ! -d "$DEST_DIR" ]; then
    echo -e "${RED}❌ Destination directory not found: $DEST_DIR${NC}"
    exit 1
fi

# Create backup of destination before syncing
BACKUP_DIR="/Users/sawyer/gitSync/_backups/tm-mobile-cursor/$(date +%Y%m%d_%H%M%S)_patch-mirror-backup"
echo -e "${YELLOW}📦 Creating backup of MAIN patches to: $BACKUP_DIR${NC}"
mkdir -p "$BACKUP_DIR"
cp -r "$DEST_DIR"/* "$BACKUP_DIR/" 2>/dev/null || echo "No existing files to backup"

# Sync all files from source to destination
echo -e "${GREEN}🔄 Syncing patches from $SOURCE_DIR to $DEST_DIR${NC}"
rsync -av --delete "$SOURCE_DIR/" "$DEST_DIR/"

# Verify sync
echo -e "${GREEN}✅ Patch mirroring completed${NC}"
echo -e "${YELLOW}📊 Summary:${NC}"
echo "  Source: $SOURCE_DIR"
echo "  Destination: $DEST_DIR"
echo "  Backup: $BACKUP_DIR"

# Check for any differences
if diff -r "$SOURCE_DIR" "$DEST_DIR" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Sync verification: Directories are identical${NC}"
else
    echo -e "${RED}❌ Sync verification: Differences detected${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Patch mirroring completed successfully!${NC}" 