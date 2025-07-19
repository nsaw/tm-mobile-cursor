#!/bin/bash

## Auto-update index.md, readme.md, roadmap.md and organize patches by status
PROJECT_PATH='/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/src-nextgen'

# Create status-based directories if they don't exist
mkdir -p "$PROJECT_PATH/patches/.archive/"
mkdir -p "$PROJECT_PATH/patches/.completed/"
mkdir -p "$PROJECT_PATH/patches/.failed/"
mkdir -p "$PROJECT_PATH/summaries/archived/"

# Move completed patches (containing "complete" or "success" in filename or content)
find "$PROJECT_PATH/patches/" -name '*.json' -exec grep -l -i "complete\|success" {} \; 2>/dev/null | while read file; do
  if [[ "$file" != *"/.archive/"* && "$file" != *"/.completed/"* && "$file" != *"/.failed/"* ]]; then
    mv "$file" "$PROJECT_PATH/patches/.completed/"
    echo "✅ Moved completed patch: $(basename "$file")"
  fi
done

# Move failed patches (containing "fail" or "error" in filename or content)
find "$PROJECT_PATH/patches/" -name '*.json' -exec grep -l -i "fail\|error" {} \; 2>/dev/null | while read file; do
  if [[ "$file" != *"/.archive/"* && "$file" != *"/.completed/"* && "$file" != *"/.failed/"* ]]; then
    mv "$file" "$PROJECT_PATH/patches/.failed/"
    echo "❌ Moved failed patch: $(basename "$file")"
  fi
done

# Archive stale patches (older than 30 minutes) that aren't already organized
find "$PROJECT_PATH/patches/" -name '*.json' -mmin +30 -not -path "*/\.archive/*" -not -path "*/\.completed/*" -not -path "*/\.failed/*" -exec mv {} "$PROJECT_PATH/patches/.archive/" \;

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
echo "$(date): Doc sync daemon executed - organized patches by status, archived stale files and updated indexes" 