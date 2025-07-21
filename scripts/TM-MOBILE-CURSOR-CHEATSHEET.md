# TM-MOBILE-CURSOR COMPREHENSIVE CHEATSHEET

## 🚀 QUICK START COMMANDS

```bash
# Start all systems
./scripts/system-control.sh start

# Stop all systems
./scripts/system-control.sh stop

# Restart all systems
./scripts/system-control.sh restart

# Check system status
./scripts/system-control.sh status

# Check what's running
ps aux | grep -E "(expo|metro|nodemon|ngrok|ghost|autolinter)"

# Check ports
lsof -i -P | grep LISTEN | grep -E "(3000|4000|14000|5050|5052|5555|8081|18081)"
```

## 📊 PORT ASSIGNMENTS

### **TM-Mobile-Cursor Project**
| Service | Port | Description | Status |
|---------|------|-------------|--------|
| Expo Dev Server | 4000 | React Native development | ✅ Boot Script |
| Expo Second Instance | 14000 | Second React Native instance | ✅ Boot Script |
| Metro Bundler | 8081 | JavaScript bundler | ✅ Boot Script |
| Metro Second Bundler | 18081 | Second Metro bundler | ✅ Boot Script |
| Backend API | 3000 | Express.js server | ✅ Boot Script |
| Fly.io | 3001 | Deployment service | ✅ Boot Script |
| Ngrok GPT | 5050 | GPT-Cursor-Runner tunnel | ✅ Boot Script |
| Ngrok Static | 5052 | Static files tunnel | ✅ Boot Script |
| Watchdog | 5053 | Monitoring port | ✅ Boot Script |

### **GPT-Cursor-Runner Project**
| Service | Port | Description | Status |
|---------|------|-------------|--------|
| Python Ghost Runner | 5051 | Main Python server | ✅ Runner Script |
| Node.js Server | 5555 | Main Node.js server | ✅ Runner Script |
| Ngrok API | 4040 | Ngrok web interface | ✅ Runner Script |

## 🔧 SYSTEM COMPONENTS

### **Frontend Services**
- **Expo Development Server** (Port: 4000)
  - React Native development environment
  - Tunnel mode enabled for external access
  - Metro bundler integration
  - Hot reloading support

- **Metro Bundler** (Port: 8081)
  - JavaScript bundler for React Native
  - Asset management
  - Development server

### **Backend Services**
- **Backend API** (Port: 3000)
  - Express.js server with nodemon
  - Database connections (PostgreSQL)
  - Authentication services
  - API endpoints
  - Health checks

### **Tunnels**
- **Ngrok GPT Tunnel** (Port: 5050)
  - Exposes GPT-Cursor-Runner services
  - Static URL for external access
  - Auto-healing with watchdog

- **Ngrok Static Tunnel** (Port: 5051)
  - Exposes static files and assets
  - Backup tunnel for additional services
  - Health monitoring

### **Ghost Monitoring Systems**
- **Ghost Summary Monitor**
  - Monitors summary file creation
  - Processes and categorizes summaries
  - Maintains processing logs
  - File watching and detection

- **Ghost Bridge Monitor**
  - Bridges communication between systems
  - Handles patch and summary routing
  - Manages inter-system communication
  - Real-time monitoring

- **Patch Executor**
  - Watches for patch files
  - Executes patches automatically
  - Manages patch lifecycle
  - File system monitoring

- **Trust Daemon**
  - Continuous trust assessment
  - 30-second monitoring intervals
  - Security and compliance monitoring
  - Trust level tracking

- **Watchdog Tunnel Monitoring**
  - Monitors tunnel health
  - Automatic tunnel recovery
  - Health check reporting
  - Auto-healing capabilities

### **Autolinter Systems**
- **JavaScript/TypeScript Autolinter**
  - ESLint integration
  - TypeScript checking
  - Automatic error fixing
  - File watching and processing
  - Cross-project monitoring

