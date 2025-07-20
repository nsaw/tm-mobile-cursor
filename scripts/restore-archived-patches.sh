#!/bin/bash

# restore-archived-patches.sh
# Restores patches that were incorrectly archived without corresponding summaries

set -e

PROJECT_PATH='/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh'
ARCHIVE_DIR="$PROJECT_PATH/tasks/patches/.archive"
SUMMARIES_DIR="$PROJECT_PATH/tasks/summaries"
PATCHES_DIR="$PROJECT_PATH/tasks/patches"

echo "🔍 Checking for incorrectly archived patches..."
echo ""

restored_count=0

# Check each archived patch in tasks/patches
find "$ARCHIVE_DIR" -name '*.json' | while read patch_file; do
  patch_name=$(basename "$patch_file" .json)
  
  # Check if there's a corresponding summary file (including archived summaries)
  summary_pattern="*${patch_name}*.md"
  summary_file=$(find "$SUMMARIES_DIR" -name "$summary_pattern" 2>/dev/null | head -1)
  
  if [ -z "$summary_file" ]; then
    echo "📋 Found patch without summary: $(basename "$patch_file")"
    echo "   → Restoring to main patches directory..."
    
    # Move back to main patches directory
    mv "$patch_file" "$PATCHES_DIR/"
    echo "   ✅ Restored: $(basename "$patch_file")"
    ((restored_count++))
  else
    echo "✅ Patch $(basename "$patch_file") has summary - correctly archived"
  fi
done

# Check each archived patch in phase directories
for phase_dir in "$PROJECT_PATH/src-nextgen/patches/phase-"*; do
  if [ -d "$phase_dir" ]; then
    phase_name=$(basename "$phase_dir")
    phase_archive_dir="$phase_dir/.archive"
    
    if [ -d "$phase_archive_dir" ]; then
      echo "🔍 Checking $phase_name archived patches..."
      
      find "$phase_archive_dir" -name '*.json' | while read patch_file; do
        patch_name=$(basename "$patch_file" .json)
        
        # Check if there's a corresponding summary file (including archived summaries)
        summary_pattern="*${patch_name}*.md"
        summary_file=$(find "$SUMMARIES_DIR" -name "$summary_pattern" 2>/dev/null | head -1)
        
        if [ -z "$summary_file" ]; then
          echo "📋 Found patch without summary: $phase_name/$(basename "$patch_file")"
          echo "   → Restoring to $phase_name directory..."
          
          # Move back to phase directory
          mv "$patch_file" "$phase_dir/"
          echo "   ✅ Restored: $phase_name/$(basename "$patch_file")"
          ((restored_count++))
        else
          echo "✅ Patch $phase_name/$(basename "$patch_file") has summary - correctly archived"
        fi
      done
    fi
  fi
done

echo ""
echo "📊 Restoration Summary:"
echo "   - Patches restored: $restored_count"
echo "   - Patches correctly archived: $(find "$ARCHIVE_DIR" -name '*.json' | wc -l | tr -d ' ')"

if [ $restored_count -gt 0 ]; then
  echo ""
  echo "✅ Restoration completed successfully"
else
  echo ""
  echo "✅ No incorrectly archived patches found"
fi 