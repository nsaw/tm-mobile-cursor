# .cursor/rules — Canon Index (consolidated)

## Active Rules
- `01_strict-validation.mdc`
- `02_nb-runner-enforcement.mdc`
- `03_expo-launch-nonblocking.mdc`
- `04_summary-and-cache-standards.mdc`
- `05_git-guardrails.mdc`
- `06_monitoring-and-heartbeat.mdc`
- `07_secrets-and-sessions.mdc`
- `08_role-theme-guardrails.mdc`
- `09_no-bare-grep.mdc`

## Additional Clean Custom Rules
- `README.md`
- `_rewrite-ruleset.mdc`
- `agent-behavior-rules.mdc`
- `agent-summary-write-discipline.mdc`
- `autopilot-behavior.mdc`
- `braun-main-agent-enforcement.mdc`
- `cursor-agent-integrity-check.mdc`
- `cursor-cache-path-enforcement.mdc`
- `cursor-cli-command-audit.mdc`
- `cursor-index-autogeneration.mdc`
- `directory-structure-enforcer.mdc`
- `doc-daemon-autopilot-sync.mdc`
- `doc-daemon-sorting-rules.mdc`
- `documentation-policy.mdc`
- `ghost-integrity.mdc`
- `gpt-accountability-hardlock.mdc`
- `gpt-summary-proof-required.mdc`
- `gpt-user-override-requests.mdc`
- `mandatory-markdown-file-creation.mdc`
- `no-hidden-runs.mdc`
- `patch-delivery-proof-policy.mdc`
- `prevent-main-ghost-collision.mdc`
- `role-theme-autofix-guardrails.mdc`
- `secret-management-rules.mdc`
- `strict-validation.mdc`
- `summary-file-standards.mdc`
- `unified-ghost-root-routing.mdc`

## Archived (legacy/duplicates)
- 02_nb-runner-enforcement.mdc — legacy-pattern — id=nb-runner-enforcement
- 03_expo-launch-nonblocking.mdc — legacy-pattern — id=expo-launch-nonblocking
- 09_no-bare-grep.mdc — legacy-pattern — id=no-bare-grep
- app-refresh-validation.mdc — legacy-pattern
- automatic-patch-hardening.mdc — legacy-pattern
- backup-operations.mdc — legacy-pattern
- freezer-backup-standards.mdc — legacy-pattern
- sawyer-gpt-ruleset.md — legacy-pattern
- tilde-replacement.mdc — legacy-pattern

## Notes
- All legacy patterns (`disown`, `$!`, `tail -f`, `timeout`, brace groups, **grep**) are removed or prohibited.