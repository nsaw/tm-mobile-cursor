# Universal Non-Blocking Runner (nb.js) — BRAUN

Use this for **all** commands that previously used `timeout ... & disown` (fly, pm2, curl, grep, jest, detox, maestro, etc.).

Examples:

```bash
# fly
node scripts/nb.js --ttl 45s --label fly-status --log validations/logs/fly-status.log --status validations/status -- fly status

# pm2
node scripts/nb.js --ttl 20s --label pm2-save --log validations/logs/pm2-save.log --status validations/status -- pm2 save

# curl/grep probe
node scripts/nb.js --ttl 15s --label probe --log validations/logs/probe.log --status validations/status -- bash -lc 'curl -fsS http://localhost:8081 | grep -q 200'

# generic
node scripts/nb.js --ttl 30s --label any --log validations/logs/any.log --status validations/status -- echo "hello"
```

- All commands run under **/bin/zsh -lc** with **Coreutils timeout** and `--kill-after=10s`.
- Outputs go to **validations/logs/** and status stamps to **validations/status/**.
- Prefer this over `& disown` to avoid agent terminal blocking.