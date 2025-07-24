# 🧰 Tools System Reference

This directory contains automation tools, CI scripts, and phase-enforcement utilities.

## 🔧 Script Overview

| Script | Purpose |
|--------|---------|
| `boot-all-systems.sh` | Starts daemon, tunnel, and patch relay systems |
| `system-control.sh` | Central router for CLI-based patch tooling |
| `shutdown-all-systems.sh` | Gracefully tears down all GPT/Runner systems |
| `trust-daemon.js` | Monitors socket integrity and cursor-runner feedback loop |
| `watchdog-tunnel.sh` | Cloudflare tunnel watchdog |
| `monitoring-system.js` | Logs endpoint summaries and status per heartbeat |
| `verify-systems.js` | Called in postMutationBuild to validate system health |
| `verify-phase3-systems.sh` | Enforces snapshot and visual regression safety in P3 |
| `summary-monitor.js` | Logs every `.md` and `.json` summary with fail flags |
| `patch-executor.js` | Automates GPT patch routing and handoff |
| `ghost-bridge.js` | Ghost routing bridge for patch queue delivery |
| `enhanced-ghost-runner-with-verification.sh` | Runs ghost loop with retries and fail detection |
| `backup-tag-push.sh` | Creates .tar.gz backu{ { { { ps and Git tags | & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
| `aggressive-backup-cleaner.js` | Removes stale .tar.gz based on policy |
| `summary-cleanup.js` | Deletes old `.md` summaries after tag success |
| `log-rotation.js` | Compresses old logs and retains critical history |
| `repair-slack-relay.sh` | Repairs failed webhook tunnels |
| `slack-audit.sh` | Lints Slack manifest and permission state |
| `test-ghost-endpoints.js` | Pings known routes in the ghost patch router |

## 🧪 Suggested Phase Hooks

- Phase 0 → `verify-systems.js`
- Phase 2 → `verify-phase3-systems.sh`, `summary-monitor.js`
- Phase 3+ → `ghost-bridge.js`, `patch-executor.js`

## 🔄 Rollback Protocol

1. Run `backup-tag-push.sh` before any risky patch
2. Tag in format: `v1.4.999_PRE-riskpoint_YYMMDD_HHMMPT`
3. Revert via Git or restore from `/backups/*.tar.gz`
