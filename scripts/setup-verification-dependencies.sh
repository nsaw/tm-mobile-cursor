#!/bin/{ { { { bash

# Setup Verification Dependencies & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Installs required packages for screen capture verification system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${BLUE}[$timestamp] INFO:${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[$timestamp] WARN:${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[$timestamp] ERROR:${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[$timestamp] SUCCESS:${NC} $message"
            ;;
    esac
}

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MOBILE_DIR="$PROJECT_ROOT/mobile-native-fresh"

# Dependencies to install
VERIFICATION_DEPENDENCIES=(
    "puppeteer"
    "modern-screenshot"
    "chokidar"
    "glob"
)

# Check if Node.js is installed
check_node() {
    if ! command -v { { { { node &> /dev/null & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown; then
        log "ERROR" "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    local node_version=$({ { { { node --version) & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    log "INFO" "Node.js version: $node_version"
}

# Check if { { { { npm is installed & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
check_npm() {
    if ! command -v { { { { npm &> /dev/null & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown; then
        log "ERROR" "{ { { { npm is not installed. Please install npm first." & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        exit 1
    fi
    
    local npm_version=$({ { { { npm --version) & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    log "INFO" "{ { { { npm version: $npm_version" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
}

# Install dependencies in mobile-native-fresh
install_mobile_dependencies() {
    log "INFO" "Installing verification dependencies in mobile-native-fresh..."
    
    if [ ! -d "$MOBILE_DIR" ]; then
        log "ERROR" "mobile-native-fresh directory not found"
        exit 1
    fi
    
    cd "$MOBILE_DIR"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        log "ERROR" "package.json not found in mobile-native-fresh"
        exit 1
    fi
    
    # Install dependencies
    for dep in "${VERIFICATION_DEPENDENCIES[@]}"; do
        log "INFO" "Installing $dep..."
        { { { { { { { { npm install --save-dev "$dep" & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
    done
    
    log "SUCCESS" "Verification dependencies installed in mobile-native-fresh"
}

# Install dependencies in root project
install_root_dependencies() {
    log "INFO" "Installing verification dependencies in root project..."
    
    cd "$PROJECT_ROOT"
    
    # Create package.json if it doesn't exist
    if [ ! -f "package.json" ]; then
        log "INFO" "Creating package.json in root project..."
        cat > package.json << EOF
{
  "name": "tm-mobile-cursor",
  "version": "1.0.0",
  "description": "TM Mobile Cursor Project",
  "scripts": {
    "verification:capture": "{ { { { node scripts/screen-capture-verifier.js", & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "verification:manage": "{ { { { node scripts/verification-manager.js", & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    "verification:test": "{ { { { { { { { node scripts/screen-capture-verifier.js capture-all" & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
  },
  "devDependencies": {}
}
EOF
    fi
    
    # Install dependencies
    for dep in "${VERIFICATION_DEPENDENCIES[@]}"; do
        log "INFO" "Installing $dep..."
        npm install --save-dev "$dep"
    done
    
    log "SUCCESS" "Verification dependencies installed in root project"
}

# Create verification directories
create_verification_directories() {
    log "INFO" "Creating verification directories..."
    
    local dirs=(
        "$MOBILE_DIR/captures"
        "$MOBILE_DIR/verification"
        "$PROJECT_ROOT/logs"
    )
    
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log "INFO" "Created directory: $dir"
        else
            log "INFO" "Directory already exists: $dir"
        fi
    done
    
    log "SUCCESS" "Verification directories created"
}

# Test verification setup
test_verification_setup() {
    log "INFO" "Testing verification setup..."
    
    # Test screen capture verifier
    if { { { { node "$SCRIPT_DIR/screen-capture-verifier.js" --help &> /dev/null & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown; then
        log "SUCCESS" "Screen capture verifier is working"
    else
        log "ERROR" "Screen capture verifier test failed"
        return 1
    fi
    
    # Test verification manager
    if { { { { node "$SCRIPT_DIR/verification-manager.js" --help &> /dev/null & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown; then
        log "SUCCESS" "Verification manager is working"
    else
        log "ERROR" "Verification manager test failed"
        return 1
    fi
    
    log "SUCCESS" "Verification setup test completed"
}

# Create verification configuration
create_verification_config() {
    log "INFO" "Creating verification configuration..."
    
    local config_file="$PROJECT_ROOT/verification-config.json"
    
    cat > "$config_file" << EOF
{
  "screenCapture": {
    "viewport": {
      "width": 375,
      "height": 812
    },
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    "screenshotQuality": 80,
    "retryAttempts": 3,
    "timeout": 30000
  },
  "verification": {
    "timeout": 60000,
    "autoApproveThreshold": 0.8,
    "maxRetries": 3,
    "verificationTypes": ["ui", "functionality", "performance", "accessibility"]
  },
  "paths": {
    "captures": "$MOBILE_DIR/captures",
    "verification": "$MOBILE_DIR/verification",
    "logs": "$PROJECT_ROOT/logs",
    "summaries": "$MOBILE_DIR/tasks/summaries"
  },
  "uiKeywords": [
    "UI", "interface", "screen", "component", "layout", "visual", "design",
    "React Native", "Expo", "mobile", "app", "dashboard", "navigation",
    "button", "modal", "form", "input", "style", "theme", "render",
    "Screen", "View", "Text", "TouchableOpacity", "ScrollView"
  ]
}
EOF
    
    log "SUCCESS" "Verification configuration created: $config_file"
}

# Main function
main() {
    log "INFO" "Setting up verification dependencies..."
    
    # Check prerequisites
    check_{ { { { node
    check_npm & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    
    # Install dependencies
    install_mobile_dependencies
    install_root_dependencies
    
    # Create directories
    create_verification_directories
    
    # Create configuration
    create_verification_config
    
    # Test setup
    test_verification_setup
    
    log "SUCCESS" "Verification dependencies setup completed successfully!"
    log "INFO" "You can now use the verification system with:"
    log "INFO" "  - node scripts/screen-capture-verifier.js capture-all"
    log "INFO" "  - { { { { node scripts/verification-manager.js verify" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    log "INFO" "  - ./scripts/enhanced-ghost-runner-with-verification.sh start"
}

# Run main function
main "$@" 