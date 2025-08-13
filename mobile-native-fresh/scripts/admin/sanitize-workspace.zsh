#!/bin/zsh
# sanitize-workspace.zsh — Fix formatter noise, lockfile conflicts, and terminal spawn issues
set -euo pipefail
ROOT="/Users/sawyer/gitSync/tm-mobile-cursor"
APP="$ROOT/mobile-native-fresh"

backup() {
  local f="$1"; [ -f "$f" ] || return 0; local dir="${f:h}"; local ts=$(date +%y%m%d_%H%M%S)
  cp -p "$f" "${f}.bak.${ts}" || true
}

# 1) Remove any illegal folder-scoped setting `terminal.integrated.enableVisualBell`
for f in "$ROOT/.vscode/settings.json" "$APP/.vscode/settings.json"; do
  [ -f "$f" ] || continue
  backup "$f"
  # delete any lines containing that key (safe for json minified or pretty)
  /usr/bin/sed -i '' '/"terminal\.integrated\.enableVisualBell"/d' "$f" || true
  # also strip trailing commas that could remain (best-effort): remove ",\s*}\n" -> "}\n"
  /usr/bin/sed -i '' 's/,\s*}/}/g' "$f" || true
done

# 2) Lockfile sanity: prefer npm. Move conflicting lockfiles aside (with backup dir)
LF_BACK="$APP/_backups/lockfiles/$(date +%y%m%d_%H%M%S)"
mkdir -p "$LF_BACK"
for lf in "$APP/yarn.lock" "$APP/pnpm-lock.yaml"; do
  if [ -f "$lf" ]; then
    mv "$lf" "$LF_BACK/" || true
  fi
done

# 3) Ensure default shell exists and is executable
for sh in /bin/zsh /bin/bash; do
  if [ ! -x "$sh" ]; then echo "WARN: shell missing: $sh"; fi
done

# 4) Quick spawn probe via zsh login non-interactive
/bin/zsh -lc 'echo SHELL=$(echo $SHELL); echo OK_SPawn' >/dev/null 2>&1 || {
  echo "Spawn probe failed; attempting bash fallback"
  /bin/bash -lc 'echo SHELL=$(echo $SHELL); echo OK_Spawn_Bash' >/dev/null 2>&1 || true
}

echo "sanitize-workspace: complete"
