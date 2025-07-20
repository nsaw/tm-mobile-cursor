# Global Cursor Rules Configuration

Generated: 2025-07-18T21:20:00.000Z

## Overview

Successfully applied the comprehensive Sawyer GPT Ruleset & Automation Policy to the global Cursor configuration at `/Users/sawyer/.cursorrules`.

## Configuration Details

### File Location
- **Path**: `/Users/sawyer/.cursorrules`
- **Size**: 10,126 bytes
- **Permissions**: `-rw-r--r--`
- **Scope**: Global (applies to all Cursor workspaces)

### Key Components Applied

#### 1. Identity & Crew Manifest
- **Name**: Nick Sawyer
- **Org**: Sawyer Workspace
- **Handle**: `@nick`
- **Primary Role**: Visionary / Creative / Technical Oversight

#### 2. Crew Hierarchy
| Role | Codename | Description |
|------|----------|-------------|
| GPT (MAIN) | BRAIN | Directs `tm-mobile-cursor` (MAIN) |
| GPT (DEV) | COACH | Directs `gpt-cursor-runner` (CYOPS/DEV) |
| Cursor Agent 1 | BRAUN | Executes instructions for MAIN |
| Cursor Agent 2 | THE KID | Executes instructions for CYOPS (DEV) |
| GHOST | Relay | Handles patch delivery & message transport |

#### 3. Project Structure
- **MAIN project** → `tm-mobile-cursor` (executed by BRAUN, directed by BRAIN)
- **CYOPS project** → `gpt-cursor-runner` (executed by DEV/THE KID, directed by COACH)

#### 4. Critical Enforcement Rules

##### Git Operations
- NEVER use `--force` without explicit user approval
- NEVER push to `main` without GPT validation
- NEVER merge to `main` without GPT validation
- All commits must pass lint + typecheck before tagging

##### Patch Delivery
- All hybrid blocks MUST include `"showInUI": true`
- All hybrid blocks MUST include `"blockCommitOnError": true`
- All patches must be validated by GPT before final commit
- All patch summaries must include roadmap phase references

##### Security & Credentials
- NO raw secrets in instruction files
- ALL secrets must use op CLI vault
- ALL distributions must include `.env.example`
- ALL environment variables must use `${VAR_NAME}` format

##### Path Hardening
- ALL paths must be absolute: `/Users/sawyer/gitSync/*`
- NO relative path ambiguity
- ALL backup names must follow exact format
- ALL task files must follow exact naming convention

#### 5. Master Rule Index
Applied all 40 master rules including:
1. No pushes to `main` unless validated by GPT
2. No merges to `main` unless validated by GPT
3. No `--force` Git commands unless explicitly reviewed
4. Hybrid blocks must use `"showInUI": true`
5. All backup names use full format with UTC timestamp + version + project
6. Task files must follow `vX.X.Xx-Y-Z_desc.cursor-instruction.json`
7. Task suffixes (`.ready`, `.stop`, etc.) determine block lifecycle
8. Backups only created when system is stable and compiling
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
26. `.tar.gz` backups live in `_backups/[project]` with exact naming format
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

## Implementation Guidelines

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
5. Always verify system stability before allowing backups

### For GHOST Relay
1. Always relay patch delivery status back to GPT
2. Always maintain proper endpoint configurations
3. Always handle timeouts and retries gracefully
4. Always log all relay activities
5. Always validate endpoint health before delivery

## Compliance Checklist

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

## Status

✅ **CONFIGURATION COMPLETE**

- ✅ Global Cursor rules file created at `/Users/sawyer/.cursorrules`
- ✅ All 40 master rules applied
- ✅ Critical enforcement rules implemented
- ✅ Implementation guidelines established
- ✅ Compliance checklist provided
- ✅ Agent hierarchy and responsibilities defined

The comprehensive Sawyer GPT Ruleset & Automation Policy is now active and will govern all GPT and Cursor operations across the Sawyer Workspace. All agents must comply with these rules without exception. 