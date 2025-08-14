#!/usr/bin/env node
const fs = require('fs');
const p = require('path');
const ROOT = process.env.ROOT || '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh';
const CACHE = process.env.CACHE || '/Users/sawyer/gitSync/.cursor-cache/MAIN';
const LOGS = process.env.LOGS || '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/validations/logs';
const STATE_FILE = process.env.STATE_FILE || p.join(CACHE,'validation/p66-execution.state.json');
const OUT_SUMMARY_DIR = p.join(CACHE,'summaries');
const ts = new Date().toISOString();

function safeReadJSON(fp, fallback) {
  try { return JSON.parse(fs.readFileSync(fp,'utf8')); } catch { return fallback; }
}

const state = safeReadJSON(STATE_FILE, {state:'unknown', completed:[], failed:[], inProgress:[], total:21});
const completed = Array.isArray(state.completed) ? state.completed.length : 0;
const failed = Array.isArray(state.failed) ? state.failed.length : 0;
const inProg = Array.isArray(state.inProgress) && state.inProgress.length ? state.inProgress[0] : null;
const total = Number.isFinite(state.total) ? state.total : 21;

const summary = {
  ts,
  state: state.state || (inProg ? 'running' : 'idle'),
  counts: { completed, failed, total, remaining: Math.max(total - completed - failed, 0) },
  current: inProg ? { patch: inProg.name || inProg.patch || null, step: inProg.step || null, label: inProg.label || null } : null,
  logs: {
    resume: p.join(ROOT,'validations/logs/p66-resume.log'),
    finalizer: p.join(ROOT,'validations/logs/wait-p66-complete.log')
  },
  artifacts: {
    state_file: STATE_FILE,
    summaries_dir: OUT_SUMMARY_DIR
  }
};

// Print compact JSON for agent chat
process.stdout.write(JSON.stringify(summary) + "\n");

// Also drop a readable MD snapshot (non-blocking convenience)
try {
  fs.mkdirSync(OUT_SUMMARY_DIR, { recursive: true });
  const mdName = `P6.6_progress.chat.${ts.replace(/[:.]/g,'-')}.md`;
  const line = `**${ts}** • state: \`${summary.state}\` • ${summary.counts.completed}/${summary.counts.total} done, ${summary.counts.failed} failed` +
               (summary.current && summary.current.patch ? ` • current: \`${summary.current.patch}\` :: ${summary.current.step||summary.current.label||'step'}` : '') +
               `\nLogs: \`${summary.logs.resume}\`\n`;
  fs.writeFileSync(p.join(OUT_SUMMARY_DIR, mdName), line, 'utf8');
} catch {}
