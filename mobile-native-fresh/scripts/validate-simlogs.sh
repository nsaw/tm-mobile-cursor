#!/usr/bin/env bash
set -euo pipefail
LOGFILE=${1:-"./logs/simulator.log"}
if [[ ! -f "$LOGFILE" ]]; then echo "[validate-simlogs] WARN: log file not found: $LOGFILE"; exit 0; fi

# Fail-fast patterns: application-specific errors only
FAIL_PATTERNS=(
  "FATAL EXCEPTION"
  "Unhandled promise rejection"
  "TypeError:"
  "ReferenceError:"
  "Invariant Violation"
  "ERROR  Invariant"
  "ERROR  Possible Unhandled Promise Rejection"
  "React Native Error"
  "Metro Error"
  "Expo Error"
)

# System-level errors to ignore (not application errors)
IGNORE_PATTERNS=(
  "pairedsyncd.*Fatal error"
  "system.*Fatal error"
  "daemon.*Fatal error"
)

# Check for application-specific fatal errors
for pat in "${FAIL_PATTERNS[@]}"; do
  if grep -E "$pat" "$LOGFILE" >/dev/null 2>&1; then
    # Double-check it's not a system error we should ignore
    is_system_error=false
    for ignore_pat in "${IGNORE_PATTERNS[@]}"; do
      if grep -E "$ignore_pat" "$LOGFILE" >/dev/null 2>&1; then
        is_system_error=true
        break
      fi
    done
    
    if [[ "$is_system_error" == "false" ]]; then
      echo "[validate-simlogs] FAIL matched pattern: $pat" >&2
      exit 1
    else
      echo "[validate-simlogs] IGNORED system error: $pat"
    fi
  fi
done

# Optional noisy warnings that shouldn't fail build but we report
WARN_PATTERNS=("Warning:" "deprecated")
for pat in "${WARN_PATTERNS[@]}"; do
  if grep -E "$pat" "$LOGFILE" >/dev/null 2>&1; then
    echo "[validate-simlogs] WARN matched: $pat"
  fi
done

echo "[validate-simlogs] SIMLOGS_OK"
