#!/usr/bin/env bash
set -eo pipefail

# Configuration
VAULT="tm-mobile"
DIR="${HOME}/gitSync/tm-mobile-cursor/mobile-native-fresh"

# Ensure 1Password CLI is available
if ! command -v op &> /dev/null; then
  echo "Error: 1Password CLI 'op' not found. Please install it and log in."
  exit 1
fi

# Function to import a .env file into 1Password
import_env() {
  local file="$1"
  local vault="$2"
  echo "Importing ${file##*/} → vault: $vault"
  # Read each line, including last line without newline
  while IFS='=' read -r key val || [ -n "$key" ]; do
    # Skip empty lines and comments
    [[ -z "$key" || "$key" =~ ^# ]] && continue
    # Trim whitespace
    key="$(echo -n "$key" | xargs)"
    val="$(echo -n "$val" | xargs)"
    echo " • $key"
    op item create \
      --vault "$vault" \
      --category "API Credential" \
      --title "$key" \
      username="$key" \
      password="$val"
  done < "$file"
}

# Perform imports
import_env "$DIR/.env.account" "$VAULT"
import_env "$DIR/.env.app" "$VAULT"

echo "✅ All done! Your secrets now live in the \"$VAULT\" vault."
