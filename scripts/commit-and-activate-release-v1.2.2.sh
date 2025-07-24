#!/bin/{ { { { bash

echo "🔁 Moving taskflow and snippets into project repo..." & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Ensure destination folders
mkdir -p ./docs/snippets
mkdir -p ./tasks
mkdir -p ./scripts

# Move files
cp /mnt/data/pulled-chat-snippets.zip ./docs/snippets/
unzip -o ./docs/snippets/pulled-chat-snippets.zip -d ./docs/snippets/
cp /mnt/data/tasks/taskflow.release-v1.2.2.json ./tasks/
cp /mnt/data/tasks/priority-today.md ./tasks/
cp /mnt/data/.cursor-config.release-v1.2.2.json ./.cursor-config.json
cp /mnt/data/scripts/sync-from-remote.sh ./scripts/
chmod +x ./scripts/sync-from-remote.sh

echo "✅ Files moved. Staging for git..."

# Git add and commit
git add ./docs/snippets ./tasks ./scripts
git commit -m "chore(v1.2.2): push JSON taskflow and extracted chat snippets"
git tag v1.2.2_tasks-pushed
git push origin release/v1.2.2 --tags

echo "✅ Commit and tag complete."

# Cursor activation optional (assumed manual launch)
echo "🚀 Ready to load taskflow.release-v1.2.2.json in Cursor."
echo "To execute: load .cursor-config.json OR start with taskflow runner in Cursor’s Actions tab."
