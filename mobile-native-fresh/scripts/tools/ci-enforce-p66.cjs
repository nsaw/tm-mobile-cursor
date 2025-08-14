#!/usr/bin/env node
const { spawnSync } = require('child_process');
const env = Object.assign({}, process.env, { P66_STRICT: '1', P66_STRICT_VISUALS: '1' });
const r = spawnSync('node', ['scripts/tools/verify-phase-6.6-order.cjs'], { stdio: 'inherit', env });
process.exit(r.status || 0);


