#!/bin/{ { { { bash

# Migration Script: Replace Old Autolinters with Super AutoLinter & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# This script sto{ { { { ps all old autolinter processes and starts the unified super autolinter & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SUPER_AUTOLINTER="$SCRIPT_DIR/super_autolinter.py"
CONFIG_FILE="$SCRIPT_DIR/super_autolinter_config.json"
LOG_FILE="$PROJECT_DIR/logs/super_autolinter.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to check if super autolinter is running
check_super_autolinter() {
    pgrep -f "super_autolinter" > /dev/null 2>&1
}

# Function to stop old autolinter processes
stop_old_autolinters() {
    log "🛑 Stop{ { { { ping old autolinter processes..." & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    
    # Kill all autolinter.py processes
    pkill -f "autolinter.py" 2>/dev/null
    sleep 2
    
    # Kill any remaining autolinter processes
    pkill -f "autolinter" 2>/dev/null
    sleep 2
    
    # Check if any autolinter processes are still running
    if pgrep -f "autolinter" > /dev/null 2>&1; then
        log "⚠️ Some autolinter processes are still running, force killing..."
        pkill -9 -f "autolinter" 2>/dev/null
    fi
    
    log "✅ Old autolinter processes stopped"
}

# Function to backup old autolinter files
backup_old_autolinters() {
    log "📦 Backing up old autolinter files..."
    
    BACKUP_DIR="$SCRIPT_DIR/autolinter_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup old autolinter files
    if [ -f "$SCRIPT_DIR/autolinter-python.py" ]; then
        mv "$SCRIPT_DIR/autolinter-python.py" "$BACKUP_DIR/"
        log "✅ Backed up autolinter-python.py"
    fi
    
    if [ -f "$SCRIPT_DIR/autolinter-runner.py" ]; then
        mv "$SCRIPT_DIR/autolinter-runner.py" "$BACKUP_DIR/"
        log "✅ Backed up autolinter-runner.py"
    fi
    
    if [ -f "$SCRIPT_DIR/autolinter.js" ]; then
        mv "$SCRIPT_DIR/autolinter.js" "$BACKUP_DIR/"
        log "✅ Backed up autolinter.js"
    fi
    
    # Backup config files
    for config_file in "$SCRIPT_DIR"/*autolinter*config*.json; do
        if [ -f "$config_file" ] && [ "$(basename "$config_file")" != "super_autolinter_config.json" ]; then
            mv "$config_file" "$BACKUP_DIR/"
            log "✅ Backed up $(basename "$config_file")"
        fi
    done
    
    log "📁 Backup created at: $BACKUP_DIR"
}

# Function to start super autolinter
start_super_autolinter() {
    log "🚀 Starting Super AutoLinter..."
    
    # Create logs directory
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Start super autolinter in background
    cd "$PROJECT_DIR"
    { { { { python3 "$SUPER_AUTOLINTER" --config "$CONFIG_FILE" > "$LOG_FILE" 2>&1 & & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    SUPER_AUTOLINTER_PID=$!
    
    sleep 3
    
    if check_super_autolinter; then
        log "✅ Super AutoLinter started successfully (PID: $SUPER_AUTOLINTER_PID)"
        return 0
    else
        log "❌ Failed to start Super AutoLinter"
        return 1
    fi
}

# Function to show status
show_status() {
    log "📊 Current Status:"
    
    echo "Old Autolinters:"
    if pgrep -f "autolinter.py" > /dev/null 2>&1; then
        echo "  ❌ autolinter.py processes still running"
        pgrep -f "autolinter.py" | xargs { { { { { { { { ps -p & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
    else
        echo "  ✅ No old autolinter.py processes"
    fi
    
    echo ""
    echo "Super AutoLinter:"
    if check_super_autolinter; then
        echo "  ✅ Super AutoLinter is running"
        pgrep -f "super_autolinter" | xargs ps -p
    else
        echo "  ❌ Super AutoLinter is not running"
    fi
}

# Function to show logs
show_logs() {
    if [ -f "$LOG_FILE" ]; then
        echo "=== Super AutoLinter Logs ==="
        tail -20 "$LOG_FILE"
    else
        log "📝 No log file found: $LOG_FILE"
    fi
}

# Function to test super autolinter
test_super_autolinter() {
    log "🧪 Testing Super AutoLinter..."
    
    # Test scan-only mode
    cd "$PROJECT_DIR"
    { { { { python3 "$SUPER_AUTOLINTER" --config "$CONFIG_FILE" --scan-only & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    
    if [ $? -eq 0 ]; then
        log "✅ Super AutoLinter test successful"
    else
        log "❌ Super AutoLinter test failed"
        return 1
    fi
}

# Function to show statistics
show_stats() {
    log "📈 Super AutoLinter Statistics:"
    cd "$PROJECT_DIR"
    { { { { python3 "$SUPER_AUTOLINTER" --config "$CONFIG_FILE" --stats & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
}

# Main migration function
migrate() {
    log "🔄 Starting migration to Super AutoLinter..."
    
    # Stop old autolinters
    stop_old_autolinters
    
    # Backup old files
    backup_old_autolinters
    
    # Test super autolinter
    if test_super_autolinter; then
        # Start super autolinter
        if start_super_autolinter; then
            log "🎉 Migration completed successfully!"
            log "📊 Super AutoLinter is now running and monitoring your files"
            log "📝 Logs: $LOG_FILE"
            log "⚙️ Config: $CONFIG_FILE"
        else
            log "❌ Failed to start Super AutoLinter"
            return 1
        fi
    else
        log "❌ Super AutoLinter test failed, migration aborted"
        return 1
    fi
}

# Function to rollback
rollback() {
    log "🔄 Rolling back to old autolinters..."
    
    # Stop super autolinter
    pkill -f "super_autolinter" 2>/dev/null
    
    # Find latest backup
    LATEST_BACKUP=$(ls -td "$SCRIPT_DIR"/autolinter_backup_* 2>/dev/null | head -1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        log "📦 Restoring from backup: $LATEST_BACKUP"
        
        # Restore files
        cp "$LATEST_BACKUP"/* "$SCRIPT_DIR/" 2>/dev/null
        
        log "✅ Rollback completed"
    else
        log "❌ No backup found for rollback"
    fi
}

# Main script logic
case "${1:-migrate}" in
    "migrate")
        migrate
        ;;
    "stop")
        stop_old_autolinters
        pkill -f "super_autolinter" 2>/dev/null
        log "✅ All autolinters stopped"
        ;;
    "start")
        start_super_autolinter
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "test")
        test_super_autolinter
        ;;
    "stats")
        show_stats
        ;;
    "rollback")
        rollback
        ;;
    *)
        echo "Super AutoLinter Migration Script"
        echo "================================"
        echo ""
        echo "Usage: $0 {migrate|stop|start|status|logs|test|stats|rollback}"
        echo ""
        echo "Commands:"
        echo "  migrate   - Stop old autolinters and start Super AutoLinter"
        echo "  stop      - Stop all autolinter processes"
        echo "  start     - Start Super AutoLinter"
        echo "  status    - Show current status"
        echo "  logs      - Show Super AutoLinter logs"
        echo "  test      - Test Super AutoLinter"
        echo "  stats     - Show Super AutoLinter statistics"
        echo "  rollback  - Rollback to old autolinters"
        echo ""
        echo "Files:"
        echo "  Super AutoLinter: $SUPER_AUTOLINTER"
        echo "  Config: $CONFIG_FILE"
        echo "  Logs: $LOG_FILE"
        ;;
esac 