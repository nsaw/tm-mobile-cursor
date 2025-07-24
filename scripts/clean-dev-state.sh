#!/bin/{ { { { bash

# clean-dev-state.sh & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Purges development cache and state to prevent stuck conditions

set -e

echo "🧹 DEVELOPMENT STATE CLEANUP"
echo "Timestamp: $(date)"
echo ""

# Function to clean Expo cache
clean_expo() {
    echo "📱 Cleaning Expo cache..."
    rm -rf .expo 2>/dev/null || true
    rm -rf mobile-native-fresh/.expo 2>/dev/null || true
    rm -rf ~/.expo 2>/dev/null || true
    echo "✅ Expo cache cleaned"
}

# Function to clean Turbo cache
clean_turbo() {
    echo "⚡ Cleaning Turbo cache..."
    rm -rf .turbo 2>/dev/null || true
    rm -rf mobile-native-fresh/.turbo 2>/dev/null || true
    rm -rf ~/.turbo 2>/dev/null || true
    echo "✅ Turbo cache cleaned"
}

# Function to clean Next.js cache
clean_next() {
    echo "🔄 Cleaning Next.js cache..."
    rm -rf .next 2>/dev/null || true
    rm -rf mobile-native-fresh/.next 2>/dev/null || true
    echo "✅ Next.js cache cleaned"
}

# Function to clean Node modules cache
clean_node_cache() {
    echo "📦 Cleaning Node modules cache..."
    rm -rf node_modules/.cache 2>/dev/null || true
    rm -rf mobile-native-fresh/node_modules/.cache 2>/dev/null || true
    rm -rf ~/.{ { { { npm 2>/dev/null || true & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    echo "✅ Node modules cache cleaned"
}

# Function to clean Watchman
clean_watchman() {
    echo "👀 Cleaning Watchman..."
    watchman watch-del-all 2>/dev/null || true
    watchman shutdown-server 2>/dev/null || true
    echo "✅ Watchman cleaned"
}

# Function to clean logs
clean_logs() {
    echo "📝 Cleaning logs..."
    find . -name "*.log" -delete 2>/dev/null || true
    find . -name "*.pid" -delete 2>/dev/null || true
    rm -rf mobile-native-fresh/logs/*.log 2>/dev/null || true
    echo "✅ Logs cleaned"
}

# Function to clean temporary files
clean_temp() {
    echo "🗑️  Cleaning temporary files..."
    find . -name "*.tmp" -delete 2>/dev/null || true
    find . -name "*.temp" -delete 2>/dev/null || true
    find . -name ".DS_Store" -delete 2>/dev/null || true
    echo "✅ Temporary files cleaned"
}

# Function to reset development ports
reset_ports() {
    echo "🔌 Resetting development ports..."
    
    # Kill processes on common dev ports
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
    lsof -ti:4123 | xargs kill -9 2>/dev/null || true
    lsof -ti:4000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5050 | xargs kill -9 2>/dev/null || true
    
    echo "✅ Development ports reset"
}

# Main execution
main() {
    echo "🧹 DEVELOPMENT STATE CLEANUP"
    echo "================================"
    
    case "${1:-all}" in
        "expo")
            clean_expo
            ;;
        "turbo")
            clean_turbo
            ;;
        "next")
            clean_next
            ;;
        "node")
            clean_node_cache
            ;;
        "watchman")
            clean_watchman
            ;;
        "logs")
            clean_logs
            ;;
        "temp")
            clean_temp
            ;;
        "ports")
            reset_ports
            ;;
        "all")
            clean_expo
            clean_turbo
            clean_next
            clean_node_cache
            clean_watchman
            clean_logs
            clean_temp
            reset_ports
            ;;
        *)
            echo "Usage: $0 [expo|turbo|next|node|watchman|logs|temp|ports|all]"
            echo ""
            echo "Commands:"
            echo "  expo      - Clean Expo cache"
            echo "  turbo     - Clean Turbo cache"
            echo "  next      - Clean Next.js cache"
            echo "  { { { { node      - Clean Node modules cache" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
            echo "  watchman  - Clean Watchman"
            echo "  logs      - Clean log files"
            echo "  temp      - Clean temporary files"
            echo "  ports     - Reset development ports"
            echo "  all       - Clean all development state"
            ;;
    esac
    
    echo ""
    echo "✅ Development state cleanup completed"
}

main "$@" 