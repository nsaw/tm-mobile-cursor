#!/bin/{ { { { bash

# Terminal Pattern Validation Gate & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Prevents blocking commands from being executed
# Enforces non-blocking patterns: { command & } >/dev/null 2>&1 & disown

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor"
LOG_DIR="$PROJECT_ROOT/logs"
VALIDATION_LOG="$LOG_DIR/terminal-pattern-validation.log"

# Create log directory
mkdir -p "$LOG_DIR"

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    echo "[$timestamp] [TERMINAL-VALIDATOR] [$level] $message" | tee -a "$VALIDATION_LOG"
}

# Safe commands that don't need non-blocking pattern
SAFE_COMMANDS=(
    "ls" "pwd" "echo" "cat" "git status" "which" "test" "true" "false"
    "head" "tail" "wc" "grep" "find" "sort" "uniq" "cut" "awk" "sed"
)

# Blocking command patterns to detect
BLOCKING_PATTERNS=(
    "execSync"
    "{ { { { npm run" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "{ { { { npx " & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "{ { { { node " & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "{ { { { python3 -m" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "{ { { { bash scripts/" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "{ { { { curl " & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "{ { { { ps aux" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "{ { { { tar " & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "{ { { { rsync " & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "{ { { { ping " & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "{ { { { nmap " & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "docker "
    "kubectl "
    "fly "
    "ngrok "
    "expo start"
    "yarn "
)

# Check if command is safe
is_safe_command() {
    local command="$1"
    for safe in "${SAFE_COMMANDS[@]}"; do
        if [[ "$command" == "$safe"* ]]; then
            return 0
        fi
    done
    return 1
}

# Check if command uses non-blocking pattern
is_non_blocking_pattern() {
    local command="$1"
    
    # Check for the mandatory non-blocking pattern
    if [[ "$command" =~ \{.*\&\s*\}\s*\>/dev/null\s*2\>\&1\s*\&\s*disown ]]; then
        return 0
    fi
    
    # Check for timeout protection
    if [[ "$command" =~ timeout.*\{.*\&\s*\}\s*\>/dev/null\s*2\>\&1\s*\&\s*disown ]]; then
        return 0
    fi
    
    # Check for gtimeout protection (macOS)
    if [[ "$command" =~ gtimeout.*\{.*\&\s*\}\s*\>/dev/null\s*2\>\&1\s*\&\s*disown ]]; then
        return 0
    fi
    
    return 1
}

# Validate a single command
validate_command() {
    local command="$1"
    local context="$2"
    
    # Skip if command is safe
    if is_safe_command "$command"; then
        log "INFO" "Safe command detected: $command"
        return 0
    fi
    
    # Check if command uses non-blocking pattern
    if is_non_blocking_pattern "$command"; then
        log "INFO" "Non-blocking pattern detected: $command"
        return 0
    fi
    
    # Check for blocking patterns
    for pattern in "${BLOCKING_PATTERNS[@]}"; do
        if [[ "$command" == *"$pattern"* ]]; then
            log "ERROR" "Blocking command detected: $command"
            log "ERROR" "Context: $context"
            log "ERROR" "Use non-blocking pattern: { $command & } >/dev/null 2>&1 & disown"
            return 1
        fi
    done
    
    return 0
}

