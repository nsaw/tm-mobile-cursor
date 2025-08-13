#!/usr/bin/env bash
set -euo pipefail
NB_NODE="node scripts/nb.cjs"
NB_LOG_DIR="${NB_LOG_DIR:-validations/logs}"
NB_STATUS_DIR="${NB_STATUS_DIR:-validations/status}"
mkdir -p "$NB_LOG_DIR" "$NB_STATUS_DIR" >/dev/null 2>&1 || true
nb_bg() { local ttl="$1"; local label="$2"; shift 2; ( $NB_NODE --ttl "$ttl" --label "$label" --log "$NB_LOG_DIR/$label.log" --status "$NB_STATUS_DIR" -- bash -lc "$*" ) >/dev/null 2>&1 & }
nb_run() { local ttl="$1"; local label="$2"; shift 2; $NB_NODE --ttl "$ttl" --label "$label" --log "$NB_LOG_DIR/$label.log" --status "$NB_STATUS_DIR" -- bash -lc "$*"; }
