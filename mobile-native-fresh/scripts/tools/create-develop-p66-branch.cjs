#!/usr/bin/env node
const { spawnSync } = require('child_process');
const cwd = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
function run(cmd, args){ const r = spawnSync(cmd, args, { stdio:'inherit', cwd }); if (r.status!==0) process.exit(r.status); }
// Try to checkout existing branch or create new
let r = spawnSync("git", ["rev-parse","--verify","develop/P66"], { cwd });
if (r.status===0) {
  run("git", ["checkout","develop/P66"]);
} else {
  run("git", ["checkout","-b","develop/P66"]);
}
// Push and set upstream (safe, no --force)
run("git", ["push","-u","origin","HEAD:refs/heads/develop/P66"]);
console.log("branch_ready: develop/P66");


