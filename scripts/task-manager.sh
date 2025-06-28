#!/bin/bash

# Task Manager - Auto-sort completed tasks by version
# This script manages the versioned task filesystem

TASKS_DIR="tasks"
COMPLETED_DIR="tasks/completed"
VERSION_PATTERN="v[0-9]+\.[0-9]+\.[0-9]+"

# Create completed directory if it doesn't exist
mkdir -p "$COMPLETED_DIR"

# Function to extract version from filename
extract_version() {
    local filename="$1"
    echo "$filename" | grep -o "$VERSION_PATTERN" | head -1
}

# Function to sort tasks by version
sort_tasks_by_version() {
    local source_dir="$1"
    local target_dir="$2"
    
    echo "Sorting tasks in $source_dir by version..."
    
    # Find all JSON files with version patterns
    find "$source_dir" -name "*.json" -type f | while read -r file; do
        filename=$(basename "$file")
        version=$(extract_version "$filename")
        
        if [ -n "$version" ]; then
            # Create version directory
            version_dir="$target_dir/$version"
            mkdir -p "$version_dir"
            
            # Move file to version directory
            mv "$file" "$version_dir/"
            echo "Moved $filename to $version_dir/"
        fi
    done
}

# Function to mark task as completed
mark_completed() {
    local task_file="$1"
    local version=$(extract_version "$task_file")
    
    if [ -n "$version" ]; then
        version_dir="$COMPLETED_DIR/$version"
        mkdir -p "$version_dir"
        mv "$task_file" "$version_dir/"
        echo "✅ Task completed and moved to $version_dir/"
    else
        echo "❌ No version found in filename: $task_file"
    fi
}

# Function to list all tasks by version
list_tasks() {
    echo "📋 Current Tasks by Version:"
    echo "============================"
    
    # List active tasks
    echo "🔄 Active Tasks:"
    find "$TASKS_DIR" -name "*.json" -type f | grep -v "$COMPLETED_DIR" | while read -r file; do
        version=$(extract_version "$file")
        filename=$(basename "$file")
        echo "  $version: $filename"
    done
    
    echo ""
    echo "✅ Completed Tasks:"
    find "$COMPLETED_DIR" -name "*.json" -type f | while read -r file; do
        version=$(extract_version "$file")
        filename=$(basename "$file")
        echo "  $version: $filename"
    done
}

# Function to auto-organize all tasks
auto_organize() {
    echo "🧹 Auto-organizing tasks by version..."
    
    # Organize hybrid_blocks
    if [ -d "$TASKS_DIR/hybrid_blocks" ]; then
        sort_tasks_by_version "$TASKS_DIR/hybrid_blocks" "$COMPLETED_DIR"
    fi
    
    # Organize release_flows
    if [ -d "$TASKS_DIR/release_flows" ]; then
        sort_tasks_by_version "$TASKS_DIR/release_flows" "$COMPLETED_DIR"
    fi
    
    echo "✅ Task organization complete!"
}

# Main script logic
case "$1" in
    "complete")
        if [ -z "$2" ]; then
            echo "Usage: $0 complete <task_file>"
            exit 1
        fi
        mark_completed "$2"
        ;;
    "list")
        list_tasks
        ;;
    "organize")
        auto_organize
        ;;
    "sort")
        if [ -z "$2" ]; then
            echo "Usage: $0 sort <source_directory>"
            exit 1
        fi
        sort_tasks_by_version "$2" "$COMPLETED_DIR"
        ;;
    *)
        echo "Task Manager - Versioned Task Management"
        echo "======================================="
        echo ""
        echo "Usage:"
        echo "  $0 complete <task_file>  - Mark task as completed"
        echo "  $0 list                  - List all tasks by version"
        echo "  $0 organize              - Auto-organize all tasks by version"
        echo "  $0 sort <directory>      - Sort tasks in directory by version"
        echo ""
        echo "Examples:"
        echo "  $0 complete tasks/hybrid_blocks/v1.3.4_ui-cleanup.json"
        echo "  $0 list"
        echo "  $0 organize"
        ;;
esac 