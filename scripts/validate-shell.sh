#!/bin/bash
# Shell Validation Script for tm-mobile-cursor project
# Ensures only zsh or bash are used, prevents PowerShell

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check shell type
check_shell() {
    local shell_path="$1"
    local shell_name="$2"
    
    if [[ -x "$shell_path" ]]; then
        print_status $GREEN "✅ $shell_name found at: $shell_path"
        return 0
    else
        print_status $RED "❌ $shell_name not found at: $shell_path"
        return 1
    fi
}

# Function to validate current shell
validate_current_shell() {
    print_status $YELLOW "🔍 Validating current shell..."
    
    # Check current shell
    if [[ -z "$SHELL" ]]; then
        print_status $RED "❌ SHELL environment variable is not set"
        return 1
    fi
    
    print_status $GREEN "Current shell: $SHELL"
    
    # Check if current shell is zsh or bash
    if [[ "$SHELL" == *"/zsh" ]]; then
        print_status $GREEN "✅ Using zsh shell"
        return 0
    elif [[ "$SHELL" == *"/bash" ]]; then
        print_status $GREEN "✅ Using bash shell"
        return 0
    else
        print_status $RED "❌ Unsupported shell: $SHELL"
        print_status $RED "This project requires zsh or bash"
        return 1
    fi
}

# Function to check for PowerShell
check_powershell() {
    print_status $YELLOW "🔍 Checking for PowerShell..."
    
    # Check for PowerShell indicators
    if [[ "$TERM_PROGRAM" == "PowerShell" ]]; then
        print_status $RED "❌ PowerShell detected via TERM_PROGRAM"
        return 1
    fi
    
    if [[ -n "$POWERSHELL_TELEMETRY_OPTOUT" ]]; then
        print_status $RED "❌ PowerShell detected via POWERSHELL_TELEMETRY_OPTOUT"
        return 1
    fi
    
    # Check if pwsh is in PATH
    if command -v pwsh >/dev/null 2>&1; then
        print_status $YELLOW "⚠️  PowerShell Core (pwsh) is available but not being used"
    fi
    
    print_status $GREEN "✅ No PowerShell detected"
    return 0
}

# Function to check available shells
check_available_shells() {
    print_status $YELLOW "🔍 Checking available shells..."
    
    local shells_found=0
    
    # Check for zsh
    if check_shell "/bin/zsh" "zsh"; then
        shells_found=$((shells_found + 1))
    fi
    
    # Check for bash
    if check_shell "/bin/bash" "bash"; then
        shells_found=$((shells_found + 1))
    fi
    
    # Check for other shells that should not be used
    if command -v fish >/dev/null 2>&1; then
        print_status $YELLOW "⚠️  fish shell found but not recommended for this project"
    fi
    
    if command -v tcsh >/dev/null 2>&1; then
        print_status $YELLOW "⚠️  tcsh shell found but not recommended for this project"
    fi
    
    if [[ $shells_found -eq 0 ]]; then
        print_status $RED "❌ No supported shells (zsh or bash) found"
        return 1
    fi
    
    print_status $GREEN "✅ Found $shells_found supported shell(s)"
    return 0
}

# Function to set up shell configuration
setup_shell_config() {
    print_status $YELLOW "🔧 Setting up shell configuration..."
    
    local project_root="/Users/sawyer/gitSync/tm-mobile-cursor"
    local mobile_fresh_root="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh"
    local cache_root="/Users/sawyer/gitSync/.cursor-cache"
    
    # Source shell configurations if they exist
    if [[ -f "$project_root/.shellrc" ]]; then
        source "$project_root/.shellrc"
        print_status $GREEN "✅ Loaded project shell configuration"
    fi
    
    if [[ -f "$mobile_fresh_root/.shellrc" ]]; then
        source "$mobile_fresh_root/.shellrc"
        print_status $GREEN "✅ Loaded mobile-native-fresh shell configuration"
    fi
    
    if [[ -f "$cache_root/.shellrc" ]]; then
        source "$cache_root/.shellrc"
        print_status $GREEN "✅ Loaded cursor-cache shell configuration"
    fi
}

# Function to provide usage instructions
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --check-only    Only check shell configuration without setup"
    echo "  --setup-only    Only setup shell configuration without validation"
    echo "  --help          Show this help message"
    echo ""
    echo "This script validates and configures shell usage for the tm-mobile-cursor project."
    echo "It ensures only zsh or bash are used and prevents PowerShell usage."
}

# Main execution
main() {
    local check_only=false
    local setup_only=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --check-only)
                check_only=true
                shift
                ;;
            --setup-only)
                setup_only=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                print_status $RED "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    print_status $GREEN "🚀 tm-mobile-cursor Shell Validation Script"
    echo ""
    
    # Run validation checks
    if [[ "$setup_only" != true ]]; then
        if ! validate_current_shell; then
            print_status $RED "❌ Shell validation failed"
            exit 1
        fi
        
        if ! check_powershell; then
            print_status $RED "❌ PowerShell detected - not allowed"
            exit 1
        fi
        
        if ! check_available_shells; then
            print_status $RED "❌ No supported shells available"
            exit 1
        fi
        
        print_status $GREEN "✅ All shell validation checks passed"
    fi
    
    # Setup shell configuration
    if [[ "$check_only" != true ]]; then
        setup_shell_config
        print_status $GREEN "✅ Shell configuration setup complete"
    fi
    
    echo ""
    print_status $GREEN "🎉 Shell validation and configuration completed successfully"
}

# Run main function
main "$@" 