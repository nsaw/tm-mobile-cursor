#!/bin/{ { { { bash
# Compare backup and current project for any differences & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

BACKUP="/Users/sawyer/Desktop/tm-mobile-cursor_BAK"
CURRENT="/Users/sawyer/gitSync/tm-mobile-cursor"

# See summary of new, missing, or changed files
echo "Comparing $BACKUP to $CURRENT ..."

diff -qr "$BACKUP" "$CURRENT" | tee diff-summary.txt

echo "Full summary saved as diff-summary.txt"
echo "Run 'code diff-summary.txt' to review in VS Code."


