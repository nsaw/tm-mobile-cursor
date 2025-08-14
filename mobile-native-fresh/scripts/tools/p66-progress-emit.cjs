#!/usr/bin/env node
/* eslint-disable */
// Noninteractive progress emitter: snapshots executor state + recent log hints and writes chat-friendly summaries.
const fs = require("fs");
const p = require("path");
const ROOT   = process.env.ROOT   || "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const CACHE  = process.env.CACHE  || "/Users/sawyer/gitSync/.cursor-cache/MAIN";
const LOGS   = process.env.LOGS   || p.join(ROOT, "validations/logs");
const SUMDIR = p.join(CACHE, "summaries");
const STATE  = process.env.STATE_FILE || p.join(CACHE, "validation/p66-execution.state.json");
const RESUME = p.join(LOGS, "p66-resume.log");

function readJSON(fp) { try { return JSON.parse(fs.readFileSync(fp, "utf8")); } catch { return null; } }
function lastLines(fp, maxBytes = 4096) {
  try {
    const stat = fs.statSync(fp); const size = stat.size;
    const start = Math.max(0, size - maxBytes);
    const buf = Buffer.alloc(size - start);
    const fd = fs.openSync(fp, "r"); fs.readSync(fd, buf, 0, buf.length, start); fs.closeSync(fd);
    return buf.toString("utf8").split(/\r?\n/).slice(-30).filter(Boolean);
  } catch { return []; }
}
function nowISO() { return new Date().toISOString(); }

const st = readJSON(STATE) || { state:"unknown" };
const lines = lastLines(RESUME);
const hint = (lines.slice().reverse().find(l => /label=|patch-v1\.6\./.test(l)) || lines.slice(-1)[0] || "");

const progress = {
  ts: nowISO(),
  state: st.state || (st.inProgress ? "inProgress" : "unknown"),
  completed_count: Array.isArray(st.completed) ? st.completed.length : 0,
  in_progress: st.inProgress || false,
  failed_at: st.failedAt || null,
  current_hint: (hint || "").trim().slice(0, 300),
};

fs.mkdirSync(SUMDIR, { recursive: true });
const out = p.join(SUMDIR, `P6.6_progress.${Date.now()}.md`);
const md = [
  `# P6.6 Progress`,
  `**ts**: ${progress.ts}`,
  `**state**: ${progress.state}`,
  `**completed**: ${progress.completed_count}`,
  `**inProgress**: ${progress.in_progress}`,
  progress.failed_at ? `**failedAt**: \`${progress.failed_at}\`` : `**failedAt**: none`,
  progress.current_hint ? `**hint**: \`${progress.current_hint}\`` : ``,
  ``,
  `_artifacts_:`,
  `- state: ${STATE}`,
  `- log:   ${RESUME}`,
].filter(Boolean).join("\n");
fs.writeFileSync(out, md);
console.log(JSON.stringify(progress));


