#!/bin/bash

# Detect the active shell config file
if [ -n "$ZSH_VERSION" ]; then
  SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
  SHELL_RC="$HOME/.bashrc"
else
  echo "Unsupported shell. Add alias manually to your shell profile."
  exit 1
fi

ALIAS_CMD="alias gbackup='bash ~/gitSync/tm-mobile-cursor/scripts/backup-tag-push.sh'"

# Check if alias already exists
if grep -Fxq "$ALIAS_CMD" "$SHELL_RC"; then
  echo "Alias already exists in $SHELL_RC"
else
  echo "$ALIAS_CMD" >> "$SHELL_RC"
  echo "✅ Alias 'gbackup' added to $SHELL_RC"
  echo "📌 Run: source $SHELL_RC to activate now"
fi
