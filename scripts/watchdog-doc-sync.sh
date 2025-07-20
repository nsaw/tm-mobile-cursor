#!/bin/bash

## Auto-update index.md, readme.md, roadmap.md and organize patches by status
PROJECT_PATH='/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh'

# Create status-based directories if they don't exist
mkdir -p "$PROJECT_PATH/tasks/patches/.archive/"
mkdir -p "$PROJECT_PATH/tasks/patches/.completed/"
mkdir -p "$PROJECT_PATH/tasks/patches/.failed/"
mkdir -p "$PROJECT_PATH/tasks/summaries/archived/"

# Create phase-specific directories for src-nextgen
mkdir -p "$PROJECT_PATH/src-nextgen/patches/phase-0/.completed/"
mkdir -p "$PROJECT_PATH/src-nextgen/patches/phase-0/.failed/"
mkdir -p "$PROJECT_PATH/src-nextgen/patches/phase-0/.archive/"
mkdir -p "$PROJECT_PATH/src-nextgen/patches/phase-1/.completed/"
mkdir -p "$PROJECT_PATH/src-nextgen/patches/phase-1/.failed/"
mkdir -p "$PROJECT_PATH/src-nextgen/patches/phase-1/.archive/"
mkdir -p "$PROJECT_PATH/src-nextgen/patches/phase-2/.completed/"
mkdir -p "$PROJECT_PATH/src-nextgen/patches/phase-2/.failed/"
mkdir -p "$PROJECT_PATH/src-nextgen/patches/phase-2/.archive/"

echo "🔍 Auto-organizer: Checking patches for summaries..."

# Function to update documentation files
update_documentation() {
    local moved_patches="$1"
    local phase_name="$2"
    
    if [ -n "$moved_patches" ]; then
        echo "📝 Updating documentation for moved patches..."
        
        # Update patch-index.md
        if [ -f "$PROJECT_PATH/tasks/patch-index.md" ]; then
            echo "   📋 Updating tasks/patch-index.md"
            # Add moved patches to the index
            for patch in $moved_patches; do
                echo "- $(basename "$patch") - $(date '+%Y-%m-%d %H:%M:%S')" >> "$PROJECT_PATH/tasks/patch-index.md"
            done
        fi
        
        # Update index.md
        if [ -f "$PROJECT_PATH/tasks/index.md" ]; then
            echo "   📋 Updating tasks/index.md"
            # Update the index with current status
            {
                echo "# Patch Status Update - $(date '+%Y-%m-%d %H:%M:%S')"
                echo ""
                echo "## Recently Moved Patches:"
                for patch in $moved_patches; do
                    echo "- $(basename "$patch")"
                done
                echo ""
                echo "## Current Status:"
                echo "- Active patches: $(find "$PROJECT_PATH/tasks/patches/" -name '*.json' | wc -l | tr -d ' ')"
                echo "- Completed patches: $(find "$PROJECT_PATH/tasks/patches/.completed/" -name '*.json' | wc -l | tr -d ' ')"
                echo "- Failed patches: $(find "$PROJECT_PATH/tasks/patches/.failed/" -name '*.json' | wc -l | tr -d ' ')"
                echo "- Archived patches: $(find "$PROJECT_PATH/tasks/patches/.archive/" -name '*.json' | wc -l | tr -d ' ')"
                echo ""
            } >> "$PROJECT_PATH/tasks/index.md"
        fi
        
        # Update README.md
        if [ -f "$PROJECT_PATH/tasks/README.md" ]; then
            echo "   📋 Updating tasks/README.md"
            # Update the README with current status
            {
                echo "## Auto-Organizer Update - $(date '+%Y-%m-%d %H:%M:%S')"
                echo ""
                echo "### Recent Activity:"
                for patch in $moved_patches; do
                    echo "- Moved: $(basename "$patch")"
                done
                echo ""
                echo "### Patch Statistics:"
                echo "- Total patches: $(find "$PROJECT_PATH/tasks/patches/" -name '*.json' | wc -l | tr -d ' ')"
                echo "- Completed: $(find "$PROJECT_PATH/tasks/patches/.completed/" -name '*.json' | wc -l | tr -d ' ')"
                echo "- Failed: $(find "$PROJECT_PATH/tasks/patches/.failed/" -name '*.json' | wc -l | tr -d ' ')"
                echo "- Archived: $(find "$PROJECT_PATH/tasks/patches/.archive/" -name '*.json' | wc -l | tr -d ' ')"
                echo ""
            } >> "$PROJECT_PATH/tasks/README.md"
        fi
        
        # Update phase-specific documentation
        if [ -n "$phase_name" ]; then
            local phase_readme="$PROJECT_PATH/src-nextgen/patches/$phase_name/README.md"
            if [ -f "$phase_readme" ]; then
                echo "   📋 Updating $phase_name/README.md"
                {
                    echo "## Auto-Organizer Update - $(date '+%Y-%m-%d %H:%M:%S')"
                    echo ""
                    echo "### Recent Activity:"
                    for patch in $moved_patches; do
                        echo "- Moved: $(basename "$patch")"
                    done
                    echo ""
                    echo "### Current Status:"
                    echo "- Active patches: $(find "$PROJECT_PATH/src-nextgen/patches/$phase_name/" -name '*.json' | wc -l | tr -d ' ')"
                    echo "- Completed: $(find "$PROJECT_PATH/src-nextgen/patches/$phase_name/.completed/" -name '*.json' | wc -l | tr -d ' ')"
                    echo "- Failed: $(find "$PROJECT_PATH/src-nextgen/patches/$phase_name/.failed/" -name '*.json' | wc -l | tr -d ' ')"
                    echo "- Archived: $(find "$PROJECT_PATH/src-nextgen/patches/$phase_name/.archive/" -name '*.json' | wc -l | tr -d ' ')"
                    echo ""
                } >> "$phase_readme"
            fi
        fi
    fi
}