- **Python Autolinter**
  - Flake8 integration
  - Black code formatting
  - Autopep8 auto-fixing
  - Cross-project monitoring
  - Syntax error detection

### **Deployment**
- **Fly.io Deployment**
  - Automatic deployment (if configured)
  - Remote-only deployment
  - Deployment logging
  - Health monitoring

## 🛠️ BOOT SYSTEM SCRIPTS

### **Main Control Script**
```bash
./scripts/system-control.sh [COMMAND]
```
**Commands:**
- `start` - Start all systems
- `stop` - Stop all systems
- `restart` - Restart all systems
- `status` - Check system status
- `help` - Show help

### **Comprehensive Boot Script**
```bash
./scripts/boot-all-systems.sh
```
**Features:**
- Port conflict detection and resolution
- Dependency installation
- Service health checks
- Process management and PID tracking
- Comprehensive logging
- Health monitoring and verification

### **Graceful Shutdown Script**
```bash
./scripts/shutdown-all-systems.sh
```
**Features:**
- Graceful process termination
- Port cleanup
- Log file management
- Verification and reporting
- Force kill fallbacks

## 📁 LOG FILES

### **Boot System Logs**
- `logs/boot-all-systems.log` - Boot script execution log
- `logs/shutdown-all-systems.log` - Shutdown script execution log
- `logs/boot-pids.json` - Process PID tracking

### **Service Logs**
- `logs/backend.log` - Backend API server
- `logs/expo.log` - Expo development server
- `logs/ngrok-gpt.log` - Ngrok GPT tunnel
- `logs/ngrok-static.log` - Ngrok static tunnel
- `logs/summary-monitor.log` - Summary monitoring
- `logs/ghost-bridge.log` - Ghost bridge monitoring
- `logs/patch-executor.log` - Patch execution
- `logs/trust-daemon.log` - Trust daemon
- `logs/js-autolinter.log` - JavaScript autolinter
- `logs/python-autolinter.log` - Python autolinter
- `logs/watchdog-tunnel.log` - Watchdog tunnel monitoring
- `logs/fly-deploy.log` - Fly.io deployment

## 🔍 MONITORING COMMANDS

### **Process Monitoring**
```bash
# Check all related processes
ps aux | grep -E "(expo|metro|nodemon|ngrok|ghost|autolinter|trust|watchdog)"

# Check specific service
ps aux | grep "expo start"
ps aux | grep "nodemon"
ps aux | grep "ngrok"
```

### **Port Monitoring**
```bash
# Check all listening ports
lsof -i -P | grep LISTEN

# Check specific ports
lsof -i:4000,14000,8081,18081,3000,5050,5052,5555

# Check port conflicts
lsof -i:4000 && echo "Port 4000 in use" || echo "Port 4000 free"
```

### **Health Checks**
```bash
# Backend health
curl -s http://localhost:3000/health

# Expo health
curl -s http://localhost:4000

# Metro health
curl -s http://localhost:8081

# Ngrok tunnels
curl -s http://localhost:4040/api/tunnels | jq
```

## 🚨 TROUBLESHOOTING

### **Common Issues**

**Port Already in Use**
```bash
# Check what's using the port
lsof -i :4000

# Kill the process
kill -9 <PID>

# Restart systems
./scripts/system-control.sh restart
```

**Service Not Starting**
```bash
# Check logs
tail -f logs/boot-all-systems.log

# Check specific service log
tail -f logs/backend.log

# Verify dependencies
cd mobile-native-fresh/backend && npm install
```

**Process Not Stopping**
```bash
# Force kill all related processes
pkill -f "expo"
pkill -f "metro"
pkill -f "nodemon"
pkill -f "ngrok"

# Restart
./scripts/system-control.sh start
```

### **Debug Mode**
```bash
# Enable debug mode
set -x
./scripts/system-control.sh start
set +x
```

## 🔄 DEVELOPMENT WORKFLOW

### **Start Development**
```bash
# Start all systems
./scripts/system-control.sh start

# Check status
./scripts/system-control.sh status

# View logs
tail -f logs/expo.log
tail -f logs/backend.log
```

