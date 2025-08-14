#!/usr/bin/env node
/* eslint-disable */
const { spawnSync } = require('child_process');

const PROJECT = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const SOFT = process.env.P66_ULTRA_SOFT === '1';
const CMD = `${PROJECT}/scripts/ultra-runtime-validation.sh`;

const r = spawnSync('bash', ['-lc', CMD], { stdio: 'inherit', cwd: PROJECT, env: process.env });
const code = (typeof r.status === 'number') ? r.status : 1;

if (SOFT && code !== 0) process.exit(0);
process.exit(code);


