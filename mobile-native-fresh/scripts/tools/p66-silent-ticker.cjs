#!/usr/bin/env node
const fs = require('fs');
const p = require('path');
const ROOT = process.env.ROOT || '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh';
const CACHE = process.env.CACHE || '/Users/sawyer/gitSync/.cursor-cache/MAIN';
const STATE_FILE = process.env.STATE_FILE || p.join(CACHE,'validation/p66-execution.state.json');
const TICKER_FILE = p.join(CACHE,'validation/p66-silent-ticker.json');

function safeReadJSON(fp, fallback) {
  try { return JSON.parse(fs.readFileSync(fp,'utf8')); } catch { return fallback; }
}

function emitTicker() {
  const ts = new Date().toISOString();
  const state = safeReadJSON(STATE_FILE, {completed:[], failed:[], inProgress:null});
  
  const ticker = {
    ts,
    state: state.inProgress ? 'running' : 'idle',
    completed: Array.isArray(state.completed) ? state.completed.length : 0,
    failed: Array.isArray(state.failed) ? state.failed.length : 0,
    total: 21,
    current: state.inProgress || null,
    processes: []
  };

  // Check for running processes
  const { execSync } = require('child_process');
  try {
    const psOutput = execSync('ps aux | grep -E "(p66|execute-p66|nb.cjs)" | grep -v grep', { encoding: 'utf8' });
    ticker.processes = psOutput.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.split(/\s+/);
      return {
        pid: parts[1],
        cmd: parts.slice(10).join(' ').substring(0, 50) + '...'
      };
    });
  } catch (e) {
    ticker.processes = [];
  }

  // Write ticker file
  try {
    fs.writeFileSync(TICKER_FILE, JSON.stringify(ticker, null, 2));
  } catch (e) {}

  // Print compact status for chat
  const status = `${ticker.state.toUpperCase()} | ${ticker.completed}/${ticker.total} | ${ticker.processes.length} procs`;
  process.stdout.write(status + '\n');
}

emitTicker();
