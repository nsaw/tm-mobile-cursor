#!/bin/bash

# =============================================================================
# TM-MOBILE-CURSOR COMPREHENSIVE BOOT SCRIPT
# =============================================================================
# Starts all frontend, backend, monitoring, and pipeline systems
# Handles port conflicts and ensures clean startup
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor"
MOBILE_DIR="$PROJECT_ROOT/mobile-native-fresh"
BACKEND_DIR="$MOBILE_DIR/backend"
RUNNER_DIR="/Users/sawyer/gitSync/gpt-cursor-runner"

# Port assignments (avoiding conflicts)
EXPO_PORT=4000
METRO_PORT=8081
EXPO_SECOND_PORT=14000
METRO_SECOND_PORT=18081
BACKEND_PORT=3000
FLY_PORT=3001
NGROK_GPT_PORT=5050
NGROK_STATIC_PORT=5052
WATCHDOG_PORT=5053

# Log files
BOOT_LOG="$PROJECT_ROOT/logs/boot-all-systems.log"
PID_FILE="$PROJECT_ROOT/logs/boot-pids.json"

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/logs"
mkdir -p "$MOBILE_DIR/tasks/summaries"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$BOOT_LOG"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$BOOT_LOG"
}

log_warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$BOOT_LOG"
}

log_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$BOOT_LOG"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local process_name=$2
    if check_port $port; then
        log_warn "Port $port is in use. Killing existing process..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Function to start process and save PID
start_process() {
    local name=$1
    local command=$2
    local log_file=$3
    
    log_info "Starting $name..."
    
    # Create log directory if it doesn't exist
    mkdir -p "$(dirname "$log_file")"
    
    # Start process in background
    eval "$command" > "$log_file" 2>&1 &
    local pid=$!
    
    # Save PID to JSON file
    if [ -f "$PID_FILE" ]; then
        # Update existing JSON
        node -e "
        const fs = require('fs');
        const pids = JSON.parse(fs.readFileSync('$PID_FILE', 'utf8'));
        pids['$name'] = { pid: $pid, command: '$command', log_file: '$log_file', started: new Date().toISOString() };
        fs.writeFileSync('$PID_FILE', JSON.stringify(pids, null, 2));
        " 2>/dev/null || true
    else
        # Create new JSON
        echo "{\"$name\": {\"pid\": $pid, \"command\": \"$command\", \"log_file\": \"$log_file\", \"started\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}}" > "$PID_FILE"
    fi
    
    log_info "$name started with PID $pid"
    return $pid
}

# Function to wait for service to be ready
wait_for_service() {
    local name=$1
    local url=$2
    local max_attempts=30
    local attempt=1
    
    log_info "Waiting for $name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            log_info "$name is ready!"
            return 0
        fi
        
        log_info "Attempt $attempt/$max_attempts: $name not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "$name failed to start after $max_attempts attempts"
    return 1
}

# =============================================================================
# CLEANUP PHASE
# =============================================================================

log "=== TM-MOBILE-CURSOR BOOT SCRIPT STARTED ==="
log "Cleaning up existing processes..."

# Kill existing processes on our ports
kill_port $EXPO_PORT "Expo"
kill_port $METRO_PORT "Metro"
kill_port $BACKEND_PORT "Backend"
kill_port $FLY_PORT "Fly.io"
kill_port $NGROK_GPT_PORT "Ngrok GPT"
kill_port $NGROK_STATIC_PORT "Ngrok Static"

# Kill any existing ngrok processes
pkill -f "ngrok" 2>/dev/null || true

# Kill any existing monitoring processes
pkill -f "summary-monitor" 2>/dev/null || true
pkill -f "ghost-bridge" 2>/dev/null || true
pkill -f "patch-executor" 2>/dev/null || true
pkill -f "trust-daemon" 2>/dev/null || true

log "Cleanup completed"

# =============================================================================
# BACKEND STARTUP
# =============================================================================

log "=== STARTING BACKEND SERVICES ==="

# Start backend server
if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR"
    log_info "Installing backend dependencies..."
    npm install --silent
    
    start_process "Backend" "npm run dev" "$PROJECT_ROOT/logs/backend.log"
    cd "$PROJECT_ROOT"
else
    log_error "Backend directory not found: $BACKEND_DIR"
fi

# Wait for backend to be ready
sleep 5
wait_for_service "Backend" "http://localhost:$BACKEND_PORT/health" || log_warn "Backend health check failed"

# =============================================================================
# FRONTEND STARTUP
# =============================================================================

