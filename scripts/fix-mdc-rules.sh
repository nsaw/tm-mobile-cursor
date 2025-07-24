#!/bin/{ { { bash

# Comprehensive .mdc Rule File Fixer & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Fixes YAML headers, structure, and standardization across all rule files

set -e

# Directories to process
DIRS=(
    "/Users/sawyer/gitSync/.cursor/rules"
    "/Users/sawyer/gitSync/_global/.cursor/rules"
    "/Users/sawyer/gitSync/_backups/.cursor/rules"
    "/Users/sawyer/gitSync/.cursor-cache/.cursor/rules"
    "/Users/sawyer/gitSync/dev-tools/.cursor/rules"
    "/Users/sawyer/gitSync/gpt-cursor-runner/.cursor/rules"
    "/Users/sawyer/gitSync/tm-mobile-cursor/.cursor/rules"
    "/Users/sawyer/.cursor/rules"
)

# Function to fix a single .mdc file
fix_mdc_file() {
    local file="$1"
    local filename=$(basename "$file" .mdc)
    local dir=$(dirname "$file")
    
    echo "Processing: $file"
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Extract current content (skip existing YAML if present)
    local content=""
    local in_yaml=false
    local yaml_end=false
    
    while IFS= read -r line; do
        if [[ "$line" == "---" && "$in_yaml" == false ]]; then
            in_yaml=true
            continue
        elif [[ "$line" == "---" && "$in_yaml" == true ]]; then
            yaml_end=true
            continue
        elif [[ "$in_yaml" == true && "$yaml_end" == false ]]; then
            continue
        else
            content+="$line"$'\n'
        fi
    done < "$file"
    
    # Generate new YAML header based on filename
    local description=""
    local globs=""
    local priority="high"
    
    case "$filename" in
        *"accountability"*)
            description="Enforce AI accountability and integrity with strict validation requirements"
            globs=("**/summary-*.md" "**/patch-*.json" "**/agent-*.log")
            priority="critical"
            ;;
        *"agent"*)
            description="Enforce agent behavior and discipline across all operations"
            globs=("**/agent-*.log" "**/patch-*.json" "**/summary-*.md")
            priority="high"
            ;;
        *"autopilot"*)
            description="Enforce autopilot behavior and validation barriers"
            globs=("**/patch-*.json" "**/autopilot-*.log")
            priority="high"
            ;;
        *"cursor"*)
            description="Enforce Cursor-specific operations and integrity checks"
            globs=("**/cursor-*.json" "**/patch-*.json")
            priority="high"
            ;;
        *"git"*)
            description="Enforce git operation safety and prevent data loss"
            globs=("**/*.sh" "**/scripts/**" "**/git-*.json")
            priority="critical"
            ;;
        *"ghost"*)
            description="Enforce Ghost runner integrity and routing validation"
            globs=("**/ghost-*.log" "**/patch-*.json")
            priority="high"
            ;;
        *"patch"*)
            description="Enforce patch validation and proof requirements"
            globs=("**/patch-*.json" "**/summary-*.md")
            priority="critical"
            ;;
        *"summary"*)
            description="Enforce summary file standards and routing"
            globs=("**/summary-*.md" "**/patch-*.json")
            priority="critical"
            ;;
        *"validation"*)
            description="Enforce comprehensive validation chain for all operations"
            globs=("**/patch-*.json" "**/validation-*.log")
            priority="critical"
            ;;
        *"terminal"*)
            description="Enforce non-blocking terminal patterns and prevent UI freezing"
            globs=("**/*.sh" "**/scripts/**")
            priority="high"
            ;;
        *"path"*)
            description="Enforce absolute path requirements and routing"
            globs=("**/*.json" "**/*.md" "**/*.sh")
            priority="high"
            ;;
        *"compliance"*)
            description="Enforce global compliance checklist for all operations"
            globs=("**/patch-*.json" "**/summary-*.md")
            priority="critical"
            ;;
        *"documentation"*)
            description="Enforce documentation and indexing policy"
            globs=("**/*.md" "**/docs/**")
            priority="medium"
            ;;
        *"monitoring"*)
            description="Enforce monitoring and logging rules"
            globs=("**/*.log" "**/monitoring-*.json")
            priority="high"
            ;;
        *"project"*)
            description="Enforce project structure and organization rules"
            globs=("**/*.json" "**/*.md")
            priority="medium"
            ;;
        *"secret"*)
            description="Enforce secret management and security rules"
            globs=("**/.env*" "**/secrets/**")
            priority="critical"
            ;;
        *"strict"*)
            description="Enforce strict execution and validation requirements"
            globs=("**/patch-*.json" "**/validation-*.log")
            priority="critical"
            ;;
        *"mandatory"*)
            description="Enforce mandatory requirements with zero tolerance"
            globs=("**/summary-*.md" "**/patch-*.json")
            priority="critical"
            ;;
        *)
            description="Enforce rule compliance for $filename operations"
            globs=("**/*.json" "**/*.md")
            priority="medium"
            ;;
    esac
    
    # Create new YAML header
    local new_header="---"
    new_header+=$'\n'"description: $description"
    new_header+=$'\n'"globs:"
    for glob in "${globs[@]}"; do
        new_header+=$'\n'"  - \"$glob\""
    done
    new_header+=$'\n'"alwaysApply: true"
    new_header+=$'\n'"priority: $priority"
    new_header+=$'\n'"---"
    new_header+=$'\n'
    
    # Write new file
    echo "$new_header$content" > "$file"
    
    echo "Fixed: $file"
}

# Function to add footer if missing
add_footer() {
    local file="$1"
    local filename=$(basename "$file" .mdc)
    
    # Check if footer already exists
    if grep -q "Status.*ENFORCED" "$file"; then
        return
    fi
    
    # Add footer based on priority
    local priority=$(grep "priority:" "$file" | head -1 | sed 's/.*priority: //')
    local status="ENFORCED"
    local compliance="Standard validation"
    
    case "$priority" in
        "critical")
            status="ENFORCED - CRITICAL"
            compliance="Zero tolerance with automatic violation detection"
            ;;
        "high")
            status="ENFORCED - HIGH"
            compliance="Strict validation with automatic rollback"
            ;;
        "medium")
            status="ENFORCED - MEDIUM"
            compliance="Standard validation with logging"
            ;;
        *)
            status="ENFORCED"
            compliance="Standard validation"
            ;;
    esac
    
    # Add footer
    echo "" >> "$file"
    echo "---" >> "$file"
    echo "**Status**: ✅ **$status**" >> "$file"
    echo "**Compliance**: $compliance" >> "$file"
    echo "**Scope**: All operations across all contexts" >> "$file"
}

# Main processing
echo "Starting comprehensive .mdc rule file cleanup..."

for dir in "${DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
        echo "Processing directory: $dir"
        for file in "$dir"/*.mdc; do
            if [[ -f "$file" ]]; then
                fix_mdc_file "$file"
                add_footer "$file"
            fi
        done
    else
        echo "Directory not found: $dir"
    fi
done

echo "Cleanup complete!"
echo "Backup files created with .backup extension" 