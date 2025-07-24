#!/bin/{ { { bash

# ============================================================================= & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# 1PASSWORD CLI CONFIGURATION SCRIPT
# =============================================================================
# Manages project secrets from SecretKeeper vault
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Users/sawyer/gitSync/tm-mobile-cursor"
GLOBAL_DIR="/Users/sawyer/gitSync/_global"
VAULT_NAME="SecretKeeper"
ENV_FILE="$PROJECT_ROOT/mobile-native-fresh/.env"
BACKUP_FILE="$PROJECT_ROOT/mobile-native-fresh/.env.backup"

# WARP Tunnel Configuration
CLOUDFLARED_DIR="/Users/sawyer/.cloudflared"
RUNNER_TUNNEL_ID="f1545c78-1a94-408f-ba6b-9c4223b4c2bf"
GHOST_TUNNEL_ID="c9a7bf54-dab4-4c9f-a05d-2022f081f4e0"
RUNNER_HOSTNAME="runner.thoughtmarks.app"
GHOST_HOSTNAME="ghost.thoughtmarks.app"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

log_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Function to check if 1Password CLI is installed
check_op_cli() {
    if ! command -v op &> /dev/null; then
        log_error "1Password CLI is not installed"
        log_info "Install from: https://1password.com/downloads/command-line/"
        exit 1
    fi
}

# Function to check if user is signed in
check_op_auth() {
    if ! op account list &> /dev/null; then
        log_error "Not signed in to 1Password CLI"
        log_info "Run: op signin"
        exit 1
    fi
}

# Function to check if vault exists
check_vault() {
    if ! op vault list | grep -q "$VAULT_NAME"; then
        log_error "Vault '$VAULT_NAME' not found"
        log_info "Available vaults:"
        op vault list
        exit 1
    fi
}

# Function to backup existing .env file
backup_env() {
    if [ -f "$ENV_FILE" ]; then
        log_info "Backing up existing .env file..."
        cp "$ENV_FILE" "$BACKUP_FILE"
        log_info "Backup created: $BACKUP_FILE"
    fi
}

# Function to import secrets from vault
import_secrets() {
    log_info "Importing secrets from vault '$VAULT_NAME'..."
    
    # Create .env file if it doesn't exist
    touch "$ENV_FILE"
    
    # Get list of items in vault
    items=$(op item list --vault "$VAULT_NAME" --format json | jq -r '.[].id')
    
    imported_count=0
    for item_id in $items; do
        # Get item details
        item_title=$(op item get "$item_id" --vault "$VAULT_NAME" --format json | jq -r '.title')
        
        # Skip items that don't look like environment variables
        if [[ "$item_title" =~ ^[A-Z_]+$ ]]; then
            log_info "Processing: $item_title"
            
            # Get the secret value (assuming it's in a field called 'value' or 'password')
            secret_value=$(op item get "$item_id" --vault "$VAULT_NAME" --format json | jq -r '.fields[] | select(.id == "value" or .id == "password" or .id == "concealed") | .value' 2>/dev/null || echo "")
            
            if [ -n "$secret_value" ] && [ "$secret_value" != "null" ]; then
                # Add to .env file
                echo "$item_title=$secret_value" >> "$ENV_FILE"
                imported_count=$((imported_count + 1))
                log_info "✅ Imported: $item_title"
            else
                log_warn "⚠️  No secret value found for: $item_title"
            fi
        fi
    done
    
    log_info "Import completed: $imported_count secrets imported"
}

# Function to export secrets to vault
export_secrets() {
    log_info "Exporting secrets to vault '$VAULT_NAME'..."
    
    if [ ! -f "$ENV_FILE" ]; then
        log_error "No .env file found to export"
        exit 1
    fi
    
    exported_count=0
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ "$key" =~ ^[[:space:]]*# ]] || [[ -z "$key" ]]; then
            continue
        fi
        
        # Remove leading/trailing whitespace
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)
        
        if [ -n "$key" ] && [ -n "$value" ]; then
            log_info "Exporting: $key"
            
            # Check if item already exists
            existing_item=$(op item list --vault "$VAULT_NAME" --format json | jq -r ".[] | select(.title == \"$key\") | .id" 2>/dev/null || echo "")
            
            if [ -n "$existing_item" ]; then
                log_warn "Item '$key' already exists, skipping..."
            else
                # Create new item
                op item create --vault "$VAULT_NAME" --category="Secure Note" --title="$key" --notes="Auto-exported from project .env" > /dev/null 2>&1
                
                # Add the secret value
                item_id=$(op item list --vault "$VAULT_NAME" --format json | jq -r ".[] | select(.title == \"$key\") | .id" 2>/dev/null || echo "")
                
                if [ -n "$item_id" ]; then
                    # Update with secret value
                    op item edit "$item_id" --vault "$VAULT_NAME" --field="value=$value" > /dev/null 2>&1
                    exported_count=$((exported_count + 1))
                    log_info "✅ Exported: $key"
                else
                    log_warn "⚠️  Failed to create item: $key"
                fi
            fi
        fi
    done < "$ENV_FILE"
    
    log_info "Export completed: $exported_count secrets exported"
}

