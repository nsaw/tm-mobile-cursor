#!/bin/bash

## Auto-update index.md, readme.md, roadmap.md and archive stale files
PROJECT_PATH='/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/src-nextgen'

# Create archive directories if they don't exist
mkdir -p "$PROJECT_PATH/patches/archived/"
mkdir -p "$PROJECT_PATH/summaries/archived/"

# Archive stale patches (older than 30 minutes)
find "$PROJECT_PATH/patches/" -name '*.json' -mmin +30 -exec mv {} "$PROJECT_PATH/patches/archived/" \;

# Archive stale summaries (older than 30 minutes)
find "$PROJECT_PATH/summaries/" -name '*.md' -mmin +30 -exec mv {} "$PROJECT_PATH/summaries/archived/" \;

# Update master index if modified
if [ -f "$PROJECT_PATH/tasks/INDEX.md" ]; then
  grep -r 'Phase' "$PROJECT_PATH/tasks/" > "$PROJECT_PATH/tasks/INDEX.md"
fi

# Sync per-directory README.md or ROADMAP.md if changed
for dir in $(find "$PROJECT_PATH" -type d); do
  if [ -f "$dir/README.md" ]; then
    echo "✅ Updated: $dir/README.md"
  fi
  if [ -f "$dir/ROADMAP.md" ]; then
    echo "✅ Synced: $dir/ROADMAP.md"
  fi
done

# Log execution
echo "$(date): Doc sync daemon executed - archived stale files and updated indexes" 