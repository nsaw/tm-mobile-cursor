#!/usr/bin/env node
// Wrapper to execute CJS rules migrator
'use strict';
const { spawn } = require('child_process');
const path = require('path');
const child = spawn(process.execPath, [path.join(__dirname, 'update-cursor-rules-timeout-migration.cjs'), ...process.argv.slice(2)], { stdio: 'inherit' });
child.on('exit', code => process.exit(code));
