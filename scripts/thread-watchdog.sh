#!/bin/bash

# thread-watchdog.sh
# Monitors for stuck processes and CPU thresholds

set -e

# Configuration
MAX_CPU_PERCENT=80
MAX_MEMORY_MB=4096
CHECK_INTERVAL=30
LOG_FILE="logs/thread-watchdog.log"

# Ensure log directory exists
mkdir -p logs

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check CPU usage
check_cpu() {
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
    if (( $(echo "$cpu_usage > $MAX_CPU_PERCENT" | bc -l) )); then
        log_message "🚨 WARNING: High CPU usage detected: ${cpu_usage}%"
        return 1
    fi
    return 0
}

# Function to check memory usage
check_memory() {
    local memory_usage=$(vm_stat | grep "Pages active" | awk '{print $3}' | sed 's/\.//')
    local memory_mb=$((memory_usage * 4096 / 1024 / 1024))
    if [ "$memory_mb" -gt "$MAX_MEMORY_MB" ]; then
        log_message "🚨 WARNING: High memory usage detected: ${memory_mb}MB"
        return 1
    fi
    return 0
}

# Function to check for stuck processes
check_stuck_processes() {
    local stuck_processes=()
    
    # Check for processes that have been running too long
    while IFS= read -r line; do
        local pid=$(echo "$line" | awk '{print $2}')
        local time=$(echo "$line" | awk '{print $10}')
        local cmd=$(echo "$line" | awk '{print $11}')
        
        # Check if process has been running for more than 10 minutes
        if [[ "$time" =~ ^[0-9]+:[0-9]+$ ]] && [[ "$time" > "10:00" ]]; then
            stuck_processes+=("$pid:$cmd")
        fi
    done < <(ps aux | grep -E "(node|expo|ngrok)" | grep -v grep)
    
    if [ ${#stuck_processes[@]} -gt 0 ]; then
        log_message "🚨 WARNING: Stuck processes detected:"
        for process in "${stuck_processes[@]}"; do
            log_message "   - $process"
        done
        return 1
    fi
    return 0
}

# Function to check for zombie processes
check_zombie_processes() {
    local zombie_count=$(ps aux | grep -c "Z" || true)
    if [ "$zombie_count" -gt 0 ]; then
        log_message "🚨 WARNING: Zombie processes detected: $zombie_count"
        return 1
    fi
    return 0
}

# Function to check development ports
check_dev_ports() {
    local ports=(8081 4123 4000 5050)
    local issues=0
    
    for port in "${ports[@]}"; do
        if lsof -i ":$port" >/dev/null 2>&1; then
            local process_count=$(lsof -i ":$port" | wc -l)
            if [ "$process_count" -gt 3 ]; then
                log_message "🚨 WARNING: Multiple processes on port $port: $process_count"
                ((issues++))
            fi
        fi
    done
    
    return $issues
}

# Function to perform emergency cleanup
emergency_cleanup() {
    log_message "🚨 EMERGENCY CLEANUP INITIATED"
    
    # Kill stuck development processes
    pkill -f "patch-executor" 2>/dev/null || true
    pkill -f "live-patch-status" 2>/dev/null || true
    pkill -f "ghost-bridge" 2>/dev/null || true
    pkill -f "expo" 2>/dev/null || true
    pkill -f "ngrok" 2>/dev/null || true
    
    # Reset ports
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
    lsof -ti:4123 | xargs kill -9 2>/dev/null || true
    lsof -ti:4000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5050 | xargs kill -9 2>/dev/null || true
    
    log_message "✅ Emergency cleanup completed"
}

# Function to run health check
run_health_check() {
    local issues=0
    
    log_message "🔍 Running thread watchdog health check..."
    
    check_cpu || ((issues++))
    check_memory || ((issues++))
    check_stuck_processes || ((issues++))
    check_zombie_processes || ((issues++))
    check_dev_ports || ((issues++))
    
    if [ "$issues" -eq 0 ]; then
        log_message "✅ All systems healthy"
    else
        log_message "⚠️  $issues issues detected"
        
        # Perform emergency cleanup if too many issues
        if [ "$issues" -ge 3 ]; then
            emergency_cleanup
        fi
    fi
    
    return $issues
}

# Function to start monitoring
start_monitoring() {
    log_message "🚀 Thread watchdog started"
    log_message "Configuration:"
    log_message "  - Max CPU: ${MAX_CPU_PERCENT}%"
    log_message "  - Max Memory: ${MAX_MEMORY_MB}MB"
    log_message "  - Check Interval: ${CHECK_INTERVAL}s"
    
    while true; do
        run_health_check
        sleep "$CHECK_INTERVAL"
    done
}

# Function to run single check
single_check() {
    log_message "🔍 Running single health check..."
    run_health_check
}

# Main execution
main() {
    case "${1:-monitor}" in
        "monitor")
            start_monitoring
            ;;
        "check")
            single_check
            ;;
        "cleanup")
            emergency_cleanup
            ;;
        *)
            echo "Usage: $0 [monitor|check|cleanup]"
            echo ""
            echo "Commands:"
            echo "  monitor  - Start continuous monitoring"
            echo "  check    - Run single health check"
            echo "  cleanup  - Perform emergency cleanup"
            ;;
    esac
}

main "$@" 