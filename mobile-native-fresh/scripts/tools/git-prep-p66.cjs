#!/usr/bin/env node
const { spawnSync } = require('child_process');
const cwd = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
function run(cmd, args){ const r = spawnSync(cmd, args, { stdio:'inherit', cwd }); if (r.status!==0) process.exit(r.status); }
run("git", ["add","-A"]);
run("git", ["commit","-n","-m","pre-P66: STRICT-ready; ROLLBACKSAFE snapshot prepared"]);
console.log("git_prep_done");


