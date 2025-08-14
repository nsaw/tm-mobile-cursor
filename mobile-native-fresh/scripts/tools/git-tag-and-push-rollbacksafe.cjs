#!/usr/bin/env node
const { spawnSync } = require('child_process');
const cwd = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const ts = new Date().toISOString().replace(/[:.]/g,'-');
const tagName = `ROLLBACKSAFE_P66_${ts}`;
function run(cmd, args){ const r = spawnSync(cmd, args, { stdio:'inherit', cwd }); if (r.status!==0) process.exit(r.status); }
run("git", ["tag","-a", tagName, "-m", "Rollback-safe snapshot before Phase 6.6 execution"]);
run("git", ["push","origin", tagName]);
console.log("rollbacksafe_tag:", tagName);


