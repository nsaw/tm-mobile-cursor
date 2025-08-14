#!/usr/bin/env node
const { spawnSync } = require('child_process');
const cwd = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const ts = new Date().toISOString().replace(/[:.]/g,'-');
const tagName = `POSTP66_EXEC_${ts}`;
function run(cmd, args){ const r = spawnSync(cmd, args, { stdio:'inherit', cwd }); if (r.status!==0) process.exit(r.status); }
run("git", ["add","-A"]);
run("git", ["commit","-n","-m","post-P6.6 execution snapshot"]);
run("git", ["tag","-a", tagName, "-m", "Snapshot right after successful Phase 6.6 execution"]);
run("git", ["push","origin", tagName]);
console.log("postp66_tag:", tagName);


