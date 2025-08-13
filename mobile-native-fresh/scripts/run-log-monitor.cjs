#!/usr/bin/env node
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

// Default options for log monitoring
let options = {
  file: null,
  lines: 50,
  timeout: '30s',
  follow: false,
  detached: false,
  output: 'stdout' // 'stdout', 'file', or 'both'
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--file' && i + 1 < args.length) {
    options.file = args[++i];
  } else if (arg === '--lines' && i + 1 < args.length) {
    options.lines = parseInt(args[++i]);
  } else if (arg === '--timeout' && i + 1 < args.length) {
    options.timeout = args[++i];
  } else if (arg === '--follow') {
    options.follow = true;
  } else if (arg === '--detached') {
    options.detached = true;
  } else if (arg === '--output' && i + 1 < args.length) {
    options.output = args[++i];
  } else if (arg === '--help') {
    console.log(`
Usage: run-log-monitor.cjs [options] <log-file>

Options:
  --file <file>      Log file to monitor (required)
  --lines <n>        Number of lines to show (default: 50)
  --timeout <time>   Timeout for the operation (default: 30s)
  --follow           Follow the log file (tail -f)
  --detached         Run in detached mode
  --output <type>    Output type: stdout, file, or both (default: stdout)
  --help             Show this help

Examples:
  node run-log-monitor.cjs --file logs/app.log --lines 20
  node run-log-monitor.cjs --file logs/error.log --follow --timeout 60s
  node run-log-monitor.cjs --file logs/debug.log --detached --output file
`);
    process.exit(0);
  }
}

if (!options.file) {
  console.error('Error: --file option is required');
  process.exit(1);
}

// Build the tail command
let tailCmd = `tail -n ${options.lines}`;
if (options.follow) {
  tailCmd = `tail -f -n ${options.lines}`;
}

// Add timeout and head to prevent infinite hanging for follow mode
if (options.follow) {
  tailCmd = `timeout ${options.timeout} ${tailCmd} | head -${options.lines * 2}`;
} else {
  tailCmd = `timeout ${options.timeout} ${tailCmd}`;
}

// Complete command
const fullCmd = `${tailCmd} "${options.file}"`;

// Handle output redirection
let stdio = 'inherit';
if (options.output === 'file') {
  stdio = 'ignore';
} else if (options.output === 'both') {
  // For both, we'll redirect to a file and also show stdout
  const outputFile = `${options.file}.monitor-${Date.now()}.log`;
  const redirectCmd = `${fullCmd} | tee "${outputFile}"`;
  const child = spawn('/bin/zsh', ['-lc', redirectCmd], { 
    stdio: 'inherit', 
    detached: options.detached 
  });
  if (options.detached) {
    child.unref();
    process.exit(0);
  }
  child.on('exit', (code) => process.exit(code));
  return;
}

// Execute the command
const child = spawn('/bin/zsh', ['-lc', fullCmd], { 
  stdio, 
  detached: options.detached 
});

if (options.detached) {
  child.unref();
  process.exit(0);
}

child.on('exit', (code) => process.exit(code));
