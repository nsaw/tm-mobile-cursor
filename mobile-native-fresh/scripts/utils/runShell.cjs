#!/usr/bin/env node
'use strict';
const { spawn, exec } = require('child_process');
function execShell(cmd, opts = {}) { return new Promise((resolve, reject) => { exec(cmd, { shell: '/bin/zsh', ...opts }, (err, stdout, stderr) => { if (err) { err.stdout = stdout; err.stderr = stderr; err.code = err.code ?? err.signal ?? 1; return reject(err);} resolve({ stdout, stderr, code: 0 }); }); }); }
function spawnDetached(cmdLine, opts = {}) { const child = spawn('/bin/zsh', ['-lc', cmdLine], { cwd: opts.cwd, env: { ...process.env, ...opts.env }, stdio: 'ignore', detached: true }); child.unref(); return true; }
module.exports = { execShell, spawnDetached };