### **Make Changes**
```bash
# Edit code files...

# Check autolinter status
tail -f logs/js-autolinter.log
tail -f logs/python-autolinter.log
```

### **Restart for Changes**
```bash
# Restart all systems
./scripts/system-control.sh restart

# Or restart specific service
pkill -f "nodemon" && cd mobile-native-fresh/backend && npm run dev &
```

### **Stop Development**
```bash
# Stop all systems
./scripts/system-control.sh stop

# Verify cleanup
./scripts/system-control.sh status
```

## 📡 GHOST MONITORING INTEGRATION

### **Ghost Systems**
- **Summary Monitor**: Processes summary files automatically
- **Bridge Monitor**: Handles inter-system communication
- **Patch Executor**: Manages patch lifecycle
- **Trust Daemon**: Security and compliance monitoring
- **Watchdog**: Auto-healing tunnel monitoring

### **Monitoring Commands**
```bash
# Check Ghost processes
ps aux | grep -E "(summary-monitor|ghost-bridge|patch-executor|trust-daemon)"

# Check Ghost logs
tail -f logs/summary-monitor.log
tail -f logs/ghost-bridge.log
tail -f logs/trust-daemon.log

# Check processed summaries
ls -la mobile-native-fresh/tasks/summaries/.processed/
```

## 🔧 CONFIGURATION

### **Environment Variables**
```bash
# Project paths
PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor"
MOBILE_DIR="$PROJECT_ROOT/mobile-native-fresh"
BACKEND_DIR="$MOBILE_DIR/backend"
RUNNER_DIR="/Users/sawyer/gitSync/gpt-cursor-runner"

# Port assignments
EXPO_PORT=4000
METRO_PORT=8081
BACKEND_PORT=3000
FLY_PORT=3001
NGROK_GPT_PORT=5050
NGROK_STATIC_PORT=5051
WATCHDOG_PORT=5052
```

### **Customization**
To modify port assignments or add new services:
1. Edit the port variables in `boot-all-systems.sh`
2. Add new service startup in the appropriate section
3. Update the shutdown script to handle new services
4. Test with `./scripts/system-control.sh restart`

## 📊 PERFORMANCE METRICS

### **Resource Usage**
- **Boot time**: ~30-60 seconds for full system startup
- **Memory usage**: ~500MB-1GB for all services
- **CPU usage**: Low during idle, spikes during development
- **Network**: Minimal for local development, moderate for tunnels

### **Monitoring**
```bash
# Check memory usage
ps aux | grep -E "(expo|metro|nodemon|ngrok)" | awk '{print $2, $3, $4, $11}'

# Check CPU usage
top -l 1 | grep -E "(expo|metro|nodemon|ngrok)"

# Check disk usage
du -sh logs/
du -sh mobile-native-fresh/node_modules/
```

## 🛡️ SECURITY

### **Security Considerations**
- All processes run with appropriate permissions
- No sensitive data in logs
- Secure tunnel configurations
- Trust daemon monitoring for security compliance

### **Access Control**
```bash
# Check file permissions
ls -la scripts/
ls -la logs/

# Verify no sensitive data in logs
grep -r "password\|secret\|key" logs/ || echo "No sensitive data found"
```

## 📚 ADDITIONAL RESOURCES

### **Documentation**
- `scripts/README-BOOT-SYSTEM.md` - Comprehensive documentation
- `mobile-native-fresh/tasks/summaries/` - System summaries
- `logs/` - All system logs

### **Useful Commands**
```bash
# Quick status check
./scripts/system-control.sh status

# View recent logs
tail -20 logs/boot-all-systems.log

# Check all ports
lsof -i -P | grep LISTEN

# Kill everything and restart
./scripts/system-control.sh stop && sleep 5 && ./scripts/system-control.sh start
```

---

**Status**: ✅ Production Ready  
**Last Updated**: 2025-07-18  
**Version**: 1.0.0 