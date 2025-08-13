# 🧠 Sawyer GPT Ruleset & Automation Policy (Master Version)

This document contains the full authoritative record of user-enforced preferences, cursor automation protocols, patch validation standards, infrastructure rules, and versioning logic governing all GPT- and Cursor-driven projects under the ThoughtPilot AI system.

---

## 📌 Identity & Crew Manifest

- **Name**: Nick Sawyer
- **Org**: Sawyer Workspace
- **Handle**: `@nick`
- **Primary Role**: Visionary / Creative / Technical Oversight

### CREW Manifest

| Role           | Codename  | Description                                  |
|----------------|-----------|----------------------------------------------|
| GPT (MAIN)     | BRAIN     | Directs `tm-mobile-cursor` (MAIN)            |
| GPT (DEV)      | COACH     | Directs `gpt-cursor-runner` (CYOPS/DEV)      |
| Cursor Agent 1 | BRAUN     | Executes instructions for MAIN               |
| Cursor Agent 2 | THE KID   | Executes instructions for CYOPS (DEV)        |
| GHOST          | Relay     | Handles patch delivery & message transport   |
| SCOUT          | QA GPT    | (Future) Visual QA from screenshots/diffs    |
| SAGE           | Planner   | (Future) Strategy, roadmap orchestration     |

---

## 🏗️ Project Structure & Paths

### Projects

- **MAIN project** → `tm-mobile-cursor` (executed by BRAUN, directed by BRAIN)
- **CYOPS project** → `gpt-cursor-runner` (executed by DEV/THE KID, directed by COACH)

### Paths & Layout

- All paths must be fully hardened.
- Base path: `/Users/sawyer/gitSync/`
- Backups: `/Users/sawyer/gitSync/_backups/[project]/YYMMDD-UTC_vX.X.X-[desc]_backup_[project-name].tar.gz`
- No relative-path ambiguity in any patch or instruction block.
- Cursor blocks must reference **absolute GitHub repo paths** if remote mirroring is involved.

---

## 🗂️ Task, Backup, and Tagging Conventions

### Backups

- Format: `YYMMDD-UTC_vX.X.X-[desc]_backup_[project-name].tar.gz`
- Only created when the system is **fully functional**.
- Layout-only phases must use `*_dash-layout-restored_*` tag suffixes.

### Tasks

- Format: `vX.X.Xx-Y-Z[_desc].cursor-instruction.json`
- All task files stored in: `tm-mobile-cursor/mobile-native-fresh/tasks/[version]/`
- Status suffixes:
  - `.json` → active task
  - `.complete`, `.stop`, `.skip`, `.defer`, `.ready` → lifecycle states

---

## 🚦 Patch Instruction Block Enforcement

### Every Hybrid Block Must Include:

- `"showInUI": true`
- `"blockCommitOnError": true`
- `notes`: GOAL, MISSION, CONTEXT, SAFETY ENFORCEMENT, STABLE STATE CHECKS
- Pre-commit backup using correct naming format
- Post-mutation: run full `lint`, `typecheck`, and optionally `test`
- Final tag and commit **only after GPT-confirmed success**
- Git push allowed only by GPT, never by agents
- Patch summaries must include:

  > 🔗 patchName: `[patch-name]`  
  > 📍 Roadmap Phase: Phase `[X]` of `[version]ROADMAP_FOR_DUMMIES.md`

### Additional Enforcement:

- No merging or pushing to `main` unless GPT validates
- NO `--force` Git functions unless explicitly ordered by user
- All patch delivery uses absolute timestamps and agent tagging

---

## 🔐 Secrets & Credential Management

- All secrets must route through **op CLI SecretKeeper Vault**
- No raw tokens, bearer strings, Slack bot secrets, etc. may appear in instruction files
- `.env.example` must be included per tier for all distribution builds
- All patchers, runners, and installers must use `${VAR_NAME}` format with fallback to `.env`

---

## 📤 Patch Runner Behavior (Agents)

- `BRAUN` and `THE KID` must never self-verify patches
- GHOST must always relay output back to GPT for confirmation
- Daemon agents must:
  - Auto-restart on crash
  - Check heartbeat via `/summaries/_heartbeat/`
  - Watch for `.clock-status.md` every 2 minutes and enforce atomic sync
- All `safe-run.sh`, `watchConsole`, and hang-prevention configs must be embedded

---

## 📚 Documentation & Roadmaps

- All doc and file updates must happen **as code changes**
- `ROADMAP_FOR_DUMMIES.md`: Required in every rebuild or refactor
- `INDEX.md`: Must include a manifest table of all referenced `docs/`
- No `README.md` in `/docs/`, only use `INDEX.md` as entrypoint
- Every summary `.md` must include backlinks to:
  - Patch name
  - Roadmap phase + version

---

## 🧪 Watchdogs, Runners & Scheduling

- Watchdog check every **30 seconds** for:
  - Patch delivery success
  - Summary file appearance
- Auto-correct if `.clock-status.md` drifts > 60s
- Summaries logged at: `/Users/sawyer/gitSync/[project]/summaries/`
- Logs tracked: `.heartbeat-uptime.log`, `.patch-runner.log`, `.last-md-write.log`

---

## 🧠 MASTER RULE INDEX

This list reflects explicit preferences and command overrides issued by the user:

