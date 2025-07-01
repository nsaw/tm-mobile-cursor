# Cursor Agent Summary for Thoughtmarks

## Role
- Enforce hybrid block execution
- Maintain git versioning protocol
- Refactor UI and tokens safely

## Triggers
- Run background linter/fixer after commits
- Enforce `useTheme()` scope on all tokens
- Rewrite components by `role` and `type` (Card, Tag, Section)

## Guardrails
- Block commits if parse fails or lint breaks
- Refuse pushes if fatal theme drift or shadowed token usage found

## Automation Scripts
- `scripts/backup-tag-push.sh`: Tag and push Git backups with UTC timestamps
- All packages backed up to `/Users/sawyer/gitSync/tm-safety_backups/`
