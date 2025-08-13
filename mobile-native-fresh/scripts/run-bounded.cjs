#!/usr/bin/env node
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let cwd = process.cwd();
let ttl = '25m';
let label = 'task';
let logFile = 'validations/logs/task.log';
let statusDir = 'validations/status';

let sepIndex = args.indexOf('--');
const flags = sepIndex === -1 ? args : args.slice(0, sepIndex);
const cmdParts = sepIndex === -1 ? [] : args.slice(sepIndex + 1);

for (let i = 0; i < flags.length; i++) {
  const a = flags[i];
  if (a === '--cwd') { cwd = flags[++i]; }
  else if (a === '--ttl') { ttl = flags[++i]; }
  else if (a === '--label') { label = flags[++i]; }
  else if (a === '--log') { logFile = flags[++i]; }
  else if (a === '--status') { statusDir = flags[++i]; }
}

if (cmdParts.length === 0) {
  console.error('Usage: run-bounded.js --cwd <dir> --ttl <30s|5m|1h> --label <name> --log <file> --status <dir> -- <command ...>');
  process.exit(2);
}

const absLog = path.isAbsolute(logFile) ? logFile : path.join(cwd, logFile);
const absStatus = path.isAbsolute(statusDir) ? statusDir : path.join(cwd, statusDir);

fs.mkdirSync(path.dirname(absLog), { recursive: true });
fs.mkdirSync(absStatus, { recursive: true });

const doneFile = path.join(absStatus, `${label}.done`);
const codeFile = path.join(absStatus, `${label}.exitcode`);
const cmd = cmdParts.join(' ');

// Special handling for log and tail commands
let processedCmd = cmd;
if (cmd.includes('tail -f') || cmd.includes('tail -F') || cmd.includes('log')) {
  // For tail commands, add head to prevent infinite hanging
  if (cmd.includes('tail -f') && !cmd.includes('head -')) {
    processedCmd = cmd.replace('tail -f', 'tail -f | head -50');
  }
  // Ensure timeout is applied for log-related commands
  if (!cmd.includes('timeout')) {
    processedCmd = `timeout ${ttl} ${processedCmd}`;
  }
} else {
  // Apply timeout for non-log commands
  processedCmd = `timeout ${ttl} ${processedCmd}`;
}

const shellLine = [
  `mkdir -p \\"${absStatus}\\" \\"${path.dirname(absLog)}\\"`,
  `( ${processedCmd} ) >> \\"${absLog}\\" 2>&1`,
  'code=$?',
  `echo $code > \\"${codeFile}\\"`,
  `date +%FT%T%z > \\"${doneFile}\\"`
].join(' && ');

const child = spawn('/bin/zsh', ['-lc', shellLine], { cwd, detached: true, stdio: 'ignore' });
child.unref();
process.exit(0);