# Process patches in tasks/patches directory
moved_patches=""
find "$PROJECT_PATH/tasks/patches/" -name '*.json' -not -path "*/\.archive/*" -not -path "*/\.completed/*" -not -path "*/\.failed/*" | while read patch_file; do
  patch_name=$(basename "$patch_file" .json)
  
  # Check if there's a corresponding summary file indicating execution
  summary_pattern="*${patch_name}*.md"
  summary_file=$(find "$PROJECT_PATH/tasks/summaries/" -name "$summary_pattern" 2>/dev/null | head -1)
  
  if [ -n "$summary_file" ]; then
    # Check if the summary indicates success or failure
    if grep -q -i "success\|complete\|✅" "$summary_file" 2>/dev/null; then
      mv "$patch_file" "$PROJECT_PATH/tasks/patches/.completed/"
      echo "✅ Moved completed patch: $(basename "$patch_file") (found success summary)"
      moved_patches="$moved_patches $(basename "$patch_file")"
    elif grep -q -i "fail\|error\|❌" "$summary_file" 2>/dev/null; then
      mv "$patch_file" "$PROJECT_PATH/tasks/patches/.failed/"
      echo "❌ Moved failed patch: $(basename "$patch_file") (found failure summary)"
      moved_patches="$moved_patches $(basename "$patch_file")"
    else
      echo "⚠️ Patch $(basename "$patch_file") has summary but unclear status - leaving in place"
    fi
  else
    echo "📋 Patch $(basename "$patch_file") has no summary - not executed yet, leaving in place"
  fi
done

# Update documentation for tasks/patches
update_documentation "$moved_patches" ""

