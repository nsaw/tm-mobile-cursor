#!/bin/bash

# Validation Mirror Synchronization Script
# Aligns validation snapshot and diff output across CYOPS and MAIN systems

set -e

# Configuration
PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
CURSOR_CACHE="/Users/sawyer/gitSync/.cursor-cache"
CYOPS_VALIDATION="$CURSOR_CACHE/CYOPS/validation"
MAIN_VALIDATION="$CURSOR_CACHE/MAIN/validation"
PROJECT_VALIDATION="$PROJECT_ROOT/validation"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create directory structure if it doesn't exist
create_directory_structure() {
    log_info "Creating directory structure..."
    
    # Create main validation directories
    mkdir -p "$PROJECT_VALIDATION/snapshots"
    mkdir -p "$PROJECT_VALIDATION/diff"
    mkdir -p "$CYOPS_VALIDATION/snapshots"
    mkdir -p "$CYOPS_VALIDATION/diff"
    mkdir -p "$MAIN_VALIDATION/snapshots"
    mkdir -p "$MAIN_VALIDATION/diff"
    
    # Create subdirectories
    for dir in ".archive" ".completed" ".failed"; do
        mkdir -p "$PROJECT_VALIDATION/snapshots/$dir"
        mkdir -p "$PROJECT_VALIDATION/diff/$dir"
        mkdir -p "$CYOPS_VALIDATION/snapshots/$dir"
        mkdir -p "$CYOPS_VALIDATION/diff/$dir"
        mkdir -p "$MAIN_VALIDATION/snapshots/$dir"
        mkdir -p "$MAIN_VALIDATION/diff/$dir"
    done
    
    log_success "Directory structure created"
}

# Sync validation data from project to cache directories
sync_validation_data() {
    log_info "Syncing validation data..."
    
    # Sync snapshots
    if [ -d "$PROJECT_VALIDATION/snapshots" ]; then
        rsync -av --delete "$PROJECT_VALIDATION/snapshots/" "$CYOPS_VALIDATION/snapshots/"
        rsync -av --delete "$PROJECT_VALIDATION/snapshots/" "$MAIN_VALIDATION/snapshots/"
        log_success "Snapshots synced"
    else
        log_warning "Project snapshots directory not found"
    fi
    
    # Sync diff
    if [ -d "$PROJECT_VALIDATION/diff" ]; then
        rsync -av --delete "$PROJECT_VALIDATION/diff/" "$CYOPS_VALIDATION/diff/"
        rsync -av --delete "$PROJECT_VALIDATION/diff/" "$MAIN_VALIDATION/diff/"
        log_success "Diff files synced"
    else
        log_warning "Project diff directory not found"
    fi
}

# Create symbolic links for easy access
create_symlinks() {
    log_info "Creating symbolic links..."
    
    # Create symlinks in project validation to cache directories
    cd "$PROJECT_VALIDATION"
    
    # Remove existing symlinks if they exist
    rm -f snapshots-cyops snapshots-main diff-cyops diff-main
    
    # Create new symlinks
    ln -sf "$CYOPS_VALIDATION/snapshots" snapshots-cyops
    ln -sf "$MAIN_VALIDATION/snapshots" snapshots-main
    ln -sf "$CYOPS_VALIDATION/diff" diff-cyops
    ln -sf "$MAIN_VALIDATION/diff" diff-main
    
    log_success "Symbolic links created"
}

# Validate mirroring integrity
validate_mirroring() {
    log_info "Validating mirroring integrity..."
    
    # Check if directories exist
    for dir in "$CYOPS_VALIDATION/snapshots" "$CYOPS_VALIDATION/diff" \
               "$MAIN_VALIDATION/snapshots" "$MAIN_VALIDATION/diff"; do
        if [ ! -d "$dir" ]; then
            log_error "Directory missing: $dir"
            return 1
        fi
    done
    
    # Check if subdirectories exist
    for cache_dir in "$CYOPS_VALIDATION" "$MAIN_VALIDATION"; do
        for type in "snapshots" "diff"; do
            for subdir in ".archive" ".completed" ".failed"; do
                if [ ! -d "$cache_dir/$type/$subdir" ]; then
                    log_error "Subdirectory missing: $cache_dir/$type/$subdir"
                    return 1
                fi
            done
        done
    done
    
    log_success "Mirroring integrity validated"
}

# Generate validation manifest
generate_validation_manifest() {
    log_info "Generating validation manifest..."
    
    manifest_file="$PROJECT_VALIDATION/validation-manifest.json"
    
    cat > "$manifest_file" << EOF
{
  "validation_mirror_config": {
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "project_root": "$PROJECT_ROOT",
    "cursor_cache": "$CURSOR_CACHE",
    "targets": {
      "project_validation": {
        "snapshots": "$PROJECT_VALIDATION/snapshots",
        "diff": "$PROJECT_VALIDATION/diff"
      },
      "cyops_validation": {
        "snapshots": "$CYOPS_VALIDATION/snapshots",
        "diff": "$CYOPS_VALIDATION/diff"
      },
      "main_validation": {
        "snapshots": "$MAIN_VALIDATION/snapshots",
        "diff": "$MAIN_VALIDATION/diff"
      }
    },
    "subdirectories": [".archive", ".completed", ".failed"],
    "symlinks": {
      "snapshots_cyops": "snapshots-cyops",
      "snapshots_main": "snapshots-main",
      "diff_cyops": "diff-cyops",
      "diff_main": "diff-main"
    }
  }
}
EOF
    
    log_success "Validation manifest generated: $manifest_file"
}

# Main execution
main() {
    log_info "Starting validation mirror synchronization..."
    
    create_directory_structure
    sync_validation_data
    create_symlinks
    validate_mirroring
    generate_validation_manifest
    
    log_success "Validation mirror synchronization completed successfully!"
    
    # Display summary
    echo
    log_info "Validation Mirror Summary:"
    echo "  Project Validation: $PROJECT_VALIDATION"
    echo "  CYOPS Validation:   $CYOPS_VALIDATION"
    echo "  MAIN Validation:    $MAIN_VALIDATION"
    echo
    log_info "Symlinks created in project validation:"
    echo "  snapshots-cyops -> $CYOPS_VALIDATION/snapshots"
    echo "  snapshots-main  -> $MAIN_VALIDATION/snapshots"
    echo "  diff-cyops      -> $CYOPS_VALIDATION/diff"
    echo "  diff-main       -> $MAIN_VALIDATION/diff"
}

# Run main function
main "$@" 