# Validate file content
validate_file() {
    local file="$1"
    local violations=0
    
    log "INFO" "Validating file: $file"
    
    if [[ ! -f "$file" ]]; then
        log "WARN" "File not found: $file"
        return 0
    fi
    
    # Read file line by line
    local line_number=0
    while IFS= read -r line; do
        ((line_number++))
        
        # Skip comments and empty lines
        if [[ "$line" =~ ^[[:space:]]*# ]] || [[ -z "${line// }" ]]; then
            continue
        fi
        
        # Check for execSync patterns
        if [[ "$line" =~ execSync[[:space:]]*\( ]]; then
            log "ERROR" "Line $line_number: execSync detected - $line"
            log "ERROR" "Use non-blocking pattern instead"
            ((violations++))
        fi
        
        # Check for blocking command patterns
        for pattern in "${BLOCKING_PATTERNS[@]}"; do
            if [[ "$line" == *"$pattern"* ]] && ! is_non_blocking_pattern "$line"; then
                log "ERROR" "Line $line_number: Blocking command detected - $line"
                log "ERROR" "Use non-blocking pattern: { $pattern... & } >/dev/null 2>&1 & disown"
                ((violations++))
            fi
        done
    done < "$file"
    
    return $violations
}

# Validate all files in project
validate_project() {
    local total_violations=0
    local files_validated=0
    
    log "INFO" "Starting project-wide terminal pattern validation"
    
    # Find all relevant files
    while IFS= read -r -d '' file; do
        if [[ "$file" == *"node_modules"* ]] || [[ "$file" == *".git"* ]]; then
            continue
        fi
        
        if [[ "$file" =~ \.(js|ts|sh|bash|py|md)$ ]]; then
            local file_violations=0
            if validate_file "$file"; then
                file_violations=$?
            fi
            ((total_violations += file_violations))
            ((files_validated++))
        fi
    done < <(find "$PROJECT_ROOT" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.sh" -o -name "*.bash" -o -name "*.py" -o -name "*.md" \) -print0)
    
    log "INFO" "Validation complete: $files_validated files validated, $total_violations violations found"
    
    return $total_violations
}

# Pre-commit hook validation
pre_commit_validation() {
    log "INFO" "Running pre-commit terminal pattern validation"
    
    # Get staged files
    local staged_files=()
    while IFS= read -r file; do
        if [[ "$file" =~ \.(js|ts|sh|bash|py|md)$ ]]; then
            staged_files+=("$file")
        fi
    done < <(git diff --cached --name-only)
    
    local violations=0
    for file in "${staged_files[@]}"; do
        if [[ -f "$file" ]]; then
            local file_violations=0
            if validate_file "$file"; then
                file_violations=$?
            fi
            ((violations += file_violations))
        fi
    done
    
    if [[ $violations -gt 0 ]]; then
        log "ERROR" "Pre-commit validation failed: $violations violations found"
        log "ERROR" "Fix blocking commands before committing"
        return 1
    else
        log "INFO" "Pre-commit validation passed"
        return 0
    fi
}

# Real-time command validation
validate_realtime_command() {
    local command="$1"
    
    log "INFO" "Validating real-time command: $command"
    
    if validate_command "$command" "real-time execution"; then
        log "INFO" "Command validation passed"
        return 0
    else
        log "ERROR" "Command validation failed - blocking command detected"
        log "ERROR" "Command blocked: $command"
        return 1
    fi
}

# Generate compliance report
generate_report() {
    local report_file="$LOG_DIR/terminal-pattern-compliance-report.md"
    
    cat > "$report_file" << EOF
# Terminal Pattern Compliance Report

**Generated**: $(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
**Project**: tm-mobile-cursor
**Validator**: validate-terminal-patterns.sh

## Summary

- **Status**: $(if [[ $1 -eq 0 ]]; then echo "✅ COMPLIANT"; else echo "❌ NON-COMPLIANT"; fi)
- **Violations Found**: $1
- **Risk Level**: $(if [[ $1 -gt 10 ]]; then echo "HIGH"; elif [[ $1 -gt 5 ]]; then echo "MEDIUM"; else echo "LOW"; fi)

## Required Actions

$(if [[ $1 -gt 0 ]]; then
    echo "- Fix all blocking commands to use non-blocking patterns"
    echo "- Replace execSync with non-blocking alternatives"
    echo "- Add timeout protection to long-running commands"
    echo "- Test all fixes to ensure functionality is maintained"
else
    echo "- ✅ No actions required - all commands are compliant"
fi)

## Non-Blocking Pattern Examples

### Correct Pattern
\`\`\`{ { { { { { { bash
{ command &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown&  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown& & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown& } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
\`\`\`

### With Timeout Protection
\`\`\`{ { { { bash
{ timeout 300 command & & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
\`\`\`

### With Logging
\`\`\`bash
{ command & } >logs/command.log 2>&1 & disown
\`\`\`

## Safe Commands (No Pattern Required)

- ls, pwd, echo, cat, git status
- which, test, true, false
- head, tail, wc, grep, find, sort, uniq

## Blocking Commands (Pattern Required)

- execSync, { { { { npm run, npx, node & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- { { { { python3 -m, bash scripts/, curl & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- { { { { ps aux, tar, rsync, ping, nmap & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- docker, kubectl, fly, ngrok, expo start

EOF

    log "INFO" "Compliance report generated: $report_file"
}

# Main execution
main() {
    local action="${1:-validate}"
    
    case "$action" in
        "validate")
            log "INFO" "Starting terminal pattern validation"
            if validate_project; then
                violations=$?
                generate_report $violations
                if [[ $violations -eq 0 ]]; then
                    echo -e "${GREEN}✅ Terminal pattern validation passed${NC}"
                    exit 0
                else
                    echo -e "${RED}❌ Terminal pattern validation failed: $violations violations${NC}"
                    exit 1
                fi
            fi
            ;;
        "pre-commit")
            log "INFO" "Running pre-commit validation"
            if pre_commit_validation; then
                echo -e "${GREEN}✅ Pre-commit validation passed${NC}"
                exit 0
            else
                echo -e "${RED}❌ Pre-commit validation failed${NC}"
                exit 1
            fi
            ;;
        "check")
            local command="$2"
            if [[ -z "$command" ]]; then
                echo "Usage: $0 check <command>"
                exit 1
            fi
            if validate_realtime_command "$command"; then
                echo -e "${GREEN}✅ Command validation passed${NC}"
                exit 0
            else
                echo -e "${RED}❌ Command validation failed${NC}"
                exit 1
            fi
            ;;
        "help")
            echo "Terminal Pattern Validator"
            echo "Usage: $0 [action]"
            echo ""
            echo "Actions:"
            echo "  validate     - Validate all files in project"
            echo "  pre-commit   - Validate staged files for commit"
            echo "  check <cmd>  - Validate a single command"
            echo "  help         - Show this help"
            ;;
        *)
            echo "Unknown action: $action"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 