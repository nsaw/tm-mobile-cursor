#!/usr/bin/env node
/* eslint-disable */
const fs = require("fs");
const p  = require("path");
const CACHE = process.env.CACHE || "/Users/sawyer/gitSync/.cursor-cache/MAIN";
const STATE = process.env.STATE_FILE || p.join(CACHE, "validation/p66-execution.state.json");
const OUT   = p.join(CACHE, "summaries", "P6.6_completion_probe.json");

function readJSON(fp){ try { return JSON.parse(fs.readFileSync(fp,"utf8")); } catch { return null; } }

const st = readJSON(STATE);
const ok = !!(st && !st.inProgress && Array.isArray(st.completed) && st.completed.length);
const res = {
  ts: new Date().toISOString(),
  has_state: !!st,
  in_progress: !!(st && st.inProgress),
  completed_count: st && Array.isArray(st.completed) ? st.completed.length : 0,
  ok
};
fs.mkdirSync(p.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(res, null, 2));
console.log(JSON.stringify(res));
process.exit(ok ? 0 : 3);


