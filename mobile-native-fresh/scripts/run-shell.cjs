#!/usr/bin/env node
'use strict';
const { spawn } = require('child_process');
const args = process.argv.slice(2);

if (args.includes('--version')) { 
  console.log('run-shell.js via /bin/zsh -lc (detached supported, log/tail optimized)'); 
  process.exit(0); 
}

let detached = false; 
const cmd = [];

for (const a of args) { 
  if (a === '--detached') detached = true; 
  else cmd.push(a); 
}

const line = cmd.join(' ').trim();

if (!line) { 
  console.error('Usage: run-shell.js [--detached] <command>'); 
  process.exit(2); 
}

// Special handling for log and tail commands
let shellLine = line;
if (line.includes('tail -f') || line.includes('tail -F') || line.includes('log')) {
  // For tail commands, add timeout and head to prevent infinite hanging
  if (line.includes('tail -f') && !line.includes('head -')) {
    shellLine = line.replace('tail -f', 'tail -f | head -50');
  }
  // Add timeout for all log-related commands
  if (!line.includes('timeout')) {
    shellLine = `timeout 30s ${shellLine}`;
  }
}

const child = spawn('/bin/zsh', ['-lc', shellLine], { 
  stdio: detached ? 'ignore' : 'inherit', 
  detached 
});

if (detached) { 
  child.unref(); 
  process.exit(0); 
}

child.on('exit', (code) => process.exit(code));
