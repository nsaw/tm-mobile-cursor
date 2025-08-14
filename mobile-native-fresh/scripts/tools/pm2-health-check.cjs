#!/usr/bin/env node
const { spawnSync } = require('child_process');
const REQUIRED = ["g2o-executor","g2o-queue-reader","g2o-reporter","dashboard","webhook-server"];
function jlist() {
  const r = spawnSync("pm2", ["jlist"], { encoding: "utf8" });
  if (r.status !== 0) return [];
  try { return JSON.parse(r.stdout); } catch { return []; }
}
const procs = jlist();
const status = Object.fromEntries(REQUIRED.map(n => [n, "missing"]));
for (const n of REQUIRED) {
  const found = procs.find(p => (p?.name === n));
  status[n] = found ? found.pm2_env?.status || "unknown" : "missing";
}
const notOnline = Object.entries(status).filter(([,s]) => s !== "online").map(([n])=>n);
console.log(JSON.stringify({ ts:new Date().toISOString(), status, notOnline }, null, 2));
const auto = process.argv.includes("--auto-restart");
if (auto && notOnline.length) {
  const r = spawnSync("pm2", ["restart"].concat(REQUIRED), { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status);
  const s = spawnSync("pm2", ["save"], { stdio: "inherit" });
  process.exit(s.status || 0);
}


