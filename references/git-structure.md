# 🧬 Git Structure & Hygiene (Thoughtmarks)

## Versioning
- Semantic: `vX.Y.Z_description`
- With timestamp: `v1.3.2_deeplink-core-handler_250629_1330UTC`
- Final production tags must be lowercase `v`, no zero-padding

## Branch Naming
- `main` — stable
- `verX.Y.Z` — locked release forks
- `feature/`, `fix/`, `refactor/`, `release/` — all self-explanatory
- `stash/`, `archive/` — experimental or deprecated

## Safety Rules
- Always tag before destructive changes
- Never rewrite `main` — use `stash/` branches for resets
- Git backups auto-stored at `/Users/sawyer/gitBackups/`

## Cursor Task Prep
- Always run:
  ```bash
  git add .
  git commit -m "chore(rollback): snapshot before [change]"
  git tag vX.Y.Z_[desc]_YYMMDD_HHMMUTC
  git push origin vX.Y.Z_[desc]_YYMMDD_HHMMUTC
  ```

## Shortcuts
- `gbackup` — Pushes current state as timestamped tag and zips `.git/` into backups
