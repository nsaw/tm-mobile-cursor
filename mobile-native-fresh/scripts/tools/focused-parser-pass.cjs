// @ts-nocheck
/**
 * focused-parser-pass.cjs
 * Reads validations/verify/static-triage.json and applies auto-parse-fixes
 * to top-N files with TS parse errors. N defaults to 50, configurable via --top.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh';
const TRIAGE = path.join(ROOT, 'validations', 'verify', 'static-triage.json');
const args = process.argv.slice(2);
const get = (k, d=null) => { const i=args.indexOf(k); return i>=0 ? args[i+1] : d; };
const TOP = parseInt(get('--top', '50'), 10);

if (!fs.existsSync(TRIAGE)) { console.error('triage missing:', TRIAGE); process.exit(0); }
const tri = JSON.parse(fs.readFileSync(TRIAGE, 'utf8'));
const files = (tri.ts || []).map(e => e.file).filter(Boolean);
const order = []; const seen = new Set();
for (const f of files) { if (!seen.has(f)) { order.push(f); seen.add(f); } }
const pick = order.slice(0, isFinite(TOP) ? TOP : 50);
if (pick.length === 0) { console.log('no TS offenders listed'); process.exit(0); }
const targets = pick.filter(f => f.startsWith('/') && (/\.(ts|tsx)$/i.test(f)));
if (targets.length === 0) { console.log('no eligible targets'); process.exit(0); }

const tool = path.join(ROOT, 'scripts', 'tools', 'auto-parse-fixes.cjs');
const res = spawnSync('node', [tool, ...targets], { stdio: 'inherit' });
process.exit(res.status || 0);


