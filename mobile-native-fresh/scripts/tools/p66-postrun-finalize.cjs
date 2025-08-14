#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT = "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const STATE = "/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/p66-execution.state.json";

function readState(){
  try { return JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch { return null; }
}

function waitForCompletion(maxMs){
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + maxMs;
    const tick = () => {
      const st = readState();
      if (!st) { if (Date.now() > deadline) return reject(new Error('state-missing-timeout')); return setTimeout(tick, 3000); }
      if (st.inProgress) { if (Date.now() > deadline) return reject(new Error('resume-timeout')); return setTimeout(tick, 3000); }
      return resolve(st);
    };
    tick();
  });
}

function runNode(label, file, extraEnv){
  const env = { ...process.env, ...(extraEnv||{}) };
  const r = spawnSync('node', [file], { stdio: 'inherit', cwd: PROJECT, env });
  return (typeof r.status === 'number') ? r.status : 1;
}

(async () => {
  console.log('[postrun] waiting for executor to complete…');
  const st = await waitForCompletion(28*60*1000);
  console.log('[postrun] executor complete. completed count =', Array.isArray(st.completed)?st.completed.length:0);

  console.log('[postrun] strict ULTRA report (hard)…');
  runNode('ultra-report-strict', path.join('scripts','tools','ultra-wrapper.cjs'), { P66_ULTRA_SOFT: '0' });

  console.log('[postrun] strict ordering verify…');
  const vCode = runNode('verify-p6-6-order-strict', path.join('scripts','tools','verify-phase-6.6-order.cjs'), { P66_STRICT: '1', P66_STRICT_VISUALS: '1' });
  if (vCode !== 0) console.error('[postrun] strict verify failed with code', vCode);

  console.log('[postrun] generate compliance manifest…');
  runNode('p6-6-compliance-manifest', path.join('scripts','tools','generate-p66-compliance-manifest.cjs'));

  // Post-freeze only if completed and not inProgress
  const st2 = readState();
  if (st2 && !st2.inProgress && Array.isArray(st2.completed) && st2.completed.length) {
    console.log('[postrun] creating safety backup…');
    runNode('post-backup', path.join('scripts','tools','create-safety-backup.cjs'));
    console.log('[postrun] tagging post-P66…');
    runNode('post-tag', path.join('scripts','tools','git-tag-and-push-postp66.cjs'));
  } else {
    console.log('[postrun] skipping backup/tag; executor not fully complete');
  }
  console.log('[postrun] done');
})().catch(err => { console.error('[postrun] error', err && err.message); process.exit(1); });


