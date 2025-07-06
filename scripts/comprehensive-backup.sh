#!/bin/bash

# Usage: ./comprehensive-backup.sh <version> <tag>
# Example: ./comprehensive-backup.sh v1.4.0 pre-autoroleview-cleanup

VERSION="$1"
TAG="$2"
DATESTAMP=$(date -u +"%y%m%d_%H%MUTC")

if [ -z "$VERSION" ] || [ -z "$TAG" ]; then
  echo "Error: Must provide version and tag as arguments"
  echo "Usage: $0 <version> <tag>"
  exit 1
fi

BACKUP_DIR="/Users/sawyer/gitSync/tm-safety_backups"
BACKUP_NAME="${DATESTAMP}_${VERSION}_${TAG}_backup_tm-mobile-cursor.tar.gz"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

cd "$(dirname "$0")/.." # Go to tm-mobile-cursor root

# Exclude node_modules, .expo, and log/tmp files
EXCLUDES=(--exclude=node_modules --exclude=.expo --exclude='*.log' --exclude='*.tmp')

echo "Creating backup: $BACKUP_PATH"
tar -czf "$BACKUP_PATH" "${EXCLUDES[@]}" .

if [ $? -eq 0 ]; then
  echo "✅ Backup created at $BACKUP_PATH"
else
  echo "❌ Backup failed!"
  exit 2
fi 