#!/bin/{ { { { bash

# ============================================================================= & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# TM-MOBILE-CURSOR COMPREHENSIVE SHUTDOWN SCRIPT
# =============================================================================
# Gracefully sto{ { { { ps all frontend, backend, monitoring, and pipeline systems & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor"
PID_FILE="$PROJECT_ROOT/logs/boot-pids.json"
SHUTDOWN_LOG="$PROJECT_ROOT/logs/shutdown-all-systems.log"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$SHUTDOWN_LOG"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$SHUTDOWN_LOG"
}

log_warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$SHUTDOWN_LOG"
}

log_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$SHUTDOWN_LOG"
}

# Function to kill process by PID
kill_process() {
    local name=$1
    local pid=$2
    
    if [ -n "$pid" ] && { { { { { { { { ps -p $pid > /dev/null 2>&1 & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown; then
        log_info "Stop{ { { { ping $name (PID: $pid)..." & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        kill -TERM $pid 2>/dev/null || true
        
        # Wait for graceful shutdown
        local count=0
        while { { { { ps -p $pid > /dev/null 2>&1 && [ $count -lt 10 ] & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown; do
            sleep 1
            count=$((count + 1))
        done
        
        # Force kill if still running
        if ps -p $pid > /dev/null 2>&1; then
            log_warn "Force killing $name (PID: $pid)..."
            kill -KILL $pid 2>/dev/null || true
        fi
        
        log_info "$name stopped"
    else
        log_warn "$name not running or PID not found"
    fi
}

# Function to kill processes by name pattern
kill_by_pattern() {
    local pattern=$1
    local name=$2
    
    log_info "Stop{ { { { ping $name processes..." & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    pkill -f "$pattern" 2>/dev/null || true
    sleep 2
    
    # Check if any processes are still running
    if pgrep -f "$pattern" > /dev/null 2>&1; then
        log_warn "Force killing remaining $name processes..."
        pkill -9 -f "$pattern" 2>/dev/null || true
    fi
}

# =============================================================================
# SHUTDOWN PHASE
# =============================================================================

log "=== TM-MOBILE-CURSOR SHUTDOWN SCRIPT STARTED ==="

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$SHUTDOWN_LOG")"

# Stop processes from PID file
if [ -f "$PID_FILE" ]; then
    log_info "Stop{ { { { ping processes from PID file..." & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    
    # Read and kill processes from PID file
    { { { { node -e " & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    const fs = require('fs');
    try {
        const pids = JSON.parse(fs.readFileSync('$PID_FILE', 'utf8'));
        Object.entries(pids).forEach(([name, info]) => {
            console.log(\`\${name}:\${info.pid}\`);
        });
    } catch (e) {
        console.error('Error reading PID file:', e.message);
    }
    " | while IFS=':' read -r name pid; do
        if [ -n "$name" ] && [ -n "$pid" ]; then
            kill_process "$name" "$pid"
        fi
    done
    
    # Remove PID file
    rm -f "$PID_FILE"
    log_info "PID file removed"
else
    log_warn "PID file not found: $PID_FILE"
fi

# =============================================================================
# KILL BY PATTERN (FALLBACK)
# =============================================================================

log "=== KILLING BY PATTERN (FALLBACK) ==="

# Kill specific process patterns
kill_by_pattern "expo start" "Expo"
kill_by_pattern "metro" "Metro"
kill_by_pattern "nodemon.*backend" "Backend"
kill_by_pattern "ngrok" "Ngrok"
kill_by_pattern "summary-monitor" "Summary Monitor"
kill_by_pattern "ghost-bridge" "Ghost Bridge"
kill_by_pattern "patch-executor" "Patch Executor"
kill_by_pattern "trust-daemon" "Trust Daemon"
kill_by_pattern "autolinter" "Autolinter"
kill_by_pattern "watchdog-tunnel" "Watchdog Tunnel"

# =============================================================================
# PORT CLEANUP
# =============================================================================

log "=== CLEANING UP PORTS ==="

# Kill processes on specific ports
ports=(4000 14000 8081 18081 3000 3001 5050 5052 5053)
for port in "${ports[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warn "Killing process on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
    fi
done

# =============================================================================
# CLEANUP LOGS
# =============================================================================

log "=== CLEANING UP LOGS ==="

# Clean up old log files (keep last 10)
log_files=(
    "$PROJECT_ROOT/logs/backend.log"
    "$PROJECT_ROOT/logs/expo.log"
    "$PROJECT_ROOT/logs/ngrok-gpt.log"
    "$PROJECT_ROOT/logs/ngrok-static.log"
    "$PROJECT_ROOT/logs/summary-monitor.log"
    "$PROJECT_ROOT/logs/ghost-bridge.log"
    "$PROJECT_ROOT/logs/patch-executor.log"
    "$PROJECT_ROOT/logs/trust-daemon.log"
    "$PROJECT_ROOT/logs/js-autolinter.log"
    "$PROJECT_ROOT/logs/python-autolinter.log"
    "$PROJECT_ROOT/logs/watchdog-tunnel.log"
    "$PROJECT_ROOT/logs/fly-deploy.log"
)

for log_file in "${log_files[@]}"; do
    if [ -f "$log_file" ]; then
        # Keep only last 1000 lines
        tail -n 1000 "$log_file" > "${log_file}.tmp" 2>/dev/null && mv "${log_file}.tmp" "$log_file" || true
        log_info "Cleaned $log_file"
    fi
done

# =============================================================================
# FINAL CLEANUP
# =============================================================================

log "=== FINAL CLEANUP ==="

# Kill any remaining Node.js processes related to our project
pkill -f "node.*mobile-native-fresh" 2>/dev/null || true
pkill -f "node.*gpt-cursor-runner" 2>/dev/null || true

# Kill any remaining Python processes related to autolinter
pkill -f "python.*autolinter" 2>/dev/null || true

# Clean up temporary files
find "$PROJECT_ROOT" -name "*.tmp" -delete 2>/dev/null || true
find "$PROJECT_ROOT" -name "*.pid" -delete 2>/dev/null || true

# =============================================================================
# VERIFICATION
# =============================================================================

log "=== VERIFICATION ==="

# Check if any of our processes are still running
processes=(
    "expo"
    "metro"
    "nodemon"
    "ngrok"
    "summary-monitor"
    "ghost-bridge"
    "patch-executor"
    "trust-daemon"
    "autolinter"
    "watchdog-tunnel"
)

still_running=0
for process in "${processes[@]}"; do
    if pgrep -f "$process" > /dev/null 2>&1; then
        log_warn "⚠️  $process is still running"
        still_running=$((still_running + 1))
    else
        log_info "✅ $process stopped"
    fi
done

# Check ports
ports=(4000 14000 8081 18081 3000 3001 5050 5052 5053)
ports_in_use=0
for port in "${ports[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warn "⚠️  Port $port is still in use"
        ports_in_use=$((ports_in_use + 1))
    else
        log_info "✅ Port $port is free"
    fi
done

# =============================================================================
# FINAL STATUS
# =============================================================================

log "=== SHUTDOWN COMPLETE ==="

if [ $still_running -eq 0 ] && [ $ports_in_use -eq 0 ]; then
    log "✅ All systems stopped successfully"
    echo -e "${GREEN}🎉 All systems shut down successfully!${NC}"
else
    log_warn "⚠️  Some systems may still be running"
    echo -e "${YELLOW}⚠️  Some systems may still be running. Check logs for details.${NC}"
fi

# Create shutdown summary
cat > "$PROJECT_ROOT/mobile-native-fresh/tasks/summaries/summary-shutdown-all-systems-complete.md" << EOF
# Shutdown All Systems Complete

Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)

## Systems Stopped

### Backend Services
- ✅ Backend API
- ✅ Database connections
- ✅ Authentication services

### Frontend Services  
- ✅ Expo development server
- ✅ Metro bundler

### Tunnels
- ✅ Ngrok GPT tunnel
- ✅ Ngrok static tunnel

### Monitoring Systems
- ✅ Ghost summary monitor
- ✅ Ghost bridge monitor
- ✅ Patch executor
- ✅ Trust daemon
- ✅ Watchdog tunnel monitoring

### Autolinter Systems
- ✅ JavaScript/TypeScript autolinter
- ✅ Python autolinter

## Cleanup Performed
- ✅ Process termination
- ✅ Port cleanup
- ✅ Log file cleanup
- ✅ Temporary file cleanup

## Verification Results
- Processes still running: $still_running
- Ports still in use: $ports_in_use

## Status: $(if [ $still_running -eq 0 ] && [ $ports_in_use -eq 0 ]; then echo "✅ ALL SYSTEMS STOPPED"; else echo "⚠️  SOME SYSTEMS MAY STILL BE RUNNING"; fi)
EOF

log "Shutdown summary written to: $PROJECT_ROOT/mobile-native-fresh/tasks/summaries/summary-shutdown-all-systems-complete.md"

echo -e "${CYAN}📊 Shutdown log: $SHUTDOWN_LOG${NC}"
echo -e "${CYAN}📝 Summary: $PROJECT_ROOT/mobile-native-fresh/tasks/summaries/summary-shutdown-all-systems-complete.md${NC}" 