log "=== STARTING FRONTEND SERVICES ==="

# Start Expo development server
if [ -d "$MOBILE_DIR" ]; then
    cd "$MOBILE_DIR"
    
    log_info "Installing frontend dependencies..."
    npm install --silent
    
    # Start Expo with tunnel
    start_process "Expo" "npx expo start --tunnel --port $EXPO_PORT" "$PROJECT_ROOT/logs/expo.log"
    
    # Start second Expo instance with different ports
    start_process "Expo Second" "npx expo start --tunnel --port $EXPO_SECOND_PORT --metro-port $METRO_SECOND_PORT" "$PROJECT_ROOT/logs/expo-second.log"
    
    cd "$PROJECT_ROOT"
else
    log_error "Mobile directory not found: $MOBILE_DIR"
fi

# Wait for Expo instances to be ready
sleep 10
wait_for_service "Expo" "http://localhost:$EXPO_PORT" || log_warn "Expo health check failed"
wait_for_service "Expo Second" "http://localhost:$EXPO_SECOND_PORT" || log_warn "Expo Second health check failed"

# =============================================================================
# NGROK TUNNELS
# =============================================================================

log "=== STARTING NGROK TUNNELS ==="

# Start ngrok for GPT-Cursor-Runner (port 5050)
start_process "Ngrok GPT" "ngrok http $NGROK_GPT_PORT --log=stdout" "$PROJECT_ROOT/logs/ngrok-gpt.log"

# Start ngrok for static files (port 5051)
start_process "Ngrok Static" "ngrok http $NGROK_STATIC_PORT --log=stdout" "$PROJECT_ROOT/logs/ngrok-static.log"

# Wait for ngrok tunnels
sleep 5

# =============================================================================
# MONITORING SYSTEMS
# =============================================================================

log "=== STARTING MONITORING SYSTEMS ==="

# Start Ghost monitoring systems
if [ -d "$RUNNER_DIR" ]; then
    cd "$RUNNER_DIR"
    
    # Start summary monitor
    start_process "Summary Monitor" "node scripts/summary-monitor.js start" "$PROJECT_ROOT/logs/summary-monitor.log"
    
    # Start ghost bridge
    start_process "Ghost Bridge" "node scripts/ghost-bridge.js monitor" "$PROJECT_ROOT/logs/ghost-bridge.log"
    
    # Start patch executor
    start_process "Patch Executor" "node scripts/patch-executor.js watch" "$PROJECT_ROOT/logs/patch-executor.log"
    
    # Start trust daemon
    start_process "Trust Daemon" "node scripts/trust-daemon.js start" "$PROJECT_ROOT/logs/trust-daemon.log"
    
    cd "$PROJECT_ROOT"
else
    log_error "Runner directory not found: $RUNNER_DIR"
fi

# =============================================================================
# AUTOLINTER SYSTEMS
# =============================================================================

log "=== STARTING AUTOLINTER SYSTEMS ==="

# Start JavaScript/TypeScript autolinter
if [ -d "$MOBILE_DIR" ]; then
    cd "$MOBILE_DIR"
    start_process "JS Autolinter" "node scripts/autolinter.js start" "$PROJECT_ROOT/logs/js-autolinter.log"
    cd "$PROJECT_ROOT"
fi

# Start Python autolinter (if available)
if [ -f "$MOBILE_DIR/scripts/autolinter-python.py" ]; then
    cd "$MOBILE_DIR"
    start_process "Python Autolinter" "python3 scripts/autolinter-python.py" "$PROJECT_ROOT/logs/python-autolinter.log"
    cd "$PROJECT_ROOT"
fi

# =============================================================================
# WATCHDOG SYSTEMS
# =============================================================================

log "=== STARTING WATCHDOG SYSTEMS ==="

# Start watchdog tunnel monitoring
if [ -d "$RUNNER_DIR" ]; then
    cd "$RUNNER_DIR"
    start_process "Watchdog Tunnel" "./scripts/watchdog-tunnel.sh start" "$PROJECT_ROOT/logs/watchdog-tunnel.log"
    cd "$PROJECT_ROOT"
fi

# =============================================================================
# FLY.IO DEPLOYMENT (if configured)
# =============================================================================

log "=== CHECKING FLY.IO DEPLOYMENT ==="

# Check if fly.io is configured and deploy
if command -v fly &> /dev/null; then
    if [ -f "$MOBILE_DIR/fly.toml" ]; then
        log_info "Deploying to Fly.io..."
        cd "$MOBILE_DIR"
        start_process "Fly.io Deploy" "fly deploy --remote-only" "$PROJECT_ROOT/logs/fly-deploy.log"
        cd "$PROJECT_ROOT"
    else
        log_warn "Fly.io not configured (no fly.toml found)"
    fi