# Function to list available secrets
list_secrets() {
    log_info "Available secrets in vault '$VAULT_NAME':"
    
    op item list --vault "$VAULT_NAME" --format json | jq -r '.[] | "  \(.title) (\(.id))"' | sort
}

# Function to get a specific secret
get_secret() {
    local secret_name="$1"
    
    if [ -z "$secret_name" ]; then
        log_error "Secret name required"
        log_info "Usage: $0 get <secret_name>"
        exit 1
    fi
    
    # Find item by title
    item_id=$(op item list --vault "$VAULT_NAME" --format json | jq -r ".[] | select(.title == \"$secret_name\") | .id" 2>/dev/null || echo "")
    
    if [ -n "$item_id" ]; then
        secret_value=$(op item get "$item_id" --vault "$VAULT_NAME" --format json | jq -r '.fields[] | select(.id == "value" or .id == "password" or .id == "concealed") | .value' 2>/dev/null || echo "")
        
        if [ -n "$secret_value" ] && [ "$secret_value" != "null" ]; then
            echo "$secret_value"
        else
            log_error "No secret value found for: $secret_name"
            exit 1
        fi
    else
        log_error "Secret not found: $secret_name"
        exit 1
    fi
}

# Function to manage WARP tunnel secrets
manage_warp_secrets() {
    local action="$1"
    
    case "$action" in
        "export")
            log_info "Exporting WARP tunnel secrets to vault..."
            
            # Export runner tunnel credentials
            if [ -f "$CLOUDFLARED_DIR/credentials.json" ]; then
                op item create --vault "$VAULT_NAME" --category="Secure Note" --title="RUNNER_TUNNEL_CREDENTIALS" --notes="Runner tunnel credentials for $RUNNER_HOSTNAME" > /dev/null 2>&1
                item_id=$(op item list --vault "$VAULT_NAME" --format json | jq -r ".[] | select(.title == \"RUNNER_TUNNEL_CREDENTIALS\") | .id" 2>/dev/null || echo "")
                if [ -n "$item_id" ]; then
                    op item edit "$item_id" --vault "$VAULT_NAME" --field="value=$(cat $CLOUDFLARED_DIR/credentials.json)" > /dev/null 2>&1
                    log_info "✅ Exported runner tunnel credentials"
                fi
            fi
            
            # Export ghost tunnel credentials
            if [ -f "$CLOUDFLARED_DIR/$GHOST_TUNNEL_ID.json" ]; then
                op item create --vault "$VAULT_NAME" --category="Secure Note" --title="GHOST_TUNNEL_CREDENTIALS" --notes="Ghost tunnel credentials for $GHOST_HOSTNAME" > /dev/null 2>&1
                item_id=$(op item list --vault "$VAULT_NAME" --format json | jq -r ".[] | select(.title == \"GHOST_TUNNEL_CREDENTIALS\") | .id" 2>/dev/null || echo "")
                if [ -n "$item_id" ]; then
                    op item edit "$item_id" --vault "$VAULT_NAME" --field="value=$(cat $CLOUDFLARED_DIR/$GHOST_TUNNEL_ID.json)" > /dev/null 2>&1
                    log_info "✅ Exported ghost tunnel credentials"
                fi
            fi
            
            # Export tunnel configuration
            op item create --vault "$VAULT_NAME" --category="Secure Note" --title="WARP_TUNNEL_CONFIG" --notes="WARP tunnel configuration" > /dev/null 2>&1
            item_id=$(op item list --vault "$VAULT_NAME" --format json | jq -r ".[] | select(.title == \"WARP_TUNNEL_CONFIG\") | .id" 2>/dev/null || echo "")
            if [ -n "$item_id" ]; then
                config_content="RUNNER_TUNNEL_ID=$RUNNER_TUNNEL_ID
