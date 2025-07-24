# BACKGROUND AGENT RULES

## Agent Behaviors
- Lint & fix runs (`{ { { { npm run lint:fix-all`) on schedule & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- `audit:clickables` and `lint:check-theme` bundled in recurring task
- Auto-repair commits from agents allowed

## Agent Trigger Schedule
- ⏰ Daily at 1am via Watchman or Node scheduler