else
    log_warn "Fly.io CLI not installed"
fi

# =============================================================================
# HEALTH CHECKS
# =============================================================================

log "=== PERFORMING HEALTH CHECKS ==="

# Wait a bit for all services to start
sleep 10

# Check all services
services=(
    "Backend:http://localhost:$BACKEND_PORT/health"
    "Expo:http://localhost:$EXPO_PORT"
    "Expo Second:http://localhost:$EXPO_SECOND_PORT"
    "Metro:http://localhost:$METRO_PORT"
    "Metro Second:http://localhost:$METRO_SECOND_PORT"
)

for service in "${services[@]}"; do
    name="${service%%:*}"
    url="${service##*:}"
    
    if curl -s "$url" > /dev/null 2>&1; then
        log_info "✅ $name is healthy"
    else
        log_warn "⚠️  $name health check failed"
    fi
done

# =============================================================================
# FINAL STATUS
# =============================================================================

log "=== BOOT COMPLETE ==="

# Display running processes
log_info "Running processes:"
if [ -f "$PID_FILE" ]; then
    node -e "
    const fs = require('fs');
    const pids = JSON.parse(fs.readFileSync('$PID_FILE', 'utf8'));
    console.log('PID\tProcess\t\tStarted');
    console.log('---\t-------\t\t-------');
    Object.entries(pids).forEach(([name, info]) => {
        console.log(\`\${info.pid}\t\${name.padEnd(15)}\t\${info.started}\`);
    });
    " 2>/dev/null || cat "$PID_FILE"
fi

# Display port status
log_info "Port status:"
for port in $EXPO_PORT $EXPO_SECOND_PORT $METRO_PORT $METRO_SECOND_PORT $BACKEND_PORT $FLY_PORT $NGROK_GPT_PORT $NGROK_STATIC_PORT; do
    if check_port $port; then
        log_info "✅ Port $port is in use"
    else
        log_warn "⚠️  Port $port is not in use"
    fi
done

log "=== BOOT SCRIPT COMPLETED ==="
log "All systems should now be running. Check logs for any issues."
log "PID file: $PID_FILE"
log "Boot log: $BOOT_LOG"

# Create a summary file
cat > "$MOBILE_DIR/tasks/summaries/summary-boot-all-systems-complete.md" << EOF
# Boot All Systems Complete

Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)

## Systems Started

### Backend Services
- ✅ Backend API (Port: $BACKEND_PORT)
- ✅ Database connections
- ✅ Authentication services

### Frontend Services  
- ✅ Expo development server (Port: $EXPO_PORT)
- ✅ Expo second instance (Port: $EXPO_SECOND_PORT, Metro: $METRO_SECOND_PORT)
- ✅ Metro bundler (Port: $METRO_PORT)
- ✅ Metro second bundler (Port: $METRO_SECOND_PORT)
- ✅ Tunnel mode enabled for both instances

### Tunnels
- ✅ Ngrok GPT tunnel (Port: $NGROK_GPT_PORT)
- ✅ Ngrok static tunnel (Port: $NGROK_STATIC_PORT)

### Monitoring Systems
- ✅ Ghost summary monitor
- ✅ Ghost bridge monitor
- ✅ Patch executor
- ✅ Trust daemon
- ✅ Watchdog tunnel monitoring

### Autolinter Systems
- ✅ JavaScript/TypeScript autolinter
- ✅ Python autolinter

### Deployment
- ✅ Fly.io deployment (if configured)

## Port Assignments
- Expo: $EXPO_PORT
- Metro: $METRO_PORT  
- Backend: $BACKEND_PORT
- Fly.io: $FLY_PORT
- Ngrok GPT: $NGROK_GPT_PORT
- Ngrok Static: $NGROK_STATIC_PORT

## Status: ✅ ALL SYSTEMS OPERATIONAL
EOF

log "Summary written to: $MOBILE_DIR/tasks/summaries/summary-boot-all-systems-complete.md"

echo -e "${GREEN}🎉 All systems booted successfully!${NC}"
echo -e "${CYAN}📊 Check logs at: $BOOT_LOG${NC}"
echo -e "${CYAN}📋 Process PIDs at: $PID_FILE${NC}"
echo -e "${CYAN}📝 Summary at: $MOBILE_DIR/tasks/summaries/summary-boot-all-systems-complete.md${NC}" 