#!/bin/{ { { { bash
mkdir -p /Users/sawyer/gitSync/.cursor-cache/MAIN/summaries & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
for f in $(find /Users/sawyer/gitSync/tm-mobile-cursor -name "*.md" -type f | grep -v "/.cursor-cache/MAIN/summaries/"); do
  if grep -q "PATCH EXECUTION COMPLETE" "$f" && ! grep -q "/.cursor-cache/MAIN/summaries/" <<< "$f"; then
    tag=$(grep -m1 "Patch ID" "$f" | awk '{print $NF}' | sed 's/`//g')
    base="summary-${tag}.md"
    echo "Moving $f to .cursor-cache/MAIN/summaries/$base"
    mv "$f" "/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/$base"
  fi
done 