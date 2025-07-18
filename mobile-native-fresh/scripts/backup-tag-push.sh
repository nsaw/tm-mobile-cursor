#!/bin/bash

TAG="$1"
DATESTAMP=$(date -u +"%Y%m%d_%H%MUTC")

if [ -z "$TAG" ]; then
  echo "Error: Must provide tag name as argument"
  exit 1
fi

BACKUP_DIR="/Users/sawyer/gitBackups/${TAG}_${DATESTAMP}"
mkdir -p "$BACKUP_DIR"

echo "Backing up .git/ to $BACKUP_DIR"
cp -R .git "$BACKUP_DIR/.git"

echo "Backup complete."

echo "Pushing tag $TAG to origin..."
git push origin "$TAG"

echo "Done: tag pushed and git backup created at:"
echo "$BACKUP_DIR"
