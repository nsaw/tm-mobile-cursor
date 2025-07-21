AUTO SETUP BACKGROUND AGENTS — LINT,AUTOGIT,ETC

//Setup Separate Background Agents Daily at 1am

{
  ////////////////////////////////////////////
  ////////////////////////////////////////////
  // MISSION: Setup Separate Background Agents
  // GOAL: Scaffold agent prompts, spawn script, npm boot script,
  //       and environment config for separate background agents,
  //       hide reference exports, sync mobile-fresh clone,
  //       and stash experimental branch
  // PRE-CHECK: Create rollback checkpoint before changes
  // DO NOT STOP — complete all tasks and sections in order
  // Run `npm run lint:fix-all` continuously in background
  // BEFORE ANY FILE CHANGES:
  //   git add .
  //   git commit -m "chore(rollback): pre-background-agents-setup safety snapshot"
  //   git tag v1.2.2_pre-background-agents-setup-ROLLBACK
  ////////////////////////////////////////////

  "branch": "feature/background-agents-setup",
  "mode": "auto",
  "watchConsole": true,
  "onReloadHang": "background",

  "phases": [
    {
      "section": "Scaffold agent prompt files",
      "actions": [
        "mkdir -p .cursor/agents",
        "cat > .cursor/agents/continuous-enforcement.txt << 'EOF'\nMISSION: Continuous Enforcement\n\nGOAL: On every file change or git push, auto-fix lint, token-scope & accessibility violations and commit them.\n\n1. Watch for file system events (debounced 5s).\n2. Run:\n   • npm run lint:fix-all\n   • npm run check:tokens\n   • npm run audit:accessibility\n3. If any files were modified:\n   git add .\n   git commit -m \"chore(agent): auto-fix lint, tokens & accessibility\"\n   git push origin HEAD:auto/enforcement-fixes\n4. Loop indefinitely.\nEOF",
        "cat > .cursor/agents/watch-tasks.txt << 'EOF'\nMISSION: Watch-Style Tasks\n\nGOAL: Keep Metro/build running + auto-format, docs generation & UI snapshots on save.\n\nOn startup:\n1. npm run start       # Metro bundler\n2. In parallel, run script:\n   while true; do\n     watch 'npm run format && npm run docs:generate && scripts/snapshot-ui.sh' src/\n     sleep 1\n   done\n3. If docs or snapshot output changes:\n   git add docs/ snapshots/\n   git commit -m \"chore(agent): update docs & UI snapshots\"\n   git push origin HEAD:auto/watch-tasks\nEOF",
        "cat > .cursor/agents/ci-chores.txt << 'EOF'\nMISSION: CI-Adjacent Chores\n\nGOAL: Hourly bump versions, regen API docs, update changelog/version map & push.\n\nLoop every 60m:\n1. npm run docs:generate\n2. npm run version-bump     # must exist\n3. node scripts/changelog.js # regenerates CHANGELOG.md\n4. git add docs/ package.json CHANGELOG.md scripts/version-map.json\n5. git commit -m \"chore(agent): bump version & update docs/changelog\"\n6. git push origin HEAD:auto/ci-chores\nEOF",
        "cat > .cursor/agents/git-checkpoints.txt << 'EOF'\nMISSION: Git Checkpoints\n\nGOAL: Every 30m, commit & push any work-in-progress so nothing sits unstaged.\n\nLoop every 30m:\n1. if git diff --quiet; then\n     sleep 30m\n   else\n     git add .\n     git commit -m \"chore(agent): checkpoint $(date +'%Y-%m-%d %H:%M')\"\n     git push origin HEAD:auto/checkpoints\n   fi\nEOF"
      ],
      "commit": "chore: scaffold agent prompt files",
      "tag": "v1.2.3_agent-prompts"
    },
    {
      "section": "Create spawn-agents script",
      "actions": [
        "mkdir -p scripts",
        "cat > scripts/spawn-agents.sh << 'EOF'\n#!/usr/bin/env bash\n\n# Spawn Cursor background agents for each task\ncursor agent spawn --name \"Enforcement\" --prompt-file .cursor/agents/continuous-enforcement.txt\ncursor agent spawn --name \"Watch-Tasks\" --prompt-file .cursor/agents/watch-tasks.txt\ncursor agent spawn --name \"CI-Chores\" --prompt-file .cursor/agents/ci-chores.txt\ncursor agent spawn --name \"Checkpoints\" --prompt-file .cursor/agents/git-checkpoints.txt\nEOF",
        "chmod +x scripts/spawn-agents.sh"
      ],
      "commit": "chore: add spawn-agents script",
      "tag": "v1.2.3_spawn-script"
    },
    {
      "section": "Add agents:boot npm script",
      "actions": [
        "npx json -I -f package.json -e \"this.scripts = this.scripts || {}\"",
        "npx json -I -f package.json -e \"this.scripts['agents:boot']='bash scripts/spawn-agents.sh'\""
      ],
      "commit": "chore: add agents:boot npm script",
      "tag": "v1.2.3_npm-script"
    },
    {
      "section": "Configure .cursor/environment.json",
      "actions": [
        "cat > .cursor/environment.json << 'EOF'\n{\n  \"snapshot\": \"POPULATED_FROM_SETTINGS\",\n  \"install\": \"npm install\",\n  \"terminals\": [\n    {\n      \"name\": \"Agent Bootstrap\",\n      \"command\": \"npm run agents:boot\"\n    }\n  ]\n}\nEOF"
      ],
      "commit": "chore: configure .cursor/environment",
      "tag": "v1.2.3_environment-config"
    },
    {
      "section": "Hide reference-exports folder",
      "actions": [
        "mkdir -p .cursor/reference-exports",
        "echo '/.cursor/reference-exports/' >> .gitignore",
        "cat >> metro.config.js << 'EOF'\n// Exclude reference-exports from bundler\nconst exclusion = /.*\\\\.cursor[\\\\/\\\\\\\\]reference-exports\\\\/.*$/;\nmodule.exports.resolver.blacklistRE = exclusion;\nEOF"
      ],
      "commit": "chore: hide reference-exports from tools",
      "tag": "v1.2.3_hide-reference-exports"
    },
    {
      "section": "Sync mobile-fresh clone",
      "actions": [
        "cat > scripts/sync-mobile-fresh.sh << 'EOF'\n#!/usr/bin/env bash\ncd mobile-fresh\n\ngit pull origin main\nEOF",
        "chmod +x scripts/sync-mobile-fresh.sh"
      ],
      "commit": "chore: add mobile-fresh sync script",
      "tag": "v1.2.3_sync-mobile-fresh"
    },
    {
      "section": "Stash experimental branch",
      "actions": [
        "git branch -m third-branch stash/third-branch",
        "git push origin :third-branch stash/third-branch"
      ],
      "commit": "chore: move experimental branch to stash/",
      "tag": "v1.2.3_stash-experimental-branch"
    }
  ],

  "final": {
    "commit": "chore: background agents setup refined",
    "tag": "v1.2.3_background-agents-refined",
    "notes": "Moved .cursor to root, hid reference exports, added sync for mobile-fresh, stashed experimental branch."
  }
}

