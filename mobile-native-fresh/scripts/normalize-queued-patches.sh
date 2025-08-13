#!/usr/bin/env bash
set -euo pipefail
Q="/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.5/_queue"
OUT="/Users/sawyer/gitSync/.cursor-cache/MAIN/artifacts/json-normalized-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"
normalize_one() {
  local f="$1"; local b; b="$(basename "$f")"
  if ! jq . "$f" >/dev/null 2>&1; then
    # Attempt to repair common newline-in-string errors by compacting with jq -R / -s heuristic
    # (Best-effort; if still bad, move to .failed for manual attention)
    if python - <<'PY' "$f" "$OUT/$b.repaired.json"; then
import sys, json, re
src=sys.argv[1]; dst=sys.argv[2]
raw=open(src,'rb').read().decode('utf-8','ignore')
raw=re.sub(r'("summaryFile"\\s*:\\s*")\\s*\\n\\s*','\\1', raw)
open(dst,'w').write(raw)
PY
      then
        mv "$OUT/$b.repaired.json" "$f"
      else
        echo "[normalize] could not auto-repair $b"
      fi
  fi
  # Normalize object-shaped mutations with .shell[] into an array shell op
  if jq -e '(.mutations|type)=="object" and (.mutations.shell|type)=="array"' "$f" >/dev/null 2>&1; then
    tmp="$(mktemp)"
    jq ' .mutations = [ { "op":"shell", "run": (.mutations.shell|join("\n")) } ] ' "$f" > "$tmp" && mv "$tmp" "$f"
    echo "[normalize] $b -> array(shell)"
  fi
  # Canonicalize formatting
  jq -S . "$f" > "$OUT/$b.canonical.json" && mv "$OUT/$b.canonical.json" "$f"
}
export -f normalize_one
shopt -s nullglob
for f in "$Q"/*.json; do normalize_one "$f"; done
echo "[normalize] complete"