GHOST_TUNNEL_ID=$GHOST_TUNNEL_ID
RUNNER_HOSTNAME=$RUNNER_HOSTNAME
GHOST_HOSTNAME=$GHOST_HOSTNAME"
                op item edit "$item_id" --vault "$VAULT_NAME" --field="value=$config_content" > /dev/null 2>&1
                log_info "✅ Exported WARP tunnel configuration"
            fi
            ;;
        "import")
            log_info "Importing WARP tunnel secrets from vault..."
            
            # Import runner tunnel credentials
            item_id=$(op item list --vault "$VAULT_NAME" --format json | jq -r ".[] | select(.title == \"RUNNER_TUNNEL_CREDENTIALS\") | .id" 2>/dev/null || echo "")
            if [ -n "$item_id" ]; then
                secret_value=$(op item get "$item_id" --vault "$VAULT_NAME" --format json | jq -r '.fields[] | select(.id == "value") | .value' 2>/dev/null || echo "")
                if [ -n "$secret_value" ] && [ "$secret_value" != "null" ]; then
                    echo "$secret_value" > "$CLOUDFLARED_DIR/credentials.json"
                    log_info "✅ Imported runner tunnel credentials"
                fi
            fi
            
            # Import ghost tunnel credentials
            item_id=$(op item list --vault "$VAULT_NAME" --format json | jq -r ".[] | select(.title == \"GHOST_TUNNEL_CREDENTIALS\") | .id" 2>/dev/null || echo "")
            if [ -n "$item_id" ]; then
                secret_value=$(op item get "$item_id" --vault "$VAULT_NAME" --format json | jq -r '.fields[] | select(.id == "value") | .value' 2>/dev/null || echo "")
                if [ -n "$secret_value" ] && [ "$secret_value" != "null" ]; then
                    echo "$secret_value" > "$CLOUDFLARED_DIR/$GHOST_TUNNEL_ID.json"
                    log_info "✅ Imported ghost tunnel credentials"
                fi
            fi
            ;;
        *)
            log_error "Invalid action. Use 'export' or 'import'"
            exit 1
            ;;
    esac
}

# Function to show usage
show_usage() {
    echo -e "${BLUE}1PASSWORD CLI CONFIGURATION${NC}"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  import          Import secrets from vault to .env file"
    echo "  export          Export secrets from .env file to vault"
    echo "  list            List all available secrets in vault"
    echo "  get <name>      Get a specific secret value"
    echo "  backup          Backup current .env file"
    echo "  restore         Restore .env file from backup"
    echo "  status          Check 1Password CLI status"
    echo "  warp-export     Export WARP tunnel secrets to vault"
    echo "  warp-import     Import WARP tunnel secrets from vault"
    echo "  help            Show this help"
    echo ""
    echo "Configuration:"
    echo "  Vault: $VAULT_NAME"
    echo "  Project: $PROJECT_ROOT"
    echo "  Global Config: $GLOBAL_DIR"
    echo "  Cloudflared: $CLOUDFLARED_DIR"
    echo ""
    echo "WARP Tunnels:"
    echo "  Runner: $RUNNER_HOSTNAME ($RUNNER_TUNNEL_ID)"
    echo "  Ghost: $GHOST_HOSTNAME ($GHOST_TUNNEL_ID)"
}

# Function to check status
check_status() {
    log_info "Checking 1Password CLI status..."
    
    # Check if CLI is installed
    if command -v op &> /dev/null; then
        log_info "✅ 1Password CLI is installed"
    else
        log_error "❌ 1Password CLI is not installed"
        return 1
    fi
    
    # Check if signed in
    if op account list &> /dev/null; then
        log_info "✅ Signed in to 1Password CLI"
    else
        log_error "❌ Not signed in to 1Password CLI"
        return 1
    fi
    
    # Check if vault exists
    if op vault list | grep -q "$VAULT_NAME"; then
        log_info "✅ Vault '$VAULT_NAME' found"
    else
        log_error "❌ Vault '$VAULT_NAME' not found"
        return 1
    fi
    
    # Check global config
    if [ -d "$GLOBAL_DIR" ]; then
        log_info "✅ Global config directory found: $GLOBAL_DIR"
    else
        log_warn "⚠️  Global config directory not found: $GLOBAL_DIR"
    fi
    
    # Check project .env
    if [ -f "$ENV_FILE" ]; then
        log_info "✅ Project .env file found: $ENV_FILE"
    else
        log_warn "⚠️  Project .env file not found: $ENV_FILE"
    fi
    
    log_info "Status check completed"
}

# Function to backup .env
backup_env_file() {
    if [ -f "$ENV_FILE" ]; then
        backup_env
        log_info "Backup completed"
    else
        log_warn "No .env file to backup"
    fi
}

# Function to restore .env
restore_env_file() {
    if [ -f "$BACKUP_FILE" ]; then
        log_info "Restoring .env file from backup..."
        cp "$BACKUP_FILE" "$ENV_FILE"
        log_info "Restore completed"
    else
        log_error "No backup file found: $BACKUP_FILE"
        exit 1
    fi
}

# Main script
main() {
    case "${1:-help}" in
        "import")
            check_op_cli
            check_op_auth
            check_vault
            backup_env
            import_secrets
            ;;
        "export")
            check_op_cli
            check_op_auth
            check_vault
            export_secrets
            ;;
        "list")
            check_op_cli
            check_op_auth
            check_vault
            list_secrets
            ;;
        "get")
            check_op_cli
            check_op_auth
            check_vault
            get_secret "$2"
            ;;
        "backup")
            backup_env_file
            ;;
        "restore")
            restore_env_file
            ;;
        "status")
            check_status
            ;;
        "warp-export")
            check_op_cli
            check_op_auth
            check_vault
            manage_warp_secrets "export"
            ;;
        "warp-import")
            check_op_cli
            check_op_auth
            check_vault
            manage_warp_secrets "import"
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

# Run main function
main "$@" 