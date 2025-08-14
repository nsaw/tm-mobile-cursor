#!/usr/bin/env node
/* eslint-disable */
// Discrete, noninteractive post-run steps to avoid long interactive shells.
const { spawnSync } = require("child_process");
const path = require("path");
const ROOT = process.env.ROOT || "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh";
const NB   = process.env.NB   || `node ${path.join(ROOT,"scripts/nb.cjs")}`;
const LOGS = process.env.LOGS || path.join(ROOT,"validations/logs");
const STATUS=process.env.STATUS|| path.join(ROOT,"validations/status");
const step = process.argv[2];

(async () => {
  if (process.argv.includes('chat-pulse')) {
    const { spawnSync } = require('child_process');
    const env = Object.assign({}, process.env, {
      ROOT: process.env.ROOT || '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh',
      CACHE: process.env.CACHE || '/Users/sawyer/gitSync/.cursor-cache/MAIN',
      LOGS: process.env.LOGS || '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/validations/logs',
      STATE_FILE: process.env.STATE_FILE || '/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/p66-execution.state.json'
    });
    const r = spawnSync('node',['scripts/tools/p66-chat-pulse.cjs'],{ stdio:'inherit', env, cwd: env.ROOT });
    process.exit(r.status ?? 0);
  }

const cmds = {
  "strict-ultra": `${NB} --ttl 300s --label ultra-report-strict --log ${LOGS}/ultra-report-strict.log --status ${STATUS} -- node ${path.join(ROOT,"scripts/tools/ultra-wrapper.cjs")}`,
  "strict-verify": `P66_STRICT=1 P66_STRICT_VISUALS=1 ${NB} --ttl 150s --label verify-p6-6-order-strict --log ${LOGS}/verify-p6-6-order-strict.log --status ${STATUS} -- node ${path.join(ROOT,"scripts/tools/verify-phase-6.6-order.cjs")}`,
  "manifest": `${NB} --ttl 90s --label p6-6-compliance-manifest --log ${LOGS}/p6-6-compliance-manifest.log --status ${STATUS} -- node ${path.join(ROOT,"scripts/tools/generate-p66-compliance-manifest.cjs")}`,
  "backup": `${NB} --ttl 300s --label post-backup --log ${LOGS}/post-backup.log --status ${STATUS} -- node ${path.join(ROOT,"scripts/tools/create-safety-backup.cjs")}`,
  "tag": `${NB} --ttl 180s --label post-tag --log ${LOGS}/post-tag.log --status ${STATUS} -- node ${path.join(ROOT,"scripts/tools/git-tag-and-push-postp66.cjs")}`,
};

if (!cmds[step]) {
  console.error(`Unknown step: ${step}`);
  process.exit(2);
}
const sh = process.env.SHELL || "/bin/bash";
const res = spawnSync(sh, ["-lc", cmds[step]], { stdio: "inherit", cwd: ROOT, env: process.env });
process.exit(res.status ?? 0);
})().catch((e)=>{ console.error(e?.stack||String(e)); process.exit(2); });


