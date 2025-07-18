#!/bin/bash

# Comprehensive Backup Script for tm-mobile-cursor project
# Supports both full project backup and mobile-native-fresh specific backup

TAG="$1"
BACKUP_TYPE="$2"  # "full" or "mobile-fresh" or "both"
DATESTAMP=$(date -u +"%Y%m%d_%H%MUTC")

if [ -z "$TAG" ]; then
  echo "Error: Must provide tag name as argument"
  echo "Usage: $0 <tag_name> [backup_type]"
  echo "  backup_type: full, mobile-fresh, or both (default: both)"
  exit 1
fi

if [ -z "$BACKUP_TYPE" ]; then
  BACKUP_TYPE="both"
fi

echo "=== Comprehensive Backup for tm-mobile-cursor ==="
echo "Tag: $TAG"
echo "Backup Type: $BACKUP_TYPE"
echo "Timestamp: $DATESTAMP"
echo ""

# Function to backup full tm-mobile-cursor project
backup_full_project() {
  echo "📁 Backing up full tm-mobile-cursor project..."
  FULL_BACKUP_DIR="/Users/sawyer/gitBackups/full_${TAG}_${DATESTAMP}"
  mkdir -p "$FULL_BACKUP_DIR"
  
  # Go to parent directory (tm-mobile-cursor root)
  cd ..
  
  echo "  Copying entire tm-mobile-cursor directory..."
  cp -R . "$FULL_BACKUP_DIR/"
  
  echo "  Full backup complete: $FULL_BACKUP_DIR"
  echo ""
}

# Function to backup mobile-native-fresh .git specifically
backup_mobile_fresh_git() {
  echo "📱 Backing up mobile-native-fresh .git..."
  MOBILE_BACKUP_DIR="/Users/sawyer/gitBackups/mobile-fresh_${TAG}_${DATESTAMP}"
  mkdir -p "$MOBILE_BACKUP_DIR"
  
  # Stay in mobile-native-fresh directory
  echo "  Copying .git from mobile-native-fresh..."
  if [ -d ".git" ]; then
    cp -R .git "$MOBILE_BACKUP_DIR/.git"
    echo "  Mobile-fresh .git backup complete: $MOBILE_BACKUP_DIR"
  else
    echo "  ⚠️  Warning: .git directory not found in mobile-native-fresh"
  fi
  echo ""
}

# Function to push git tag
push_git_tag() {
  echo "🏷️  Pushing git tag..."
  git push origin "$TAG"
  if [ $? -eq 0 ]; then
    echo "  ✅ Tag $TAG pushed successfully"
  else
    echo "  ⚠️  Warning: Failed to push tag $TAG"
  fi
  echo ""
}

# Main execution
case "$BACKUP_TYPE" in
  "full")
    backup_full_project
    ;;
  "mobile-fresh")
    backup_mobile_fresh_git
    ;;
  "both")
    backup_full_project
    backup_mobile_fresh_git
    ;;
  *)
    echo "Error: Invalid backup type '$BACKUP_TYPE'"
    echo "Valid options: full, mobile-fresh, both"
    exit 1
    ;;
esac

# Push git tag
push_git_tag

echo "=== Backup Summary ==="
echo "Tag: $TAG"
echo "Backup Type: $BACKUP_TYPE"
echo "Timestamp: $DATESTAMP"
echo ""
echo "Backup locations:"
if [ "$BACKUP_TYPE" = "full" ] || [ "$BACKUP_TYPE" = "both" ]; then
  echo "  Full project: /Users/sawyer/gitBackups/full_${TAG}_${DATESTAMP}"
fi
if [ "$BACKUP_TYPE" = "mobile-fresh" ] || [ "$BACKUP_TYPE" = "both" ]; then
  echo "  Mobile-fresh .git: /Users/sawyer/gitBackups/mobile-fresh_${TAG}_${DATESTAMP}"
fi
echo ""
echo "✅ Comprehensive backup complete!"