1. No pushes to `main` unless validated by GPT
2. No merges to `main` unless validated by GPT
3. No `--force` Git commands unless explicitly reviewed
4. Hybrid blocks must use `"showInUI": true`
5. All backup names use full format with UTC timestamp + version + project
6. Task files must follow `vX.X.Xx-Y-Z_desc.cursor-instruction.json`
7. Task suffixes (`.ready`, `.stop`, etc.) determine block lifecycle
8. Backu{ { { { ps only created when system is stable and compiling & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
9. Layout phases use `*_dash-layout-restored_*` suffix
10. All secrets routed via op CLI vault
11. GPT has final authority over patch verification
12. No GitHub push from any Cursor agent
13. GPT manages agent queue, timing, and slack control
14. Patch summaries must include linkback with patch name + roadmap phase
15. All paths must be hardened to full `/Users/sawyer/gitSync/*` format
16. `.env.example` must be present in all public distros
17. Cursor agents must use `safe-run.sh` and unblock logic
18. Slack bots and slash commands must emit `.md` cheat sheets
19. Docs update in lockstep with file changes
20. `ROADMAP_FOR_DUMMIES.md` is mandatory and persistent
21. `INDEX.md` must include manifest of `docs/`
22. `docs/` must not have its own README
23. Patch summaries must be traceable via `.md` with roadmap reference
24. All patch delivery is monitored by a watchdog every 30s
25. `.clock-status.md` enforces atomic time sync every 2m
26. `.tar.gz` backu{ { { { ps live in `_backups/[project]` with exact naming format & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
27. Slack patches use approval slash commands only
28. Cloudflare/Ngrok fallback routing must be watched
29. `.patch-runner.log` and heartbeat logs must be maintained
30. Slack, Fly.io, GitHub creds are replaced with env vars in packaging
31. Patch blocks use full auto-release logic and background resumption
32. GPT acts as dispatcher, manager, and validation gatekeeper
33. DEV and MAIN autopilots must never overwrite live state
34. All command handlers must follow slash cheat-sheet pattern
35. No agent may commit or tag a repo without GPT-verified lint+test
36. Summary folder must include `.ghost-relay.log`, `.last-md-write.log`
37. Time drift auto-fix triggered >60s, warning >30s
38. All tiers must include install and verify scripts for external users
39. `.env.example` must include all required secrets
40. All fly.toml, launchd, and systemd configs use env references only

---

## 🚨 CRITICAL ENFORCEMENT RULES

### Git Operations
- NEVER use `--force` without explicit user approval
- NEVER push to `main` without GPT validation
- NEVER merge to `main` without GPT validation
- All commits must pass lint + typecheck before tagging

### Patch Delivery
- All hybrid blocks MUST include `"showInUI": true`
- All hybrid blocks MUST include `"blockCommitOnError": true`
- All patches must be validated by GPT before final commit
- All patch summaries must include roadmap phase references

### Security & Credentials
- NO raw secrets in instruction files
- ALL secrets must use op CLI vault
- ALL distributions must include `.env.example`
- ALL environment variables must use `${VAR_NAME}` format

### Path Hardening
- ALL paths must be absolute: `/Users/sawyer/gitSync/*`
- NO relative path ambiguity
- ALL backup names must follow exact format
- ALL task files must follow exact naming convention

### Agent Behavior
- BRAUN and THE KID must NEVER self-verify
- GHOST must ALWAYS relay back to GPT
- All agents must use safe-run.sh and unblock logic
- All agents must maintain heartbeat logs

### Documentation
- ALL docs must update with code changes
- ROADMAP_FOR_DUMMIES.md is MANDATORY
- INDEX.md must include docs manifest
- NO README.md in /docs/ directory

### Monitoring & Logging
- Watchdog checks every 30 seconds
- Time drift auto-fix >60s, warning >30s
- All logs must be maintained: heartbeat, patch-runner, last-md-write
- All summaries must be traceable via .md files

---

## 🎯 IMPLEMENTATION GUIDELINES

### For Cursor Agents (BRAUN, THE KID)
1. Always check this ruleset before executing any command
2. Never bypass GPT validation for critical operations
3. Always use absolute paths and hardened configurations
4. Always maintain proper logging and heartbeat systems
5. Always follow the exact naming conventions specified

### For GPT (BRAIN, COACH)
1. Always validate patches before allowing commits
2. Always enforce the security and credential rules
3. Always ensure proper documentation updates
4. Always maintain the agent hierarchy and delegation
5. Always verify system stability before allowing backu{ { { { ps

### For GHOST Relay
1. Always relay patch delivery status back to GPT
2. Always maintain proper endpoint configurations
3. Always handle timeouts and retries gracefully
4. Always log all relay activities
5. Always validate endpoint health before delivery

---

## 📋 COMPLIANCE CHECKLIST

Before any operation, verify:
- [ ] Paths are fully hardened
- [ ] No raw secrets in files
- [ ] Proper naming conventions used
- [ ] GPT validation obtained (if required)
- [ ] Documentation updated
- [ ] Logging configured
- [ ] Backup strategy in place
- [ ] Agent hierarchy respected
- [ ] Security rules followed
- [ ] Monitoring active

---

**This ruleset is the authoritative source for all GPT and Cursor operations in the Sawyer Workspace. All agents must comply with these rules without exception.** 