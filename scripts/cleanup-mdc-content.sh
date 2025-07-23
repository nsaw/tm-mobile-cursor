#!/bin/bash

# Cleanup remaining old content in .mdc files
# Removes old tags, appliesTo, enforce fields and standardizes structure

set -e

# Directories to process
DIRS=(
    "/Users/sawyer/gitSync/tm-mobile-cursor/.cursor/rules"
)

# Function to clean up a single .mdc file
cleanup_mdc_file() {
    local file="$1"
    local filename=$(basename "$file" .mdc)
    
    echo "Cleaning up: $file"
    
    # Create backup
    cp "$file" "$file.cleanup.backup"
    
    # Remove old content patterns
    sed -i '' '/^tags:/d' "$file"
    sed -i '' '/^appliesTo:/d' "$file"
    sed -i '' '/^enforce:/d' "$file"
    sed -i '' '/^priority: high$/d' "$file"
    sed -i '' '/^priority: critical$/d' "$file"
    sed -i '' '/^priority: medium$/d' "$file"
    
    # Remove empty lines after cleanup
    sed -i '' '/^$/N;/^\n$/D' "$file"
    
    echo "Cleaned: $file"
}

# Function to add execution context routing
add_execution_context() {
    local file="$1"
    local filename=$(basename "$file" .mdc)
    
    # Check if execution context already exists
    if grep -q "Execution Contexts" "$file"; then
        return
    fi
    
    # Add execution context section before footer
    local temp_file=$(mktemp)
    local in_footer=false
    
    while IFS= read -r line; do
        if [[ "$line" == "---" && "$in_footer" == false ]]; then
            # Check if next line is Status
            local next_line=$(tail -n +$(( $(grep -n "---" "$file" | tail -1 | cut -d: -f1) + 1 )) "$file" | head -1)
            if [[ "$next_line" == *"Status"* ]]; then
                in_footer=true
                echo "" >> "$temp_file"
                echo "## Execution Contexts" >> "$temp_file"
                echo "" >> "$temp_file"
                echo "- **MAIN**: \`/Users/sawyer/gitSync/tm-mobile-cursor/\` (BRAUN agent)" >> "$temp_file"
                echo "- **CYOPS**: \`/Users/sawyer/gitSync/gpt-cursor-runner/\` (DEV agent)" >> "$temp_file"
                echo "- **UNIFIED**: \`/Users/sawyer/gitSync/.cursor-cache/\` (Global cache)" >> "$temp_file"
                echo "- **FREEZER**: \`/Users/sawyer/gitSync/_backups/\` (Backup storage)" >> "$temp_file"
                echo "" >> "$temp_file"
            fi
        fi
        echo "$line" >> "$temp_file"
    done < "$file"
    
    mv "$temp_file" "$file"
}

# Main processing
echo "Starting .mdc content cleanup..."

for dir in "${DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
        echo "Processing directory: $dir"
        for file in "$dir"/*.mdc; do
            if [[ -f "$file" ]]; then
                cleanup_mdc_file "$file"
                add_execution_context "$file"
            fi
        done
    else
        echo "Directory not found: $dir"
    fi
done

echo "Content cleanup complete!" 