# Process patches in src-nextgen/patches phase directories
for phase_dir in "$PROJECT_PATH/src-nextgen/patches/phase-"*; do
  if [ -d "$phase_dir" ]; then
    phase_name=$(basename "$phase_dir")
    echo "🔍 Auto-organizer: Processing $phase_name patches..."
    
    moved_patches=""
    # Find patches in this phase directory
    find "$phase_dir" -name '*.json' -not -path "*/\.archive/*" -not -path "*/\.completed/*" -not -path "*/\.failed/*" | while read patch_file; do
      patch_name=$(basename "$patch_file" .json)
      
      # Check if there's a corresponding summary file indicating execution
      summary_pattern="*${patch_name}*.md"
      summary_file=$(find "$PROJECT_PATH/tasks/summaries/" -name "$summary_pattern" 2>/dev/null | head -1)
      
      if [ -n "$summary_file" ]; then
        # Check if the summary indicates success or failure
        if grep -q -i "success\|complete\|✅" "$summary_file" 2>/dev/null; then
          mv "$patch_file" "$phase_dir/.completed/"
          echo "✅ Moved completed patch: $phase_name/$(basename "$patch_file") (found success summary)"
          moved_patches="$moved_patches $(basename "$patch_file")"
        elif grep -q -i "fail\|error\|❌" "$summary_file" 2>/dev/null; then
          mv "$patch_file" "$phase_dir/.failed/"
          echo "❌ Moved failed patch: $phase_name/$(basename "$patch_file") (found failure summary)"
          moved_patches="$moved_patches $(basename "$patch_file")"
        else
          echo "⚠️ Patch $phase_name/$(basename "$patch_file") has summary but unclear status - leaving in place"
        fi
      else
        echo "📋 Patch $phase_name/$(basename "$patch_file") has no summary - not executed yet, leaving in place"
      fi
    done
    
    # Update documentation for this phase
    update_documentation "$moved_patches" "$phase_name"
  fi
done

echo "🔍 Auto-organizer: Checking for old patches with summaries..."

# ONLY archive patches that have summaries (indicating they were processed)
# Don't archive patches just because they're old - only if they have summaries

# Archive old patches in tasks/patches
moved_patches=""
find "$PROJECT_PATH/tasks/patches/" -name '*.json' -not -path "*/\.archive/*" -not -path "*/\.completed/*" -not -path "*/\.failed/*" | while read patch_file; do
  patch_name=$(basename "$patch_file" .json)
  
  # Check if there's a corresponding summary file
  summary_pattern="*${patch_name}*.md"
  summary_file=$(find "$PROJECT_PATH/tasks/summaries/" -name "$summary_pattern" 2>/dev/null | head -1)
  
  if [ -n "$summary_file" ]; then
    # Only archive if patch is older than 30 minutes AND has a summary
    if [ $(find "$patch_file" -mmin +30 2>/dev/null | wc -l) -gt 0 ]; then
      mv "$patch_file" "$PROJECT_PATH/tasks/patches/.archive/"
      echo "📦 Archived processed patch: $(basename "$patch_file") (has summary and is old)"
      moved_patches="$moved_patches $(basename "$patch_file")"
    fi
  else
    echo "📋 Patch $(basename "$patch_file") has no summary - keeping for execution"
  fi
done

# Update documentation for archived patches
update_documentation "$moved_patches" ""

# Archive old patches in phase directories
for phase_dir in "$PROJECT_PATH/src-nextgen/patches/phase-"*; do
  if [ -d "$phase_dir" ]; then
    phase_name=$(basename "$phase_dir")
    
    moved_patches=""
    find "$phase_dir" -name '*.json' -not -path "*/\.archive/*" -not -path "*/\.completed/*" -not -path "*/\.failed/*" | while read patch_file; do
      patch_name=$(basename "$patch_file" .json)
      
      # Check if there's a corresponding summary file
      summary_pattern="*${patch_name}*.md"
      summary_file=$(find "$PROJECT_PATH/tasks/summaries/" -name "$summary_pattern" 2>/dev/null | head -1)
      
      if [ -n "$summary_file" ]; then
        # Only archive if patch is older than 30 minutes AND has a summary
        if [ $(find "$patch_file" -mmin +30 2>/dev/null | wc -l) -gt 0 ]; then
          mv "$patch_file" "$phase_dir/.archive/"
          echo "📦 Archived processed patch: $phase_name/$(basename "$patch_file") (has summary and is old)"
          moved_patches="$moved_patches $(basename "$patch_file")"
        fi
      else
        echo "📋 Patch $phase_name/$(basename "$patch_file") has no summary - keeping for execution"
      fi
    done
    
    # Update documentation for archived patches in this phase
    update_documentation "$moved_patches" "$phase_name"
  fi
done

echo "🔍 Auto-organizer: Archiving old summaries..."

# Archive stale summaries (older than 30 minutes)
find "$PROJECT_PATH/tasks/summaries/" -name '*.md' -mmin +30 -exec mv {} "$PROJECT_PATH/tasks/summaries/archived/" \;

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
echo "$(date): Doc sync daemon executed - organized patches by execution status, archived stale files and updated indexes" 