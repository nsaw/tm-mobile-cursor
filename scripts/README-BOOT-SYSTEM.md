# TM-MOBILE-CURSOR BOOT SYSTEM

## Overview

This boot system provides comprehensive management for all TM-Mobile-Cursor services, including frontend, backend, monitoring, and pipeline systems. It handles port conflicts, ensures clean startup/shutdown, and provides detailed logging and status monitoring.

## Quick Start

```bash
# Start all systems
./scripts/system-control.sh start

# Stop all systems  
./scripts/system-control.sh stop

# Restart all systems
./scripts/system-control.sh restart

# Check system status
./scripts/system-control.sh status
```

## System Components

### Frontend Services
- **Expo Development Server** (Port: 4000)
  - React Native development environment
  - Tunnel mode enabled for external access
  - Metro bundler integration

- **Metro Bundler** (Port: 8081)
  - JavaScript bundler for React Native
  - Hot reloading support
  - Asset management

### Backend Services
- **Backend API** (Port: 3000)
  - Express.js server
  - Database connections (PostgreSQL)
  - Authentication services
  - API endpoints

### Tunnels
- **Ngrok GPT Tunnel** (Port: 5050)
  - Exposes GPT-Cursor-Runner services
  - Static URL for external access

- **Ngrok Static Tunnel** (Port: 5051)
  - Exposes static files and assets
  - Backup tunnel for additional services

### Monitoring Systems
- **Ghost Summary Monitor**
  - Monitors summary file creation
  - Processes and categorizes summaries
  - Maintains processing logs

- **Ghost Bridge Monitor**
  - Bridges communication between systems
  - Handles patch and summary routing
  - Manages inter-system communication

- **Patch Executor**
  - Watches for patch files
  - Executes patches automatically
  - Manages patch lifecycle

- **Trust Daemon**
  - Continuous trust assessment
  - 30-second monitoring intervals
  - Security and compliance monitoring

- **Watchdog Tunnel Monitoring**
  - Monitors tunnel health
  - Automatic tunnel recovery
  - Health check reporting

### Autolinter Systems
- **JavaScript/TypeScript Autolinter**
  - ESLint integration
  - TypeScript checking
  - Automatic error fixing
  - File watching and processing

- **Python Autolinter**
  - Flake8 integration
  - Black code formatting
  - Autopep8 auto-fixing
  - Cross-project monitoring

### Deployment
- **Fly.io Deployment**
  - Automatic deployment (if configured)
  - Remote-only deployment
  - Deployment logging

## Port Assignments

| Service | Port | Description |
|---------|------|-------------|
| Expo | 4000 | Development server |
| Metro | 8081 | JavaScript bundler |
| Backend | 3000 | API server |
| Fly.io | 3001 | Deployment service |
| Ngrok GPT | 5050 | GPT tunnel |
| Ngrok Static | 5051 | Static tunnel |
| Watchdog | 5052 | Monitoring port |

## Scripts

### Main Control Script
- **`system-control.sh`** - Main wrapper script
  - `start` - Start all systems
  - `stop` - Stop all systems  
  - `restart` - Restart all systems
  - `status` - Check system status

### Boot Script
- **`boot-all-systems.sh`** - Comprehensive startup script
  - Port conflict resolution
  - Dependency installation
  - Service health checks
  - Process management
  - Logging and monitoring

### Shutdown Script
- **`shutdown-all-systems.sh`** - Graceful shutdown script
  - Process termination
  - Port cleanup
  - Log file management
  - Verification and reporting

## Features

### Port Conflict Resolution
- Automatically detects and kills conflicting processes
- Ensures clean port allocation
- Prevents startup failures due to port conflicts

### Health Monitoring
- Service readiness checks
- Automatic retry mechanisms
- Health status reporting
- Failure detection and logging

### Process Management
- PID tracking and management
- Graceful shutdown procedures
- Force kill fallbacks
- Process status monitoring

### Logging System
- Comprehensive logging for all services
- Log rotation and cleanup
- Error tracking and reporting
- Performance monitoring

### Dependency Management
- Automatic npm install for dependencies
- Python package management
- Environment setup
- Configuration validation

## Usage Examples

### Development Workflow
```bash
# Start development environment
./scripts/system-control.sh start

# Check status
./scripts/system-control.sh status

# Make changes to code...

# Restart to apply changes
./scripts/system-control.sh restart

# Stop when done
./scripts/system-control.sh stop
```

### Troubleshooting
```bash
# Check what's running
./scripts/system-control.sh status

# Force restart everything
./scripts/system-control.sh stop
sleep 5
./scripts/system-control.sh start

# Check logs
tail -f logs/boot-all-systems.log
tail -f logs/backend.log
tail -f logs/expo.log
```

### Monitoring
```bash
# Check process status
ps aux | grep -E "(expo|metro|nodemon|ngrok)"

# Check port usage
lsof -i -P | grep LISTEN

# Check logs
ls -la logs/
```

## Log Files

### Boot System Logs
- `logs/boot-all-systems.log` - Boot script execution log
- `logs/shutdown-all-systems.log` - Shutdown script execution log
- `logs/boot-pids.json` - Process PID tracking

### Service Logs
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

## Configuration

### Environment Variables
The scripts use the following environment paths:
- `PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor"`
- `MOBILE_DIR="$PROJECT_ROOT/mobile-native-fresh"`
- `BACKEND_DIR="$MOBILE_DIR/backend"`
- `RUNNER_DIR="/Users/sawyer/gitSync/gpt-cursor-runner"`

### Customization
To modify port assignments or add new services:
1. Edit the port variables in `boot-all-systems.sh`
2. Add new service startup in the appropriate section
3. Update the shutdown script to handle new services
4. Test with `./scripts/system-control.sh restart`

## Troubleshooting

### Common Issues

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

### Debug Mode
To run with verbose output:
```bash
# Enable debug mode
set -x
./scripts/system-control.sh start
set +x
```

## Integration with Ghost Monitoring

The boot system integrates with the Ghost monitoring infrastructure:
- Automatically starts all Ghost monitoring systems
- Ensures proper communication between systems
- Maintains monitoring continuity
- Provides health status to Ghost systems

## Security Considerations

- All processes run with appropriate permissions
- No sensitive data in logs
- Secure tunnel configurations
- Trust daemon monitoring for security compliance

## Performance Notes

- Boot time: ~30-60 seconds for full system startup
- Memory usage: ~500MB-1GB for all services
- CPU usage: Low during idle, spikes during development
- Network: Minimal for local development, moderate for tunnels

## Support

For issues or questions:
1. Check the logs in `logs/` directory
2. Run `./scripts/system-control.sh status`
3. Review this README for troubleshooting steps
4. Check individual service documentation

---

**Status**: ✅ Production Ready  
**Last Updated**: 2025-07-18  
**Version**: 1.0.0 